import { useState, useEffect, useCallback } from 'react';

/**
 * PWA Install Prompt — captures the beforeinstallprompt event and
 * shows a dismissable banner inviting the user to install the app.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already dismissed this session or already installed
    if (sessionStorage.getItem('pwa-install-dismissed')) {
      setDismissed(true);
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const appInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', appInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', '1');
  }, []);

  if (installed || dismissed || !deferredPrompt) return null;

  return (
    <div
      role="banner"
      aria-label="Install application"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'rgba(31, 41, 55, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(249, 115, 22, 0.3)',
        borderRadius: '0.75rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        maxWidth: '420px',
        width: 'calc(100% - 2rem)',
        color: '#fff',
        fontSize: '0.875rem',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <img
        src="/logo.png"
        alt="Ondosoft"
        width="36"
        height="36"
        style={{ borderRadius: '0.375rem', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>
          Install Ondosoft
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.8125rem' }}>
          Add to your home screen for quick access
        </div>
      </div>
      <button
        onClick={handleInstall}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#fff',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        style={{
          padding: '0.25rem',
          background: 'transparent',
          border: 'none',
          color: '#6b7280',
          cursor: 'pointer',
          flexShrink: 0,
          lineHeight: 1,
          fontSize: '1.25rem',
        }}
      >
        &times;
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(1rem); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
