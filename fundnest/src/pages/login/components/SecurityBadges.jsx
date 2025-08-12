import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Login',
      description: 'Multi-factor authentication available'
    },
    {
      icon: 'CheckCircle',
      title: 'KYC Verified',
      description: 'All users undergo identity verification'
    },
    {
      icon: 'Eye',
      title: 'Privacy First',
      description: 'We never share your personal information'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Your Security Matters
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name={feature?.icon} size={20} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {feature?.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;