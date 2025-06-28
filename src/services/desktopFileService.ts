// Service de gestion des fichiers pour l'import/export desktop
// Suivant le guide de migration MIGRATION_DESKTOP.md

import { useElectron } from './electronService';

export interface FileExportOptions {
  format: 'json' | 'csv' | 'pdf';
  filename?: string;
  includeMetadata?: boolean;
  compress?: boolean;
}

export interface FileImportOptions {
  format: 'json' | 'csv' | 'auto';
  validateData?: boolean;
  mergeWithExisting?: boolean;
}

export interface FileOperationResult {
  success: boolean;
  data?: any;
  filePath?: string;
  error?: string;
  metadata?: {
    size: number;
    lastModified: Date;
    format: string;
  };
}

export class DesktopFileService {
  private static instance: DesktopFileService;
  private electronService: any;

  private constructor() {
    try {
      this.electronService = useElectron();
    } catch (error) {
      console.warn('ElectronService non disponible, fonctionnalités limitées');
      this.electronService = null;
    }
  }

  public static getInstance(): DesktopFileService {
    if (!DesktopFileService.instance) {
      DesktopFileService.instance = new DesktopFileService();
    }
    return DesktopFileService.instance;
  }

  // Import de données
  public async importData(options: FileImportOptions = { format: 'json' }): Promise<FileOperationResult> {
    try {
      if (!this.electronService || !this.electronService.isAvailable()) {
        return {
          success: false,
          error: 'Fonctionnalité d\'import non disponible en mode web'
        };
      }

      const result = await this.electronService.importData();
      
      if (result.success && result.data) {
        // Validation des données si demandée
        if (options.validateData) {
          const validation = this.validateImportData(result.data);
          if (!validation.valid) {
            return {
              success: false,
              error: `Données invalides: ${validation.errors.join(', ')}`
            };
          }
        }

        // Nettoyage des données si demandé
        const cleanedData = this.sanitizeData(result.data);

        return {
          success: true,
          data: cleanedData,
          filePath: result.filePath,
          metadata: {
            size: result.data.length,
            lastModified: new Date(),
            format: options.format
          }
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de l'import: ${error}`
      };
    }
  }

  // Export de données
  public async exportData(data: any, options: FileExportOptions = { format: 'json' }): Promise<FileOperationResult> {
    try {
      if (!this.electronService || !this.electronService.isAvailable()) {
        return {
          success: false,
          error: 'Fonctionnalité d\'export non disponible en mode web'
        };
      }

      // Préparer les données selon le format
      let exportData = data;
      let filename = options.filename;

      if (options.includeMetadata) {
        exportData = {
          data: data,
          metadata: {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            format: options.format,
            source: 'RTS Desktop App'
          }
        };
      }

      // Générer le nom de fichier par défaut
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `rts-export-${timestamp}.${options.format}`;
      }

      // Convertir en format approprié
      let content: string;
      switch (options.format) {
        case 'json':
          content = JSON.stringify(exportData, null, 2);
          break;
        case 'csv':
          content = this.convertToCSV(exportData);
          break;
        case 'pdf':
          // Pour l'export PDF, on utilise le service PDF dédié
          return await this.exportToPDF(exportData, filename);
        default:
          content = JSON.stringify(exportData, null, 2);
      }

      // Compression si demandée
      if (options.compress && content.length > 1000) {
        content = this.compressData(content);
      }

      const result = await this.electronService.exportData(content);
      
      if (result.success) {
        return {
          success: true,
          filePath: result.filePath,
          metadata: {
            size: content.length,
            lastModified: new Date(),
            format: options.format
          }
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de l'export: ${error}`
      };
    }
  }

  // Export spécifique pour les historiques
  public async exportHistory(historyType: 'gsm' | 'umts' | 'hertzien' | 'optique', options: FileExportOptions = { format: 'json' }): Promise<FileOperationResult> {
    try {
      // Récupérer l'historique depuis le stockage
      const { desktopStorage } = await import('./desktopStorage');
      
      let history: any[] = [];
      switch (historyType) {
        case 'gsm':
          history = await desktopStorage.getGsmHistory();
          break;
        case 'umts':
          history = await desktopStorage.getUmtsHistory();
          break;
        case 'hertzien':
          history = await desktopStorage.getHertzienHistory();
          break;
        case 'optique':
          history = await desktopStorage.getOptiqueHistory();
          break;
      }

      if (!options.filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        options.filename = `rts-${historyType}-history-${timestamp}.${options.format}`;
      }

      return await this.exportData(history, options);
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de l'export de l'historique ${historyType}: ${error}`
      };
    }
  }

  // Export de tous les historiques
  public async exportAllHistories(options: FileExportOptions = { format: 'json' }): Promise<FileOperationResult> {
    try {
      const { desktopStorage } = await import('./desktopStorage');
      
      const allData = {
        gsm_history: await desktopStorage.getGsmHistory(),
        umts_history: await desktopStorage.getUmtsHistory(),
        hertzien_history: await desktopStorage.getHertzienHistory(),
        optique_history: await desktopStorage.getOptiqueHistory(),
        settings: await desktopStorage.getSettings(),
        user_preferences: await desktopStorage.getUserPreferences()
      };

      if (!options.filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        options.filename = `rts-complete-backup-${timestamp}.${options.format}`;
      }

      return await this.exportData(allData, options);
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de l'export complet: ${error}`
      };
    }
  }

