// Performance optimization utilities

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload hero image
  const heroImage = new Image();
  heroImage.src = '/logo.png';
  
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);
  
  // Preload critical CSS
  const criticalCSS = document.createElement('link');
  criticalCSS.rel = 'preload';
  criticalCSS.href = '/assets/critical.css';
  criticalCSS.as = 'style';
  document.head.appendChild(criticalCSS);
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
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
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
  return React.lazy(importFunction);
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
  // Web Vitals monitoring
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // LCP monitoring
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID monitoring
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // CLS monitoring
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('CLS:', entry.value);
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
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
