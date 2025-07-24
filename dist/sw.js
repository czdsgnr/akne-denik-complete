// 📁 public/sw.js - Service Worker pro PWA
const CACHE_NAME = 'akne-denik-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

// Instalace Service Workeru
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Aktivace Service Workeru
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch - offline podpora
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// 🔔 PUSH NOTIFIKACE - hlavní funkce
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received:', event)

  const options = {
    body: event.data ? event.data.text() : 'Čas na tvůj denní úkol! 💖',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200, 100, 200], // 📳 HAPTIKA!
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Otevřít aplikaci',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Zavřít'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Akné Deník', options)
  )
})

// Click na notifikaci
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification click:', event)

  event.notification.close()

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})