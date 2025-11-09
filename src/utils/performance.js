// Performance optimization utilities
import { lazy } from 'react';

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload hero image
  const heroImage = new Image();
  heroImage.src = '/logo.png';
  
  // Load critical fonts (use stylesheet instead of preload to avoid warnings)
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
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

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registered: ', registration);
          }
        })
        .catch((registrationError) => {
          // Only log in development to avoid console errors
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registration failed: ', registrationError);
          }
        });
    });
  }
};

// Resource hints for performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Bundle splitting utilities
export const loadComponent = (importFunction) => {
  return lazy(importFunction);
};

// Critical CSS extraction
export const extractCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    .hero-section { display: block; }
    .navbar { position: fixed; top: 0; }
    .cta-button { background: linear-gradient(45deg, #f97316, #ea580c); }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Performance monitoring
export const initPerformanceMonitoring = () => {
  // Web Vitals monitoring - only send to analytics, no console logging
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // LCP monitoring
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
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
        if (process.env.NODE_ENV === 'development') {
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
          if (process.env.NODE_ENV === 'development') {
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
  }
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  preloadCriticalResources();
  addResourceHints();
  registerServiceWorker();
  extractCriticalCSS();
  initPerformanceMonitoring();
};
