import useNetworkStatus from '../hooks/useNetworkStatus';

export default function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.625rem 1rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#fff',
        background: isOnline ? '#16a34a' : '#dc2626',
        transition: 'background 0.3s ease',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: isOnline ? '#bbf7d0' : '#fca5a5',
          animation: isOnline ? 'none' : 'pulse 2s infinite',
        }}
      />
      {isOnline
        ? 'Back online — connection restored'
        : 'You are offline — some features may be unavailable'}
    </div>
  );
}
