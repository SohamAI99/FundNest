import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsBar = ({ metrics }) => {
  const metricItems = [
    {
      label: 'Portfolio Value',
      value: metrics?.portfolioValue,
      change: metrics?.portfolioChange,
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      label: 'Active Deals',
      value: metrics?.activeDeals,
      change: metrics?.activeDealsChange,
      icon: 'Briefcase',
      color: 'text-primary'
    },
    {
      label: 'Pending Opportunities',
      value: metrics?.pendingOpportunities,
      change: metrics?.pendingChange,
      icon: 'Clock',
      color: 'text-warning'
    },
    {
      label: 'This Month ROI',
      value: metrics?.monthlyROI,
      change: metrics?.roiChange,
      icon: 'DollarSign',
      color: 'text-accent'
    }
  ];

  const formatValue = (value, type) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })?.format(value);
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    return value?.toLocaleString();
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricItems?.map((item, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover-lift transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-muted/50 ${item?.color}`}>
              <Icon name={item?.icon} size={20} />
            </div>
            {item?.change !== undefined && (
              <div className={`flex items-center space-x-1 ${getChangeColor(item?.change)}`}>
                <Icon name={getChangeIcon(item?.change)} size={14} />
                <span className="text-sm font-medium">
                  {Math.abs(item?.change)}%
                </span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {index === 0 ? formatValue(item?.value, 'currency') :
               index === 3 ? formatValue(item?.value, 'percentage') :
               formatValue(item?.value)}
            </h3>
            <p className="text-sm text-muted-foreground">{item?.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsBar;