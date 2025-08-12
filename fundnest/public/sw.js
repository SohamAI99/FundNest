// FundNest Service Worker for PWA functionality
const CACHE_NAME = 'fundnest-v1.0.0';
const STATIC_CACHE_NAME = 'fundnest-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'fundnest-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/login',
  '/user-registration',
  '/manifest.json',
  '/assets/logo-192.png',
  '/assets/logo-512.png',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/auth\/verify/,
  /\/api\/stats\/dashboard/,
  /\/api\/users\/profile/
];

// Network-first strategies for these patterns
const NETWORK_FIRST_PATTERNS = [
  /\/api\/auth\/(login|register|logout)/,
  /\/api\/.*\/(create|update|delete)/,
  /\/api\/messaging/,
  /\/api\/matching/
];

// Cache-first strategies for these patterns  
const CACHE_FIRST_PATTERNS = [
  /\.(css|js|png|jpg|jpeg|svg|woff|woff2|ttf|eot)$/,
  /\/assets\//
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('fundnest-')) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method } = request;
  
  // Only handle GET requests
  if (method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!url.startsWith('http')) return;
  
  event.respondWith(handleRequest(request));
});

// Main request handler
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request);
    }
    
    // Handle static assets
    if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await cacheFirst(request);
    }
    
    // Handle navigation requests (pages)
    if (request.mode === 'navigate') {
      return await handleNavigation(request);
    }
    
    // Default: network first with cache fallback
    return await networkFirst(request);
    
  } catch (error) {
    console.error('Request handler error:', error);
    return await fallbackResponse(request);
  }
}

// Handle API requests with appropriate strategies
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Network-first for critical operations
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return await networkFirst(request, DYNAMIC_CACHE_NAME);
  }
  
  // Cache-first for cacheable data
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return await cacheFirst(request, DYNAMIC_CACHE_NAME);
  }
  
  // Default: network-only for API
  return await fetch(request);
}

// Handle navigation requests (pages)
async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page or index
    return await caches.match('/') || await fallbackResponse(request);
  }
}

// Network-first strategy
async function networkFirst(request, cacheName = DYNAMIC_CACHE_NAME) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName = STATIC_CACHE_NAME) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request, cacheName);
    return cachedResponse;
  }
  
  // Fetch from network and cache
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Update cache in background
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // Ignore background update errors
    console.log('Background cache update failed:', error.message);
  }
}

// Fallback response for offline scenarios
async function fallbackResponse(request) {
  const url = new URL(request.url);
  
  // For navigation requests, return cached index page
  if (request.mode === 'navigate') {
    const indexResponse = await caches.match('/');
    if (indexResponse) return indexResponse;
  }
  
  // For API requests, return offline message
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'You are offline. Please check your connection.',
        offline: true
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // For other requests, return a generic offline response
  return new Response(
    'You are offline. Please check your internet connection.',
    { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    }
  );
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'profile-update':
      event.waitUntil(syncProfileUpdate());
      break;
    case 'message-send':
      event.waitUntil(syncMessages());
      break;
    default:
      console.log('Unknown sync tag:', event.tag);
  }
});

// Sync profile updates when back online
async function syncProfileUpdate() {
  try {
    // Get pending profile updates from IndexedDB
    // and sync them when back online
    console.log('Syncing profile updates...');
  } catch (error) {
    console.error('Profile sync failed:', error);
  }
}

// Sync messages when back online
async function syncMessages() {
  try {
    // Get pending messages from IndexedDB
    // and sync them when back online
    console.log('Syncing messages...');
  } catch (error) {
    console.error('Message sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'You have new updates in FundNest',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/badge-72x72.png',
    tag: 'fundnest-notification',
    renotify: true,
    vibrate: [100, 50, 100],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Open FundNest',
        icon: '/assets/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/action-dismiss.png'
      }
    ]
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.data.url = payload.url || options.data.url;
    } catch (error) {
      console.error('Error parsing push payload:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('FundNest', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if the app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.log('FundNest Service Worker loaded successfully');