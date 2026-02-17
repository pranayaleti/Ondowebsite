import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// In dev, handle /api/analytics/track* so they never hit the proxy when backend is down (avoids ECONNREFUSED spam).
function analyticsProxyStub() {
  return {
    name: 'analytics-proxy-stub',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || !req.url) {
          next()
          return
        }
        const path = req.url.split('?')[0]
        if (path === '/api/analytics/track' || path === '/api/analytics/track-batch') {
          req.on('data', () => {})
          req.on('end', () => {
            res.statusCode = 204
            res.end()
          })
          return
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base:'/',
  plugins: [
    react(),
    analyticsProxyStub(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo.png',
        'robots.txt',
        'sitemap.xml',
        'offline.html',
        'icons/icon-72x72.png',
        'icons/icon-96x96.png',
        'icons/icon-128x128.png',
        'icons/icon-144x144.png',
        'icons/icon-152x152.png',
        'icons/icon-192x192.png',
        'icons/icon-384x384.png',
        'icons/icon-512x512.png'
      ],
      manifest: {
        name: 'Ondosoft - Software Development Services',
        short_name: 'Ondosoft',
        description: 'Trusted software development with on-time delivery. Full stack, SaaS, and custom web apps.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#f97316',
        orientation: 'portrait-primary',
        lang: 'en-US',
        id: '/',
        scope: '/',
        categories: ['business', 'productivity', 'technology'],
        icons: [
          { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          {
            name: 'Contact Us',
            short_name: 'Contact',
            description: 'Get in touch with our development team',
            url: '/contact',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Our Services',
            short_name: 'Services',
            description: 'View our software development services',
            url: '/services',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Portfolio',
            short_name: 'Portfolio',
            description: 'See our development portfolio',
            url: '/products',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        globIgnores: ['**/logo.backup*'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/sitemap\.xml$/, /^\/robots\.txt$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/api\/(?!auth\/).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot|otf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/assets\.calendly\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'calendly-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Admin pages - separate chunk, only loaded when needed
          if (id.includes('/pages/admin/') || id.includes('/components/admin/')) {
            return 'admin';
          }
          // Portal pages - separate chunk, only loaded when needed
          if (id.includes('/pages/portal/') || id.includes('/components/portal/')) {
            return 'portal';
          }
          // Auth pages - separate chunk
          if (id.includes('/pages/SignInPage') || id.includes('/pages/SignUpPage') || 
              id.includes('/pages/ForgotPasswordPage') || id.includes('/pages/ResetPasswordPage')) {
            return 'auth';
          }
          // Core React libraries - keep React, ReactDOM, and ALL React-dependent libraries together
          // CRITICAL: All React-related code MUST be in vendor-react to prevent createContext errors
          // This ensures React is always available when any React-dependent library loads
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/react-helmet-async') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/@types/react')) {
            return 'vendor-react';
          }
          // Check for any other potential React dependencies
          // Some packages might have 'react' in their name or path
          if (id.includes('node_modules') && (
              id.toLowerCase().includes('react') ||
              id.includes('jsx') ||
              id.includes('scheduler') // React scheduler
            )) {
            return 'vendor-react';
          }
          // Other node_modules (non-React dependencies only)
          // IMPORTANT: If unsure whether a library uses React, put it in vendor-react to be safe
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    chunkSizeWarningLimit: 500, // Warn if chunks exceed 500KB
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
      treeShaking: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      target: 'es2020'
    },
    // Enable compression
    reportCompressedSize: true,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/]
    },
    // Enable source maps for production debugging (optional, can disable for smaller builds)
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
    // Minify CSS
    cssMinify: true
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      'lucide-react',
      'react-helmet-async'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  // CSS optimization
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js'
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: ['3000-ix2dlb48gz0pekd8429o0-6bb112db.us2.manus.computer'],
    // Enable compression in dev
    middlewareMode: false,
    // Proxy API requests to backend server
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            // Suppress ALL errors for analytics requests - they fail gracefully in the client
            // Don't log, don't respond - just silently ignore
            if (req.url && req.url.includes('/api/analytics/track')) {
              // Silently handle analytics proxy errors - client code handles failures gracefully
              // Don't send any response, don't log - just return
              return;
            }
            // Only log errors for non-analytics requests
            if (!req.url || !req.url.includes('/api/analytics')) {
              console.log('⚠️  Proxy error:', err.message);
              console.log('💡 Make sure the backend server is running on port 5001');
              console.log('   Run: cd backend && node index.js');
            }
          });
          // Only log non-analytics requests to reduce noise
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Skip logging analytics tracking requests (they're very frequent)
            // Also suppress any errors for analytics requests
            if (!req.url || (!req.url.includes('/api/analytics/track') && !req.url.includes('/api/analytics'))) {
              console.log(`🔄 Proxying ${req.method} ${req.url} to http://localhost:5001${req.url}`);
            }
          });
        },
        // Retry on connection errors
        timeout: 10000,
        // Don't fail on connection errors, just log them
        onProxyReq: (proxyReq, req, res) => {
          // Add error handling
          proxyReq.on('error', (err) => {
            // Suppress errors for analytics requests
            if (req.url && req.url.includes('/api/analytics/track')) {
              // Silently handle analytics proxy errors
              if (res && typeof res.status === 'function' && !res.headersSent) {
                res.status(503).end();
              }
              return;
            }
            console.error('❌ Proxy request error:', err.message);
            if (res && typeof res.status === 'function' && !res.headersSent) {
              res.status(503).json({ 
                error: 'Backend server is not available',
                message: 'Please ensure the backend server is running on port 5001',
                hint: 'Run: cd backend && node index.js'
              });
            }
          });
        },
        onError: (err, req, res) => {
          // Suppress ALL errors for analytics requests - don't log, don't respond
          if (req && req.url && (req.url.includes('/api/analytics/track') || req.url.includes('/api/analytics'))) {
            // Silently ignore - client handles failures gracefully
            return;
          }
          // For other requests, log the error only if it's not a connection refused for analytics
          if (err && err.message && !err.message.includes('ECONNREFUSED') && !err.message.includes('analytics')) {
            console.error('❌ Proxy error:', err.message);
          }
        }
      }
    }
  },
  preview: {
    port: 4173,
    open: true
  }
})
