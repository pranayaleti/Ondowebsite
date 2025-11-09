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
  
  // In production, use the same origin (relative URL)
  if (import.meta.env.PROD) {
    return '/api';
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
  
  // In production, use empty string (same origin)
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, default to localhost
  return 'http://localhost:5001';
};

// Export the API URL as a constant for direct use
export const API_URL = getAPIUrl();

// Export the API base URL as a constant for direct use
export const API_BASE = getAPIBase();

