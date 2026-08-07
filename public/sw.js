// Bhutan Class 10 ICT Quest - Service Worker for Offline Learning
const CACHE_NAME = 'bhutan-ict-quest-v3';
const SCOPE_URL = new URL(self.registration.scope);
const BASE_PATH = SCOPE_URL.pathname.endsWith('/') ? SCOPE_URL.pathname : `${SCOPE_URL.pathname}/`;
const withBase = (path) => `${BASE_PATH}${path.replace(/^\//, '')}`;

// Pre-cache core shell resources & static assets on install
const PRECACHE_ASSETS = [
  withBase('/'),
  withBase('/index.html'),
  withBase('/logo.png'),
  withBase('/manifest.json')
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching ICT Quest offline app shell...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate & Network-First with Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip browser extension requests or chrome-extension schemes
  if (!url.protocol.startsWith('http')) return;

  // Firebase/Firestore & external AI API calls handle their own offline persistence or need live connection
  if (url.hostname.includes('firestore.googleapis.com') || 
      url.hostname.includes('identitytoolkit.googleapis.com') ||
      url.pathname.startsWith('/api/chat')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found, while fetching fresh in background (Stale-While-Revalidate)
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, if navigating HTML page return cached index.html or offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match(withBase('/')) || caches.match(withBase('/index.html'));
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Receive message from client to skip waiting or sync cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
