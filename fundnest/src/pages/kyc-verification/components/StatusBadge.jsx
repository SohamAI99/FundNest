import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: 'CheckCircle',
          text: 'Approved',
          className: 'bg-success/10 text-success border-success/20'
        };
      case 'rejected':
        return {
          icon: 'XCircle',
          text: 'Rejected',
          className: 'bg-error/10 text-error border-error/20'
        };
      case 'pending':
        return {
          icon: 'Clock',
          text: 'Under Review',
          className: 'bg-warning/10 text-warning border-warning/20'
        };
      case 'in_progress':
        return {
          icon: 'Loader',
          text: 'In Progress',
          className: 'bg-primary/10 text-primary border-primary/20'
        };
      case 'not_uploaded':
        return {
          icon: 'Upload',
          text: 'Upload Required',
          className: 'bg-muted/50 text-muted-foreground border-muted'
        };
      case 'not_started':
      default:
        return {
          icon: 'Circle',
          text: 'Not Started',
          className: 'bg-muted/30 text-muted-foreground border-muted'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ?'text-xs px-2 py-1' :'text-sm px-3 py-1';

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full border font-medium
      ${config?.className} 
      ${sizeClasses}
    `}>
      <Icon 
        name={config?.icon} 
        size={size === 'sm' ? 12 : 14} 
        strokeWidth={2}
        className={config?.icon === 'Loader' ? 'animate-spin' : ''}
      />
      <span>{config?.text}</span>
    </div>
  );
};

export default StatusBadge;