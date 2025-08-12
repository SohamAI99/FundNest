import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StartupCard = ({ startup, onViewPitch, onConnect, onBookmark }) => {
  const [isBookmarked, setIsBookmarked] = useState(startup?.isBookmarked || false);
  const [showDetails, setShowDetails] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(startup?.id, !isBookmarked);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-success bg-success/10 border-success/20';
    if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-error bg-error/10 border-error/20';
  };

  const getStageColor = (stage) => {
    const colors = {
      'pre-seed': 'bg-purple-100 text-purple-800 border-purple-200',
      'seed': 'bg-blue-100 text-blue-800 border-blue-200',
      'series-a': 'bg-green-100 text-green-800 border-green-200',
      'series-b': 'bg-orange-100 text-orange-800 border-orange-200',
      'series-c': 'bg-red-100 text-red-800 border-red-200',
      'growth': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors?.[stage] || 'bg-muted text-muted-foreground border-border';
  };

  const formatFunding = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000)?.toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000)?.toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm hover-lift transition-smooth overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={startup?.logo}
                alt={`${startup?.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {startup?.name}
              </h3>
              <p className="text-sm text-muted-foreground">{startup?.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchScoreColor(startup?.matchScore)}`}>
              {startup?.matchScore}% Match
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className={isBookmarked ? 'text-warning' : 'text-muted-foreground'}
            >
              <Icon name={isBookmarked ? "Bookmark" : "BookmarkPlus"} size={16} />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(startup?.stage)}`}>
            {startup?.stage?.charAt(0)?.toUpperCase() + startup?.stage?.slice(1)?.replace('-', ' ')}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            {startup?.sector}
          </span>
          {startup?.isVerified && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={14} />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {startup?.description}
        </p>

        {/* Funding Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Seeking</p>
            <p className="text-sm font-semibold text-foreground">
              {formatFunding(startup?.fundingTarget)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Valuation</p>
            <p className="text-sm font-semibold text-foreground">
              {formatFunding(startup?.valuation)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Funding Progress</span>
            <span className="text-xs font-medium text-foreground">
              {startup?.fundingProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${startup?.fundingProgress}%` }}
            />
          </div>
        </div>
      </div>
      {/* Expandable Details */}
      {showDetails && (
        <div className="px-6 pb-4 border-t border-border">
          <div className="pt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">AI Investment Thesis</h4>
              <p className="text-sm text-muted-foreground">{startup?.aiThesis}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                  <p className="text-sm font-medium text-foreground">
                    {startup?.monthlyRevenue ? formatFunding(startup?.monthlyRevenue) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Team Size</p>
                  <p className="text-sm font-medium text-foreground">{startup?.teamSize}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Risk Assessment</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  startup?.riskLevel === 'low' ? 'bg-success' :
                  startup?.riskLevel === 'medium' ? 'bg-warning' : 'bg-error'
                }`} />
                <span className="text-sm text-muted-foreground capitalize">
                  {startup?.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Card Actions */}
      <div className="px-6 py-4 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            iconName={showDetails ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            {showDetails ? 'Less Details' : 'More Details'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewPitch(startup?.id)}
              iconName="FileText"
              iconSize={16}
            >
              View Pitch
            </Button>
            <Button
              size="sm"
              onClick={() => onConnect(startup?.id)}
              iconName="MessageSquare"
              iconSize={16}
            >
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupCard;