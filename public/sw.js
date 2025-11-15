// public/sw.js
const CACHE_NAME = "christmas-deals-v1";
const urlsToCache = [
  "/",
  "/homepage",
  "/styles.css",
  // Ajoute les routes importantes de ton app
];

// Installation
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activation
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - stratégie de cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne le cache si trouvé, sinon fetch réseau
      return response || fetch(event.request);
    })
  );
});
