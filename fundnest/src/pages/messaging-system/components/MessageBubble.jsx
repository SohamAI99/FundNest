import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageBubble = ({ message, isOwn, participant, onReaction, onReply, showAvatar = true }) => {
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'doc': case'docx':
        return 'FileText';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'Image';
      case 'mp4': case'mov':
        return 'Video';
      default:
        return 'File';
    }
  };

  const handleReaction = (emoji) => {
    onReaction(message?.id, emoji);
    setShowReactions(false);
  };

  const reactions = ['👍', '❤️', '😊', '😮', '😢', '😡'];

  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          <Image
            src={participant?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant?.name}`}
            alt={participant?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}
      {/* Message Container */}
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
        {/* Reply Context */}
        {message?.replyTo && (
          <div className={`mb-2 p-2 rounded-lg border-l-4 bg-muted/30 ${
            isOwn ? 'border-primary' : 'border-accent'
          }`}>
            <p className="text-xs text-muted-foreground mb-1">
              Replying to {message?.replyTo?.senderName}
            </p>
            <p className="text-xs text-foreground truncate">
              {message?.replyTo?.content}
            </p>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`relative group px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          {/* Message Content */}
          {message?.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message?.content}
            </p>
          )}

          {message?.type === 'file' && (
            <div className="space-y-2">
              {message?.file?.type?.startsWith('image/') ? (
                <div className="relative">
                  <Image
                    src={message?.file?.url}
                    alt={message?.file?.name}
                    className="max-w-full h-auto rounded-lg"
                  />
                  <button className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-smooth">
                    <Icon name="Download" size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-background/10 rounded-lg">
                  <div className="flex-shrink-0">
                    <Icon name={getFileIcon(message?.file?.name)} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {message?.file?.name}
                    </p>
                    <p className="text-xs opacity-70">
                      {(message?.file?.size / 1024 / 1024)?.toFixed(2)} MB
                    </p>
                  </div>
                  <button className="flex-shrink-0 p-1 hover:bg-background/20 rounded transition-smooth">
                    <Icon name="Download" size={16} />
                  </button>
                </div>
              )}
              {message?.content && (
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message?.content}
                </p>
              )}
            </div>
          )}

          {/* Message Actions */}
          <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-smooth">
            <div className="flex items-center space-x-1 bg-popover border border-border rounded-lg shadow-lg p-1">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 hover:bg-muted/50 rounded transition-smooth"
                title="Add reaction"
              >
                <Icon name="Smile" size={14} />
              </button>
              <button
                onClick={() => onReply(message)}
                className="p-1 hover:bg-muted/50 rounded transition-smooth"
                title="Reply"
              >
                <Icon name="Reply" size={14} />
              </button>
            </div>
          </div>

          {/* Reactions Picker */}
          {showReactions && (
            <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 z-10">
              <div className="flex space-x-1">
                {reactions?.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-1 hover:bg-muted/50 rounded transition-smooth text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Reactions */}
        {message?.reactions && message?.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message?.reactions?.map((reaction, index) => (
              <button
                key={index}
                onClick={() => handleReaction(reaction?.emoji)}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-muted/50 hover:bg-muted rounded-full text-xs transition-smooth"
              >
                <span>{reaction?.emoji}</span>
                <span className="text-muted-foreground">{reaction?.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and Status */}
        <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-muted-foreground">
            {formatTime(message?.timestamp)}
          </span>
          {isOwn && (
            <Icon
              name={message?.status === 'read' ? 'CheckCheck' : message?.status === 'delivered' ? 'Check' : 'Clock'}
              size={12}
              className={
                message?.status === 'read' ?'text-primary' 
                  : message?.status === 'delivered' ?'text-muted-foreground' :'text-muted-foreground/50'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;