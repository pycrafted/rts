const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const puppeteer = require('puppeteer');

// Configuration de l'application
const APP_CONFIG = {
  name: 'RTS - Radio Transmission System',
  version: '1.0.0',
  author: 'RTS Team',
  window: {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  }
};

const store = new Store();

let mainWindow;
let tray;

// Configuration de la mise à jour automatique
function setupAutoUpdater() {
  // Configuration pour le développement (désactiver les mises à jour)
  if (process.env.NODE_ENV === 'development') {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    return;
  }

  // Configuration pour la production
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.checkForUpdatesAndNotify();

  // Événements de mise à jour
  autoUpdater.on('checking-for-update', () => {
    console.log('Vérification des mises à jour...');
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'checking');
    }
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Mise à jour disponible:', info);
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'available', info);
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Aucune mise à jour disponible:', info);
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'not-available', info);
    }
  });

  autoUpdater.on('error', (err) => {
    console.error('Erreur lors de la mise à jour:', err);
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'error', err.message);
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progressObj);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Mise à jour téléchargée:', info);
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'downloaded', info);
    }
  });
}

// Gestionnaire de création de fenêtre principale
function createMainWindow() {
  mainWindow = new BrowserWindow({
    ...APP_CONFIG.window,
    title: APP_CONFIG.name,
    icon: path.join(__dirname, '../public/vite.svg'),
    show: false,
    autoHideMenuBar: true,
    webSecurity: true,
    allowRunningInsecureContent: false,
    nodeIntegrationInWorker: false,
    enableWebCodecs: false,
    // Optimisations de performance
    backgroundThrottling: false,
    webPreferences: {
      ...APP_CONFIG.window.webPreferences,
      // Optimisations pour les performances
      enableRemoteModule: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Désactiver les fonctionnalités qui peuvent causer des problèmes de souris
      enableWebCodecs: false,
      // Optimisations de rendu
      offscreen: false,
      // Améliorer la gestion des événements de souris
      experimentalFeatures: false
    }
  });

  // Optimisations supplémentaires pour les performances
  mainWindow.webContents.setFrameRate(60);
  
  // Désactiver les animations de fenêtre qui peuvent causer des problèmes
  mainWindow.setMenuBarVisibility(false);
  
  console.log('🔍 [ELECTRON] Configuration de la fenêtre terminée - VERSION PROPRE');

  // Charger l'application
  if (isDev) {
    console.log('Mode développement: chargement depuis http://localhost:5173');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Mode production: chargement depuis', indexPath);
    console.log('Fichier existe:', fs.existsSync(indexPath));
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(indexPath)) {
      console.error('Fichier index.html introuvable:', indexPath);
      dialog.showErrorBox('Erreur', 'Fichier d\'application introuvable. Veuillez réinstaller l\'application.');
      app.quit();
      return;
    }
    
    mainWindow.loadFile(indexPath);
    
    // Activer les outils de développement en cas de problème
    if (process.env.DEBUG) {
      mainWindow.webContents.openDevTools();
    }
  }

  // Gestionnaires d'événements de fenêtre
  mainWindow.once('ready-to-show', () => {
    console.log('Fenêtre prête à être affichée');
    mainWindow.show();
    if (isDev) {
      console.log('Application RTS démarrée en mode développement');
    } else {
      console.log('Application RTS démarrée en mode production');
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Empêcher la fermeture de l'application quand la fenêtre est fermée
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Gestionnaire de liens externes
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Gestionnaire d'erreurs de chargement
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Erreur de chargement:', errorCode, errorDescription, validatedURL);
    dialog.showErrorBox('Erreur de chargement', `Impossible de charger l'application: ${errorDescription}`);
  });

  // Gestionnaire d'erreurs de rendu
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Processus de rendu terminé:', details);
    dialog.showErrorBox('Erreur', 'Le processus de rendu a été interrompu. L\'application va redémarrer.');
    createMainWindow();
  });

  // Gestionnaires IPC pour les mises à jour
  ipcMain.handle('check-for-updates', () => {
    return autoUpdater.checkForUpdates();
  });

  ipcMain.handle('download-update', () => {
    return autoUpdater.downloadUpdate();
  });

  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall();
  });
}

