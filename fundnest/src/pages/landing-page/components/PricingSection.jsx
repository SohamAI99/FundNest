import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingSection = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      description: 'Perfect for exploring the platform and getting started.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      icon: 'Zap',
      gradient: 'from-slate-500 to-gray-600',
      features: [
        { text: '10 messages per month', included: true },
        { text: '15 connection requests', included: true },
        { text: '50 profile views', included: true },
        { text: 'Basic search & filters', included: true },
        { text: 'Profile creation', included: true },
        { text: 'AI-powered matching', included: false },
        { text: 'Analytics dashboard', included: false },
        { text: 'Priority support', included: false },
        { text: 'Video call scheduling', included: false },
        { text: 'Verified badge', included: false }
      ],
      cta: 'Get Started Free'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious founders and active investors ready to scale.',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      popular: true,
      icon: 'Rocket',
      gradient: 'from-blue-600 to-indigo-700',
      features: [
        { text: 'Unlimited messages', included: true },
        { text: 'Unlimited connections', included: true },
        { text: 'Unlimited profile views', included: true },
        { text: 'Advanced search & filters', included: true },
        { text: 'AI-powered matching', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Priority support', included: true },
        { text: 'Document sharing', included: true },
        { text: 'Verified badge', included: true },
        { text: 'Video call scheduling', included: false }
      ],
      cta: 'Start Pro Trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For VCs, accelerators, and large organizations.',
      monthlyPrice: 2999,
      yearlyPrice: 29999,
      popular: false,
      icon: 'Building2',
      gradient: 'from-purple-600 to-pink-700',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Unlimited everything', included: true },
        { text: 'Video call scheduling', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'White-label options', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'API access', included: true },
        { text: 'Custom analytics', included: true },
        { text: 'SLA guarantee', included: true }
      ],
      cta: 'Contact Sales'
    }
  ];

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return '₹0';
    const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlySavings = monthlyTotal - plan.yearlyPrice;
    return yearlySavings;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" id="pricing">
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-purple-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Choose Your Growth Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-muted rounded-xl p-1.5 shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-success text-white text-xs rounded-full font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular
                  ? 'border-primary bg-white shadow-xl scale-[1.02]'
                  : 'border-border bg-white shadow-md hover:border-primary/30'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-md`}>
                    <Icon name={plan.icon} size={22} color="white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-foreground">{getPrice(plan)}</span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-muted-foreground text-sm mb-1">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && getSavings(plan) && (
                    <p className="text-sm text-success font-medium mt-1">
                      Save ₹{getSavings(plan).toLocaleString('en-IN')}/year
                    </p>
                  )}
                  {plan.monthlyPrice === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Free forever</p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => navigate(plan.id === 'free' ? '/user-registration' : '/subscription-management')}
                  variant={plan.popular ? 'default' : 'outline'}
                  className={`w-full mb-8 py-3 font-semibold ${
                    plan.popular ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' : ''
                  }`}
                >
                  {plan.cta}
                </Button>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="Check" size={12} className="text-success" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon name="X" size={10} className="text-muted-foreground" strokeWidth={3} />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={18} className="text-success" />
            <span className="text-sm font-medium">256-bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="CreditCard" size={18} className="text-primary" />
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="RotateCcw" size={18} className="text-accent" />
            <span className="text-sm font-medium">Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="HeadphonesIcon" size={18} className="text-secondary" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
