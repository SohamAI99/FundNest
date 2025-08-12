import config, { FEATURES, isProduction } from '../config/environment';

// Analytics and performance monitoring utilities
class Analytics {
  constructor() {
    this.isInitialized = false;
    this.userProperties = {};
    this.sessionId = this.generateSessionId();
    this.pageViewStartTime = Date.now();
    
    if (FEATURES.ENABLE_ANALYTICS) {
      this.initializeAnalytics();
    }
  }

  // Initialize analytics services
  initializeAnalytics() {
    if (this.isInitialized) return;
    
    try {
      // Initialize Google Analytics
      if (config.GOOGLE_ANALYTICS_ID) {
        this.initializeGA();
      }
      
      // Initialize custom analytics
      this.initializeCustomAnalytics();
      
      // Set up performance monitoring
      this.initializePerformanceMonitoring();
      
      this.isInitialized = true;
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  // Initialize Google Analytics
  initializeGA() {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', config.GOOGLE_ANALYTICS_ID, {
      send_page_view: false, // We'll handle page views manually
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure',
      session_timeout: 1800, // 30 minutes
      custom_map: {
        custom_parameter_1: 'user_role',
        custom_parameter_2: 'subscription_tier'
      }
    });
  }

  // Initialize custom analytics
  initializeCustomAnalytics() {
    // Set up user identification
    const userId = this.getUserId();
    if (userId) {
      this.setUserId(userId);
    }
    
    // Track session start
    this.trackEvent('session_start', {
      session_id: this.sessionId,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    });
  }

  // Initialize performance monitoring
  initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.monitorWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor JavaScript errors
    this.monitorErrors();
    
