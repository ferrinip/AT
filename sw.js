de﻿'use strict';
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
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(key => {
            if (key !== cacheName) {
              // eliminamos lo que ya no se necesita en cache
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        // activar el cache actual
        self.clients.claim();
      })
  );
});

// Solicitar: URL real o los recursos estáticos del cache.
// Escuche el evento `fetch`.
self.addEventListener("fetch", event => {
  async function returnCachedResource() {
    // Open the app's cache.
    const cache = await caches.open(cacheName);
    // Find the response that was pre-cached during the `install` event.
    const cachedResponse = await cache.match(event.request.url);

    if (cachedResponse) {
      // Return the resource.
      return cachedResponse;
    } else {
      // The resource wasn't found in the cache, so fetch it from the network.
      const fetchResponse = await fetch(event.request.url);
      // Put the response in cache.
      cache.put(event.request.url, fetchResponse.clone());
      // And return the response.
      return fetchResponse.
    }
  }
 event.respondWith(returnCachedResource());
});