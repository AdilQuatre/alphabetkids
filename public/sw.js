// Version du cache
const CACHE_VERSION = 'v1';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

// Ressources à mettre en cache
const RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.ts',
  '/src/style.css',
  'https://code.responsivevoice.org/responsivevoice.js?key=k49pimZJ',
  'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(RESOURCES_TO_CACHE);
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('app-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la ressource du cache si elle existe
        if (response) {
          return response;
        }

        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Ne pas mettre en cache les réponses non valides
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Mettre en cache la nouvelle ressource
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Retourner une réponse par défaut en cas d'erreur réseau
            return new Response('Offline content not available');
          });
      })
  );
});