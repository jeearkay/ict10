async function unregisterServiceWorkersAndClearCaches() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }
}

// Service Worker registration helper for Bhutan Class 10 ICT Quest
export function registerServiceWorker(onStatusChange?: (isOnline: boolean) => void) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      if (import.meta.env.DEV) {
        unregisterServiceWorkersAndClearCaches()
          .then(() => {
            console.log('[SW] Development mode detected. Existing service workers and caches cleared.');
          })
          .catch((error) => {
            console.warn('[SW] Failed to clear development caches:', error);
          });
        return;
      }

      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}sw.js`)
        .then((registration) => {
          console.log('[SW] Service Worker registered successfully with scope:', registration.scope);
          registration.update().catch((error) => {
            console.warn('[SW] Failed to check for service worker updates:', error);
          });

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[SW] New content is available; please refresh.');
                  } else {
                    console.log('[SW] Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[SW] Service Worker registration failed:', error);
        });
    });
  }

  // Handle Online / Offline network status listeners
  if (onStatusChange) {
    window.addEventListener('online', () => onStatusChange(true));
    window.addEventListener('offline', () => onStatusChange(false));
  }
}
