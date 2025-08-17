// Environment configuration for different deployment stages
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5001/api',
    APP_URL: 'http://localhost:4028',
    ENABLE_LOGGING: true,
    ENABLE_REDUX_DEVTOOLS: true,
    ENABLE_SERVICE_WORKER: false,
    SENTRY_DSN: null,
    GOOGLE_ANALYTICS_ID: null,
    STRIPE_PUBLISHABLE_KEY: null,
    ENVIRONMENT: 'development'
  },
  
  staging: {
    API_BASE_URL: import.meta.env?.VITE_API_URL || '/api',
    APP_URL: 'https://staging.fundnest.com',
    ENABLE_LOGGING: true,
    ENABLE_REDUX_DEVTOOLS: false,
    ENABLE_SERVICE_WORKER: true,
    SENTRY_DSN: import.meta.env?.VITE_SENTRY_DSN_STAGING || null,
    GOOGLE_ANALYTICS_ID: import.meta.env?.VITE_GA_STAGING || null,
    STRIPE_PUBLISHABLE_KEY: import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY_STAGING || null,
    ENVIRONMENT: 'staging'
  },
  
  production: {
    API_BASE_URL: import.meta.env?.VITE_API_URL || '/api',
    APP_URL: 'https://fundnest.com',
    ENABLE_LOGGING: false,
    ENABLE_REDUX_DEVTOOLS: false,
    ENABLE_SERVICE_WORKER: true,
    SENTRY_DSN: import.meta.env?.VITE_SENTRY_DSN || null,
    GOOGLE_ANALYTICS_ID: import.meta.env?.VITE_GA_ID || null,
    STRIPE_PUBLISHABLE_KEY: import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || null,
    ENVIRONMENT: 'production'
  }
};

// Get current environment
const getCurrentEnvironment = () => {
  if (import.meta.env?.VITE_ENVIRONMENT) {
    return import.meta.env.VITE_ENVIRONMENT;
  }
  
  if (import.meta.env?.MODE === 'production') {
    return 'production';
  }
  
  return 'development';
};

const currentEnv = getCurrentEnvironment();
const environmentConfig = config[currentEnv] || config.development;

// Validation for production environment
if (currentEnv === 'production') {
  const requiredEnvVars = [
    'VITE_SENTRY_DSN',
    'VITE_GA_ID',
    'VITE_STRIPE_PUBLISHABLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env?.[varName]);
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables for production: ${missingVars.join(', ')}`);
  }
}

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: environmentConfig.GOOGLE_ANALYTICS_ID !== null,
  ENABLE_ERROR_TRACKING: environmentConfig.SENTRY_DSN !== null,
  ENABLE_PAYMENTS: environmentConfig.STRIPE_PUBLISHABLE_KEY !== null,
  ENABLE_PWA: environmentConfig.ENABLE_SERVICE_WORKER,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REAL_TIME: true,
  ENABLE_ADVANCED_MATCHING: true,
  ENABLE_VIDEO_CALLS: currentEnv !== 'development',
  ENABLE_DOCUMENT_UPLOAD: true,
  ENABLE_KYC: currentEnv !== 'development'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${environmentConfig.API_BASE_URL}/auth/login`,
    REGISTER: `${environmentConfig.API_BASE_URL}/auth/register`,
    LOGOUT: `${environmentConfig.API_BASE_URL}/auth/logout`,
    REFRESH: `${environmentConfig.API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${environmentConfig.API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${environmentConfig.API_BASE_URL}/auth/reset-password`,
    VERIFY_EMAIL: `${environmentConfig.API_BASE_URL}/auth/verify-email`
  },
  USERS: {
    PROFILE: `${environmentConfig.API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${environmentConfig.API_BASE_URL}/users/profile`,
    UPLOAD_AVATAR: `${environmentConfig.API_BASE_URL}/users/avatar`,
    DELETE_ACCOUNT: `${environmentConfig.API_BASE_URL}/users/delete`
  },
  STARTUPS: {
    LIST: `${environmentConfig.API_BASE_URL}/startups`,
    DETAILS: (id) => `${environmentConfig.API_BASE_URL}/startups/${id}`,
    CREATE: `${environmentConfig.API_BASE_URL}/startups`,
    UPDATE: (id) => `${environmentConfig.API_BASE_URL}/startups/${id}`,
    DELETE: (id) => `${environmentConfig.API_BASE_URL}/startups/${id}`
  },
  INVESTORS: {
    LIST: `${environmentConfig.API_BASE_URL}/investors`,
    DETAILS: (id) => `${environmentConfig.API_BASE_URL}/investors/${id}`,
    CREATE: `${environmentConfig.API_BASE_URL}/investors`,
    UPDATE: (id) => `${environmentConfig.API_BASE_URL}/investors/${id}`,
    DELETE: (id) => `${environmentConfig.API_BASE_URL}/investors/${id}`
  },
  MATCHING: {
    RECOMMENDATIONS: `${environmentConfig.API_BASE_URL}/matching/recommendations`,
    COMPATIBILITY: `${environmentConfig.API_BASE_URL}/matching/compatibility`
  },
  STATS: {
    DASHBOARD: `${environmentConfig.API_BASE_URL}/stats/dashboard`
  }
};

// Export configuration
export default environmentConfig;

// Helper functions
export const isDevelopment = () => currentEnv === 'development';
export const isProduction = () => currentEnv === 'production';
export const isStaging = () => currentEnv === 'staging';

export const log = (...args) => {
  if (environmentConfig.ENABLE_LOGGING) {
    console.log(...args);
  }
};

export const logError = (...args) => {
  if (environmentConfig.ENABLE_LOGGING) {
    console.error(...args);
  }
};

export const logWarn = (...args) => {
  if (environmentConfig.ENABLE_LOGGING) {
    console.warn(...args);
  }
};
