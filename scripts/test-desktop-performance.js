const puppeteer = require('puppeteer');
const path = require('path');
const electronPath = require('electron');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Démarrage du test de performance et souris pour l\'application desktop...');

  // Lancer Electron avec Puppeteer
  const browser = await puppeteer.launch({
    executablePath: electronPath,
    args: [path.join(__dirname, '../electron/main.js')],
    headless: false,
    defaultViewport: null,
  });

  const pages = await browser.pages();
  const page = pages[0];

  // Attendre que l'application soit chargée
  await page.waitForSelector('.App', { timeout: 20000 });
  console.log('Application chargée.');

  // Attendre un peu pour que tout s'affiche
  await sleep(2000);

  // Vérifier la présence du moniteur de performance (plusieurs variantes)
  let perfMonitor = await page.$('.fixed.bottom-4.right-4');
  if (!perfMonitor) {
    perfMonitor = await page.$('[class*=PerformanceMonitor]');
  }
  if (!perfMonitor) {
    perfMonitor = await page.$x("//*[contains(text(),'Performance')]");
  }
  if (perfMonitor && perfMonitor.length) perfMonitor = perfMonitor[0];

  if (perfMonitor) {
    console.log('✅ Moniteur de performance détecté.');
  } else {
    console.log('⚠️  Moniteur de performance non détecté. Vérifiez qu\'il est bien visible dans l\'application desktop.');
  }

  // Simuler des mouvements de souris sur différents éléments interactifs
  const selectors = [
    'button',
    'a',
    'input[type="text"]',
    'input[type="number"]',
    'textarea',
    '[role="button"]'
  ];

  for (const selector of selectors) {
    const el = await page.$(selector);
    if (el) {
      const box = await el.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await sleep(300);
        // Récupérer le curseur
        const cursor = await page.evaluate(el => getComputedStyle(el).cursor, el);
        console.log(`Sur ${selector} : curseur = ${cursor}`);
        // Simuler un clic
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await sleep(200);
      }
    }
  }

  // Récupérer les FPS depuis le moniteur de performance (si visible)
  const fps = await page.evaluate(() => {
    const el = document.querySelector('.fixed.bottom-4.right-4');
    if (!el) return null;
    const text = el.innerText;
    const match = text.match(/FPS:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  });
  if (fps !== null) {
    console.log(`FPS mesuré : ${fps}`);
    if (fps >= 30) {
      console.log('✅ Performance correcte.');
    } else {
      console.log('❌ Performance faible.');
    }
  } else {
    console.log('Impossible de lire le FPS.');
  }

  // Fermer le navigateur après le test
  await browser.close();
  console.log('Test terminé.');
})(); 