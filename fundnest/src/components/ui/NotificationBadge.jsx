import React from 'react';

const NotificationBadge = ({ 
  count = 0, 
  size = 'default', 
  variant = 'default',
  className = '',
  showZero = false,
  maxCount = 99
}) => {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  const sizeClasses = {
    xs: 'h-4 w-4 text-xs min-w-4',
    sm: 'h-5 w-5 text-xs min-w-5',
    default: 'h-6 w-6 text-sm min-w-6',
    lg: 'h-7 w-7 text-sm min-w-7'
  };

  const variantClasses = {
    default: 'bg-accent text-accent-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    error: 'bg-error text-error-foreground',
    muted: 'bg-muted text-muted-foreground'
  };

  const displayCount = count > maxCount ? `${maxCount}+` : count?.toString();

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-medium
        ${sizeClasses?.[size]}
        ${variantClasses?.[variant]}
        ${className}
      `}
      aria-label={`${count} notification${count !== 1 ? 's' : ''}`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;