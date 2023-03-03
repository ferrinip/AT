"use strict";
// version 0.1

// asignar un nombre y versión al cache
const cacheName = 'WebDeveloper',
  filesToCache = [
    './',
    './index.html',
    './img/icons/icon-512x512.png',
    './img/icons/icon-72x72.png'
  ]

// durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(filesToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

// una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [cacheName]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

// cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  // responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          // recuperar del cache
          return res
        }
        // recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})
