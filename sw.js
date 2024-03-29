﻿'use strict';
// version 0.6

// El nombre del caché que usa tu aplicación.
const cacheName = 'ATraductor-v0.6';

// Lista de archivos estáticos que la aplicación necesita para iniciarse.
const cacheFiles = [
  'https://ferrinip.github.io/AT/',
  'https://ferrinip.github.io/AT/index.html',
  'https://ferrinip.github.io/AT/manifest.json',
  'https://ferrinip.github.io/AT/db/db.js',
  'https://ferrinip.github.io/AT/img/icons/icon-72x72.png',
  'https://ferrinip.github.io/AT/img/icons/icon-96x96.png',
  'https://ferrinip.github.io/AT/img/icons/icon-128x128.png',
  'https://ferrinip.github.io/AT/img/icons/icon-512x512.png'
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
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(cacheName).then((cache) => {
      return cache.match(e.request)
      .then((response) => {
        return response || fetch(e.request.url);
      });
    })
  );
});
