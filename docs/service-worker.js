// Service Worker for DiabetCare AI PWA
// Provides offline functionality and caching

const CACHE_NAME = 'diabetcare-ai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/glucose-tracker.html',
  '/meal-analyzer.html',
  '/retina-scan.html',
  '/chatbot.html',
  '/css/wireframe.css',
  '/js/wireframe.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the new response
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.log('[ServiceWorker] Fetch failed:', error);
          // Return offline page if available
          return caches.match('/offline.html');
        });
      })
  );
});

// Background sync for glucose data (when online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-glucose-data') {
    event.waitUntil(syncGlucoseData());
  }
});

async function syncGlucoseData() {
  // This would sync IndexedDB glucose readings to server
  console.log('[ServiceWorker] Syncing glucose data');
  // Implementation would use IndexedDB and Fetch API
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from DiabetCare AI',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'view', title: 'View', icon: '/images/checkmark.png'},
      {action: 'close', title: 'Close', icon: '/images/xmark.png'}
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DiabetCare AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard.html')
    );
  }
});
