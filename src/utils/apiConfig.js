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
    // If not set, try to use relative /api path (assumes backend is on same domain)
    if (!import.meta.env.VITE_API_URL) {
      console.warn('⚠️  VITE_API_URL not set. Using relative /api path. If backend is on different domain, set VITE_API_URL.');
      // Use relative path - assumes backend is on same domain
      return '/api';
    }
    // Ensure the URL ends with /api if it doesn't already
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl.endsWith('/api')) {
      return apiUrl;
    } else if (apiUrl.endsWith('/')) {
      return apiUrl + 'api';
    } else {
      return apiUrl + '/api';
    }
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
      // If VITE_API_URL is not set, use empty string (relative paths)
      console.warn('⚠️  VITE_API_URL not set. Using relative paths. If backend is on different domain, set VITE_API_URL.');
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

