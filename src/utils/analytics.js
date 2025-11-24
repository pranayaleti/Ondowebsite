// Comprehensive Analytics Tracking Utility
// Tracks clicks, navigation, user interactions, and other relevant metrics

// Import centralized API configuration
import { API_URL } from './apiConfig';

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
    
    // Set up event listeners first (non-blocking)
    this.setupClickTracking();
    this.setupNavigationTracking();
    this.setupScrollTracking();
    this.setupFormTracking();
    this.setupVisibilityTracking();
    this.setupErrorTracking();
    
    // Track page unload - Use pagehide instead of beforeunload for better cache support
    // beforeunload prevents back/forward cache restoration
    this.pageHideHandler = () => {
      this.trackPageExit();
      this.flushBatch(); // Flush any pending events
    };
    // Use pagehide instead of beforeunload to allow bfcache
    window.addEventListener('pagehide', this.pageHideHandler);
    
    // Defer initial page view tracking to avoid blocking critical path
    // Use requestIdleCallback or setTimeout to ensure non-blocking
    const trackInitialPageView = () => {
      this.trackPageView(window.location.pathname);
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trackInitialPageView, { timeout: 2000 });
    } else {
      setTimeout(trackInitialPageView, 100);
    }
  }

  // Cleanup method to remove event listeners
  cleanup() {
    if (!this.initialized) return;
    
    // Remove pagehide listener
    if (this.pageHideHandler) {
      window.removeEventListener('pagehide', this.pageHideHandler);
      this.pageHideHandler = null;
    }
    
    // Remove popstate listener
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
    
    // Restore original history methods
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
    }
    
    // Clear batch timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    this.initialized = false;
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
    
    // Store original methods for cleanup
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    
    // Override pushState and replaceState
    history.pushState = function(...args) {
      this.originalPushState.apply(history, args);
      trackPathChange();
    }.bind(this);
    
    history.replaceState = function(...args) {
      this.originalReplaceState.apply(history, args);
      trackPathChange();
    }.bind(this);
    
    // Track popstate (back/forward)
    this.popstateHandler = () => {
      trackPathChange();
      this.trackNavigation(lastPath, window.location.pathname, 'back');
    };
    window.addEventListener('popstate', this.popstateHandler);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          type: eventType,
          data: eventData
        }),
        keepalive: immediate // Use keepalive for page exit events
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Silently fail - don't log errors for analytics failures
        // Analytics should never interrupt user experience
        return;
      }
    } catch (error) {
      // Silently fail - analytics errors should never be visible to users
      // Network errors, timeouts, and connection failures are expected
      // when backend is not available (e.g., in preview mode without backend)
      // Do not log or throw - just return silently
      return;
    }
  }

  // Send batch of events
  async sendBatch(events) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_URL}/analytics/track-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({ events }),
        keepalive: true
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Silently fail - don't log errors for analytics failures
        return;
      }
    } catch (error) {
      // Silently fail - analytics errors should never be visible to users
      // Network errors, timeouts, and connection failures are expected
      // when backend is not available (e.g., in preview mode without backend)
      // Do not log or throw - just return silently
      return;
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

