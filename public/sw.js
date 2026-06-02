// Self-destroying service worker to clear caching issues on both local and production
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          console.log('Clearing cache:', cache);
          return caches.delete(cache);
        })
      );
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      console.log('Service worker unregistered successfully.');
      return self.clients.matchAll();
    }).then(clients => {
      clients.forEach(client => {
        if (client.url) {
          client.navigate(client.url);
        }
      });
    })
  );
});
