import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Handle blocked script errors (e.g., Cloudflare Insights blocked by ad blockers)
if (typeof window !== 'undefined') {
  // Suppress ERR_BLOCKED_BY_CLIENT errors ONLY for analytics/beacon scripts
  // This should NOT interfere with API calls or other legitimate requests
  window.addEventListener('error', (event) => {
    // Only suppress errors from Cloudflare Insights or other analytics beacons
    // Be very specific to avoid interfering with legitimate errors
    const isCloudflareBeacon = 
      (event.filename?.includes('cloudflareinsights.com') ||
       event.filename?.includes('beacon.min.js') ||
       (event.target?.tagName === 'SCRIPT' && event.target?.src?.includes('cloudflareinsights.com'))) &&
      (event.message?.includes('ERR_BLOCKED_BY_CLIENT') || 
       event.message?.includes('Failed to load') ||
       event.message?.includes('net::ERR_BLOCKED_BY_CLIENT'));
    
    if (isCloudflareBeacon) {
      // Suppress the error - it's harmless and expected when ad blockers are active
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);

  // Handle unhandled promise rejections ONLY from blocked analytics requests
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const errorMessage = reason?.message || reason?.toString() || '';
    const errorSource = reason?.source || '';
    const errorUrl = reason?.url || '';
    
    // Only suppress if it's specifically a Cloudflare Insights request
    const isCloudflareRejection = 
      (errorMessage.includes('ERR_BLOCKED_BY_CLIENT') ||
       errorMessage.includes('cloudflareinsights.com') ||
       errorMessage.includes('beacon.min.js') ||
       errorSource?.includes('cloudflareinsights.com') ||
       errorUrl?.includes('cloudflareinsights.com')) &&
      // Make sure it's not an API call
      !errorUrl?.includes('/api/') &&
      !errorMessage?.includes('/api/');
    
    if (isCloudflareRejection) {
      // Prevent the error from being logged
      event.preventDefault();
    }
  });
}

// Preload critical resources
if (typeof window !== 'undefined') {
  // Preload logo
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/logo.png';
  link.fetchPriority = 'high';
  document.head.appendChild(link);

  // DNS prefetch for external resources
  const dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical domains
  const preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  preconnect.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Register service worker for PWA functionality (only in production)
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Use requestIdleCallback for non-critical service worker registration
    const registerSW = () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          if (import.meta.env.DEV) {
            console.log('SW registered: ', registration);
          }
        })
        .catch((registrationError) => {
          if (import.meta.env.DEV) {
            console.log('SW registration failed: ', registrationError);
          }
        });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(registerSW, { timeout: 2000 });
    } else {
      window.addEventListener('load', registerSW);
    }
  } else {
    // Unregister service worker in development to avoid conflicts
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
        if (import.meta.env.DEV) {
          console.log('SW unregistered for development');
        }
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