// Création du tray
function createTray() {
  const iconPath = path.join(__dirname, '../public/vite.svg');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  tray.setToolTip(APP_CONFIG.name);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Ouvrir RTS',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Quitter',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Gestionnaires IPC pour la communication avec le renderer
ipcMain.handle('app:get-version', () => {
  return APP_CONFIG.version;
});

ipcMain.handle('app:get-name', () => {
  return APP_CONFIG.name;
});

// Gestionnaire pour l'export PDF avec Puppeteer
ipcMain.handle('export:pdf', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter en PDF',
      defaultPath: `rts-export-${new Date().toISOString().split('T')[0]}.pdf`,
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] }
      ]
    });

    if (!filePath) {
      return { success: false, error: 'Aucun fichier sélectionné' };
    }

    console.log('🚀 Début de l\'export PDF avec Puppeteer...');

    // Lancer Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    try {
      const page = await browser.newPage();
      
      // Configuration optimisée pour le rendu PDF
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
      });

      // Activer les styles d'impression
      await page.emulateMediaType('print');

      // Préparer les données pour la page PDF
      const reportData = data.data || {
        type: data.type || 'complete',
        title: data.title || 'Rapport RTS',
        subtitle: data.subtitle || 'Analyse complète des réseaux télécoms',
        data: data,
        metadata: {
          generatedAt: new Date().toISOString(),
          user: data.user || 'Ingénieur Télécoms',
          company: 'RTS - Radio Transmission System'
        }
      };

      // Construire l'URL de la page PDF
      const devServerUrl = 'http://localhost:5173';
      const pdfReportUrl = `${devServerUrl}/#/pdf-report?data=${encodeURIComponent(JSON.stringify(reportData))}`;
      
      console.log('📄 Navigation vers:', pdfReportUrl);

      // Naviguer vers la page PDF
      await page.goto(pdfReportUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Attendre le chargement complet
      console.log('⏳ Attente du chargement React...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Attendre le signal de prêt
      console.log('⏳ Attente du signal de prêt...');
      try {
        await page.waitForFunction(() => {
          const indicator = document.getElementById('pdf-ready-indicator');
          return indicator && indicator.style.display !== 'none';
        }, { timeout: 15000 });
        console.log('✅ Signal de prêt reçu');
      } catch (error) {
        console.log('⚠️ Signal de prêt non reçu, continuation...');
      }

      // Attente finale pour un rendu optimal
      console.log('⏳ Attente finale pour le rendu optimal...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Récupérer les options PDF depuis les données ou utiliser les valeurs par défaut
      const pdfOptions = data.options || {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '15mm',
          bottom: '15mm',
          left: '15mm'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        scale: 0.9
      };

      // Générer le PDF optimisé
      console.log('📄 Génération du PDF optimisé...');
      const pdfBuffer = await page.pdf(pdfOptions);

      // Sauvegarder le PDF
      fs.writeFileSync(filePath, pdfBuffer);
      
      console.log('✅ PDF généré avec succès:', filePath);
      console.log('📊 Taille du fichier:', pdfBuffer.length, 'bytes');

      return { 
        success: true, 
        filePath,
        metadata: {
          size: pdfBuffer.length,
          pages: Math.ceil(pdfBuffer.length / 1000), // Estimation
          generatedAt: new Date().toISOString()
        }
      };

    } finally {
      // Fermer le navigateur
      await browser.close();
      console.log('🔒 Navigateur fermé');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'export PDF:', error);
    return { 
      success: false, 
      error: `Erreur lors de l'export PDF: ${error.message}` 
    };
  }
});

// Gestionnaire pour l'import/export de données
ipcMain.handle('data:export', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exporter les données',
      defaultPath: `rts-data-${new Date().toISOString().split('T')[0]}.json`,
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });

    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true, filePath };
    }
    return { success: false, error: 'Aucun fichier sélectionné' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('data:import', async (event) => {
  try {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Importer des données',
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });

    if (filePaths && filePaths.length > 0) {
      const data = fs.readFileSync(filePaths[0], 'utf8');
      return { success: true, data: JSON.parse(data) };
    }
    return { success: false, error: 'Aucun fichier sélectionné' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Gestionnaire pour l'accès aux fichiers système
ipcMain.handle('file:read', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('file:write', async (event, filePath, data) => {
  try {
    fs.writeFileSync(filePath, data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Gestionnaire pour les informations système
ipcMain.handle('system:info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    memory: process.memoryUsage(),
    cwd: process.cwd()
  };
});

// Gestionnaires IPC existants
ipcMain.handle('get-store', async (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store', async (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled) {
    const fs = require('fs');
    return fs.readFileSync(result.filePaths[0], 'utf-8');
  }
  return null;
});

ipcMain.handle('save-file', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled) {
    const fs = require('fs');
    fs.writeFileSync(result.filePath, data);
    return true;
  }
  return false;
});

// Événements de l'application
app.whenReady().then(() => {
  createMainWindow();
  createTray();
  setupAutoUpdater();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuiting = true;
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
  if (mainWindow) {
    mainWindow.webContents.send('app:error', error.message);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
  if (mainWindow) {
    mainWindow.webContents.send('app:error', reason);
  }
}); 