  // Import et fusion d'historiques
  public async importAndMergeHistories(options: FileImportOptions = { format: 'json' }): Promise<FileOperationResult> {
    try {
      const importResult = await this.importData(options);
      
      if (!importResult.success || !importResult.data) {
        return importResult;
      }

      const { desktopStorage } = await import('./desktopStorage');
      
      // Fusionner les données selon le type
      if (importResult.data.gsm_history) {
        const existing = await desktopStorage.getGsmHistory();
        const merged = this.mergeHistories(existing, importResult.data.gsm_history);
        await desktopStorage.saveGsmHistory(merged);
      }

      if (importResult.data.umts_history) {
        const existing = await desktopStorage.getUmtsHistory();
        const merged = this.mergeHistories(existing, importResult.data.umts_history);
        await desktopStorage.saveUmtsHistory(merged);
      }

      if (importResult.data.hertzien_history) {
        const existing = await desktopStorage.getHertzienHistory();
        const merged = this.mergeHistories(existing, importResult.data.hertzien_history);
        await desktopStorage.saveHertzienHistory(merged);
      }

      if (importResult.data.optique_history) {
        const existing = await desktopStorage.getOptiqueHistory();
        const merged = this.mergeHistories(existing, importResult.data.optique_history);
        await desktopStorage.saveOptiqueHistory(merged);
      }

      return {
        success: true,
        data: importResult.data,
        metadata: importResult.metadata
      };
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de l'import et fusion: ${error}`
      };
    }
  }

  // Export PDF
  private async exportToPDF(data: any, filename: string): Promise<FileOperationResult> {
    try {
      if (!this.electronService || !this.electronService.isAvailable()) {
        return {
          success: false,
          error: 'Export PDF non disponible en mode web'
        };
      }

      const result = await this.electronService.exportPDF(data);
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de l'export PDF: ${error}`
      };
    }
  }

  // Validation des données importées
  private validateImportData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Vérifications de base
      if (!data || typeof data !== 'object') {
        errors.push('Les données doivent être un objet valide');
        return { valid: false, errors };
      }

      // Vérifier les historiques s'ils existent
      const historyKeys = ['gsm_history', 'umts_history', 'hertzien_history', 'optique_history'];
      for (const key of historyKeys) {
        if (data[key] && !Array.isArray(data[key])) {
          errors.push(`${key} doit être un tableau`);
        }
      }

      // Vérifier les paramètres s'ils existent
      const settingsKeys = ['settings', 'user_preferences'];
      for (const key of settingsKeys) {
        if (data[key] && typeof data[key] !== 'object') {
          errors.push(`${key} doit être un objet`);
        }
      }

    } catch (error) {
      errors.push(`Erreur de validation: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Nettoyage des données
  private sanitizeData(data: any): any {
    try {
      // Supprimer les propriétés sensibles ou inutiles
      const sensitiveKeys = ['password', 'token', 'secret', 'private'];
      
      const sanitize = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(sanitize);
        }
        
        if (obj && typeof obj === 'object') {
          const cleaned: any = {};
          for (const [key, value] of Object.entries(obj)) {
            if (!sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
              cleaned[key] = sanitize(value);
            }
          }
          return cleaned;
        }
        
        return obj;
      };

      return sanitize(data);
    } catch (error) {
      console.warn('Erreur lors du nettoyage des données:', error);
      return data;
    }
  }

  // Conversion en CSV
  private convertToCSV(data: any): string {
    try {
      if (Array.isArray(data)) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        for (const row of data) {
          const values = headers.map(header => {
            const value = row[header];
            // Échapper les virgules et guillemets
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          });
          csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
      }
      
      // Pour les objets simples, créer une ligne
      const headers = Object.keys(data);
      const values = headers.map(header => data[header] || '');
      return [headers.join(','), values.join(',')].join('\n');
    } catch (error) {
      console.error('Erreur lors de la conversion CSV:', error);
      return '';
    }
  }

  // Compression des données
  private compressData(data: string): string {
    try {
      // Compression simple (pour l'instant, on pourrait utiliser une vraie compression)
      return btoa(data);
    } catch (error) {
      console.warn('Erreur lors de la compression, données non compressées:', error);
      return data;
    }
  }

  // Fusion d'historiques
  private mergeHistories(existing: any[], newData: any[]): any[] {
    try {
      const merged = [...existing];
      
      for (const item of newData) {
        // Éviter les doublons basés sur un ID ou timestamp
        const isDuplicate = merged.some(existingItem => 
          existingItem.id === item.id || 
          existingItem.timestamp === item.timestamp
        );
        
        if (!isDuplicate) {
          merged.push(item);
        }
      }
      
      // Trier par date si possible
      return merged.sort((a, b) => {
        const dateA = new Date(a.timestamp || a.date || 0);
        const dateB = new Date(b.timestamp || b.date || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.warn('Erreur lors de la fusion, retour des données existantes:', error);
      return existing;
    }
  }

  // Lire un fichier texte
  public async readTextFile(): Promise<FileOperationResult> {
    try {
      if (!this.electronService || !this.electronService.isAvailable()) {
        return {
          success: false,
          error: 'Lecture de fichier non disponible en mode web'
        };
      }

      // Utiliser une boîte de dialogue pour sélectionner le fichier
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.json,.csv';
      
      return new Promise((resolve) => {
        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            try {
              const text = await file.text();
              resolve({
                success: true,
                data: text,
                metadata: {
                  size: file.size,
                  lastModified: new Date(file.lastModified),
                  format: file.name.split('.').pop() || 'txt'
                }
              });
            } catch (error) {
              resolve({
                success: false,
                error: `Erreur lors de la lecture: ${error}`
              });
            }
          } else {
            resolve({
              success: false,
              error: 'Aucun fichier sélectionné'
            });
          }
        };
        
        input.click();
      });
    } catch (error) {
      return {
        success: false,
        error: `Erreur lors de la lecture: ${error}`
      };
    }
  }
}

// Hook React pour utiliser le service de fichiers
export const useDesktopFileService = () => {
  const fileService = DesktopFileService.getInstance();
  
  return {
    importData: fileService.importData.bind(fileService),
    exportData: fileService.exportData.bind(fileService),
    exportHistory: fileService.exportHistory.bind(fileService),
    exportAllHistories: fileService.exportAllHistories.bind(fileService),
    importAndMergeHistories: fileService.importAndMergeHistories.bind(fileService),
    readTextFile: fileService.readTextFile.bind(fileService)
  };
};

// Instance singleton exportée
export const desktopFileService = DesktopFileService.getInstance(); 