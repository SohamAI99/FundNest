import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';

const ConversationList = ({ conversations, activeConversationId, onConversationSelect, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery?.trim()) return conversations;
    
    return conversations?.filter(conversation => {
      const participant = conversation?.participants?.find(p => p?.id !== currentUser?.id);
      return participant?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
             conversation?.lastMessage?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    });
  }, [conversations, searchQuery, currentUser?.id]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return messageTime?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return messageTime?.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageTime?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getParticipant = (conversation) => {
    return conversation?.participants?.find(p => p?.id !== currentUser?.id);
  };

  const getMatchScore = (participant) => {
    return participant?.matchScore || 0;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <button className="p-2 hover:bg-muted/50 rounded-lg transition-smooth focus-ring">
            <Icon name="Plus" size={20} className="text-muted-foreground" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
        </div>
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Start connecting with investors and startups'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations?.map((conversation) => {
              const participant = getParticipant(conversation);
              const isActive = conversation?.id === activeConversationId;
              const matchScore = getMatchScore(participant);
              
              return (
                <button
                  key={conversation?.id}
                  onClick={() => onConversationSelect(conversation)}
                  className={`w-full p-3 rounded-lg text-left transition-smooth focus-ring ${
                    isActive 
                      ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={participant?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant?.name}`}
                        alt={participant?.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {participant?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success border-2 border-card rounded-full"></div>
                      )}
                      {conversation?.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center justify-center">
                          {conversation?.unreadCount > 9 ? '9+' : conversation?.unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {participant?.name || 'Unknown User'}
                          </h3>
                          {participant?.role && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              participant?.role === 'investor' ?'bg-secondary/10 text-secondary' :'bg-accent/10 text-accent'
                            }`}>
                              {participant?.role === 'investor' ? 'Investor' : 'Startup'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {conversation?.lastMessage && formatTime(conversation?.lastMessage?.timestamp)}
                        </span>
                      </div>
                      
                      {/* Match Score */}
                      {matchScore > 0 && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Icon name="Target" size={12} className={getMatchScoreColor(matchScore)} />
                          <span className={`text-xs font-medium ${getMatchScoreColor(matchScore)}`}>
                            {matchScore}% match
                          </span>
                        </div>
                      )}

                      {/* Last Message */}
                      <div className="flex items-center space-x-1">
                        {conversation?.lastMessage?.senderId === currentUser?.id && (
                          <Icon 
                            name={conversation?.lastMessage?.status === 'read' ? 'CheckCheck' : 'Check'} 
                            size={12} 
                            className={conversation?.lastMessage?.status === 'read' ? 'text-primary' : 'text-muted-foreground'} 
                          />
                        )}
                        <p className={`text-xs truncate ${
                          conversation?.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                        }`}>
                          {conversation?.lastMessage?.type === 'file' ? (
                            <span className="flex items-center space-x-1">
                              <Icon name="Paperclip" size={12} />
                              <span>File attachment</span>
                            </span>
                          ) : (
                            conversation?.lastMessage?.content || 'No messages yet'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;