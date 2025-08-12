import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'match': return 'Users';
      case 'message': return 'MessageCircle';
      case 'pitch_view': return 'Eye';
      case 'connection': return 'UserPlus';
      case 'funding': return 'DollarSign';
      default: return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'match': return 'text-accent bg-accent/10';
      case 'message': return 'text-primary bg-primary/10';
      case 'pitch_view': return 'text-warning bg-warning/10';
      case 'connection': return 'text-success bg-success/10';
      case 'funding': return 'text-secondary bg-secondary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
          {activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} strokeWidth={2} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {activity?.avatar && (
                    <Image
                      src={activity?.avatar}
                      alt={activity?.user}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.user}</span>
                    <span className="text-muted-foreground ml-1">{activity?.action}</span>
                  </p>
                </div>
                
                {activity?.description && (
                  <p className="text-xs text-muted-foreground mb-1">{activity?.description}</p>
                )}
                
                <p className="text-xs text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</p>
              </div>
              
              {activity?.unread && (
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;