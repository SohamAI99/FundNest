import React from 'react';
import Icon from '../AppIcon';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = '', 
  fullScreen = false,
  overlay = false,
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  };

  const SpinnerContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-3 ${
      fullScreen ? 'min-h-screen' : ''
    }`}>
      <div className="relative">
        {variant === 'dots' ? (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-primary rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
          </div>
        ) : variant === 'pulse' ? (
          <div className={`${sizeClasses[size]} bg-primary/20 rounded-full animate-pulse`} />
        ) : (
          <div className={`${sizeClasses[size]} animate-spin`}>
            <Icon 
              name="Loader2" 
              size={parseInt(sizeClasses[size].match(/\d+/)[0]) * 4} 
              className="text-primary"
            />
          </div>
        )}
      </div>
      
      {text && (
        <div className={`${textSizes[size]} text-muted-foreground text-center max-w-xs`}>
          {text}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <SpinnerContent />
      </div>
    );
  }

  return <SpinnerContent />;
};

// Skeleton loading components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
      <div className="flex space-x-2 pt-2">
        <div className="h-8 bg-muted rounded w-20" />
        <div className="h-8 bg-muted rounded w-24" />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
    <div className="p-6 border-b border-border">
      <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;