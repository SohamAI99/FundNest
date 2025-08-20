import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const userObj = JSON.parse(userData);
        // Ensure name field exists
        if (!userObj.name && userObj.firstName && userObj.lastName) {
          userObj.name = `${userObj.firstName} ${userObj.lastName}`;
        }
        setUser(userObj);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { token, user: userData } = response;
        
        // Add computed name field for easier usage
        const userWithName = {
          ...userData,
          name: `${userData.firstName} ${userData.lastName}`
        };
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithName));
        
        // Update state
        setUser(userWithName);
        setIsAuthenticated(true);
        
        return { success: true, user: userWithName, redirectTo: getDashboardRoute(userWithName) };
      } else {
        return { success: false, message: response.message || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios with specific messages
      if (!error.response) {
        // Network error - no response from server
        return { 
          success: false, 
          message: 'Unable to connect to the server. Please check your internet connection and try again.'
        };
      }
      
      if (error.response?.status === 401) {
        // Unauthorized - invalid credentials
        return { 
          success: false, 
          message: 'Invalid email or password. Please check your credentials and try again.'
        };
      }
      
      if (error.response?.status === 400) {
        // Bad request - validation error
        return { 
          success: false, 
          message: error.response?.data?.message || 'Invalid request. Please check your input and try again.'
        };
      }
      
      if (error.response?.status === 429) {
        // Too many requests - rate limited
        return { 
          success: false, 
          message: 'Too many login attempts. Please wait a few minutes and try again.'
        };
      }
      
      // Default error message
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { token, user: newUser } = response;
        
        // Add computed name field for easier usage
        const userWithName = {
          ...newUser,
          name: `${newUser.firstName} ${newUser.lastName}`
        };
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithName));
        
        // Update state
        setUser(userWithName);
        setIsAuthenticated(true);
        
        return { success: true, user: userWithName, redirectTo: getDashboardRoute(userWithName) };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Handle network errors specifically
      if (!error.response) {
        return { 
          success: false, 
          message: 'Network error. Please check your connection and try again.'
        };
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Helper function to get dashboard route based on user role
  const getDashboardRoute = (user) => {
    switch (user?.role) {
      case 'startup':
        return '/startup-dashboard';
      case 'investor':
        return '/investor-dashboard';
      default:
        return '/';
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
