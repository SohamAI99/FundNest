import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/ui/AppHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import TestimonialSlider from './components/TestimonialSlider';
import PlatformBenefits from './components/PlatformBenefits';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const targetUrl = redirectTo || (user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      navigate(targetUrl, { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirectTo]);

  const handleLogin = async (credentials, rememberMe) => {
    setIsLoading(true);
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        const userData = result.user;
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Redirect to the originally requested page or dashboard
        let targetUrl = result.redirectTo || '/';
        if (redirectTo) {
          // Override with URL param if present  
          targetUrl = redirectTo;
        }
        
        navigate(targetUrl, { replace: true });
      } else {
        // Login failed, throw error to be caught by LoginForm
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw to be handled by LoginForm
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In - FundNest | Secure Access to Your Investment Platform</title>
        <meta name="description" content="Sign in to your FundNest account to access AI-powered startup-investor matching, real-time messaging, and comprehensive funding tools." />
        <meta name="keywords" content="login, sign in, startup funding, investor platform, secure access" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AppHeader />
        
        <main className="pt-16">
          <div className="min-h-screen flex items-center justify-center">
            {/* Centered Login Form - Right block removed as requested */}
            <div className="w-full max-w-md px-6 py-12">
              <div className="space-y-8">
                <LoginForm onLogin={handleLogin} isLoading={isLoading} />
                
                {/* Security Badges */}
                <div className="mt-8">
                  <SecurityBadges />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;