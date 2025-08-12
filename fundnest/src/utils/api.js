import axios from 'axios';
import config, { log, logError, FEATURES } from '../config/environment';

// API Base URL
const API_BASE_URL = config.API_BASE_URL;

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful response
    log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error response
    logError(`API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject({
        response: {
          data: {
            message: 'Request timeout. Please check your connection and try again.'
          }
        }
      });
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message: 'Network error. Please check your connection and try again.'
          }
        }
      });
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login with current page as redirect target
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
      return Promise.reject(error);
    }
    
    // Handle rate limiting with retry
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      const retryAfter = error.response.headers['retry-after'] || 5;
      
      log(`Rate limited. Retrying after ${retryAfter} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      
      return api(originalRequest);
    }
    
    // Handle network errors with exponential backoff retry
    if (!error.response && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }
    
    if (!error.response && originalRequest._retryCount < 3) {
      originalRequest._retryCount++;
      const backoffDelay = Math.pow(2, originalRequest._retryCount) * 1000;
      
      log(`Network error. Retrying in ${backoffDelay}ms... (Attempt ${originalRequest._retryCount}/3)`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      return api(originalRequest);
    }
    
    // Track errors in production
    if (FEATURES.ENABLE_ERROR_TRACKING && error.response?.status >= 500) {
      // Integration with error tracking service
      // Sentry.captureException(error, { 
      //   tags: { 
      //     api_endpoint: originalRequest?.url,
      //     http_status: error.response?.status 
      //   } 
      // });
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

// Startup API calls
export const startupAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/startups', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/startups/${id}`);
    return response.data;
  },
};

// Investor API calls
export const investorAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/investors', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/investors/${id}`);
    return response.data;
  },
};

// Matching API calls
export const matchingAPI = {
  getMatches: async (params = {}) => {
    const response = await api.get('/matching', { params });
    return response.data;
  },
};

// Newsletter API calls
export const newsletterAPI = {
  subscribe: async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/newsletter/stats');
    return response.data;
  },
};

// Statistics API calls
export const statsAPI = {
  getPlatformStats: async () => {
    const response = await api.get('/stats/platform-stats');
    return response.data;
  },

  getDashboardStats: async (userId) => {
    const response = await api.get(`/stats/dashboard-stats/${userId}`);
    return response.data;
  },

  getActivityFeed: async (userId, limit = 10) => {
    const response = await api.get(`/stats/activity-feed/${userId}?limit=${limit}`);
    return response.data;
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export default api;
