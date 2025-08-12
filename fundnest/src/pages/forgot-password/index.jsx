import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppHeader from '../../components/ui/AppHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setMessage({ 
          type: 'success', 
          text: 'Password reset instructions have been sent to your email address.' 
        });
        
        // For demo purposes, show the reset link
        if (data.resetLink) {
          setTimeout(() => {
            setMessage({ 
              type: 'info', 
              text: `Demo Reset Link: ${data.resetLink}` 
            });
          }, 2000);
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - FundNest</title>
        <meta name="description" content="Reset your FundNest account password. Enter your email to receive password reset instructions." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AppHeader />
        
        <main className="pt-16">
          <div className="min-h-screen flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-md">
              <div className="bg-card border border-border rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Lock" size={24} color="white" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-muted-foreground">
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full"
                        required
                      />
                    </div>

                    {message.text && (
                      <div className={`p-4 rounded-lg text-sm ${
                        message.type === 'error' 
                          ? 'bg-error/10 text-error border border-error/20' 
                          : message.type === 'success'
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-info/10 text-info border border-info/20'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <Icon name="CheckCircle" size={24} className="text-success" />
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Check your email
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        We've sent password reset instructions to your email address.
                      </p>
                    </div>

                    {message.text && (
                      <div className={`p-4 rounded-lg text-sm text-left ${
                        message.type === 'info'
                          ? 'bg-info/10 text-info border border-info/20'
                          : 'bg-success/10 text-success border border-success/20'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                        setMessage({ type: '', text: '' });
                      }}
                      className="w-full"
                    >
                      Send to different email
                    </Button>
                  </div>
                )}

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

export default ForgotPassword;