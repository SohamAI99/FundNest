import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ActivityPanel = ({ activities, conversations, onViewConversation }) => {
  const [activeTab, setActiveTab] = useState('activity');

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type) => {
    const icons = {
      'new_match': 'Target',
      'pitch_viewed': 'Eye',
      'message_received': 'MessageSquare',
      'connection_request': 'UserPlus',
      'pitch_downloaded': 'Download',
      'bookmark_added': 'Bookmark',
      'profile_viewed': 'User'
    };
    return icons?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colors = {
      'new_match': 'text-success',
      'pitch_viewed': 'text-primary',
      'message_received': 'text-accent',
      'connection_request': 'text-warning',
      'pitch_downloaded': 'text-secondary',
      'bookmark_added': 'text-warning',
      'profile_viewed': 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-smooth">
      <div className={`p-2 rounded-lg bg-muted/50 ${getActivityColor(activity?.type)} flex-shrink-0`}>
        <Icon name={getActivityIcon(activity?.type)} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{activity?.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatTimeAgo(activity?.timestamp)}
        </p>
      </div>
      {activity?.actionable && (
        <Button variant="ghost" size="sm" className="flex-shrink-0">
          <Icon name="ChevronRight" size={14} />
        </Button>
      )}
    </div>
  );

  const ConversationItem = ({ conversation }) => (
    <div 
      className="flex items-center space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-smooth cursor-pointer"
      onClick={() => onViewConversation(conversation?.id)}
    >
      <div className="relative flex-shrink-0">
        <Image
          src={conversation?.startup?.logo}
          alt={`${conversation?.startup?.name} logo`}
          className="w-10 h-10 rounded-lg object-cover"
        />
        {conversation?.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
            {conversation?.unreadCount}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-foreground truncate">
            {conversation?.startup?.name}
          </h4>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(conversation?.lastMessage?.timestamp)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation?.lastMessage?.preview}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-smooth ${
              activeTab === 'activity' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span>Activity</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-smooth relative ${
              activeTab === 'conversations' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon name="MessageSquare" size={16} />
              <span>Messages</span>
              {conversations?.filter(c => c?.unreadCount > 0)?.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  {conversations?.reduce((sum, c) => sum + c?.unreadCount, 0)}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
      {/* Panel Content */}
      <div className="max-h-96 overflow-y-auto scrollbar-hide">
        {activeTab === 'activity' ? (
          <div className="p-2">
            {activities?.length > 0 ? (
              <div className="space-y-1">
                {activities?.map((activity) => (
                  <ActivityItem key={activity?.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {conversations?.length > 0 ? (
              <div className="space-y-1">
                {conversations?.map((conversation) => (
                  <ConversationItem key={conversation?.id} conversation={conversation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect with startups to start messaging
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Panel Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName={activeTab === 'activity' ? 'Activity' : 'MessageSquare'}
          iconSize={16}
        >
          View All {activeTab === 'activity' ? 'Activity' : 'Messages'}
        </Button>
      </div>
    </div>
  );
};

export default ActivityPanel;