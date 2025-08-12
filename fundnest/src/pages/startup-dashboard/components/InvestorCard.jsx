import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const InvestorCard = ({ investor, onConnect, onViewProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMatchColor = (score) => {
    if (score >= 85) return 'text-success bg-success/10 border-success/20';
    if (score >= 70) return 'text-accent bg-accent/10 border-accent/20';
    if (score >= 50) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-error bg-error/10 border-error/20';
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000)?.toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000)?.toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover-lift transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image
            src={investor?.avatar}
            alt={investor?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-foreground">{investor?.name}</h3>
            <p className="text-sm text-muted-foreground">{investor?.firm}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getMatchColor(investor?.matchScore)}`}>
          {investor?.matchScore}% Match
        </div>
      </div>
      {/* Investment Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Typical Check Size</p>
          <p className="text-sm font-medium text-foreground">
            {formatAmount(investor?.minInvestment)} - {formatAmount(investor?.maxInvestment)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Investment Focus</p>
          <p className="text-sm font-medium text-foreground">{investor?.sector}</p>
        </div>
      </div>
      {/* Stage & Location */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <Icon name="Target" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{investor?.stage}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="MapPin" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{investor?.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Briefcase" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{investor?.portfolioSize} investments</span>
        </div>
      </div>
      {/* Match Reasoning */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm text-accent hover:text-accent/80 transition-smooth"
        >
          <span>Why this match?</span>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </button>
        
        {isExpanded && (
          <div className="mt-2 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">{investor?.matchReasoning}</p>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="default"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          onClick={() => onConnect(investor)}
          className="flex-1"
        >
          Connect
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="User"
          onClick={() => onViewProfile(investor)}
        />
        <Button
          variant="ghost"
          size="sm"
          iconName="Bookmark"
        />
      </div>
    </div>
  );
};

export default InvestorCard;