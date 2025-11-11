/**
 * Centralized API Configuration
 * Single source of truth for API URL configuration
 */

/**
 * Determine API URL based on environment
 * @returns {string} The API base URL
 */
export const getAPIUrl = () => {
  // If VITE_API_URL is explicitly set, use it (and ensure it has /api suffix)
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL.trim();
    // Ensure the URL ends with /api if it doesn't already
    if (apiUrl.endsWith('/api')) {
      return apiUrl;
    } else if (apiUrl.endsWith('/')) {
      return apiUrl + 'api';
    } else {
      return apiUrl + '/api';
    }
  }
  
  // In production, use relative /api path since backend serves the frontend
  if (import.meta.env.PROD) {
    // Default: use relative path since backend serves the frontend on the same domain
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
  
  // In production, use relative paths since backend serves the frontend
  if (import.meta.env.PROD) {
    // If VITE_API_URL is explicitly set, extract base (for separate deployments)
    if (import.meta.env.VITE_API_URL) {
      const url = import.meta.env.VITE_API_URL;
      // Remove /api suffix if present
      return url.endsWith('/api') ? url.slice(0, -4) : url;
    }
    // Default: use empty string for relative paths (same domain)
    return '';
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

// Debug logging (only in development or if there's an issue)
if (import.meta.env.DEV || API_URL.includes('your-backend-url') || API_URL.includes('placeholder')) {
  console.warn('🔧 API Configuration:', {
    API_URL,
    API_BASE,
    VITE_API_URL: import.meta.env.VITE_API_URL || 'not set',
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE
  });
  
  if (API_URL.includes('your-backend-url') || API_URL.includes('placeholder')) {
    console.error('❌ ERROR: VITE_API_URL contains a placeholder value!');
    console.error('📝 To fix: Set VITE_API_URL environment variable to your actual backend URL');
    console.error('   Example: VITE_API_URL=https://ondowebsite.onrender.com/api');
    console.error('   Or: VITE_API_URL=https://ondowebsite.onrender.com (will auto-add /api)');
  }
}

