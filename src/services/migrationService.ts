// Service de migration pour la transition localStorage -> electron-store
// Suivant le guide de migration MIGRATION_DESKTOP.md

import { desktopStorage } from './desktopStorage';

export interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
  totalItems: number;
}

export interface MigrationStatus {
  isFirstRun: boolean;
  hasMigrated: boolean;
  lastMigrationDate?: string;
  version: string;
}

export class MigrationService {
  private static instance: MigrationService;
  private readonly MIGRATION_VERSION = '1.0.0';
  private readonly MIGRATION_STATUS_KEY = 'migration_status';

  private constructor() {}

  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  // Vérifier si c'est la première exécution
  public async isFirstRun(): Promise<boolean> {
    try {
      const status = await this.getMigrationStatus();
      return status.isFirstRun;
    } catch (error) {
      console.error('Erreur lors de la vérification du premier lancement:', error);
      return true;
    }
  }

  // Obtenir le statut de migration
  public async getMigrationStatus(): Promise<MigrationStatus> {
    try {
      const status = await desktopStorage.get(this.MIGRATION_STATUS_KEY);
      if (status) {
        return status;
      }
      
      // Statut par défaut pour première exécution
      return {
        isFirstRun: true,
        hasMigrated: false,
        version: this.MIGRATION_VERSION
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du statut de migration:', error);
      return {
        isFirstRun: true,
        hasMigrated: false,
        version: this.MIGRATION_VERSION
      };
    }
  }

  // Sauvegarder le statut de migration
  private async saveMigrationStatus(status: MigrationStatus): Promise<void> {
    try {
      await desktopStorage.set(this.MIGRATION_STATUS_KEY, status);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du statut de migration:', error);
    }
  }

  // Effectuer la migration depuis localStorage
  public async migrateFromLocalStorage(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedKeys: [],
      errors: [],
      totalItems: 0
    };

    try {
      console.log('Début de la migration depuis localStorage...');

      // Clés à migrer
      const keysToMigrate = [
        'gsm_history',
        'umts_history', 
        'hertzien_history',
        'optique_history',
        'settings',
        'user_preferences',
        'simulation_history',
        'calculation_cache',
        'ui_state',
        'theme_preferences'
      ];

      let totalItems = 0;

      for (const key of keysToMigrate) {
        try {
          const oldData = localStorage.getItem(key);
          if (oldData) {
            // Parser et valider les données
            const parsedData = this.validateAndParseData(key, oldData);
            if (parsedData !== null) {
              // Sauvegarder dans le nouveau système
              await desktopStorage.set(key, parsedData);
              result.migratedKeys.push(key);
              totalItems++;
              console.log(`Migration réussie pour ${key}`);
            } else {
              result.errors.push(`Données invalides pour ${key}`);
            }
          }
        } catch (error) {
          const errorMsg = `Erreur lors de la migration de ${key}: ${error}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      result.totalItems = totalItems;
      result.success = result.errors.length === 0;

      // Sauvegarder le statut de migration
      const status: MigrationStatus = {
        isFirstRun: false,
        hasMigrated: true,
        lastMigrationDate: new Date().toISOString(),
        version: this.MIGRATION_VERSION
      };
      await this.saveMigrationStatus(status);

      console.log(`Migration terminée. ${result.migratedKeys.length} clés migrées, ${result.errors.length} erreurs.`);

    } catch (error) {
      result.errors.push(`Erreur générale lors de la migration: ${error}`);
      console.error('Erreur générale lors de la migration:', error);
    }

    return result;
  }

  // Valider et parser les données
  private validateAndParseData(key: string, data: string): any {
    try {
      const parsed = JSON.parse(data);
      
      // Validation spécifique selon le type de données
      switch (key) {
        case 'gsm_history':
        case 'umts_history':
        case 'hertzien_history':
        case 'optique_history':
          return Array.isArray(parsed) ? parsed : [];
        
        case 'settings':
        case 'user_preferences':
        case 'theme_preferences':
          return typeof parsed === 'object' && parsed !== null ? parsed : {};
        
        case 'simulation_history':
          return Array.isArray(parsed) ? parsed : [];
        
        case 'calculation_cache':
          return typeof parsed === 'object' && parsed !== null ? parsed : {};
        
        case 'ui_state':
          return typeof parsed === 'object' && parsed !== null ? parsed : {};
        
        default:
          return parsed;
      }
    } catch (error) {
      console.error(`Erreur de parsing pour ${key}:`, error);
      return null;
    }
  }

  // Nettoyer localStorage après migration réussie
  public async cleanupLocalStorage(): Promise<void> {
    try {
      const keysToClean = [
        'gsm_history',
        'umts_history',
        'hertzien_history',
        'optique_history',
        'settings',
        'user_preferences',
        'simulation_history',
        'calculation_cache',
        'ui_state',
        'theme_preferences'
      ];

      for (const key of keysToClean) {
        localStorage.removeItem(key);
      }

      console.log('Nettoyage de localStorage terminé');
    } catch (error) {
      console.error('Erreur lors du nettoyage de localStorage:', error);
    }
  }

  // Vérifier l'intégrité des données migrées
  public async validateMigratedData(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Vérifier que les données essentielles sont présentes
      const gsmHistory = await desktopStorage.getGsmHistory();
      const umtsHistory = await desktopStorage.getUmtsHistory();
      const hertzienHistory = await desktopStorage.getHertzienHistory();
      const optiqueHistory = await desktopStorage.getOptiqueHistory();
      const settings = await desktopStorage.getSettings();

      // Vérifications de base
      if (!Array.isArray(gsmHistory)) {
        errors.push('gsm_history n\'est pas un tableau valide');
      }

      if (!Array.isArray(umtsHistory)) {
        errors.push('umts_history n\'est pas un tableau valide');
      }

      if (!Array.isArray(hertzienHistory)) {
        errors.push('hertzien_history n\'est pas un tableau valide');
      }

      if (!Array.isArray(optiqueHistory)) {
        errors.push('optique_history n\'est pas un tableau valide');
      }

      if (settings && typeof settings !== 'object') {
        errors.push('settings n\'est pas un objet valide');
      }

      // Vérifications supplémentaires pour les données critiques
      if (gsmHistory.length > 0) {
        const firstItem = gsmHistory[0];
        if (!firstItem || typeof firstItem !== 'object') {
          errors.push('Le premier élément de gsm_history n\'est pas valide');
        }
      }

      if (umtsHistory.length > 0) {
        const firstItem = umtsHistory[0];
        if (!firstItem || typeof firstItem !== 'object') {
          errors.push('Le premier élément de umts_history n\'est pas valide');
        }
      }

    } catch (error) {
      errors.push(`Erreur lors de la validation: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Créer une sauvegarde avant migration
  public async createPreMigrationBackup(): Promise<boolean> {
    try {
      const backupData: any = {};
      const keysToBackup = [
        'gsm_history',
        'umts_history',
        'hertzien_history',
        'optique_history',
        'settings',
        'user_preferences',
        'simulation_history',
        'calculation_cache',
        'ui_state',
        'theme_preferences'
      ];

      for (const key of keysToBackup) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            backupData[key] = JSON.parse(data);
          } catch (error) {
            console.warn(`Impossible de parser ${key} pour la sauvegarde:`, error);
            backupData[key] = data; // Garder les données brutes
          }
        }
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `pre_migration_backup_${timestamp}`;
      
      await desktopStorage.set(backupKey, backupData);
      console.log(`Sauvegarde pré-migration créée: ${backupKey}`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la sauvegarde pré-migration:', error);
      return false;
    }
  }

  // Restaurer depuis une sauvegarde pré-migration
  public async restoreFromPreMigrationBackup(backupKey: string): Promise<boolean> {
    try {
      const backupData = await desktopStorage.get(backupKey);
      if (!backupData) {
        throw new Error('Sauvegarde non trouvée');
      }

      // Restaurer dans localStorage
      for (const [key, value] of Object.entries(backupData)) {
        localStorage.setItem(key, JSON.stringify(value));
      }

      console.log(`Restauration depuis ${backupKey} terminée`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration depuis la sauvegarde:', error);
      return false;
    }
  }

  // Obtenir la liste des sauvegardes disponibles
  public async getAvailableBackups(): Promise<string[]> {
    try {
      const allKeys = Object.keys(localStorage);
      return allKeys.filter(key => key.startsWith('pre_migration_backup_'));
    } catch (error) {
      console.error('Erreur lors de la récupération des sauvegardes:', error);
      return [];
    }
  }

  // Processus complet de migration
  public async performCompleteMigration(): Promise<MigrationResult> {
    console.log('Début du processus complet de migration...');

    // 1. Vérifier si c'est la première exécution
    const isFirstRun = await this.isFirstRun();
    if (!isFirstRun) {
      console.log('Migration déjà effectuée, vérification de l\'intégrité...');
      const validation = await this.validateMigratedData();
      if (validation.valid) {
        return {
          success: true,
          migratedKeys: [],
          errors: [],
          totalItems: 0
        };
      } else {
        console.log('Problèmes d\'intégrité détectés, nouvelle migration nécessaire');
      }
    }

    // 2. Créer une sauvegarde pré-migration
    await this.createPreMigrationBackup();

    // 3. Effectuer la migration
    const result = await this.migrateFromLocalStorage();

    // 4. Valider les données migrées
    if (result.success) {
      const validation = await this.validateMigratedData();
      if (!validation.valid) {
        result.success = false;
        result.errors.push(...validation.errors);
        console.error('Échec de la validation post-migration');
      } else {
        // 5. Nettoyer localStorage
        await this.cleanupLocalStorage();
        console.log('Migration complète réussie');
      }
    }

    return result;
  }
}

// Hook React pour utiliser le service de migration
export const useMigrationService = () => {
  const migrationService = MigrationService.getInstance();
  
  return {
    isFirstRun: migrationService.isFirstRun.bind(migrationService),
    getMigrationStatus: migrationService.getMigrationStatus.bind(migrationService),
    migrateFromLocalStorage: migrationService.migrateFromLocalStorage.bind(migrationService),
    validateMigratedData: migrationService.validateMigratedData.bind(migrationService),
    createPreMigrationBackup: migrationService.createPreMigrationBackup.bind(migrationService),
    restoreFromPreMigrationBackup: migrationService.restoreFromPreMigrationBackup.bind(migrationService),
    getAvailableBackups: migrationService.getAvailableBackups.bind(migrationService),
    performCompleteMigration: migrationService.performCompleteMigration.bind(migrationService)
  };
};

// Instance singleton exportée
export const migrationService = MigrationService.getInstance(); 