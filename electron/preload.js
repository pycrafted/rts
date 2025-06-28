const { contextBridge, ipcRenderer } = require('electron');

// Exposition sécurisée des APIs Electron au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Informations de l'application
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  getAppName: () => ipcRenderer.invoke('app:get-name'),
  
  // Export PDF
  exportPDF: (data) => ipcRenderer.invoke('export:pdf', data),
  
  // Import/Export de données
  exportData: (data) => ipcRenderer.invoke('data:export', data),
  importData: () => ipcRenderer.invoke('data:import'),
  
  // Accès aux fichiers système
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('file:write', filePath, data),
  
  // Informations système
  getSystemInfo: () => ipcRenderer.invoke('system:info'),
  
  // Événements de l'application
  onAppError: (callback) => {
    ipcRenderer.on('app:error', (event, error) => callback(error));
  },
  
  // Nettoyage des listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Stockage
  getStore: (key) => ipcRenderer.invoke('get-store', key),
  setStore: (key, value) => ipcRenderer.invoke('set-store', key, value),
  
  // Fichiers
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  
  // Système
  getPlatform: () => process.platform,
  
  // Notifications
  showNotification: (title, body) => {
    new Notification({ title, body }).show();
  },

  // Mise à jour automatique
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // Événements de mise à jour
  onUpdateStatus: (callback) => {
    ipcRenderer.on('update-status', (event, status, info) => callback(status, info));
  },
  
  onUpdateProgress: (callback) => {
    ipcRenderer.on('update-progress', (event, progress) => callback(progress));
  }
});

// Détection de l'environnement Electron
contextBridge.exposeInMainWorld('isElectron', true);

// API pour la gestion du stockage local (compatible avec l'existant)
contextBridge.exposeInMainWorld('electronStorage', {
  // Stockage local avec fallback vers localStorage
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Erreur localStorage, fallback vers sessionStorage:', error);
      return sessionStorage.getItem(key);
    }
  },
  
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Erreur localStorage, fallback vers sessionStorage:', error);
      sessionStorage.setItem(key, value);
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Erreur localStorage, fallback vers sessionStorage:', error);
      sessionStorage.removeItem(key);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Erreur localStorage, fallback vers sessionStorage:', error);
      sessionStorage.clear();
    }
  }
});

// API pour la gestion des performances
contextBridge.exposeInMainWorld('electronPerformance', {
  // Monitoring des performances
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  },
  
  // Mesure de performance
  mark: (name) => {
    if (performance.mark) {
      performance.mark(name);
    }
  },
  
  measure: (name, startMark, endMark) => {
    if (performance.measure) {
      try {
        return performance.measure(name, startMark, endMark);
      } catch (error) {
        console.warn('Erreur mesure performance:', error);
        return null;
      }
    }
    return null;
  }
});

// API pour la gestion des notifications
contextBridge.exposeInMainWorld('electronNotifications', {
  // Notification native
  showNotification: (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
        }
      });
    }
  },
  
  // Demande de permission
  requestNotificationPermission: () => {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }
});

// API pour la gestion des raccourcis clavier
contextBridge.exposeInMainWorld('electronShortcuts', {
  // Détection des raccourcis (basique)
  isKeyPressed: (key, modifiers = []) => {
    // Cette fonction sera étendue avec des raccourcis globaux si nécessaire
    return false;
  }
});

// API pour la gestion des mises à jour
contextBridge.exposeInMainWorld('electronUpdates', {
  // Vérification des mises à jour (placeholder)
  checkForUpdates: () => {
    return Promise.resolve({ available: false, version: '1.0.0' });
  },
  
  // Installation des mises à jour (placeholder)
  installUpdate: () => {
    return Promise.resolve({ success: false, error: 'Non implémenté' });
  }
});

// API pour la gestion des logs
contextBridge.exposeInMainWorld('electronLogs', {
  // Log avec niveau
  log: (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      userAgent: navigator.userAgent
    };
    
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    
    // Stockage local des logs (optionnel)
    try {
      const logs = JSON.parse(localStorage.getItem('rts_logs') || '[]');
      logs.push(logEntry);
      
      // Garder seulement les 1000 derniers logs
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      localStorage.setItem('rts_logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Erreur sauvegarde logs:', error);
    }
  },
  
  // Récupération des logs
  getLogs: (limit = 100) => {
    try {
      const logs = JSON.parse(localStorage.getItem('rts_logs') || '[]');
      return logs.slice(-limit);
    } catch (error) {
      console.warn('Erreur récupération logs:', error);
      return [];
    }
  },
  
  // Nettoyage des logs
  clearLogs: () => {
    try {
      localStorage.removeItem('rts_logs');
    } catch (error) {
      console.warn('Erreur nettoyage logs:', error);
    }
  }
});

// Initialisation des APIs
console.log('Preload script chargé - APIs Electron disponibles');

// Gestion des erreurs
window.addEventListener('error', (event) => {
  console.error('Renderer Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
}); 