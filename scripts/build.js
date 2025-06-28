import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Démarrage du build de l\'application RTS Desktop...');

// Fonction pour exécuter une commande avec gestion d'erreur
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} terminé avec succès`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    return false;
  }
}

// Fonction pour vérifier si un fichier existe
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Fonction pour créer un fichier de version
function createVersionFile() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const version = packageJson.version;
  const buildDate = new Date().toISOString();
  
  const versionInfo = {
    version,
    buildDate,
    buildType: 'desktop',
    electron: '27.1.3'
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../dist/version.json'),
    JSON.stringify(versionInfo, null, 2)
  );
  
  console.log('📝 Fichier de version créé');
}

// Fonction pour créer un fichier de configuration desktop
function createDesktopConfig() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const config = {
    app: {
      name: 'RTS - Radio Transmission System',
      version: packageJson.version,
      description: 'Application de dimensionnement télécoms'
    },
    features: {
      desktop: true,
      electron: true,
      storage: 'electron-store',
      pdf: 'native',
      updates: 'automatic'
    },
    build: {
      date: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../dist/desktop-config.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('⚙️ Configuration desktop créée');
}

// Fonction pour vérifier les fichiers critiques
function checkCriticalFiles() {
  const criticalFiles = [
    'dist/index.html',
    'dist/assets/main-2246f74f.js',
    'electron/main.js',
    'electron/preload.js'
  ];
  
  console.log('\n🔍 Vérification des fichiers critiques...');
  
  for (const file of criticalFiles) {
    if (fileExists(file)) {
      console.log(`✅ ${file} - OK`);
    } else {
      console.error(`❌ ${file} - MANQUANT`);
      return false;
    }
  }
  
  return true;
}

// Fonction pour créer un script de lancement
function createLauncherScript() {
  const launcherContent = `@echo off
echo Démarrage de RTS Desktop...
cd /d "%~dp0"
start "" "RTS Desktop.exe"
`;
  
  fs.writeFileSync(
    path.join(__dirname, '../dist/launch-rts.bat'),
    launcherContent
  );
  
  console.log('🚀 Script de lancement créé');
}

// Fonction principale
async function main() {
  console.log('🎯 RTS Desktop - Script de build automatisé');
  console.log('============================================');
  
  // Étape 1: Build de l'application
  if (!runCommand('npm run build', 'Build de l\'application React')) {
    process.exit(1);
  }
  
  // Étape 2: Vérification des fichiers critiques
  if (!checkCriticalFiles()) {
    console.error('❌ Fichiers critiques manquants, arrêt du build');
    process.exit(1);
  }
  
  // Étape 3: Création des fichiers de configuration
  createVersionFile();
  createDesktopConfig();
  createLauncherScript();
  
  // Étape 4: Build Electron (optionnel - peut être long)
  console.log('\n🤔 Voulez-vous générer l\'exécutable Electron ? (peut prendre plusieurs minutes)');
  console.log('   Pour continuer, exécutez: npm run build:win');
  console.log('   Ou pour un build rapide: npm run electron:pack');
  
  console.log('\n🎉 Build de base terminé avec succès !');
  console.log('\n📁 Fichiers générés dans le dossier dist/');
  console.log('📁 Configuration Electron dans electron/');
  console.log('\n🚀 Pour tester l\'application: npm run electron:dev');
  console.log('📦 Pour créer l\'exécutable: npm run build:win');
}

// Exécution du script
main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 