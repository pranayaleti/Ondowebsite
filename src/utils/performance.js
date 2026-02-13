// Performance optimization utilities
import { lazy } from 'react';

// Preload critical resources (idempotent; index.html already has logo preload and fonts)
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined' || !document.head) return;
  const hasLogoPreload = document.querySelector('link[rel="preload"][href="/logo.png"]');
  if (!hasLogoPreload) {
    const heroImage = new Image();
    heroImage.src = '/logo.png';
    heroImage.fetchPriority = 'high';
  }
};

// Lazy load non-critical scripts
export const lazyLoadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  
  if (callback) {
    script.onload = callback;
  }
  
  document.head.appendChild(script);
};

// Defer analytics and third-party scripts
export const loadAnalytics = () => {
  // Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    send_page_view: false
  });
  
  // Load GA script with lazyOnload strategy
  const gaScript = document.createElement('script');
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  gaScript.async = true;
  gaScript.defer = true;
  document.head.appendChild(gaScript);
};

// Optimize images with WebP support
export const optimizeImage = (src, width, height, quality = 75) => {
  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    f: 'webp'
  });
  
  return `${src}?${params.toString()}`;
};

// Service Worker registration (handled in main.jsx with requestIdleCallback; avoid duplicate registration)
export const registerServiceWorker = () => {
  // No-op: SW is registered in main.jsx for single registration and bfcache-friendly timing
};

// Resource hints for performance (idempotent; index.html already has dns-prefetch/preconnect for fonts)
export const addResourceHints = () => {
  if (typeof document === 'undefined' || !document.head) return;
  const hasHint = (rel, domain) => Array.from(document.querySelectorAll(`link[rel="${rel}"]`)).some((el) => (el.getAttribute('href') || '').includes(domain));
  const dnsPrefetchDomains = ['fonts.googleapis.com', 'fonts.gstatic.com', 'googletagmanager.com'];
  dnsPrefetchDomains.forEach((domain) => {
    if (!hasHint('dns-prefetch', domain)) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    }
  });
  const preconnectDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
  preconnectDomains.forEach((domain) => {
    if (!hasHint('preconnect', domain)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
};

// Bundle splitting utilities
export const loadComponent = (importFunction) => {
  return lazy(importFunction);
};

// Critical CSS extraction (no-op: index.html inlines critical CSS for FCP/LCP)
export const extractCriticalCSS = () => {};

// Performance monitoring
export const initPerformanceMonitoring = () => {
  // Web Vitals monitoring - only send to analytics, no console logging
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // LCP monitoring
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('LCP:', lastEntry.startTime);
      }
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'LCP',
          value: Math.round(lastEntry.startTime),
          event_category: 'Performance'
        });
      }
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP observer not supported
    }
    
    // FID monitoring
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime;
        
        // Only log in development
        if (import.meta.env.DEV) {
          console.log('FID:', fid);
        }
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'FID',
            value: Math.round(fid),
            event_category: 'Performance'
          });
        }
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID observer not supported
    }
    
    // CLS monitoring
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          
          // Only log in development
          if (import.meta.env.DEV) {
            console.log('CLS:', entry.value);
          }
        }
      });
      
      // Send final CLS to analytics
      if (window.gtag && clsValue > 0) {
        window.gtag('event', 'web_vitals', {
          name: 'CLS',
          value: Math.round(clsValue * 1000),
          event_category: 'Performance'
        });
      }
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS observer not supported
    }

    // INP (Interaction to Next Paint) - report slow interactions where supported
    try {
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const delay = entry.processingStart - entry.startTime;
          if (window.gtag && typeof delay === 'number' && delay >= 40) {
            window.gtag('event', 'web_vitals', {
              name: 'INP',
              value: Math.round(delay),
              event_category: 'Performance'
            });
          }
        }
      });
      inpObserver.observe({ type: 'event', buffered: true });
    } catch (e) {
      // INP / event timing not supported
    }
  }
};

// Initialize all performance optimizations (bfcache-safe: no unload/beforeunload)
export const initPerformanceOptimizations = () => {
  preloadCriticalResources();
  addResourceHints();
  registerServiceWorker();
  extractCriticalCSS();
  initPerformanceMonitoring();
};
