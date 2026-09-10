import { useState, useEffect } from 'react';

export interface ConnectivityAndPWAState {
  isBrowserOnline: boolean;
  isAppCacheReady: boolean;
  needRefresh: boolean;
  storageError: string | null;
  clearStorageError: () => void;
  updateApp: () => void;
}

export const useConnectivityAndPWA = (): ConnectivityAndPWAState => {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isAppCacheReady, setIsAppCacheReady] = useState<boolean>(false);
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Browser Connectivity Listeners
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Storage Failure Listener
    const handleStorageFailure = (e: Event) => {
      const customEvent = e as CustomEvent<{ error: string }>;
      setStorageError(customEvent.detail?.error || 'Storage write failed');
    };
    window.addEventListener('storage-failure', handleStorageFailure);

    // 3. Service Worker / Cache Readiness Check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          setIsAppCacheReady(true);
          if (registration.waiting) {
            setNeedRefresh(true);
          }
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setNeedRefresh(true);
                }
              });
            }
          });
        })
        .catch(() => {
          setIsAppCacheReady(false);
        });

      // Listen for controlling service worker
      if (navigator.serviceWorker.controller) {
        setIsAppCacheReady(true);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage-failure', handleStorageFailure);
    };
  }, []);

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
        window.location.reload();
      });
    }
  };

  const clearStorageError = () => setStorageError(null);

  return {
    isBrowserOnline,
    isAppCacheReady,
    needRefresh,
    storageError,
    clearStorageError,
    updateApp
  };
};
