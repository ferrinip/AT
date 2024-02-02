"use strict";
// version 0.4

// asignar un nombre y versión al cache
const cacheName = 'static-v0.4';

const filesToCache = [
    '/',
    'index.html',
    'db/db.js',
    'img/icons/icon-512x512.png',
    'img/icons/icon-72x72.png'
 ];

 // instalación: se almacena en caché los activos estáticos
self.addEventListener('install', (e) => {
  const cacheStatic = caches
      .open(cacheName)
      .then((cache) => cache.addAll(filesToCache))
      .catch(err => console.log('Falló registro de cache', err));

  e.waitUntil(cacheStatic);
});

// activación: busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [cacheName];
  e.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // indica al Service Worker activar el cache actual
      .then(() => self.clients.claim())
  )
});

// solicitar: url o archivos caché del navegador
self.addEventListener('fetch', (e) => {
  // responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches
      .match(e.request)
      .then((res) => {
      	return res || fetch(e.request);
      })
      .catch(err => console.log('Falló de solicitud', err))
  );
});
