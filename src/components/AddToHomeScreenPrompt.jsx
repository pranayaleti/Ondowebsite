import { useState, useEffect, useCallback } from 'react';
import { Smartphone, X } from 'lucide-react';

const SESSION_KEY = 'pwa-add-to-home-dismissed';

/**
 * Shown on load for mobile users on the Notifications page.
 * Explains how to add the app to Home Screen (iOS/Android) so they can get push notifications.
 */
export default function AddToHomeScreenPrompt() {
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Already installed (standalone) or dismissed this session
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setVisible(false);
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }
    const isNarrow = () => window.innerWidth <= 768;
    setMobile(isNarrow());
    setVisible(isNarrow());
    const onResize = () => {
      const m = isNarrow();
      setMobile(m);
      if (!m) setVisible(false);
      else if (!sessionStorage.getItem(SESSION_KEY)) setVisible(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
  }, []);

  if (!visible || !mobile) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 relative">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white rounded flex items-center justify-center"
      >
        <X className="w-4 h-4 shrink-0" />
      </button>
      <div className="flex gap-3 pr-8">
        <Smartphone className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white mb-2">Get notifications on your phone</p>
          <p className="text-sm text-gray-400 mb-2">
            Add this app to your Home Screen so you can receive push notifications for ticket updates.
          </p>
          {isIOS && (
            <p className="text-xs text-gray-500">
              <strong className="text-gray-400">iPhone:</strong> Tap Share (square with arrow) → “Add to Home Screen”.
            </p>
          )}
          {isAndroid && !isIOS && (
            <p className="text-xs text-gray-500">
              <strong className="text-gray-400">Android:</strong> Chrome menu (⋮) → “Install app” or “Add to Home screen”.
            </p>
          )}
          {!isIOS && !isAndroid && (
            <p className="text-xs text-gray-500">
              Use your browser’s menu to “Add to Home Screen” or “Install app”.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