    // Monitor user interactions
    this.monitorInteractions();
  }

  // Generate unique session ID
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get user ID from storage or generate new one
  getUserId() {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  // Set user ID for tracking
  setUserId(userId) {
    this.userProperties.user_id = userId;
    
    if (window.gtag) {
      window.gtag('config', config.GOOGLE_ANALYTICS_ID, {
        user_id: userId
      });
    }
  }

  // Set user properties
  setUserProperties(properties) {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (window.gtag) {
      window.gtag('set', properties);
    }
  }

  // Track page view
  trackPageView(path, title) {
    const pageViewData = {
      page_path: path || window.location.pathname,
      page_title: title || document.title,
      page_location: window.location.href,
      session_id: this.sessionId,
      timestamp: Date.now(),
      ...this.userProperties
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', pageViewData);
    }

    // Custom analytics
    this.sendCustomEvent('page_view', pageViewData);
    
    // Reset page view timer
    this.pageViewStartTime = Date.now();
  }

  // Track custom events
  trackEvent(eventName, eventData = {}) {
    const enrichedData = {
      event_name: eventName,
      session_id: this.sessionId,
      timestamp: Date.now(),
      page_path: window.location.pathname,
      ...this.userProperties,
      ...eventData
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, enrichedData);
    }

    // Custom analytics
    this.sendCustomEvent(eventName, enrichedData);
  }

  // Track user interactions
  trackUserAction(action, category, label, value) {
    this.trackEvent('user_action', {
      action,
      category,
      label,
      value,
      element_id: document.activeElement?.id,
      element_class: document.activeElement?.className
    });
  }

  // Track business events
  trackBusinessEvent(eventType, eventData) {
    const businessEvents = {
      'user_registration': {
        event_category: 'engagement',
        event_label: eventData.user_role
      },
      'login': {
        event_category: 'engagement',
        event_label: eventData.user_role
      },
      'profile_completion': {
        event_category: 'engagement',
        event_label: `${eventData.completion_percentage}%`
      },
      'startup_created': {
        event_category: 'conversion',
        event_label: eventData.industry
      },
      'investor_profile_created': {
        event_category: 'conversion',
        event_label: eventData.investment_focus
      },
      'match_created': {
        event_category: 'engagement',
        event_label: `${eventData.match_score}%`
      },
      'message_sent': {
        event_category: 'engagement',
        event_label: eventData.recipient_type
      },
      'pitch_deck_uploaded': {
        event_category: 'conversion',
        event_label: eventData.file_type
      },
      'subscription_upgraded': {
        event_category: 'conversion',
        event_label: eventData.plan_name,
        value: eventData.plan_price
      }
    };

    const eventConfig = businessEvents[eventType] || {};
    
    this.trackEvent(eventType, {
      ...eventConfig,
      ...eventData
    });
  }

  // Monitor Core Web Vitals
  monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.trackEvent('core_web_vital', {
            metric_name: 'LCP',
            metric_value: lastEntry.startTime,
            metric_rating: this.getRating(lastEntry.startTime, [2500, 4000])
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP monitoring failed:', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.trackEvent('core_web_vital', {
              metric_name: 'FID',
              metric_value: entry.processingStart - entry.startTime,
              metric_rating: this.getRating(entry.processingStart - entry.startTime, [100, 300])
            });
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID monitoring failed:', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.trackEvent('core_web_vital', {
            metric_name: 'CLS',
            metric_value: clsValue,
            metric_rating: this.getRating(clsValue, [0.1, 0.25])
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS monitoring failed:', error);
      }
    }
  }

  // Get performance rating
  getRating(value, thresholds) {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  }

  // Monitor resource loading performance
  monitorResourceLoading() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.trackEvent('page_load_performance', {
          dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connect: navigation.connectEnd - navigation.connectStart,
          server_response: navigation.responseStart - navigation.requestStart,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          page_load_complete: navigation.loadEventEnd - navigation.loadEventStart,
          total_load_time: navigation.loadEventEnd - navigation.navigationStart
        });
      }, 0);
    });
  }

  // Monitor JavaScript errors
  monitorErrors() {
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_line: event.lineno,
        error_column: event.colno,
        error_stack: event.error?.stack,
        user_agent: navigator.userAgent
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', {
        error_reason: event.reason?.toString(),
        error_stack: event.reason?.stack,
        user_agent: navigator.userAgent
      });
    });
  }

  // Monitor user interactions
  monitorInteractions() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      
      if (['button', 'a', 'input'].includes(tagName)) {
        this.trackEvent('element_click', {
          element_type: tagName,
          element_id: target.id,
          element_class: target.className,
          element_text: target.textContent?.slice(0, 100),
          page_path: window.location.pathname
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      this.trackEvent('form_submission', {
        form_id: form.id,
        form_class: form.className,
        form_action: form.action,
        form_method: form.method,
        page_path: window.location.pathname
      });
    });
  }

  // Send custom events to analytics endpoint
  sendCustomEvent(eventName, eventData) {
    if (!isProduction()) {
      console.log('Analytics Event:', eventName, eventData);
      return;
    }

    // Send to custom analytics endpoint
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventName,
        event_data: eventData,
        timestamp: Date.now()
      })
    }).catch(error => {
      console.error('Failed to send custom analytics event:', error);
    });
  }

  // A/B Testing utilities
  getVariant(testName, variants = ['control', 'variant']) {
    const userId = this.getUserId();
    const hash = this.hashCode(userId + testName);
    const variantIndex = Math.abs(hash) % variants.length;
    const variant = variants[variantIndex];
    
    // Track A/B test exposure
    this.trackEvent('ab_test_exposure', {
      test_name: testName,
      variant: variant,
      user_id: userId
    });
    
    return variant;
  }

  // Simple hash function for A/B testing
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Track conversion events
  trackConversion(conversionType, conversionValue = 0) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      conversion_value: conversionValue,
      session_id: this.sessionId,
      timestamp: Date.now()
    });
  }

  // Clean up on page unload
  cleanup() {
    // Track session end
    this.trackEvent('session_end', {
      session_id: this.sessionId,
      session_duration: Date.now() - this.pageViewStartTime,
      timestamp: Date.now()
    });
  }
}

// Create global analytics instance
const analytics = new Analytics();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  analytics.cleanup();
});

export default analytics;