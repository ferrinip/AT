'use strict';
// version 0.5

// El nombre del caché que usa tu aplicación.
const cacheName = 'ATraductor-v0.5';

// Lista de archivos estáticos que la aplicación necesita para iniciarse.
const cacheFiles = [
  '/',
  '/index.html',
  '/manifest.json',
  '/db/db.js',
  '/img/icons/icon-72x72.png',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-128x128.png',
  '/img/icons/icon-512x512.png'
];

// Instalación: se almacena en caché los archivos estáticos.
// Escuche el evento `install`.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName)
    .then((cache) => {
      cache.addAll(cacheFiles);
    })
  )
});

// Activación: busca los recursos para hacer que funcione sin conexión.
// Escuche el evento `activate`.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(cacheFiles)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
});

// Solicitar: URL real o los recursos estáticos del cache.
// Escuche el evento `fetch`.
self.addEventListener("fetch", (e) => {
  async function returnCachedResource() {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(e.request.url);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      const fetchResponse = await fetch(e.request.url);
      cache.put(e.request.url, fetchResponse.clone());
      return fetchResponse.
    }
  }
 e.respondWith(returnCachedResource());
});
