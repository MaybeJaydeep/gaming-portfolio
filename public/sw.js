// Service Worker for Gaming Portfolio
// Handles caching of static assets for improved performance

const CACHE_NAME = 'jaydeep-portfolio-v1';
const STATIC_CACHE_NAME = 'jaydeep-portfolio-static-v1';
const DYNAMIC_CACHE_NAME = 'jaydeep-portfolio-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add other critical assets here
];

// Assets to cache dynamically
const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: [/\.(?:js|css|woff2?|ttf|eot)$/, /\/static\//],
  // Network first for HTML and API calls
  networkFirst: [/\.(?:html)$/, /\/api\//],
  // Cache first for images
  images: [/\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/],
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
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

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // Determine caching strategy based on request
    if (matchesPattern(url.pathname, CACHE_STRATEGIES.static)) {
      return await cacheFirst(request, STATIC_CACHE_NAME);
    }

    if (matchesPattern(url.pathname, CACHE_STRATEGIES.images)) {
      return await cacheFirst(request, DYNAMIC_CACHE_NAME);
    }

    if (matchesPattern(url.pathname, CACHE_STRATEGIES.networkFirst)) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME);
    }

    // Default to network first for other requests
    return await networkFirst(request, DYNAMIC_CACHE_NAME);
  } catch (error) {
    console.error('Service Worker: Error handling request', error);
    return fetch(request);
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch(() => {
        // Ignore network errors for background updates
      });

    return cachedResponse;
  }

  // Not in cache, fetch from network
  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache available, return error
    throw error;
  }
}

// Helper function to match URL patterns
function matchesPattern(pathname, patterns) {
  return patterns.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(pathname);
    }
    return pathname.includes(pattern);
  });
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);

  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Sync contact form submissions when back online
async function syncContactForm() {
  // This would handle offline form submissions
  // Implementation depends on how contact forms are stored offline
  console.log('Service Worker: Syncing contact form submissions');
}

// Handle push notifications (if needed in future)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification('Gaming Portfolio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
