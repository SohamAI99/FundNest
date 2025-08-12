import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { newsletterAPI, handleApiError } from '../../../utils/api';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!email?.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await newsletterAPI.subscribe(email);
      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    if (error) setError('');
  };

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-card rounded-2xl p-8 md:p-12 border border-white/20"
          >
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={32} color="white" strokeWidth={2} />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Welcome to FundNest!
            </h3>
            
            <p className="text-lg text-white/90 mb-6">
              Thank you for subscribing! You'll receive the latest funding opportunities, 
              success stories, and platform updates directly in your inbox.
            </p>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsSubscribed(false)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Subscribe Another Email
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-6 md:p-8 border border-white/20 text-center"
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Stay Updated
            </h2>
            <p className="text-md md:text-lg text-white/90 max-w-xl mx-auto">
              Get the latest funding insights delivered to your inbox
            </p>
          </div>

          {/* Benefits - Simplified */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="TrendingUp" size={14} color="white" />
              </div>
              <span className="text-white/90 text-sm font-medium">Market Insights</span>
            </div>
            
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Zap" size={14} color="white" />
              </div>
              <span className="text-white/90 text-sm font-medium">Early Access</span>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={handleEmailChange}
                  error={error}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/50"
                  disabled={isSubmitting}
                />
              </div>
              
              <Button
                type="submit"
                variant="default"
                size="md"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="bg-white text-primary hover:bg-white/90 px-6"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>

          {/* Privacy Notice */}
          <p className="text-xs text-white/70 mt-4 max-w-sm mx-auto">
            Unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;