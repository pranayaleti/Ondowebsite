import { BellOff, Smartphone } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications.js';

/**
 * Renders a card to enable push notifications on the notifications page.
 * Shown when push is supported and user hasn't granted/denied yet, or when granted (confirmation).
 */
export default function PushNotificationPrompt() {
  const { supported, permission, enabling, error, enable } = usePushNotifications();

  if (!supported) return null;

  if (permission === 'denied') return null;

  if (permission === 'granted') {
    return (
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-400">
        <span className="inline-flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Push notifications are on. You&apos;ll get alerts on this device for ticket updates and new messages.
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white mb-1">Get notified on your phone or desktop</p>
          <p className="text-sm text-gray-400">
            Enable push notifications to receive ticket updates and new messages even when the app is closed.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {error && (
            <span className="text-red-400 text-sm flex items-center gap-1">
              <BellOff className="w-4 h-4" />
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={enable}
            disabled={enabling}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            {enabling ? 'Enabling…' : 'Enable push notifications'}
          </button>
        </div>
      </div>
    </div>
  );
}
