import { useEffect } from 'react';

const ScriptOptimizer = () => {
  // #region agent log
  useEffect(() => {
    // Load analytics with lazyOnload strategy (only if configured)
    const loadAnalytics = () => {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
      if (!gaId || gaId === 'GA_MEASUREMENT_ID' || gaId.trim() === '') {
        return; // Don't load if not configured
      }

      try {
        // Google Analytics with lazy loading
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', gaId, {
          send_page_view: false,
          anonymize_ip: true,
          allow_google_signals: false
        });
        
        // Load GA script with lazyOnload strategy
        const gaScript = document.createElement('script');
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        gaScript.async = true;
        gaScript.defer = true;
        gaScript.loading = 'lazy';
        document.head.appendChild(gaScript);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Google Analytics loading failed:', error);
        }
      }
    };

    // Load Google Tag Manager with lazy loading (only if configured)
    const loadGTM = () => {
      const gtmId = import.meta.env.VITE_GTM_ID;
      if (!gtmId || gtmId === 'GTM-XXXXXXX' || gtmId.trim() === '') {
        return; // Don't load if not configured
      }

      try {
        const gtmScript = document.createElement('script');
        // Use textContent instead of innerHTML for security
        const gtmCode = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
        gtmScript.textContent = gtmCode;
        gtmScript.async = true;
        gtmScript.defer = true;
        document.head.appendChild(gtmScript);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('GTM loading failed:', error);
        }
      }
    };

    // Load Facebook Pixel with lazy loading (only if configured).
    // Load fbevents.js in a single script tag so we can attach onerror and avoid console noise when blocked by ad-blockers.
    const loadFacebookPixel = () => {
      const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
      if (!pixelId || pixelId === 'YOUR_PIXEL_ID' || pixelId.trim() === '') {
        return; // Don't load if not configured
      }

      try {
        // Stub fbq so any calls before script loads are queued (real fbevents.js will process the queue)
        window.fbq =
          window.fbq ||
          function () {
            (window.fbq.queue = window.fbq.queue || []).push(arguments);
          };
        window.fbq.queue = [];

        const fbScript = document.createElement('script');
        fbScript.async = true;
        fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
        fbScript.onerror = () => {
          // Silently ignore when blocked by ad blocker (ERR_BLOCKED_BY_CLIENT)
        };
        fbScript.onload = () => {
          try {
            window.fbq('init', pixelId);
            window.fbq('track', 'PageView');
          } catch (e) {
            if (import.meta.env.DEV) console.warn('Facebook Pixel init failed:', e);
          }
        };
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(fbScript, firstScript);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Facebook Pixel loading failed:', error);
        }
      }
    };

    // Load Hotjar with lazy loading (only if configured)
    const loadHotjar = () => {
      const hotjarId = import.meta.env.VITE_HOTJAR_ID;
      if (!hotjarId || hotjarId === 'YOUR_HOTJAR_ID' || hotjarId.trim() === '') {
        return; // Don't load if not configured
      }

      try {
        const hjScript = document.createElement('script');
        // Use textContent instead of innerHTML for security
        const hjCode = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjarId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
        hjScript.textContent = hjCode;
        hjScript.async = true;
        hjScript.defer = true;
        // Add error handler to prevent console errors if blocked
        hjScript.onerror = () => {
          // Silently handle if blocked by ad blocker
        };
        document.head.appendChild(hjScript);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Hotjar loading failed:', error);
        }
      }
    };

    // Load scripts with intersection observer for better performance
    const loadScriptsOnInteraction = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load analytics after user interaction
            loadAnalytics();
            observer.disconnect();
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1
      });

      // Observe the main content area
      const mainContent = document.querySelector('main') || document.body;
      if (mainContent) {
        observer.observe(mainContent);
      }
    };

    // Fonts are now loaded in index.html for better performance
    // No need to load fonts here as they're already in the HTML head

    // Initialize script loading (fonts already loaded in HTML)
    
    // Load analytics scripts after user interaction
    setTimeout(() => {
      loadScriptsOnInteraction();
    }, 1000);

    // Load non-critical scripts after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Only load these in production
        if (import.meta.env.PROD) {
          // Only load GTM if configured (check for actual GTM ID)
          const gtmId = import.meta.env.VITE_GTM_ID;
          if (gtmId && gtmId !== 'GTM-XXXXXXX' && gtmId.trim() !== '') {
            loadGTM();
          }
          loadFacebookPixel(); // Will only load if configured
          loadHotjar(); // Will only load if configured
        }
      }, 2000);
    });

    // Cleanup function
    return () => {
      // Cleanup if needed
      if (import.meta.env.DEV) {
        console.log('Script optimizer cleanup');
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ScriptOptimizer;
