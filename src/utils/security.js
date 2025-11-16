// Security utilities and configurations

// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  'connect-src': [
    "'self'",
    "https://www.google-analytics.com",
    "https://analytics.google.com"
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Format phone number as (XXX) XXX-XXXX
export function formatPhoneNumber(value) {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length === 0) return '';
  if (digitsOnly.length <= 3) return `(${digitsOnly}`;
  if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
}

// Rate limiting (client-side basic implementation)
class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// CSRF token generation (basic implementation)
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// XSS protection
export const escapeHtml = (text) => {
  if (typeof text !== 'string') return text;
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

// Sanitize HTML for dangerouslySetInnerHTML usage
// This is a basic sanitizer - for production, consider using DOMPurify
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // First escape all HTML entities
  let sanitized = escapeHtml(html);
  
  // Then allow only safe HTML tags and attributes
  // Remove all script tags and event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  
  // Allow only safe HTML tags: span, p, div, strong, em, b, i, u, br, h1-h6, ul, ol, li, a (with safe href)
  const allowedTags = ['span', 'p', 'div', 'strong', 'em', 'b', 'i', 'u', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'];
  const allowedAttributes = ['class', 'id', 'href', 'target', 'rel'];
  
  // Remove any tags not in whitelist
  sanitized = sanitized.replace(/<(\/?)([^>]+)>/g, (match, closing, tagContent) => {
    const tagName = tagContent.split(/\s/)[0].toLowerCase();
    if (allowedTags.includes(tagName)) {
      // Remove dangerous attributes
      let safeTag = tagContent.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
      safeTag = safeTag.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
      // Only allow safe attributes
      const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g;
      let safeAttrs = '';
      let attrMatch;
      while ((attrMatch = attrRegex.exec(tagContent)) !== null) {
        if (allowedAttributes.includes(attrMatch[1].toLowerCase())) {
          // Additional check for href - only allow http/https
          if (attrMatch[1].toLowerCase() === 'href') {
            const href = attrMatch[2];
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/') || href.startsWith('#')) {
              safeAttrs += ` ${attrMatch[1]}="${escapeHtml(attrMatch[2])}"`;
            }
          } else {
            safeAttrs += ` ${attrMatch[1]}="${escapeHtml(attrMatch[2])}"`;
          }
        }
      }
      return `<${closing}${tagName}${safeAttrs}>`;
    }
    return ''; // Remove disallowed tags
  });
  
  return sanitized;
};

// Security headers for meta tags
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), local-network=()'
});

// Form validation rules
export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  company: {
    required: false,
    maxLength: 100
  }
};

// Validate form data against rules
export const validateFormData = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field] || '';
    
    if (rule.required && !value.trim()) {
      errors[field] = `${field} is required`;
      return;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      return;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be no more than ${rule.maxLength} characters`;
      return;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = `${field} format is invalid`;
      return;
    }
  });
  
  return errors;
};
