const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Test de l\'application desktop buildée...');

// Vérifier que le build existe
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ Dossier dist introuvable. Lancez d\'abord: npm run build');
  process.exit(1);
}

// Vérifier que index.html existe
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.log('❌ index.html introuvable dans dist. Lancez d\'abord: npm run build');
  process.exit(1);
}

console.log('✅ Build détecté. Lancement de l\'application desktop...');

// Lancer l'application desktop avec electron directement
const electronProcess = spawn('electron', ['.'], {
  cwd: path.join(__dirname, '..'),
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('🚀 Application desktop lancée avec PID:', electronProcess.pid);

// Attendre un peu pour que l'application se charge
setTimeout(() => {
  console.log('📋 Instructions de test manuel:');
  console.log('');
  console.log('1. 🖱️  TEST CURSEUR:');
  console.log('   - Déplace la souris sur les boutons → doit afficher une main');
  console.log('   - Déplace la souris sur les inputs → doit afficher un curseur texte');
  console.log('   - Déplace la souris ailleurs → doit afficher une flèche');
  console.log('   - Le curseur ne doit PAS changer aléatoirement');
  console.log('');
  console.log('2. 🖱️  TEST CLICS:');
  console.log('   - Clique sur tous les boutons → doivent répondre immédiatement');
  console.log('   - Clique sur les liens de navigation → doivent fonctionner');
  console.log('   - Clique sur les inputs → doivent se sélectionner');
  console.log('   - Aucun clic ne doit être "mort" ou nécessiter un double-clic');
  console.log('');
  console.log('3. ⚡ TEST PERFORMANCE:');
  console.log('   - Navigue entre les pages → doit être fluide');
  console.log('   - Ouvre les menus → pas de lag');
  console.log('   - Utilise les sliders → réactivité immédiate');
  console.log('   - L\'application ne doit pas "ramer" ou geler');
  console.log('');
  console.log('4. 📊 MONITEUR DE PERFORMANCE:');
  console.log('   - Cherche un indicateur en bas à droite');
  console.log('   - Si visible, note le FPS (doit être > 30)');
  console.log('');
  console.log('⏰ Test en cours... Appuie sur Ctrl+C pour arrêter et donner ton verdict.');
  console.log('');

}, 3000);

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du test...');
  electronProcess.kill();
  console.log('✅ Application fermée.');
  console.log('');
  console.log('📝 RÉSULTATS DU TEST:');
  console.log('Raconte-moi ce que tu as observé:');
  console.log('- Le curseur fonctionne-t-il correctement ?');
  console.log('- Les clics répondent-ils bien ?');
  console.log('- L\'application est-elle fluide ?');
  console.log('- Y a-t-il encore des problèmes ?');
  process.exit(0);
});

// Gérer les erreurs
electronProcess.on('error', (error) => {
  console.error('❌ Erreur lors du lancement:', error.message);
  console.log('💡 Essayez: npm run electron');
  process.exit(1);
});

electronProcess.on('exit', (code) => {
  if (code !== 0) {
    console.log(`❌ Application fermée avec le code: ${code}`);
  }
}); 