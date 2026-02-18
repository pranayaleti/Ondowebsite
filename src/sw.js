/* eslint-env serviceworker */
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';

cleanupOutdatedCaches();
// Precache assets (manifest injected by vite-plugin-pwa at build time)
precacheAndRoute(self.__WB_MANIFEST);

skipWaiting();
clientsClaim();

// Web Push: show notification when a push message is received
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch {
    return;
  }
  const title = data.title || 'Ondosoft';
  const body = data.body || '';
  const link = data.link || '/';
  const urlToOpen = new URL(link, self.location.origin).href;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: urlToOpen,
      data: { url: urlToOpen },
      requireInteraction: false,
      vibrate: [200, 100, 200],
    })
  );
});

// When user clicks the notification, focus the app and navigate to the link
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
