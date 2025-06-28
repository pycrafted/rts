// Déclaration de type pour window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      onUpdateStatus?: (callback: (status: string, info: any) => void) => void;
      onUpdateProgress?: (callback: (progress: any) => void) => void;
      checkForUpdates?: () => Promise<boolean>;
      downloadUpdate?: () => Promise<boolean>;
      installUpdate?: () => Promise<void>;
      getAppVersion?: () => string;
      getPlatform?: () => string;
    };
  }
}

export interface UpdateInfo {
  version: string;
  releaseDate: string;
  releaseNotes: string;
}

export interface UpdateProgress {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

export class UpdateService {
  private static instance: UpdateService;
  private updateCallbacks: Map<string, Function[]> = new Map();

  public static getInstance(): UpdateService {
    if (!UpdateService.instance) {
      UpdateService.instance = new UpdateService();
    }
    return UpdateService.instance;
  }

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Écouter les événements de mise à jour
    if (window.electronAPI?.onUpdateStatus) {
      window.electronAPI.onUpdateStatus((status: string, info: any) => {
        this.handleUpdateStatus(status, info);
      });
    }

    if (window.electronAPI?.onUpdateProgress) {
      window.electronAPI.onUpdateProgress((progress: UpdateProgress) => {
        this.handleUpdateProgress(progress);
      });
    }
  }

  private handleUpdateStatus(status: string, info: any) {
    console.log(`Mise à jour - Status: ${status}`, info);
    
    switch (status) {
      case 'checking':
        this.notifyCallbacks('checking', { message: 'Vérification des mises à jour...' });
        break;
      case 'available':
        this.notifyCallbacks('available', { 
          message: 'Une mise à jour est disponible',
          info 
        });
        break;
      case 'not-available':
        this.notifyCallbacks('not-available', { 
          message: 'Aucune mise à jour disponible',
          info 
        });
        break;
      case 'downloaded':
        this.notifyCallbacks('downloaded', { 
          message: 'Mise à jour téléchargée, redémarrage imminent',
          info 
        });
        break;
      case 'error':
        this.notifyCallbacks('error', { 
          message: 'Erreur lors de la mise à jour',
          error: info 
        });
        break;
    }
  }

  private handleUpdateProgress(progress: UpdateProgress) {
    this.notifyCallbacks('progress', { progress });
  }

  private notifyCallbacks(event: string, data: any) {
    const callbacks = this.updateCallbacks.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  // Méthodes publiques
  public async checkForUpdates(): Promise<boolean> {
    try {
      if (window.electronAPI?.checkForUpdates) {
        return await window.electronAPI.checkForUpdates();
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error);
      return false;
    }
  }

  public async downloadUpdate(): Promise<boolean> {
    try {
      if (window.electronAPI?.downloadUpdate) {
        return await window.electronAPI.downloadUpdate();
      }
      return false;
    } catch (error) {
      console.error('Erreur lors du téléchargement de la mise à jour:', error);
      return false;
    }
  }

  public async installUpdate(): Promise<void> {
    try {
      if (window.electronAPI?.installUpdate) {
        await window.electronAPI.installUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation de la mise à jour:', error);
    }
  }

  public on(event: string, callback: Function): void {
    if (!this.updateCallbacks.has(event)) {
      this.updateCallbacks.set(event, []);
    }
    this.updateCallbacks.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.updateCallbacks.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  public getAppVersion(): string {
    return window.electronAPI?.getAppVersion?.() || '1.0.0';
  }

  public getPlatform(): string {
    return window.electronAPI?.getPlatform?.() || 'web';
  }

  public isElectron(): boolean {
    return !!window.electronAPI;
  }
}

// Hook React pour utiliser le service de mise à jour
export const useUpdateService = () => {
  const updateService = UpdateService.getInstance();
  
  return {
    checkForUpdates: updateService.checkForUpdates.bind(updateService),
    downloadUpdate: updateService.downloadUpdate.bind(updateService),
    installUpdate: updateService.installUpdate.bind(updateService),
    on: updateService.on.bind(updateService),
    off: updateService.off.bind(updateService),
    getAppVersion: updateService.getAppVersion.bind(updateService),
    getPlatform: updateService.getPlatform.bind(updateService),
    isElectron: updateService.isElectron.bind(updateService)
  };
}; 