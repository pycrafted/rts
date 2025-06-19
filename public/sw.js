// Service Worker pour RTS-Tutor
const CACHE_NAME = 'rts-tutor-v1.0.0';
const STATIC_CACHE = 'rts-static-v1.0.0';
const DYNAMIC_CACHE = 'rts-dynamic-v1.0.0';

// Assets à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/vite.svg',
  '/public/textures/terrain.png'
];

// Install event - cache les assets statiques
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
  );
});

// Activate event - nettoyer les anciens caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - stratégie de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Stratégie pour les assets statiques
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Stratégie pour les pages
  if (isPageRequest(url.pathname)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Stratégie pour les API
  if (isApiRequest(url.pathname)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Stratégie par défaut
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Stratégie Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache First failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline content not available', { status: 503 });
  }
}

// Vérifier si c'est un asset statique
function isStaticAsset(pathname) {
  return pathname.includes('/static/') || 
         pathname.includes('/assets/') || 
         pathname.includes('.js') || 
         pathname.includes('.css') || 
         pathname.includes('.png') || 
         pathname.includes('.svg');
}

// Vérifier si c'est une requête de page
function isPageRequest(pathname) {
  return pathname === '/' || 
         pathname.startsWith('/dashboard') || 
         pathname.startsWith('/simulation') || 
         pathname.startsWith('/gsm') || 
         pathname.startsWith('/umts') || 
         pathname.startsWith('/hertzien') || 
         pathname.startsWith('/optique');
}

// Vérifier si c'est une requête API
function isApiRequest(pathname) {
  return pathname.startsWith('/api/') || 
         pathname.includes('iaService') || 
         pathname.includes('linkBudget');
}

// Background sync pour les requêtes échouées
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Traiter les requêtes en attente
    const requests = await getPendingRequests();
    for (const request of requests) {
      await processPendingRequest(request);
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Fonctions utilitaires pour le background sync
async function getPendingRequests() {
  // Implémentation pour récupérer les requêtes en attente
  return [];
}

async function processPendingRequest(request) {
  // Implémentation pour traiter une requête en attente
  return Promise.resolve();
}

// Push notifications (optionnel)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

console.log('Service Worker: Loaded'); 