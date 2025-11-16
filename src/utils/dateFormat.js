/**
 * Date formatting utilities with timezone support
 * - UI components: Display in user's local timezone
 * - Admin dashboard: Display in MST (Mountain Standard Time)
 */

// MST timezone identifier (America/Denver)
const MST_TIMEZONE = 'America/Denver';

/**
 * Format date in user's local timezone (for UI components)
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDateUserTimezone = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format date and time in user's local timezone (for UI components)
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time string
 */
export const formatDateTimeUserTimezone = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...options
  };
  
  return dateObj.toLocaleString(undefined, defaultOptions);
};

/**
 * Format date in MST timezone (for admin dashboard)
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string in MST
 */
export const formatDateMST = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: MST_TIMEZONE,
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date and time in MST timezone (for admin dashboard)
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time string in MST
 */
export const formatDateTimeMST = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: MST_TIMEZONE,
    ...options
  };
  
  return dateObj.toLocaleString('en-US', defaultOptions);
};

/**
 * Smart date formatter that automatically detects context
 * Uses MST for admin pages, user timezone for UI
 * @param {string|Date} date - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {boolean} includeTime - Whether to include time in the format
 * @param {boolean} isAdmin - Whether this is in an admin context
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}, includeTime = false, isAdmin = false) => {
  if (isAdmin) {
    return includeTime ? formatDateTimeMST(date, options) : formatDateMST(date, options);
  }
  return includeTime ? formatDateTimeUserTimezone(date, options) : formatDateUserTimezone(date, options);
};

/**
 * Format date with weekday in user's timezone (for UI)
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date with weekday
 */
export const formatDateWithWeekdayUser = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date with weekday in MST (for admin)
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date with weekday in MST
 */
export const formatDateWithWeekdayMST = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: MST_TIMEZONE,
  });
};

