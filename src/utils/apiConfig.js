/**
 * Centralized API Configuration
 * Single source of truth for API URL configuration
 */

/**
 * Determine API URL based on environment
 * @returns {string} The API base URL
 */
export const getAPIUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, we need an external backend URL
  // GitHub Pages doesn't support API routes, so we can't use relative URLs
  if (import.meta.env.PROD) {
    // VITE_API_URL should be set during build time via environment variable
    // If not set, we'll show an error and prevent requests
    if (!import.meta.env.VITE_API_URL) {
      console.error('⚠️  VITE_API_URL environment variable is required in production!');
      console.error('Please set VITE_API_URL to your production backend URL (e.g., https://api.ondosoft.com/api)');
      console.error('Set it in GitHub Actions secrets or as an environment variable during build');
      // Return empty string to prevent requests to GitHub Pages
      return '';
    }
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use relative URL so Vite proxy can handle it
  // The proxy in vite.config.js will forward /api to http://localhost:5001
  return '/api';
};

/**
 * Get the API base URL (without /api suffix)
 * Useful for OAuth redirects and other non-API endpoints
 * @returns {string} The API base URL without /api
 */
export const getAPIBase = () => {
  // If VITE_API_URL is explicitly set, extract base
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    // Remove /api suffix if present
    return url.endsWith('/api') ? url.slice(0, -4) : url;
  }
  
  // In production, we need an external backend URL
  if (import.meta.env.PROD) {
    if (!import.meta.env.VITE_API_URL) {
      console.error('⚠️  VITE_API_URL environment variable is required in production!');
      return '';
    }
    const url = import.meta.env.VITE_API_URL;
    // Remove /api suffix if present
    return url.endsWith('/api') ? url.slice(0, -4) : url;
  }
  
  // In development, use environment variable or default to localhost
  // This can be overridden with VITE_API_BASE environment variable
  const devBase = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
  if (devBase === 'http://localhost:5001') {
    console.warn('⚠️  Using default API base URL. Set VITE_API_BASE environment variable if needed.');
  }
  return devBase;
};

// Export the API URL as a constant for direct use
export const API_URL = getAPIUrl();

// Export the API base URL as a constant for direct use
export const API_BASE = getAPIBase();

