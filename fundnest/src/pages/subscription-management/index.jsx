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
import { subscriptionAPI } from '../../utils/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Current user data
  const { user, updateUser } = useAuth();
  const currentUser = user || {
    id: 'unknown',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'startup',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    kycStatus: 'verified',
    subscriptionTier: 'free',
    subscriptionId: null,
    billingDate: null,
    paymentMethod: null
  };

  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState({
    currentPlan: 'free',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: null,
    subscriptionId: null,
    paymentMethod: null,
    usage: {
      messagesSent: 0,
      messagesLimit: 10,
      connectionsUsed: 0,
      connectionsLimit: 15,
      profileViewsUsed: 0,
      profileViewsLimit: 50,
      pitchViewsUsed: 0,
      pitchViewsLimit: 5
    },
    billingHistory: []
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
      price: 999,
      yearlyPrice: 9999,
      description: 'Advanced features for serious founders and startup builders',
      popular: true,
      features: [
        'Unlimited messages',
        'Unlimited connections',
        'Unlimited profile views',
        'Unlimited pitch deck access',
        'AI-powered startup-investor matching',
        'Priority support',
        'Advanced analytics dashboard',
        'Advanced search and filters',
        'Document sharing & pitch hosting',
        'Profile verification badge'
      ],
      limitations: [
        'No scheduled video calling'
      ]
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 2999,
      yearlyPrice: 29999,
      description: 'Full-suite deal sourcing and communication platform for VC funds & active angels',
      popular: false,
      features: [
        'Everything in Pro plan',
        'Scheduled built-in video calls',
        'Dedicated account manager',
        'Early access to new features',
        'Custom analytics exports',
        'Multiple team member seats',
        'Direct connection introductions'
      ],
      limitations: []
    }
  };

  const fetchSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      const response = await subscriptionAPI.getStatus();
      if (response.success) {
        setSubscriptionData({
          currentPlan: response.subscription.plan || 'free',
          status: response.subscription.status || 'active',
          billingCycle: response.subscription.activeSubscription?.billingCycle || 'monthly',
          nextBillingDate: response.subscription.activeSubscription?.expiresAt || null,
          subscriptionId: response.subscription.activeSubscription?.id || null,
          paymentMethod: response.subscription.activeSubscription ? 'Card' : null,
          usage: calculateUsage(response.subscription.plan || 'free'),
          billingHistory: response.billingHistory || []
        });

        if (user && user.subscriptionPlan !== response.subscription.plan) {
          updateUser({ subscriptionPlan: response.subscription.plan });
        }
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUsage = (plan) => {
    const isPro = plan === 'pro';
    const isEnterprise = plan === 'enterprise';
    
    return {
      messagesSent: isPro || isEnterprise ? 34 : 4,
      messagesLimit: isPro || isEnterprise ? -1 : 10,
      connectionsUsed: isPro || isEnterprise ? 45 : 7,
      connectionsLimit: isPro || isEnterprise ? -1 : 15,
      profileViewsUsed: isPro || isEnterprise ? 189 : 23,
      profileViewsLimit: isPro || isEnterprise ? -1 : 50,
      pitchViewsUsed: isPro || isEnterprise ? 12 : 2,
      pitchViewsLimit: isPro || isEnterprise ? -1 : 5
    };
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

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
      description: 'See how premium users are succeeding on our platform'
    }
  ];

  const handlePlanUpgrade = (planId) => {
    setSelectedPlan(subscriptionPlans[planId]);
    setShowUpgradeModal(true);
  };

  const handleProcessUpgrade = async () => {
    setIsProcessing(true);
    try {
      const orderResponse = await subscriptionAPI.createOrder(selectedPlan.id, billingCycle);
      if (!orderResponse.success) {
        alert(orderResponse.message || 'Failed to create subscription order');
        setIsProcessing(false);
        return;
      }

      const { order, keyId, isSimulation } = orderResponse;

      if (isSimulation) {
        console.log('Running simulated payment...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const verifyData = {
          orderId: order.id,
          paymentId: `pay_sim_${Math.random().toString(36).substr(2, 9)}`,
          signature: `sig_sim_${Math.random().toString(36).substr(2, 9)}`,
          plan: order.plan,
          billingCycle: order.billingCycle,
          isSimulation: true
        };

        const verifyResponse = await subscriptionAPI.verifyPayment(verifyData);
        if (verifyResponse.success) {
          setShowUpgradeModal(false);
          await fetchSubscriptionStatus();
          setActiveTab('billing');
        } else {
          alert(verifyResponse.message || 'Simulated verification failed');
        }
      } else {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          alert('Failed to load Razorpay SDK. Please check your internet connection.');
          setIsProcessing(false);
          return;
        }

        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "FundNest",
          description: `${order.planName} Plan - ${order.billingCycle === 'yearly' ? 'Annual' : 'Monthly'} Subscription`,
          order_id: order.id,
          handler: async function (response) {
            try {
              setIsProcessing(true);
              const verifyData = {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                plan: order.plan,
                billingCycle: order.billingCycle,
                isSimulation: false
              };

              const verifyResponse = await subscriptionAPI.verifyPayment(verifyData);
              if (verifyResponse.success) {
                setShowUpgradeModal(false);
                await fetchSubscriptionStatus();
                setActiveTab('billing');
              } else {
                alert(verifyResponse.message || 'Payment verification failed');
              }
            } catch (err) {
              console.error('Verification error:', err);
              alert('Error verifying payment.');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: currentUser.name,
            email: currentUser.email
          },
          theme: {
            color: "#6366f1"
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Upgrade processing error:', error);
      alert(error.response?.data?.message || 'Error processing upgrade');
    } finally {
      setIsProcessing(false);
    }
  };

  const getYearlySavings = () => {
    return 5989; // Maximum annual savings (for Enterprise)
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
                    Save up to ₹{getYearlySavings()}
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Object.values(subscriptionPlans).map((plan) => (
                <PlanComparisonCard
                  key={plan.id}
                  plan={plan}
                  billingCycle={billingCycle}
                  currentPlan={subscriptionData.currentPlan}
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
                      <span className="font-medium">Plan:</span> {subscriptionPlans[subscriptionData.currentPlan]?.name}
                      {subscriptionData.currentPlan !== 'free' && (
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {subscriptionData.billingCycle.charAt(0).toUpperCase() + subscriptionData.billingCycle.slice(1)}
                        </span>
                      )}
                    </p>
                    {subscriptionData.nextBillingDate && (
                      <p className="text-sm text-muted-foreground">
                        Next billing: {new Date(subscriptionData.nextBillingDate).toLocaleDateString()}
                      </p>
                    )}
                    {subscriptionData.paymentMethod && (
                      <p className="text-sm text-muted-foreground">
                        Payment method: {subscriptionData.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ₹{getCurrentPlanPrice()}
                      {subscriptionData.currentPlan !== 'free' && (
                        <span className="text-sm text-muted-foreground font-normal">
                          /{subscriptionData.billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium capitalize">
                      Status: {subscriptionData.status}
                    </p>
                  </div>
                  
                  {subscriptionData.currentPlan === 'free' ? (
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
              usage={subscriptionData.usage}
              currentPlan={subscriptionData.currentPlan}
              onUpgrade={() => handlePlanUpgrade('pro')}
            />
            {/* Billing History */}
            <BillingHistoryTab
              billingHistory={subscriptionData.billingHistory}
              currentPlan={subscriptionData.currentPlan}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
        <div className="relative bg-card border border-border rounded-lg max-w-md w-full animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">
              Upgrade to {selectedPlan.name}
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
            <div className="text-center bg-primary/5 rounded-xl p-6 border border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Total Amount Payable</p>
              <p className="text-4xl font-bold text-foreground">
                ₹{billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.price}
                <span className="text-sm text-muted-foreground font-normal">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-success font-medium mt-2">
                  Includes annual savings discount
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 border border-border rounded-lg">
                <Icon name="Shield" size={20} className="text-success" />
                <span className="text-xs text-muted-foreground">
                  Secured payment processed via Razorpay gateway. Encrypted with 256-bit SSL.
                </span>
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
                onClick={handleProcessUpgrade}
                loading={isProcessing}
                className="flex-1"
                iconName="CreditCard"
              >
                Pay with Razorpay
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-smooth
                    flex-1 justify-center focus-ring
                    ${activeTab === tab.id
                      ? 'bg-card text-foreground border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground text-sm">Loading subscription details...</p>
            </div>
          ) : (
            <div>
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal />
    </div>
  );
};

export default SubscriptionManagement;