// Service de stockage desktop utilisant electron-store
// Suivant le guide de migration MIGRATION_DESKTOP.md

export interface StorageData {
  gsm_history?: any[];
  umts_history?: any[];
  hertzien_history?: any[];
  optique_history?: any[];
  settings?: any;
  user_preferences?: any;
  [key: string]: any;
}

export class DesktopStorage {
  private static instance: DesktopStorage;
  private electronService: any;

  private constructor() {
    // Import dynamique pour éviter les erreurs en mode web
    try {
      const { ElectronService } = require('./electronService');
      this.electronService = ElectronService.getInstance();
    } catch (error) {
      console.warn('ElectronService non disponible, utilisation du fallback localStorage');
      this.electronService = null;
    }
  }

  public static getInstance(): DesktopStorage {
    if (!DesktopStorage.instance) {
      DesktopStorage.instance = new DesktopStorage();
    }
    return DesktopStorage.instance;
  }

  // Méthodes principales de stockage
  public async get(key: string): Promise<any> {
    try {
      if (this.electronService && this.electronService.isAvailable()) {
        // Utiliser electron-store via le service
        return await this.electronService.getStorageItem(key);
      } else {
        // Fallback vers localStorage
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }

  public async set(key: string, value: any): Promise<boolean> {
    try {
      if (this.electronService && this.electronService.isAvailable()) {
        // Utiliser electron-store via le service
        this.electronService.setStorageItem(key, JSON.stringify(value));
        return true;
      } else {
        // Fallback vers localStorage
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
      return false;
    }
  }

  public async remove(key: string): Promise<boolean> {
    try {
      if (this.electronService && this.electronService.isAvailable()) {
        this.electronService.removeStorageItem(key);
        return true;
      } else {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
      return false;
    }
  }

  public async clear(): Promise<boolean> {
    try {
      if (this.electronService && this.electronService.isAvailable()) {
        this.electronService.clearStorage();
        return true;
      } else {
        localStorage.clear();
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
      return false;
    }
  }

  // Méthodes spécifiques pour les données de l'application
  public async getGsmHistory(): Promise<any[]> {
    return await this.get('gsm_history') || [];
  }

  public async saveGsmHistory(data: any[]): Promise<boolean> {
    return await this.set('gsm_history', data);
  }

  public async getUmtsHistory(): Promise<any[]> {
    return await this.get('umts_history') || [];
  }

  public async saveUmtsHistory(data: any[]): Promise<boolean> {
    return await this.set('umts_history', data);
  }

  public async getHertzienHistory(): Promise<any[]> {
    return await this.get('hertzien_history') || [];
  }

  public async saveHertzienHistory(data: any[]): Promise<boolean> {
    return await this.set('hertzien_history', data);
  }

  public async getOptiqueHistory(): Promise<any[]> {
    return await this.get('optique_history') || [];
  }

  public async saveOptiqueHistory(data: any[]): Promise<boolean> {
    return await this.set('optique_history', data);
  }

  public async getSettings(): Promise<any> {
    return await this.get('settings') || {};
  }

  public async saveSettings(settings: any): Promise<boolean> {
    return await this.set('settings', settings);
  }

  public async getUserPreferences(): Promise<any> {
    return await this.get('user_preferences') || {};
  }

  public async saveUserPreferences(preferences: any): Promise<boolean> {
    return await this.set('user_preferences', preferences);
  }

  // Méthodes spécifiques pour les données de simulation
  public async getSimulationData(): Promise<any> {
    return await this.get('simulation_data') || null;
  }

  public async saveSimulationData(data: any): Promise<boolean> {
    return await this.set('simulation_data', data);
  }

  // Méthodes pour les paramètres de simulation par technologie
  public async getOptiqueSimulationParams(): Promise<any> {
    return await this.get('optique_simulation_params') || null;
  }

  public async saveOptiqueSimulationParams(params: any): Promise<boolean> {
    return await this.set('optique_simulation_params', params);
  }

  public async getUmtsSimulationParams(): Promise<any> {
    return await this.get('umts_simulation_params') || null;
  }

  public async saveUmtsSimulationParams(params: any): Promise<boolean> {
    return await this.set('umts_simulation_params', params);
  }

  public async getGsmSimulationParams(): Promise<any> {
    return await this.get('gsm_simulation_params') || null;
  }

  public async saveGsmSimulationParams(params: any): Promise<boolean> {
    return await this.set('gsm_simulation_params', params);
  }

  public async getHertzienSimulationParams(): Promise<any> {
    return await this.get('hertzien_simulation_params') || null;
  }

  public async saveHertzienSimulationParams(params: any): Promise<boolean> {
    return await this.set('hertzien_simulation_params', params);
  }

  // Méthode de migration depuis localStorage
  public async migrateFromLocalStorage(): Promise<void> {
    const keys = ['gsm_history', 'umts_history', 'hertzien_history', 'optique_history', 'settings', 'user_preferences'];
    
    for (const key of keys) {
      try {
        const oldData = localStorage.getItem(key);
        if (oldData) {
          const parsedData = JSON.parse(oldData);
          await this.set(key, parsedData);
          localStorage.removeItem(key);
          console.log(`Migration réussie pour ${key}`);
        }
      } catch (error) {
        console.error(`Erreur lors de la migration de ${key}:`, error);
      }
    }
  }

  // Méthode de validation des données
  public async validateDataIntegrity(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // Vérifier que les historiques sont des tableaux
      const gsmHistory = await this.getGsmHistory();
      if (!Array.isArray(gsmHistory)) {
        errors.push('gsm_history n\'est pas un tableau valide');
      }

      const umtsHistory = await this.getUmtsHistory();
      if (!Array.isArray(umtsHistory)) {
        errors.push('umts_history n\'est pas un tableau valide');
      }

      const hertzienHistory = await this.getHertzienHistory();
      if (!Array.isArray(hertzienHistory)) {
        errors.push('hertzien_history n\'est pas un tableau valide');
      }

      const optiqueHistory = await this.getOptiqueHistory();
      if (!Array.isArray(optiqueHistory)) {
        errors.push('optique_history n\'est pas un tableau valide');
      }

      // Vérifier que les paramètres sont des objets
      const settings = await this.getSettings();
      if (settings && typeof settings !== 'object') {
        errors.push('settings n\'est pas un objet valide');
      }

      const preferences = await this.getUserPreferences();
      if (preferences && typeof preferences !== 'object') {
        errors.push('user_preferences n\'est pas un objet valide');
      }

    } catch (error) {
      errors.push(`Erreur lors de la validation: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Méthode de sauvegarde automatique
  public async backup(): Promise<boolean> {
    try {
      const allData: StorageData = {
        gsm_history: await this.getGsmHistory(),
        umts_history: await this.getUmtsHistory(),
        hertzien_history: await this.getHertzienHistory(),
        optique_history: await this.getOptiqueHistory(),
        settings: await this.getSettings(),
        user_preferences: await this.getUserPreferences()
      };

      const timestamp = new Date().toISOString().split('T')[0];
      const backupKey = `backup_${timestamp}`;
      
      return await this.set(backupKey, allData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Méthode de restauration depuis une sauvegarde
  public async restore(backupKey: string): Promise<boolean> {
    try {
      const backupData = await this.get(backupKey);
      if (!backupData) {
        throw new Error('Sauvegarde non trouvée');
      }

      // Restaurer chaque type de données
      if (backupData.gsm_history) await this.saveGsmHistory(backupData.gsm_history);
      if (backupData.umts_history) await this.saveUmtsHistory(backupData.umts_history);
      if (backupData.hertzien_history) await this.saveHertzienHistory(backupData.hertzien_history);
      if (backupData.optique_history) await this.saveOptiqueHistory(backupData.optique_history);
      if (backupData.settings) await this.saveSettings(backupData.settings);
      if (backupData.user_preferences) await this.saveUserPreferences(backupData.user_preferences);

      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return false;
    }
  }

  // Méthode pour obtenir les informations sur le stockage
  public async getStorageInfo(): Promise<{
    environment: 'electron' | 'web';
    available: boolean;
    size: number;
    keys: string[];
  }> {
    try {
      const environment = this.electronService && this.electronService.isAvailable() ? 'electron' : 'web';
      const available = this.electronService ? this.electronService.isAvailable() : true;
      
      // Compter les clés et estimer la taille
      const keys = Object.keys(localStorage);
      let size = 0;
      
      for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }

      return {
        environment,
        available,
        size,
        keys
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de stockage:', error);
      return {
        environment: 'web',
        available: false,
        size: 0,
        keys: []
      };
    }
  }
}

// Hook React pour utiliser le stockage desktop
export const useDesktopStorage = () => {
  const storage = DesktopStorage.getInstance();
  
  return {
    get: storage.get.bind(storage),
    set: storage.set.bind(storage),
    remove: storage.remove.bind(storage),
    clear: storage.clear.bind(storage),
    getGsmHistory: storage.getGsmHistory.bind(storage),
    saveGsmHistory: storage.saveGsmHistory.bind(storage),
    getUmtsHistory: storage.getUmtsHistory.bind(storage),
    saveUmtsHistory: storage.saveUmtsHistory.bind(storage),
    getHertzienHistory: storage.getHertzienHistory.bind(storage),
    saveHertzienHistory: storage.saveHertzienHistory.bind(storage),
    getOptiqueHistory: storage.getOptiqueHistory.bind(storage),
    saveOptiqueHistory: storage.saveOptiqueHistory.bind(storage),
    getSettings: storage.getSettings.bind(storage),
    saveSettings: storage.saveSettings.bind(storage),
    getUserPreferences: storage.getUserPreferences.bind(storage),
    saveUserPreferences: storage.saveUserPreferences.bind(storage),
    migrateFromLocalStorage: storage.migrateFromLocalStorage.bind(storage),
    validateDataIntegrity: storage.validateDataIntegrity.bind(storage),
    backup: storage.backup.bind(storage),
    restore: storage.restore.bind(storage),
    getStorageInfo: storage.getStorageInfo.bind(storage)
  };
};

// Instance singleton exportée
export const desktopStorage = DesktopStorage.getInstance(); 