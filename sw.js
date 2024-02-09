"use strict";
// version 0.4, uso de una página sin conexión personalizada.

// El nombre del caché que usa tu aplicación.
const cacheName = "ATraductor-v0.4";

// Lista de archivos estáticos que la aplicación necesita para iniciarse.
const cacheFiles = [
    "/",
    "/index.html",
    "/db/db.js",
    "/img/icons/icon-512x512.png",
    "/img/icons/icon-128x128.png"
 ];

// Escuche el evento `install` para añadir los recursos estáticos al cache.
self.addEventListener("install", (e) => {
  async function cacheResources() {
    // Abre el caché de la aplicación.
    const cache = await caches.open(cacheName);
    // Almacenar en caché todos los recursos estáticos.
    cache.addAll(cacheFiles);
  }
  e.waitUntil(cacheResources());
});

// Escuche el evento `fetch` para solicitar la URL o los recursos estáticos al cache.
self.addEventListener("fetch", (e) => {
  async function navigateOrDisplayOfflinePage() {
    try {
      // Intenta cargar la página desde la red (online).
      const networkResponse = await fetch(e.request);
      return networkResponse;
    } catch (error) {
      // Responder con el objeto en caché si está fuera de línea (offline).
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match("/index.html");
      return cachedResponse;
    }
  }
  // Solo llama a e.respondWith() si se trata de una solicitud de navegación para una página HTML.
  if (e.request.mode === 'navigate') {
    e.respondWith(navigateOrDisplayOfflinePage());
  }
});

// Escuche el evento `activate` para borrar cachés antiguos.
self.addEventListener("activate", (e) => {
  async function deleteOldCaches() {
    // Lista todos los cachés por sus nombres.
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name !== cacheName) {
        // Si el nombre de un caché es diferente al nombre actual, elimínelo.
        return caches.delete(name);
      }
    }));
  }
  e.waitUntil(deleteOldCaches());
});
