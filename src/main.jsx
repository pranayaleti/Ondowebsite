import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Handle blocked script errors (e.g., Cloudflare Insights blocked by ad blockers)
// Also suppress 404 errors for source maps and other non-critical resources
// Optimized for performance - lightweight checks only
if (typeof window !== 'undefined') {
  // Cache common strings to avoid repeated checks
  const CLOUDFLARE_STR = 'cloudflareinsights.com';
  const BEACON_STR = 'beacon.min.js';
  const BLOCKED_STR = 'ERR_BLOCKED_BY_CLIENT';
  
  // Suppress ERR_BLOCKED_BY_CLIENT errors ONLY for analytics/beacon scripts
  // This should NOT interfere with API calls or other legitimate requests
  window.addEventListener('error', (event) => {
    const filename = event.filename || '';
    const message = event.message || '';
    const target = event.target;
    
    // In development, log all errors first to help debug
    if (import.meta.env.DEV) {
      console.log('🔍 Error caught:', { filename, message, target: target?.tagName });
    }
    
    // Quick checks first (most common case)
    if (message.includes(BLOCKED_STR) || message.includes('Failed to load')) {
      // Check for Cloudflare Insights
      if (filename.includes(CLOUDFLARE_STR) || 
          filename.includes(BEACON_STR) ||
          (target?.tagName === 'SCRIPT' && target?.src?.includes(CLOUDFLARE_STR))) {
        if (import.meta.env.DEV) {
          console.log('✅ Suppressing Cloudflare Insights error (expected)');
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
    
    // Suppress 404 errors for source maps (e.g., admin:1, portal:1) - these are non-critical
    if (message.includes('404') && (filename.match(/:\d+$/) || filename.includes('.map') || 
        (target?.tagName === 'SCRIPT' && target?.src?.includes('.map')))) {
      if (import.meta.env.DEV) {
        console.log('✅ Suppressing source map 404 error (non-critical)');
      }
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    
    // In development, don't suppress other errors - let them show
    if (import.meta.env.DEV) {
      console.warn('⚠️ Unhandled error (not suppressed):', { filename, message });
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

// Preload critical resources - deferred to avoid blocking main thread
if (typeof window !== 'undefined') {
  // Use requestIdleCallback or setTimeout to defer non-critical resource hints
  const setupResources = () => {
    // Preload logo (critical)
    const logoLink = document.createElement('link');
    logoLink.rel = 'preload';
    logoLink.as = 'image';
    logoLink.href = '/logo.png';
    logoLink.fetchPriority = 'high';
    document.head.appendChild(logoLink);

    // Only add DNS prefetch/preconnect if fonts are actually being used
    // Check if fonts are loaded via stylesheet
    const hasFontUsage = document.querySelector('link[href*="fonts.googleapis.com"]');
    
    if (hasFontUsage) {
      // DNS prefetch for external resources (non-blocking)
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

      // Preconnect to critical domains (non-blocking) - only if fonts are used
      const preconnect = [
        'https://fonts.gstatic.com' // Only preconnect to the actual font CDN
      ];
      preconnect.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    }
  };

  // Defer resource setup to avoid blocking initial render
  if ('requestIdleCallback' in window) {
    requestIdleCallback(setupResources, { timeout: 100 });
  } else {
    setTimeout(setupResources, 0);
  }
}

// Register service worker for PWA functionality (only in production)
// Note: StorageType.persistent deprecation warnings may come from browser internals or third-party libraries
// The default cache storage API is sufficient and doesn't require explicit persistence
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

// Render app immediately - don't block on other initialization
const root = document.getElementById('root');
if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Log successful mount in development
    if (import.meta.env.DEV) {
      console.log('✅ React app mounted successfully');
    }
  } catch (error) {
    console.error('❌ Failed to mount React app:', error);
    // Show error in the UI
    root.innerHTML = `
      <div style="padding: 2rem; color: white; background: #000; min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <h1 style="color: #f97316; margin-bottom: 1rem;">Failed to Load Application</h1>
        <p style="color: #ccc; margin-bottom: 1rem;">${error.message}</p>
        <pre style="background: #1a1a1a; padding: 1rem; border-radius: 0.5rem; overflow: auto; max-width: 800px; color: #f97316;">${error.stack}</pre>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: #f97316; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Reload Page</button>
      </div>
    `;
  }
} else {
  console.error('❌ Root element not found! Make sure index.html has <div id="root"></div>');
}
