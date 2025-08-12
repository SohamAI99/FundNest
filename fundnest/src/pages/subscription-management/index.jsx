import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/ui/AppHeader';
import PlanComparisonCard from './components/PlanComparisonCard';
import BillingHistoryTab from './components/BillingHistoryTab';
import UsageTrackingCard from './components/UsageTrackingCard';
import TestimonialsSection from './components/TestimonialsSection';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';


const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock current user data
  const { user } = useAuth();
  const currentUser = user || {
    id: 'unknown',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'startup',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    kycStatus: 'verified',
    subscriptionTier: 'free', // free, pro
    subscriptionId: null,
    billingDate: null,
    paymentMethod: null
  };

  // Mock subscription data
  const [subscriptionData, setSubscriptionData] = useState({
    currentPlan: 'free',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: null,
    subscriptionId: null,
    paymentMethod: null,
    usage: {
      messagesSent: 8,
      messagesLimit: 10,
      connectionsUsed: 12,
      connectionsLimit: 15,
      profileViewsUsed: 47,
      profileViewsLimit: 50,
      pitchViewsUsed: 3,
      pitchViewsLimit: 5
    },
    billingHistory: [
      // Will be empty for free users
    ]
  });

  // Subscription plans configuration
  const subscriptionPlans = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started with basic features',
      popular: false,
      features: [
        '10 messages per month',
        '15 connection requests',
        '50 profile views',
        '5 pitch deck views',
        'Basic matching algorithm',
        'Standard support',
        'Profile creation and editing',
        'Basic search and filters'
      ],
      limitations: [
        'Limited messaging',
        'Basic matching only',
        'No priority support',
        'No analytics dashboard',
        'No advanced filters'
      ]
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 29,
      yearlyPrice: 290,
      description: 'Advanced features for serious entrepreneurs and investors',
      popular: true,
      features: [
        'Unlimited messages',
        'Unlimited connections',
        'Unlimited profile views',
        'Unlimited pitch deck access',
        'AI-powered matching',
        'Priority support',
        'Analytics dashboard',
        'Advanced search filters',
        'Document sharing',
        'Video call scheduling',
        'Profile verification badge',
        'Early access to features'
      ],
      limitations: []
    }
  };

  // Mock billing history for pro users
  const mockBillingHistory = [
    {
      id: 'inv_001',
      date: '2024-12-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - Monthly Subscription',
      paymentMethod: 'Visa •••• 4242',
      downloadUrl: '/invoices/inv_001.pdf'
    },
    {
      id: 'inv_002',
      date: '2024-11-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - Monthly Subscription',
      paymentMethod: 'Visa •••• 4242',
      downloadUrl: '/invoices/inv_002.pdf'
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Michael Rodriguez',
      role: 'Investor',
      company: 'Tech Ventures Capital',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'The Pro plan analytics helped me identify 3x more qualified startups. The ROI is incredible.',
      rating: 5
    },
    {
      id: 2,
      name: 'Emma Thompson',
      role: 'Startup Founder',
      company: 'GreenTech Solutions',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Unlimited messaging allowed us to connect with 50+ investors. We closed our Series A in 3 months.',
      rating: 5
    },
    {
      id: 3,
      name: 'David Kim',
      role: 'Angel Investor',
      company: 'Independent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Priority support saved me hours of time. The advanced filters help me find exactly what I\'m looking for.',
      rating: 5
    }
  ];

  const tabs = [
    {
      id: 'plans',
      name: 'Subscription Plans',
      icon: 'CreditCard',
      description: 'Compare and upgrade your subscription plan'
    },
    {
      id: 'billing',
      name: 'Billing & Usage',
      icon: 'Receipt',
      description: 'View billing history and track feature usage'
    },
    {
      id: 'testimonials',
      name: 'Success Stories',
      icon: 'Star',
      description: 'See how Pro users are succeeding on our platform'
    }
  ];

  const handlePlanUpgrade = (planId) => {
    setSelectedPlan(subscriptionPlans?.[planId]);
    setShowUpgradeModal(true);
  };

  const handleProcessUpgrade = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update subscription data
      setSubscriptionData(prev => ({
        ...prev,
        currentPlan: selectedPlan?.id,
        status: 'active',
        billingCycle,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
        paymentMethod: paymentData?.paymentMethod,
        billingHistory: currentUser?.subscriptionTier === 'free' ? mockBillingHistory : prev?.billingHistory
      }));
      
      console.log('Subscription upgraded successfully');
      setShowUpgradeModal(false);
      setActiveTab('billing');
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubscriptionData(prev => ({
        ...prev,
        currentPlan: 'free',
        status: 'cancelled',
        nextBillingDate: null,
        paymentMethod: null
      }));
      
      console.log('Subscription cancelled');
    } catch (error) {
      console.error('Cancellation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentPlanPrice = () => {
    const plan = subscriptionPlans?.[subscriptionData?.currentPlan];
    if (!plan || plan?.id === 'free') return 0;
    
    return billingCycle === 'yearly' ? plan?.yearlyPrice : plan?.price;
  };

  const getYearlySavings = () => {
    const monthlyTotal = subscriptionPlans?.pro?.price * 12;
    const yearlyPrice = subscriptionPlans?.pro?.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plans':
        return (
          <div className="space-y-8">
            {/* Billing Toggle */}
            <div className="text-center">
              <div className="inline-flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    billingCycle === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                    billingCycle === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yearly
                  <span className="ml-2 px-2 py-0.5 bg-success text-success-foreground text-xs rounded-full">
                    Save ${getYearlySavings()}
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object?.values(subscriptionPlans)?.map((plan) => (
                <PlanComparisonCard
                  key={plan?.id}
                  plan={plan}
                  billingCycle={billingCycle}
                  currentPlan={subscriptionData?.currentPlan}
                  onUpgrade={handlePlanUpgrade}
                />
              ))}
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-8">
            {/* Current Subscription Status */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Current Subscription</h3>
                  <div className="space-y-1">
                    <p className="text-foreground">
                      <span className="font-medium">Plan:</span> {subscriptionPlans?.[subscriptionData?.currentPlan]?.name}
                      {subscriptionData?.currentPlan === 'pro' && (
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {subscriptionData?.billingCycle?.charAt(0)?.toUpperCase() + subscriptionData?.billingCycle?.slice(1)}
                        </span>
                      )}
                    </p>
                    {subscriptionData?.nextBillingDate && (
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(subscriptionData?.nextBillingDate)?.toLocaleDateString()}
                      </p>
                    )}
                    {subscriptionData?.paymentMethod && (
                      <p className="text-sm text-muted-foreground">
                        Payment method: {subscriptionData?.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ${getCurrentPlanPrice()}
                      {subscriptionData?.currentPlan !== 'free' && (
                        <span className="text-sm text-muted-foreground font-normal">
                          /{subscriptionData?.billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscriptionData?.status?.charAt(0)?.toUpperCase() + subscriptionData?.status?.slice(1)}
                    </p>
                  </div>
                  
                  {subscriptionData?.currentPlan === 'free' ? (
                    <Button
                      onClick={() => handlePlanUpgrade('pro')}
                      iconName="ArrowUp"
                    >
                      Upgrade
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      loading={isProcessing}
                      iconName="X"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {/* Usage Tracking */}
            <UsageTrackingCard
              usage={subscriptionData?.usage}
              currentPlan={subscriptionData?.currentPlan}
              onUpgrade={() => handlePlanUpgrade('pro')}
            />
            {/* Billing History */}
            <BillingHistoryTab
              billingHistory={subscriptionData?.currentPlan === 'pro' ? mockBillingHistory : []}
              currentPlan={subscriptionData?.currentPlan}
            />
          </div>
        );
      case 'testimonials':
        return <TestimonialsSection testimonials={testimonials} />;
      default:
        return null;
    }
  };

  const UpgradeModal = () => (
    showUpgradeModal && selectedPlan && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-card border border-border rounded-lg max-w-md w-full animate-fadeIn">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">
              Upgrade to {selectedPlan?.name}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpgradeModal(false)}
              iconName="X"
            />
          </div>
          
          <div className="p-6 space-y-6">
            {/* Plan Summary */}
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                ₹{billingCycle === 'yearly' ? selectedPlan?.yearlyPrice : selectedPlan?.price}
                <span className="text-sm text-muted-foreground font-normal">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-success">
                  Save ${getYearlySavings()} per year
                </p>
              )}
            </div>

            {/* Mock Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg bg-muted/30">
                    <input type="radio" id="card" name="payment" defaultChecked />
                    <Icon name="CreditCard" size={16} />
                    <label htmlFor="card" className="text-sm">Credit/Debit Card</label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                    <input type="radio" id="paypal" name="payment" />
                    <Icon name="Wallet" size={16} />
                    <label htmlFor="paypal" className="text-sm">PayPal</label>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground text-center">
                  In a real application, this would show Stripe payment form
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleProcessUpgrade({ paymentMethod: 'Visa •••• 4242' })}
                loading={isProcessing}
                className="flex-1"
                iconName="CreditCard"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={currentUser} 
        notifications={2}
        onNavigate={navigate}
      />
      
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
                <p className="text-muted-foreground">
                  Manage your subscription, billing, and unlock premium features
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-muted/30 rounded-lg p-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-smooth
                    flex-1 justify-center focus-ring
                    ${activeTab === tab?.id
                      ? 'bg-card text-foreground border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal />
    </div>
  );
};

export default SubscriptionManagement;