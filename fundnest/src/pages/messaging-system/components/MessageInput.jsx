import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ onSendMessage, onFileUpload, isTyping, disabled = false, replyTo, onCancelReply }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏'];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !disabled) {
      onSendMessage({
        content: message?.trim(),
        type: 'text',
        replyTo: replyTo
      });
      setMessage('');
      if (replyTo) {
        onCancelReply();
      }
      // Reset textarea height
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e?.target?.value);
    
    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef?.current?.scrollHeight, 120) + 'px';
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef?.current?.focus();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      files?.forEach(file => {
        onFileUpload(file);
      });
    }
    // Reset file input
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    if (files?.length > 0) {
      files?.forEach(file => {
        onFileUpload(file);
      });
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Reply Context */}
      {replyTo && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Reply" size={16} className="text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  Replying to {replyTo?.senderName}
                </p>
                <p className="text-sm text-foreground truncate">
                  {replyTo?.content}
                </p>
              </div>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 hover:bg-muted/50 rounded transition-smooth"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-muted-foreground">Someone is typing...</span>
          </div>
        </div>
      )}
      {/* Main Input Area */}
      <div 
        className={`p-4 ${isDragOver ? 'bg-primary/5 border-primary/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Icon name="Upload" size={32} className="text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-primary">Drop files to upload</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          {/* File Upload */}
          <button
            type="button"
            onClick={() => fileInputRef?.current?.click()}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <Icon name="Paperclip" size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          />

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "Upgrade to Pro to send messages" : "Type a message..."}
              disabled={disabled}
              className="w-full px-3 py-2 pr-10 bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            
            {/* Emoji Picker Button */}
            <div className="absolute right-2 bottom-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
                className="p-1 text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add emoji"
              >
                <Icon name="Smile" size={16} />
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg p-2 z-20">
                <div className="grid grid-cols-6 gap-1">
                  {emojis?.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="p-2 hover:bg-muted/50 rounded transition-smooth text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={!message?.trim() || disabled}
            className="flex-shrink-0"
          >
            <Icon name="Send" size={16} />
          </Button>
        </form>

        {disabled && (
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Messaging is available for Pro subscribers
            </p>
            <Button variant="outline" size="sm">
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;