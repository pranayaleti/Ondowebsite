import { useEffect } from 'react';

const ScriptOptimizer = () => {
  useEffect(() => {
    // Load analytics with lazyOnload strategy
    const loadAnalytics = () => {
      // Google Analytics with lazy loading
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false
      });
      
      // Load GA script with lazyOnload strategy
      const gaScript = document.createElement('script');
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      gaScript.async = true;
      gaScript.defer = true;
      gaScript.loading = 'lazy';
      document.head.appendChild(gaScript);
    };

    // Load Google Tag Manager with lazy loading
    const loadGTM = () => {
      const gtmScript = document.createElement('script');
      // Use textContent instead of innerHTML for security
      const gtmCode = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');`;
      gtmScript.textContent = gtmCode;
      gtmScript.async = true;
      gtmScript.defer = true;
      document.head.appendChild(gtmScript);
    };

    // Load Facebook Pixel with lazy loading
    const loadFacebookPixel = () => {
      const fbScript = document.createElement('script');
      // Use textContent instead of innerHTML for security
      const fbCode = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', 'YOUR_PIXEL_ID');fbq('track', 'PageView');`;
      fbScript.textContent = fbCode;
      fbScript.async = true;
      fbScript.defer = true;
      document.head.appendChild(fbScript);
    };

    // Load Hotjar with lazy loading
    const loadHotjar = () => {
      const hjScript = document.createElement('script');
      // Use textContent instead of innerHTML for security
      const hjCode = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
      hjScript.textContent = hjCode;
      hjScript.async = true;
      hjScript.defer = true;
      document.head.appendChild(hjScript);
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

    // Load critical scripts immediately
    const loadCriticalScripts = () => {
      // Load font stylesheet directly (avoiding preload warnings)
      const fontStyle = document.createElement('link');
      fontStyle.rel = 'stylesheet';
      fontStyle.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontStyle.crossOrigin = 'anonymous';
      document.head.appendChild(fontStyle);
    };

    // Initialize script loading
    loadCriticalScripts();
    
    // Load analytics scripts after user interaction
    setTimeout(() => {
      loadScriptsOnInteraction();
    }, 1000);

    // Load non-critical scripts after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Only load these in production
        if (import.meta.env.PROD) {
          loadGTM();
          loadFacebookPixel();
          loadHotjar();
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
