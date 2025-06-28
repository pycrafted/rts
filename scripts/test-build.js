const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Test du build de l\'application RTS...');

// Vérifier que le dossier dist existe
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Dossier dist introuvable. Exécutez d\'abord: npm run build');
  process.exit(1);
}

// Vérifier que index.html existe
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ Fichier index.html introuvable dans dist/');
  process.exit(1);
}

// Vérifier que les assets existent
const assetsPath = path.join(distPath, 'assets');
if (!fs.existsSync(assetsPath)) {
  console.error('❌ Dossier assets introuvable dans dist/');
  process.exit(1);
}

// Vérifier le contenu d'index.html
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('<div id="root">')) {
  console.error('❌ Élément root introuvable dans index.html');
  process.exit(1);
}

// Vérifier que les chemins sont relatifs
if (indexContent.includes('http://') || indexContent.includes('https://')) {
  console.warn('⚠️  Attention: Des URLs absolues détectées dans index.html');
}

console.log('✅ Build vérifié avec succès!');
console.log('📁 Dossier dist:', distPath);
console.log('📄 Fichier index.html:', indexPath);
console.log('📦 Dossier assets:', assetsPath);

// Lister les fichiers dans assets
const assetFiles = fs.readdirSync(assetsPath);
console.log('📋 Fichiers assets:', assetFiles.length);

console.log('\n🚀 Le build est prêt pour Electron!'); 