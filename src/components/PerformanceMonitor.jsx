import React, { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Initialize performance monitoring
    const initPerformanceMonitoring = () => {
      // Web Vitals monitoring
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint) monitoring
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
          
          // Send to analytics if needed
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
          console.log('LCP observer not supported');
        }

        // FID (First Input Delay) monitoring
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fid = entry.processingStart - entry.startTime;
            console.log('FID:', fid);
            
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
          console.log('FID observer not supported');
        }

        // CLS (Cumulative Layout Shift) monitoring
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log('CLS:', clsValue);
          
          if (window.gtag) {
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
          console.log('CLS observer not supported');
        }

        // FCP (First Contentful Paint) monitoring
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('FCP:', entry.startTime);
            
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'FCP',
                value: Math.round(entry.startTime),
                event_category: 'Performance'
              });
            }
          });
        });
        
        try {
          fcpObserver.observe({ entryTypes: ['paint'] });
        } catch (e) {
          console.log('FCP observer not supported');
        }
      }

      // Resource timing monitoring
      const monitorResourceTiming = () => {
        if (typeof window !== 'undefined' && 'performance' in window) {
          const resources = performance.getEntriesByType('resource');
          
          resources.forEach((resource) => {
            const loadTime = resource.responseEnd - resource.startTime;
            
            // Log slow resources
            if (loadTime > 1000) {
              console.warn('Slow resource detected:', {
                name: resource.name,
                loadTime: Math.round(loadTime),
                size: resource.transferSize
              });
            }
          });
        }
      };

      // Monitor after page load
      window.addEventListener('load', () => {
        setTimeout(monitorResourceTiming, 1000);
      });

      // Navigation timing
      const navigationTiming = () => {
        if (typeof window !== 'undefined' && 'performance' in window) {
          const navigation = performance.getEntriesByType('navigation')[0];
          
          if (navigation) {
            const metrics = {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              domInteractive: navigation.domInteractive - navigation.fetchStart,
              domComplete: navigation.domComplete - navigation.fetchStart
            };
            
            console.log('Navigation timing:', metrics);
            
            if (window.gtag) {
              window.gtag('event', 'navigation_timing', {
                name: 'DOMContentLoaded',
                value: Math.round(metrics.domContentLoaded),
                event_category: 'Performance'
              });
            }
          }
        }
      };

      // Run navigation timing after load
      window.addEventListener('load', () => {
        setTimeout(navigationTiming, 100);
      });
    };

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Cleanup function
    return () => {
      // Cleanup observers if needed
      console.log('Performance monitoring cleanup');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;