import { useState, useEffect, useCallback } from 'react';
import { portalAPI } from '../utils/auth.js';

const supported =
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

export function usePushNotifications() {
  const [permission, setPermission] = useState(
    () => (typeof Notification !== 'undefined' ? Notification.permission : 'default')
  );
  const [enabling, setEnabling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supported) return;
    setPermission(Notification.permission);
  }, []);

  const enable = useCallback(async () => {
    if (!supported) return;
    setError(null);
    setEnabling(true);
    try {
      const publicKey = await portalAPI.getVapidPublicKey();
      if (!publicKey) {
        throw new Error('Push notifications are not available');
      }
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      if (permissionResult !== 'granted') {
        setEnabling(false);
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await portalAPI.subscribePush(subscription.toJSON());
    } catch (err) {
      setError(err.message || 'Failed to enable push notifications');
    } finally {
      setEnabling(false);
    }
  }, []);

  return {
    supported,
    permission,
    enabling,
    error,
    enable,
  };
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
