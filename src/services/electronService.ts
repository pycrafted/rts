// Service pour gérer les interactions avec les APIs Electron
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getAppName: () => Promise<string>;
  exportPDF: (data: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  exportData: (data: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  importData: () => Promise<{ success: boolean; data?: any; error?: string }>;
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  writeFile: (filePath: string, data: string) => Promise<{ success: boolean; error?: string }>;
  getSystemInfo: () => Promise<any>;
  onAppError: (callback: (error: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

export interface ElectronStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

export interface ElectronPerformance {
  getMemoryUsage: () => {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  mark: (name: string) => void;
  measure: (name: string, startMark: string, endMark: string) => PerformanceMeasure | null;
}

export interface ElectronNotifications {
  showNotification: (title: string, options?: NotificationOptions) => void;
  requestNotificationPermission: () => Promise<NotificationPermission>;
}

export interface ElectronLogs {
  log: (level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) => void;
  getLogs: (limit?: number) => any[];
  clearLogs: () => void;
}

// Détection de l'environnement Electron
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && (window as any).isElectron === true;
};

// Service principal Electron
export class ElectronService {
  private static instance: ElectronService;
  private api: ElectronAPI | null = null;
  private storage: ElectronStorage | null = null;
  private performance: ElectronPerformance | null = null;
  private notifications: ElectronNotifications | null = null;
  private logs: ElectronLogs | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ElectronService {
    if (!ElectronService.instance) {
      ElectronService.instance = new ElectronService();
    }
    return ElectronService.instance;
  }

  private initialize(): void {
    if (isElectron()) {
      this.api = (window as any).electronAPI;
      this.storage = (window as any).electronStorage;
      this.performance = (window as any).electronPerformance;
      this.notifications = (window as any).electronNotifications;
      this.logs = (window as any).electronLogs;
      
      // Configuration des gestionnaires d'erreurs
      if (this.api) {
        this.api.onAppError((error: string) => {
          console.error('Erreur Electron:', error);
          this.logs?.log('error', 'Erreur Electron', { error });
        });
      }
    }
  }

  // Méthodes pour l'API principale
  public async getAppVersion(): Promise<string> {
    if (this.api) {
      return await this.api.getAppVersion();
    }
    return '1.0.0';
  }

  public async getAppName(): Promise<string> {
    if (this.api) {
      return await this.api.getAppName();
    }
    return 'RTS - Radio Transmission System';
  }

  public async exportPDF(data: any): Promise<{ success: boolean; filePath?: string; error?: string }> {
    if (this.api) {
      return await this.api.exportPDF(data);
    }
    return { success: false, error: 'Electron non disponible' };
  }

  public async exportData(data: any): Promise<{ success: boolean; filePath?: string; error?: string }> {
    if (this.api) {
      return await this.api.exportData(data);
    }
    return { success: false, error: 'Electron non disponible' };
  }

  public async importData(): Promise<{ success: boolean; data?: any; error?: string }> {
    if (this.api) {
      return await this.api.importData();
    }
    return { success: false, error: 'Electron non disponible' };
  }

  public async readFile(filePath: string): Promise<{ success: boolean; data?: string; error?: string }> {
    if (this.api) {
      return await this.api.readFile(filePath);
    }
    return { success: false, error: 'Electron non disponible' };
  }

  public async writeFile(filePath: string, data: string): Promise<{ success: boolean; error?: string }> {
    if (this.api) {
      return await this.api.writeFile(filePath, data);
    }
    return { success: false, error: 'Electron non disponible' };
  }

  public async getSystemInfo(): Promise<any> {
    if (this.api) {
      return await this.api.getSystemInfo();
    }
    return {
      platform: 'web',
      arch: 'unknown',
      version: 'unknown',
      memory: null,
      cwd: process.cwd()
    };
  }

  // Méthodes pour le stockage
  public getStorageItem(key: string): string | null {
    if (this.storage) {
      return this.storage.getItem(key);
    }
    return localStorage.getItem(key);
  }

  public setStorageItem(key: string, value: string): void {
    if (this.storage) {
      this.storage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  public removeStorageItem(key: string): void {
    if (this.storage) {
      this.storage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
  }

  public clearStorage(): void {
    if (this.storage) {
      this.storage.clear();
    } else {
      localStorage.clear();
    }
  }

  // Méthodes pour les performances
  public getMemoryUsage(): any {
    if (this.performance) {
      return this.performance.getMemoryUsage();
    }
    return null;
  }

  public markPerformance(name: string): void {
    if (this.performance) {
      this.performance.mark(name);
    }
  }

  public measurePerformance(name: string, startMark: string, endMark: string): PerformanceMeasure | null {
    if (this.performance) {
      return this.performance.measure(name, startMark, endMark);
    }
    return null;
  }

  // Méthodes pour les notifications
  public showNotification(title: string, options?: NotificationOptions): void {
    if (this.notifications) {
      this.notifications.showNotification(title, options);
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (this.notifications) {
      return await this.notifications.requestNotificationPermission();
    } else if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  // Méthodes pour les logs
  public log(level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any): void {
    if (this.logs) {
      this.logs.log(level, message, data);
    } else {
      console[level](message, data);
    }
  }

  public getLogs(limit?: number): any[] {
    if (this.logs) {
      return this.logs.getLogs(limit);
    }
    return [];
  }

  public clearLogs(): void {
    if (this.logs) {
      this.logs.clearLogs();
    }
  }

  // Méthodes utilitaires
  public isAvailable(): boolean {
    return isElectron() && this.api !== null;
  }

  public getEnvironment(): 'electron' | 'web' {
    return isElectron() ? 'electron' : 'web';
  }
}

// Export de l'instance singleton
export const electronService = ElectronService.getInstance();

// Hooks React pour utiliser le service Electron
export const useElectron = () => {
  return {
    isElectron: isElectron(),
    service: electronService,
    isAvailable: electronService.isAvailable(),
    environment: electronService.getEnvironment()
  };
}; 