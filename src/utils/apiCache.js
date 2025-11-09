/**
 * API Request Caching and Deduplication Utility
 * Prevents duplicate API calls and caches responses for better performance
 */

// In-memory cache for API responses
const apiCache = new Map();
const pendingRequests = new Map();

// Cache duration settings (in milliseconds)
const CACHE_DURATIONS = {
  default: 5 * 60 * 1000, // 5 minutes
  short: 1 * 60 * 1000,   // 1 minute
  long: 30 * 60 * 1000,   // 30 minutes
  static: 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Generate cache key from request details
 */
const getCacheKey = (url, options = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
};

/**
 * Check if cached response is still valid
 */
const isCacheValid = (cachedItem) => {
  if (!cachedItem) return false;
  return Date.now() < cachedItem.expiresAt;
};

/**
 * Cached fetch with request deduplication
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @param {string} cacheType - Cache duration type ('default', 'short', 'long', 'static')
 * @returns {Promise<Response>} - Cached or fresh response
 */
export const cachedFetch = async (url, options = {}, cacheType = 'default') => {
  const method = options.method || 'GET';
  
  // Only cache GET requests
  if (method !== 'GET') {
    return fetch(url, options);
  }

  const cacheKey = getCacheKey(url, options);
  const cacheDuration = CACHE_DURATIONS[cacheType] || CACHE_DURATIONS.default;

  // Check if there's a pending request for this URL
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  // Check cache first
  const cachedItem = apiCache.get(cacheKey);
  if (isCacheValid(cachedItem)) {
    return Promise.resolve(cachedItem.response.clone());
  }

  // Make the request
  const fetchPromise = fetch(url, options)
    .then(async (response) => {
      // Only cache successful responses
      if (response.ok) {
        const clonedResponse = response.clone();
        apiCache.set(cacheKey, {
          response: clonedResponse,
          expiresAt: Date.now() + cacheDuration,
          timestamp: Date.now()
        });

        // Clean up old cache entries periodically
        if (apiCache.size > 100) {
          cleanupCache();
        }
      }

      // Remove from pending requests
      pendingRequests.delete(cacheKey);
      return response;
    })
    .catch((error) => {
      pendingRequests.delete(cacheKey);
      throw error;
    });

  // Store pending request to deduplicate
  pendingRequests.set(cacheKey, fetchPromise);

  return fetchPromise;
};

/**
 * Clean up expired cache entries
 */
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, item] of apiCache.entries()) {
    if (now >= item.expiresAt) {
      apiCache.delete(key);
    }
  }
};

/**
 * Clear specific cache entry
 */
export const clearCache = (url, options = {}) => {
  const cacheKey = getCacheKey(url, options);
  apiCache.delete(cacheKey);
};

/**
 * Clear all cache entries
 */
export const clearAllCache = () => {
  apiCache.clear();
  pendingRequests.clear();
};

/**
 * Prefetch API endpoint (warm up cache)
 */
export const prefetchAPI = async (url, options = {}, cacheType = 'default') => {
  return cachedFetch(url, options, cacheType).catch(() => {
    // Silently fail prefetch requests
  });
};

// Cleanup cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupCache, 5 * 60 * 1000);
}

