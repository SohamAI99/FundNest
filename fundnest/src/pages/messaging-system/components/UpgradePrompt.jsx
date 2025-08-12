import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpgradePrompt = ({ onUpgrade, onClose }) => {
  const proFeatures = [
    {
      icon: 'MessageSquare',
      title: 'Unlimited Messaging',
      description: 'Send unlimited messages to investors and startups'
    },
    {
      icon: 'Download',
      title: 'Full Pitch Downloads',
      description: 'Download complete pitch decks and business plans'
    },
    {
      icon: 'Target',
      title: 'Advanced Matching',
      description: 'Get AI-powered matches with detailed compatibility scores'
    },
    {
      icon: 'Zap',
      title: 'Priority Support',
      description: '24/7 priority customer support and dedicated account manager'
    },
    {
      icon: 'BarChart3',
      title: 'Analytics Dashboard',
      description: 'Track your engagement metrics and investment performance'
    },
    {
      icon: 'Shield',
      title: 'Enhanced Security',
      description: 'Advanced encryption and secure document sharing'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevation-3 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Crown" size={24} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Upgrade to FundNest Pro</h2>
                <p className="text-sm text-muted-foreground">Unlock premium features and accelerate your funding journey</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-smooth focus-ring"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="inline-flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-bold text-foreground">$49</span>
              <span className="text-lg text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cancel anytime • 30-day money-back guarantee
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {proFeatures?.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={feature?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {feature?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Current Limitation */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Icon name="Lock" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-warning mb-1">
                  Messaging Limited
                </h3>
                <p className="text-xs text-muted-foreground">
                  You've reached the free plan messaging limit. Upgrade to Pro to continue conversations with investors and startups.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-success" />
              <span className="text-sm font-semibold text-success">Join 2,500+ Pro Members</span>
            </div>
            <p className="text-xs text-muted-foreground">
              "FundNest Pro helped us connect with the right investors and secure $2M in Series A funding within 3 months."
            </p>
            <p className="text-xs text-success font-medium mt-1">
              - Demo Founder, CEO of TechFlow
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onUpgrade}
              className="w-full"
              size="lg"
            >
              <Icon name="Crown" size={20} className="mr-2" />
              Upgrade to Pro Now
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Maybe Later
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1"
                onClick={() => console.log('View pricing details')}
              >
                View Details
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="RefreshCw" size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;