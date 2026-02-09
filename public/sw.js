// Service Worker for Ondosoft.com - Enhanced Caching Strategy
const CACHE_VERSION = 'v2.1.1';
const CACHE_NAME = `ondosoft-${CACHE_VERSION}`;
const STATIC_CACHE = `ondosoft-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `ondosoft-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `ondosoft-images-${CACHE_VERSION}`;
const API_CACHE = `ondosoft-api-${CACHE_VERSION}`;
const FONT_CACHE = `ondosoft-fonts-${CACHE_VERSION}`;

// Assets to cache immediately on install
// Note: Only include assets that are guaranteed to exist and won't be blocked
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

// Cache duration settings (in milliseconds)
const CACHE_DURATIONS = {
  static: 31536000000, // 1 year
  dynamic: 86400000,    // 1 day
  images: 2592000000,   // 30 days
  api: 300000          // 5 minutes
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets...');
        // Cache assets individually to handle failures gracefully
        // This prevents one failed asset from breaking the entire service worker
        return Promise.allSettled(
          STATIC_ASSETS.map((url) => {
            return fetch(url)
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response);
                } else {
                  console.warn(`Failed to cache ${url}: ${response.status} ${response.statusText}`);
                  return Promise.resolve();
                }
              })
              .catch((error) => {
                // Log but don't fail - some assets might be blocked or unavailable
                console.warn(`Could not cache ${url}:`, error.message);
                return Promise.resolve();
              });
          })
        );
      })
      .then(() => {
        console.log('Static assets caching completed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation error:', error);
        // Still skip waiting even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Enhanced Fetch event with intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for specific CDNs)
  if (url.origin !== location.origin && !url.origin.includes('fonts.googleapis.com')) {
    return;
  }

  // Skip caching for authenticated API endpoints
  if (url.pathname.startsWith('/api/auth/')) {
    return; // Let browser handle these requests normally
  }
  
  // Determine cache strategy based on request type
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/i)) {
    // Images: Cache First with Network Fallback
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (url.pathname.match(/\.(woff|woff2|ttf|eot|otf)$/i)) {
    // Fonts: Cache First with long cache
    event.respondWith(cacheFirst(request, FONT_CACHE));
  } else if (url.pathname.match(/\.(css|js)$/i)) {
    // Static assets: Cache First
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/api/')) {
    // API: Network First with Cache Fallback (but skip auth endpoints)
    event.respondWith(networkFirst(request, API_CACHE));
  } else if (url.pathname === '/' || url.pathname.match(/\.(html|htm)$/i)) {
    // HTML: Network First with Cache Fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Default: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Cache First Strategy - for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    // Only cache successful, complete responses (not partial 206)
    if (networkResponse.ok && 
        networkResponse.status !== 206 && 
        networkResponse.type === 'basic') {
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache).catch((err) => {
        console.warn('Failed to cache response:', err);
      });
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First fetch failed:', error);
    // Return offline fallback for images
    if (request.destination === 'image') {
      return new Response('', { status: 404 });
    }
    throw error;
  }
}

// Network First Strategy - for dynamic content
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  // Skip caching for authenticated API endpoints
  if (request.url.includes('/api/auth/')) {
    return fetch(request);
  }
  
  try {
    const networkResponse = await fetch(request);
    // Only cache successful, complete responses (not partial 206)
    if (networkResponse.ok && 
        networkResponse.status !== 206 && 
        networkResponse.type === 'basic' &&
        !request.url.includes('/api/auth/')) {
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache).catch((err) => {
        console.warn('Failed to cache response:', err);
      });
    }
    return networkResponse;
  } catch (error) {
    console.error('Network First fetch failed:', error);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy - for best performance
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    // Only cache successful, complete responses (not partial 206, not auth endpoints)
    if (networkResponse.ok && 
        networkResponse.status !== 206 && 
        !request.url.includes('/api/auth/') &&
        networkResponse.type === 'basic') {
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache).catch((err) => {
        console.warn('Failed to cache response:', err);
      });
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors in background
    return null;
  });
  
  return cachedResponse || await fetchPromise || new Response('Offline', { status: 503 });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle form submission sync
      console.log('Syncing contact form data...')
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/logo.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/logo.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Cache strategies for different types of content
const cacheStrategies = {
  // Static assets - cache first
  static: (request) => {
    return caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request);
      });
  },

  // API calls - network first
  api: (request) => {
    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      });
  },

  // Images - cache first with network fallback
  images: (request) => {
    return caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          });
      });
  }
};

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    console.log('Performance metrics received:', event.data.metrics);
    
    // Send metrics to analytics
    // This would integrate with your analytics service
  }
});