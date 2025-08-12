import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformBenefits = () => {
  const benefits = [
    {
      icon: 'Zap',
      title: 'AI-Powered Matching',
      description: 'Our advanced algorithm connects startups with the most compatible investors based on industry, stage, and investment preferences.',
      color: 'text-accent'
    },
    {
      icon: 'MessageSquare',
      title: 'Real-Time Communication',
      description: 'Built-in messaging system with file sharing, typing indicators, and read receipts for seamless investor-startup conversations.',
      color: 'text-primary'
    },
    {
      icon: 'Shield',
      title: 'KYC Verified Network',
      description: 'All users undergo thorough identity verification ensuring a trusted ecosystem of legitimate investors and startups.',
      color: 'text-success'
    },
    {
      icon: 'TrendingUp',
      title: 'Smart Analytics',
      description: 'Comprehensive dashboard with funding progress tracking, match analytics, and performance insights for data-driven decisions.',
      color: 'text-warning'
    },
    {
      icon: 'FileText',
      title: 'Pitch Deck Review',
      description: 'AI-powered pitch analysis providing actionable feedback on strengths, weaknesses, and improvement suggestions.',
      color: 'text-secondary'
    },
    {
      icon: 'Users',
      title: 'Curated Community',
      description: 'Join a network of 10,000+ verified investors and 5,000+ startups across various industries and funding stages.',
      color: 'text-accent'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Why Choose FundNest?
        </h3>
        <p className="text-muted-foreground">
          The most advanced platform for startup funding and investment opportunities
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {benefits?.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-card/50 rounded-lg border border-border/30 hover:border-border/60 transition-all duration-200"
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center ${benefit?.color}`}>
              <Icon name={benefit?.icon} size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {benefit?.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Award" size={24} className="text-primary" />
          <h4 className="text-lg font-semibold text-foreground">
            Trusted by Industry Leaders
          </h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Over $500M in funding facilitated through our platform with a 95% satisfaction rate from both startups and investors.
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-muted-foreground">500+ Successful Matches</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-muted-foreground">Average 30-day funding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformBenefits;