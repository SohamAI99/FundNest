import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppHeader from '../../components/ui/AppHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
      setMessage({ 
        type: 'error', 
        text: 'Invalid or missing reset token. Please request a new password reset.' 
      });
    }
  }, [searchParams]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setMessage({ type: 'error', text: passwordError });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password has been reset successfully! Redirecting to login...' 
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 1) return { label: 'Weak', color: 'text-error' };
    if (strength <= 2) return { label: 'Fair', color: 'text-warning' };
    if (strength <= 3) return { label: 'Good', color: 'text-info' };
    if (strength <= 4) return { label: 'Strong', color: 'text-success' };
    return { label: 'Very Strong', color: 'text-success' };
  };

  if (isValidToken === false) {
    return (
      <>
        <Helmet>
          <title>Invalid Reset Link - FundNest</title>
        </Helmet>

        <div className="min-h-screen bg-background">
          <AppHeader />
          
          <main className="pt-16">
            <div className="min-h-screen flex items-center justify-center py-12 px-6">
              <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="AlertCircle" size={24} className="text-error" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Invalid Reset Link
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    This password reset link is invalid or has expired.
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => navigate('/forgot-password')}
                      className="w-full"
                    >
                      Request New Reset Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - FundNest</title>
        <meta name="description" content="Create a new password for your FundNest account." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AppHeader />
        
        <main className="pt-16">
          <div className="min-h-screen flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-md">
              <div className="bg-card border border-border rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Key" size={24} color="white" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground">
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="password"
                      name="password"
                      placeholder="New password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full"
                      required
                    />
                    
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Password strength:</span>
                          <span className={`text-sm font-medium ${getStrengthLabel(getPasswordStrength(formData.password)).color}`}>
                            {getStrengthLabel(getPasswordStrength(formData.password)).label}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                level <= getPasswordStrength(formData.password)
                                  ? level <= 2 ? 'bg-error' : level <= 3 ? 'bg-warning' : 'bg-success'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full"
                      required
                    />
                  </div>

                  {message.text && (
                    <div className={`p-4 rounded-lg text-sm ${
                      message.type === 'error' 
                        ? 'bg-error/10 text-error border border-error/20' 
                        : 'bg-success/10 text-success border border-success/20'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={isLoading || message.type === 'success'}
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating Password...</span>
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="text-sm"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back to login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ResetPassword;