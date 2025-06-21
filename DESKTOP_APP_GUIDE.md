# Guide de Conversion en Application de Bureau

## Vue d'ensemble

Votre application est déjà parfaitement adaptée pour être convertie en application de bureau ! Voici un guide complet pour la conversion.

## Options Recommandées

### 1. **Tauri (Recommandé)** ⭐

**Avantages :**
- Plus léger (taille finale ~10-20MB vs ~100MB pour Electron)
- Plus sécurisé (sandbox natif)
- Performances natives
- Support multi-plateforme (Windows, macOS, Linux)
- Développé en Rust

**Installation :**
```bash
# Installer Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Installer Tauri CLI
cargo install tauri-cli

# Initialiser Tauri dans votre projet
cargo tauri init
```

**Configuration :**
```json
// tauri.conf.json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.telecoms.dimensionnement",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    }
  }
}
```

### 2. **Electron (Alternative)**

**Avantages :**
- Plus mature et stable
- Plus de ressources disponibles
- Écosystème riche

**Installation :**
```bash
npm install --save-dev electron electron-builder
```

**Configuration :**
```json
// package.json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "build-electron": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.telecoms.dimensionnement",
    "productName": "Télécoms Dimensionnement",
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "mac": {
      "category": "public.app-category.education"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

## Étapes de Conversion

### Étape 1: Préparation

1. **Optimiser les performances :**
   - Votre app utilise déjà le lazy loading ✅
   - Optimisations mobiles déjà en place ✅
   - Code splitting déjà implémenté ✅

2. **Vérifier les dépendances :**
   - Toutes vos dépendances sont compatibles ✅
   - Three.js fonctionne parfaitement en desktop ✅
   - React Router compatible ✅

### Étape 2: Configuration Tauri

1. **Créer le fichier de configuration :**
```bash
cargo tauri init
```

2. **Configurer les permissions :**
```json
// tauri.conf.json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "scope": ["$APPDATA/*", "$DOCUMENT/*"]
      },
      "dialog": {
        "all": true
      },
      "shell": {
        "open": true
      }
    }
  }
}
```

3. **Ajouter les icônes :**
```bash
mkdir -p src-tauri/icons
# Ajouter vos icônes dans différents formats
```

### Étape 3: Adaptations Spécifiques

1. **Gestion des fichiers :**
```typescript
// services/fileService.ts
import { invoke } from '@tauri-apps/api/tauri';
import { save } from '@tauri-apps/api/dialog';

export const saveReport = async (data: any, filename: string) => {
  const filePath = await save({
    filters: [{
      name: 'PDF',
      extensions: ['pdf']
    }]
  });
  
  if (filePath) {
    await invoke('save_file', { path: filePath, data });
  }
};
```

2. **Intégration système :**
```typescript
// hooks/useDesktopFeatures.ts
import { useEffect } from 'react';
import { getVersion } from '@tauri-apps/api/app';

export const useDesktopFeatures = () => {
  useEffect(() => {
    // Détecter si on est en mode desktop
    const isDesktop = window.__TAURI__ !== undefined;
    
    if (isDesktop) {
      // Activer les fonctionnalités desktop
      console.log('Mode desktop détecté');
    }
  }, []);
};
```

### Étape 4: Build et Distribution

1. **Build de développement :**
```bash
cargo tauri dev
```

2. **Build de production :**
```bash
cargo tauri build
```

3. **Distribution :**
- Les fichiers seront dans `src-tauri/target/release/`
- Formats : `.exe` (Windows), `.app` (macOS), `.AppImage` (Linux)

## Optimisations Spécifiques Desktop

### 1. **Fenêtres Multiples**
```typescript
// services/windowService.ts
import { WebviewWindow } from '@tauri-apps/api/window';

export const openSimulationWindow = () => {
  const simulationWindow = new WebviewWindow('simulation', {
    url: '/simulation',
    title: 'Simulation 3D',
    width: 1200,
    height: 800,
    resizable: true
  });
};
```

### 2. **Menu Système**
```rust
// src-tauri/src/main.rs
use tauri::{CustomMenuItem, Menu, Submenu};

fn main() {
    let menu = Menu::new()
        .add_submenu(Submenu::new("Fichier", Menu::new()
            .add_item(CustomMenuItem::new("nouveau".to_string(), "Nouveau"))
            .add_item(CustomMenuItem::new("ouvrir".to_string(), "Ouvrir"))
            .add_item(CustomMenuItem::new("sauvegarder".to_string(), "Sauvegarder"))
        ))
        .add_submenu(Submenu::new("Édition", Menu::new()
            .add_item(CustomMenuItem::new("copier".to_string(), "Copier"))
            .add_item(CustomMenuItem::new("coller".to_string(), "Coller"))
        ));

    tauri::Builder::default()
        .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 3. **Raccourcis Clavier**
```typescript
// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { register } from '@tauri-apps/api/globalShortcut';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const registerShortcuts = async () => {
      await register('CommandOrControl+N', () => {
        // Nouveau projet
      });
      
      await register('CommandOrControl+S', () => {
        // Sauvegarder
      });
    };
    
    registerShortcuts();
  }, []);
};
```

## Avantages de la Conversion

### 1. **Performance**
- Accès direct aux ressources système
- Pas de limitations du navigateur
- Optimisations natives

### 2. **Fonctionnalités**
- Accès aux fichiers locaux
- Intégration système (notifications, menu)
- Raccourcis clavier globaux

### 3. **Distribution**
- Installation native
- Mises à jour automatiques
- Distribution hors ligne

## Temps Estimé

**Conversion complète : 2-4 heures**

- Configuration Tauri : 30 min
- Adaptations code : 1-2 heures
- Tests et optimisations : 1 heure
- Build et distribution : 30 min

## Conclusion

Votre application est déjà très bien structurée pour la conversion desktop. Avec Tauri, vous obtiendrez une application native performante et légère, parfaitement identique à votre version web mais avec les avantages du desktop.

La responsivité mobile que nous venons d'implémenter sera également un atout pour les tablettes et les écrans tactiles en mode desktop. 