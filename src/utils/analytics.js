// Comprehensive Analytics Tracking Utility
// Tracks clicks, navigation, user interactions, and other relevant metrics

// Determine API URL based on environment
const getAPIUrl = () => {
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

const API_URL = getAPIUrl();

class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.pageViews = [];
    this.clicks = [];
    this.navigationEvents = [];
    this.userInteractions = [];
    this.scrollEvents = [];
    this.formInteractions = [];
    this.initialized = false;
    this.currentPage = null;
    this.pageStartTime = null;
    this.lastActivityTime = Date.now();
    
    // Batch tracking to reduce API calls
    this.batchSize = 10;
    this.batchTimeout = 5000; // 5 seconds
    this.pendingEvents = [];
    this.batchTimer = null;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Track initial page view
    this.trackPageView(window.location.pathname);
    
    // Set up event listeners
    this.setupClickTracking();
    this.setupNavigationTracking();
    this.setupScrollTracking();
    this.setupFormTracking();
    this.setupVisibilityTracking();
    this.setupErrorTracking();
    
    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
      this.flushBatch(); // Flush any pending events
    });
  }

  // Track page views
  trackPageView(pathname) {
    const pageView = {
      sessionId: this.sessionId,
      pathname: pathname || window.location.pathname,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pageLoadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : null,
      type: 'page_view'
    };
    
    this.pageViews.push(pageView);
    this.currentPage = pathname || window.location.pathname;
    this.pageStartTime = Date.now();
    
    this.sendEvent('page_view', pageView);
  }

  // Track clicks
  trackClick(element, event) {
    const clickData = {
      sessionId: this.sessionId,
      pathname: window.location.pathname,
      elementType: element.tagName.toLowerCase(),
      elementId: element.id || null,
      elementClass: element.className || null,
      elementText: element.textContent?.trim().substring(0, 100) || null,
      href: element.href || null,
      timestamp: new Date().toISOString(),
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      type: 'click'
    };
    
    this.clicks.push(clickData);
    this.addToBatch('click', clickData);
  }

  // Track navigation events
  trackNavigation(from, to, method = 'link') {
    const navigationData = {
      sessionId: this.sessionId,
      from: from,
      to: to,
      method: method, // 'link', 'back', 'forward', 'direct', 'programmatic'
      timestamp: new Date().toISOString(),
      timeOnPage: this.pageStartTime ? Date.now() - this.pageStartTime : null,
      type: 'navigation'
    };
    
    this.navigationEvents.push(navigationData);
    this.sendEvent('navigation', navigationData);
  }

  // Track scroll events
  trackScroll(depth, timeOnPage) {
    const scrollData = {
      sessionId: this.sessionId,
      pathname: window.location.pathname,
      scrollDepth: depth, // percentage
      timeOnPage: timeOnPage,
      timestamp: new Date().toISOString(),
      type: 'scroll'
    };
    
    this.scrollEvents.push(scrollData);
    this.addToBatch('scroll', scrollData);
  }

  // Track form interactions
  trackFormInteraction(formId, action, fieldName = null) {
    const formData = {
      sessionId: this.sessionId,
      pathname: window.location.pathname,
      formId: formId,
      action: action, // 'focus', 'blur', 'change', 'submit'
      fieldName: fieldName,
      timestamp: new Date().toISOString(),
      type: 'form_interaction'
    };
    
    this.formInteractions.push(formData);
    this.addToBatch('form_interaction', formData);
  }

  // Track user interactions
  trackUserInteraction(interactionType, details = {}) {
    const interactionData = {
      sessionId: this.sessionId,
      pathname: window.location.pathname,
      interactionType: interactionType, // 'button_click', 'link_click', 'form_submit', 'search', etc.
      details: details,
      timestamp: new Date().toISOString(),
      type: 'user_interaction'
    };
    
    this.userInteractions.push(interactionData);
    this.addToBatch('user_interaction', interactionData);
  }

  // Track page exit
  trackPageExit() {
    if (!this.currentPage || !this.pageStartTime) return;
    
    const exitData = {
      sessionId: this.sessionId,
      pathname: this.currentPage,
      timeOnPage: Date.now() - this.pageStartTime,
      timestamp: new Date().toISOString(),
      type: 'page_exit'
    };
    
    // Send immediately on exit
    this.sendEvent('page_exit', exitData, true);
  }

  // Setup click tracking
  setupClickTracking() {
    document.addEventListener('click', (event) => {
      const element = event.target;
      
      // Track all clicks
      this.trackClick(element, event);
      
      // Track specific interaction types
      if (element.tagName === 'A' || element.closest('a')) {
        const link = element.tagName === 'A' ? element : element.closest('a');
        this.trackUserInteraction('link_click', {
          href: link.href,
          text: link.textContent?.trim().substring(0, 100)
        });
      } else if (element.tagName === 'BUTTON' || element.closest('button')) {
        const button = element.tagName === 'BUTTON' ? element : element.closest('button');
        this.trackUserInteraction('button_click', {
          buttonId: button.id,
          buttonText: button.textContent?.trim().substring(0, 100),
          buttonClass: button.className
        });
      }
    }, true);
  }

  // Setup navigation tracking
  setupNavigationTracking() {
    // Track history changes (SPA navigation)
    let lastPath = window.location.pathname;
    
    const trackPathChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        this.trackNavigation(lastPath, currentPath, 'programmatic');
        this.trackPageView(currentPath);
        lastPath = currentPath;
      }
    };
    
    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      trackPathChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      trackPathChange();
    };
    
    // Track popstate (back/forward)
    window.addEventListener('popstate', () => {
      trackPathChange();
      this.trackNavigation(lastPath, window.location.pathname, 'back');
    });
  }

  // Setup scroll tracking
  setupScrollTracking() {
    let maxScroll = 0;
    let scrollTrackingInterval = null;
    
    const trackScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollDepth = Math.round((scrollTop + clientHeight) / scrollHeight * 100);
      
      if (scrollDepth > maxScroll) {
        maxScroll = scrollDepth;
        const timeOnPage = this.pageStartTime ? Date.now() - this.pageStartTime : 0;
        
        // Track milestones: 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollDepth)) {
          this.trackScroll(scrollDepth, timeOnPage);
        }
      }
    };
    
    window.addEventListener('scroll', () => {
      if (!scrollTrackingInterval) {
        scrollTrackingInterval = setTimeout(() => {
          trackScrollDepth();
          scrollTrackingInterval = null;
        }, 100);
      }
    }, { passive: true });
  }

  // Setup form tracking
  setupFormTracking() {
    document.addEventListener('focus', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        const form = event.target.closest('form');
        if (form) {
          this.trackFormInteraction(form.id || 'unnamed', 'focus', event.target.name || event.target.id);
        }
      }
    }, true);
    
    document.addEventListener('blur', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        const form = event.target.closest('form');
        if (form) {
          this.trackFormInteraction(form.id || 'unnamed', 'blur', event.target.name || event.target.id);
        }
      }
    }, true);
    
    document.addEventListener('change', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        const form = event.target.closest('form');
        if (form) {
          this.trackFormInteraction(form.id || 'unnamed', 'change', event.target.name || event.target.id);
        }
      }
    }, true);
    
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.tagName === 'FORM') {
        this.trackFormInteraction(form.id || 'unnamed', 'submit');
        this.trackUserInteraction('form_submit', {
          formId: form.id,
          formAction: form.action
        });
      }
    }, true);
  }

  // Setup visibility tracking
  setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.lastActivityTime = Date.now();
      } else {
        const timeAway = Date.now() - this.lastActivityTime;
        if (timeAway > 30000) { // More than 30 seconds away
          this.trackUserInteraction('tab_return', {
            timeAway: timeAway
          });
        }
      }
    });
  }

  // Setup error tracking
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackUserInteraction('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.trackUserInteraction('unhandled_promise_rejection', {
        reason: event.reason?.toString()
      });
    });
  }

  // Add event to batch
  addToBatch(eventType, eventData) {
    this.pendingEvents.push({ type: eventType, data: eventData });
    
    if (this.pendingEvents.length >= this.batchSize) {
      this.flushBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.flushBatch();
      }, this.batchTimeout);
    }
  }

  // Flush batched events
  flushBatch() {
    if (this.pendingEvents.length === 0) return;
    
    const events = [...this.pendingEvents];
    this.pendingEvents = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    // Send batch to server
    this.sendBatch(events);
  }

  // Send event to server
  async sendEvent(eventType, eventData, immediate = false) {
    if (!immediate && eventType !== 'page_view' && eventType !== 'navigation' && eventType !== 'page_exit') {
      this.addToBatch(eventType, eventData);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: eventType,
          data: eventData
        }),
        keepalive: immediate // Use keepalive for page exit events
      });
      
      if (!response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Analytics tracking failed:', response.statusText);
        }
      }
    } catch (error) {
      // Silently fail - don't interrupt user experience
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics tracking error:', error);
      }
    }
  }

  // Send batch of events
  async sendBatch(events) {
    try {
      const response = await fetch(`${API_URL}/analytics/track-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ events }),
        keepalive: true
      });
      
      if (!response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Analytics batch tracking failed:', response.statusText);
        }
      }
    } catch (error) {
      // Silently fail - don't interrupt user experience
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics batch tracking error:', error);
      }
    }
  }

  // Get analytics summary for current session
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      pageViews: this.pageViews.length,
      clicks: this.clicks.length,
      navigationEvents: this.navigationEvents.length,
      scrollEvents: this.scrollEvents.length,
      formInteractions: this.formInteractions.length,
      userInteractions: this.userInteractions.length,
      timeOnSite: this.pageStartTime ? Date.now() - this.pageStartTime : 0
    };
  }
}

// Create singleton instance
const analyticsTracker = new AnalyticsTracker();

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      analyticsTracker.init();
    });
  } else {
    analyticsTracker.init();
  }
}

export default analyticsTracker;

