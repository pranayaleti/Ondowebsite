import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // Routing
          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-router';
          }
          // UI components
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          // SEO and meta
          if (id.includes('node_modules/react-helmet-async')) {
            return 'vendor-seo';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
          // Admin pages
          if (id.includes('/pages/admin/')) {
            return 'admin';
          }
          // Portal pages
          if (id.includes('/pages/portal/')) {
            return 'portal';
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
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
      treeShaking: true
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
          proxy.on('error', (err, _req, _res) => {
            console.log('⚠️  Proxy error:', err.message);
            console.log('💡 Make sure the backend server is running on port 5001');
            console.log('   Run: cd backend && node index.js');
          });
          // Only log non-analytics requests to reduce noise
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Skip logging analytics tracking requests (they're very frequent)
            if (!req.url.includes('/api/analytics/track')) {
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
            console.error('❌ Proxy request error:', err.message);
            if (!res.headersSent) {
              res.status(503).json({ 
                error: 'Backend server is not available',
                message: 'Please ensure the backend server is running on port 5001',
                hint: 'Run: cd backend && node index.js'
              });
            }
          });
        }
      }
    }
  },
  preview: {
    port: 4173,
    open: true
  }
})
