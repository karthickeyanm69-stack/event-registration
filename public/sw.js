// SPIHER Events PWA Service Worker
const CACHE_NAME = 'spiher-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/spiher-logo.jpg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
];

// Install: Cache essential shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA cache.addAll non-blocking notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first strategy with cache fallback for navigation & static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Bypass all Vite dev server files, HMR websockets, source files, and Supabase endpoints
  if (
    request.method !== 'GET' ||
    url.hostname.includes('supabase.co') ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.pathname.startsWith('/rest/v1') ||
    url.pathname.startsWith('/auth/v1') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.search.includes('?t=') ||
    url.search.includes('&t=') ||
    url.search.includes('?v=') ||
    url.search.includes('?token=') ||
    request.headers.get('Upgrade') === 'websocket'
  ) {
    return;
  }

  // 2. For HTML navigation requests (SPA routes like /employee, /admin, /superadmin)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedIndex = (await caches.match('/index.html')) || (await caches.match('/'));
        if (cachedIndex) return cachedIndex;
        return new Response('Offline - SPIHER Events Portal', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );
    return;
  }

  // 3. For static assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      } catch {
        if (cachedResponse) return cachedResponse;
        return new Response('', { status: 408, statusText: 'Request Timed Out' });
      }
    })
  );
});
