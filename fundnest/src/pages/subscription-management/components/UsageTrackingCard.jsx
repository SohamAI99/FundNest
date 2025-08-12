import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const UsageTrackingCard = ({ usage, currentPlan, onUpgrade }) => {
  const isPro = currentPlan === 'pro';
  
  const usageItems = [
    {
      key: 'messages',
      label: 'Messages Sent',
      used: usage?.messagesSent || 0,
      limit: usage?.messagesLimit || 0,
      icon: 'MessageSquare',
      color: 'primary'
    },
    {
      key: 'connections',
      label: 'Connection Requests',
      used: usage?.connectionsUsed || 0,
      limit: usage?.connectionsLimit || 0,
      icon: 'Users',
      color: 'success'
    },
    {
      key: 'profileViews',
      label: 'Profile Views',
      used: usage?.profileViewsUsed || 0,
      limit: usage?.profileViewsLimit || 0,
      icon: 'Eye',
      color: 'warning'
    },
    {
      key: 'pitchViews',
      label: 'Pitch Deck Views',
      used: usage?.pitchViewsUsed || 0,
      limit: usage?.pitchViewsLimit || 0,
      icon: 'FileText',
      color: 'info'
    }
  ];

  const getUsagePercentage = (used, limit) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageStatus = (used, limit) => {
    if (limit === 0) return 'unlimited';
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'unlimited': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-destructive';
      case 'warning': return 'bg-warning';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Feature Usage</h3>
          <p className="text-sm text-muted-foreground">
            {isPro ? 'Unlimited access to all features' : 'Track your monthly usage and limits'}
          </p>
        </div>
        
        {!isPro && (
          <Button
            onClick={onUpgrade}
            size="sm"
            iconName="ArrowUp"
          >
            Upgrade for Unlimited
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {usageItems?.map((item) => {
          const percentage = getUsagePercentage(item?.used, item?.limit);
          const status = getUsageStatus(item?.used, item?.limit);
          const isNearLimit = status === 'warning' || status === 'critical';

          return (
            <div key={item?.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item?.label}</span>
                </div>
                
                <div className={`text-sm font-medium ${getStatusColor(status)}`}>
                  {isPro || status === 'unlimited' ? (
                    <span className="flex items-center space-x-1">
                      <Icon name="Infinity" size={14} />
                      <span>Unlimited</span>
                    </span>
                  ) : (
                    `${item?.used} / ${item?.limit}`
                  )}
                </div>
              </div>

              {!isPro && status !== 'unlimited' && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {isNearLimit && (
                    <div className={`flex items-center space-x-2 text-xs ${getStatusColor(status)}`}>
                      <Icon name="AlertTriangle" size={12} />
                      <span>
                        {status === 'critical' ? 'Limit almost reached!' : 'Approaching limit'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade Prompt for Free Users */}
      {!isPro && usageItems?.some(item => getUsageStatus(item?.used, item?.limit) === 'critical') && (
        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Usage Limit Reached</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You've reached or exceeded some of your monthly limits. Upgrade to Pro for unlimited access to all features.
                </p>
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={onUpgrade}
              iconName="ArrowUp"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Feature Comparison for Free Users */}
      {!isPro && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-center space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Unlock Unlimited Access</h4>
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro and remove all usage limits
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="MessageSquare" size={16} className="text-success" />
                <span>Unlimited Messages</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-success" />
                <span>Unlimited Connections</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-success" />
                <span>AI Matching</span>
              </div>
            </div>
            
            <Button
              onClick={onUpgrade}
              className="w-full sm:w-auto"
              iconName="Star"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageTrackingCard;