import { isProduction } from '../config/environment';

// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React in development
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://js.stripe.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://images.unsplash.com',
    'https://www.google-analytics.com'
  ],
  'connect-src': [
    "'self'",
    'https://api.fundnest.com',
    'https://api-staging.fundnest.com',
    'http://localhost:5000', // Development API
    'https://www.google-analytics.com',
    'https://api.stripe.com'
  ],
  'frame-src': [
    "'self'",
    'https://js.stripe.com'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"]
};

// Generate CSP string
export const generateCSP = () => {
  return Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Input sanitization utilities
export const sanitizeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export const sanitizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
};

export const sanitizeEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email.toLowerCase().trim() : null;
};

export const sanitizePhoneNumber = (phone) => {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Basic validation for international format
  return /^\+?[\d\s-()]{10,15}$/.test(phone) ? cleaned : null;
};

// XSS Protection utilities
export const escapeHtml = (str) => {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, (match) => escapeMap[match]);
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    common: !isCommonPassword(password)
  };
  
  const score = Object.values(checks).reduce((acc, check) => acc + (check ? 1 : 0), 0);
  
  return {
    score,
    checks,
    strength: getStrengthLevel(score),
    valid: score >= 4 // Minimum 4 out of 6 checks
  };
};

const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'dragon', 'princess', 'hello', 'freedom'
  ];
  return commonPasswords.includes(password.toLowerCase());
};

const getStrengthLevel = (score) => {
  if (score <= 2) return 'weak';
  if (score <= 3) return 'fair';
  if (score <= 4) return 'good';
  if (score <= 5) return 'strong';
  return 'very-strong';
};

// Token management utilities
export const secureStorage = {
  set: (key, value, expirationMinutes = 60) => {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expirationMinutes * 60 * 1000
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  },
  
  get: (key) => {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (!item) return null;
      
      const now = Date.now();
      if (now - item.timestamp > item.expiration) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return null;
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};

// CSRF Protection
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting utilities (client-side tracking)
const rateLimitStore = new Map();

export const checkRateLimit = (key, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return {
      allowed: false,
      resetTime: Math.min(...validRequests) + windowMs
    };
  }
  
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  
  return {
    allowed: true,
    remaining: maxRequests - validRequests.length
  };
};

// File upload security
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options;
  
  const errors = [];
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
  }
  
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    errors.push('File extension not allowed');
  }
  
  // Check for null bytes (potential security risk)
  if (file.name.includes('\0')) {
    errors.push('Invalid file name');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Secure random string generation
export const generateSecureToken = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, byte => charset[byte % charset.length]).join('');
};

// Environment-specific security measures
export const applySecurityMeasures = () => {
  if (!isProduction()) {
    console.warn('Running in development mode - some security features are disabled');
    return;
  }
  
  // Disable right-click context menu in production
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Disable text selection on sensitive elements
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.style.msUserSelect = 'none';
  
  // Disable drag and drop
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => e.preventDefault());
  
  // Clear sensitive data on page unload
  window.addEventListener('beforeunload', () => {
    // Clear any sensitive data from memory
    if (window.sensitiveData) {
      window.sensitiveData = null;
    }
  });
  
  // Detect developer tools
  let devtools = { open: false };
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      if (!devtools.open) {
        devtools.open = true;
        console.warn('Developer tools detected');
        // Optionally redirect or show warning
      }
    } else {
      devtools.open = false;
    }
  }, 1000);
};

// Encrypt sensitive data before storing
export const encryptData = (data, key) => {
  // Simple XOR encryption for demo purposes
  // In production, use proper encryption libraries like crypto-js
  const encrypted = [];
  for (let i = 0; i < data.length; i++) {
    encrypted.push(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(String.fromCharCode.apply(null, encrypted));
};

export const decryptData = (encryptedData, key) => {
  try {
    const encrypted = atob(encryptedData);
    const decrypted = [];
    for (let i = 0; i < encrypted.length; i++) {
      decrypted.push(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return String.fromCharCode.apply(null, decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

export default {
  sanitizeHtml,
  sanitizeUrl,
  sanitizeEmail,
  escapeHtml,
  validatePasswordStrength,
  secureStorage,
  generateCSRFToken,
  checkRateLimit,
  validateFileUpload,
  generateSecureToken,
  applySecurityMeasures,
  encryptData,
  decryptData,
  generateCSP
};