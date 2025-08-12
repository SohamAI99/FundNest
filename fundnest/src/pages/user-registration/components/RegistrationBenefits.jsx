import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationBenefits = ({ userRole }) => {
  const startupBenefits = [
    {
      icon: 'Target',
      title: 'AI-Powered Matching',
      description: 'Get matched with investors who align with your industry, stage, and funding needs.'
    },
    {
      icon: 'FileText',
      title: 'Pitch Deck Analysis',
      description: 'Receive AI-powered feedback on your pitch deck to improve your chances of success.'
    },
    {
      icon: 'MessageSquare',
      title: 'Direct Communication',
      description: 'Connect directly with interested investors through our secure messaging platform.'
    },
    {
      icon: 'TrendingUp',
      title: 'Funding Progress Tracking',
      description: 'Monitor your fundraising progress and get insights on your campaign performance.'
    },
    {
      icon: 'Shield',
      title: 'Verified Ecosystem',
      description: 'All investors go through KYC verification ensuring legitimate funding opportunities.'
    }
  ];

  const investorBenefits = [
    {
      icon: 'Search',
      title: 'Curated Deal Flow',
      description: 'Access pre-screened startups that match your investment criteria and preferences.'
    },
    {
      icon: 'BarChart3',
      title: 'AI Investment Insights',
      description: 'Get AI-powered analysis and scoring for each startup opportunity.'
    },
    {
      icon: 'Users',
      title: 'Portfolio Management',
      description: 'Track and manage your investments with comprehensive portfolio tools.'
    },
    {
      icon: 'Filter',
      title: 'Advanced Filtering',
      description: 'Find opportunities by sector, stage, funding amount, and geographic location.'
    },
    {
      icon: 'Award',
      title: 'Exclusive Access',
      description: 'Get early access to promising startups before they go to market.'
    }
  ];

  const benefits = userRole === 'startup' ? startupBenefits : investorBenefits;

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Why Join FundNest?
        </h3>
        <p className="text-sm text-muted-foreground">
          {userRole === 'startup' ?'Connect with the right investors and accelerate your funding journey.' :'Discover high-potential startups and make informed investment decisions.'
          }
        </p>
      </div>
      <div className="space-y-4">
        {benefits?.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name={benefit?.icon} size={16} className="text-primary" strokeWidth={2} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                {benefit?.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {benefit?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2 text-success">
          <Icon name="Shield" size={16} strokeWidth={2} />
          <span className="text-sm font-medium">Secure & Verified Platform</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          All users undergo KYC verification for a trusted ecosystem.
        </p>
      </div>
    </div>
  );
};

export default RegistrationBenefits;