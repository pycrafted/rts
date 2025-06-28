/// <reference types="vite/client" />

// Déclarations de types pour les APIs Electron
declare global {
  interface Window {
    electronAPI?: {
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
      checkForUpdates: () => Promise<any>;
      downloadUpdate: () => Promise<any>;
      installUpdate: () => Promise<void>;
      onUpdateStatus: (callback: (status: string, info?: any) => void) => void;
      onUpdateProgress: (callback: (progress: any) => void) => void;
      getPlatform: () => string;
    };
    electronStorage?: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
      removeItem: (key: string) => void;
      clear: () => void;
    };
    electronPerformance?: {
      getMemoryUsage: () => {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      } | null;
      mark: (name: string) => void;
      measure: (name: string, startMark: string, endMark: string) => PerformanceMeasure | null;
    };
    electronNotifications?: {
      showNotification: (title: string, options?: NotificationOptions) => void;
      requestNotificationPermission: () => Promise<NotificationPermission>;
    };
    electronLogs?: {
      log: (level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) => void;
      getLogs: (limit?: number) => any[];
      clearLogs: () => void;
    };
    isElectron?: boolean;
  }
}

// Types pour les services
export interface UpdateProgress {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

export interface UpdateInfo {
  version: string;
  releaseDate: string;
  releaseNotes?: string;
}

// Types pour les stores
export interface SimulationData {
  id: string;
  timestamp: number;
  type: 'gsm' | 'umts' | 'hertzien' | 'optique';
  params: any;
  results: any;
}

export interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  performanceMode: boolean;
  autoSave: boolean;
  notifications: boolean;
}

// Types pour les composants
export interface AssistantIARef {
  askQuestion: (question: string) => void;
  clearChat: () => void;
}

// Types pour les services de migration
export interface MigrationResult {
  success: boolean;
  errors?: string[];
  migratedItems?: number;
  totalItems?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
