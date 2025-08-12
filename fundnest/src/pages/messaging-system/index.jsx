import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/ui/AppHeader';
import ConversationList from './components/ConversationList';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import ConversationDetails from './components/ConversationDetails';
import UpgradePrompt from './components/UpgradePrompt';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MessagingSystem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // State management
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list', 'chat', 'details'

  // Use real current user from AuthContext
  const currentUser = user || {
    id: 'guest',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'startup',
    avatar: null,
    subscriptionTier: 'free',
    kycStatus: 'unverified'
  };

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      participants: [
        currentUser,
        {
          id: 'user-2',
          name: 'Guest Investor',
          email: 'guest.investor@example.com',
          role: 'investor',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
          matchScore: 87,
          kycStatus: 'verified',
          bio: 'Senior Partner at TechVentures focusing on early-stage SaaS and fintech startups. 15+ years of investment experience.',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          investmentPreferences: {
            minAmount: 100000,
            maxAmount: 5000000,
            sectors: ['SaaS', 'Fintech', 'AI/ML', 'Healthcare']
          }
        }
      ],
      lastMessage: {
        id: 'msg-3',
        senderId: 'user-2',
        content: 'I\'d love to schedule a call to discuss your Series A plans. Are you available this week?',
        timestamp: new Date(Date.now() - 300000),
        status: 'delivered',
        type: 'text'
      },
      unreadCount: 2,
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-1',
          content: 'Hi Sarah, thank you for your interest in our startup. I\'d be happy to share more details about our growth metrics and funding needs.',
          timestamp: new Date(Date.now() - 3600000),
          status: 'read',
          type: 'text'
        },
        {
          id: 'msg-2',
          senderId: 'user-2',
          content: 'Great! I\'ve reviewed your pitch deck and I\'m impressed with your traction. The 300% YoY growth is particularly compelling.',
          timestamp: new Date(Date.now() - 1800000),
          status: 'read',
          type: 'text'
        },
        {
          id: 'msg-3',
          senderId: 'user-2',
          content: 'I\'d love to schedule a call to discuss your Series A plans. Are you available this week?',
          timestamp: new Date(Date.now() - 300000),
          status: 'delivered',
          type: 'text'
        }
      ]
    },
    {
      id: 'conv-2',
      participants: [
        currentUser,
        {
          id: 'user-3',
          name: 'Michael Rodriguez',
          email: 'michael@angelinvestor.com',
          role: 'investor',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          isOnline: false,
          matchScore: 72,
          kycStatus: 'verified',
          bio: 'Angel investor and former startup founder. Invested in 50+ companies with 3 successful exits.',
          location: 'Austin, TX',
          investmentPreferences: {
            minAmount: 25000,
            maxAmount: 500000,
            sectors: ['E-commerce', 'SaaS', 'Consumer Tech']
          }
        }
      ],
      lastMessage: {
        id: 'msg-5',
        senderId: 'user-1',
        content: 'Thanks for the feedback on our business model. We\'ve made the adjustments you suggested.',
        timestamp: new Date(Date.now() - 86400000),
        status: 'read',
        type: 'text'
      },
      unreadCount: 0,
      messages: [
        {
          id: 'msg-4',
          senderId: 'user-3',
          content: 'Your customer acquisition strategy looks solid, but I\'d like to see more details on unit economics.',
          timestamp: new Date(Date.now() - 172800000),
          status: 'read',
          type: 'text'
        },
        {
          id: 'msg-5',
          senderId: 'user-1',
          content: 'Thanks for the feedback on our business model. We\'ve made the adjustments you suggested.',
          timestamp: new Date(Date.now() - 86400000),
          status: 'read',
          type: 'text'
        }
      ]
    },
    {
      id: 'conv-3',
      participants: [
        currentUser,
        {
          id: 'user-4',
          name: 'Emily Watson',
          email: 'emily@growthfund.com',
          role: 'investor',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
          matchScore: 94,
          kycStatus: 'pending',
          bio: 'Managing Director at Growth Fund specializing in B2B SaaS companies. Former McKinsey consultant.',
          location: 'New York, NY',
          investmentPreferences: {
            minAmount: 1000000,
            maxAmount: 10000000,
            sectors: ['B2B SaaS', 'Enterprise Software', 'AI/ML']
          }
        }
      ],
      lastMessage: {
        id: 'msg-7',
        senderId: 'user-4',
        content: 'Congratulations on the product launch! The early metrics look promising.',
        timestamp: new Date(Date.now() - 7200000),
        status: 'delivered',
        type: 'text'
      },
      unreadCount: 1,
      messages: [
        {
          id: 'msg-6',
          senderId: 'user-1',
          content: 'We just launched our new enterprise features and already have 5 pilot customers signed up!',
          timestamp: new Date(Date.now() - 14400000),
          status: 'read',
          type: 'text'
        },
        {
          id: 'msg-7',
          senderId: 'user-4',
          content: 'Congratulations on the product launch! The early metrics look promising.',
          timestamp: new Date(Date.now() - 7200000),
          status: 'delivered',
          type: 'text'
        }
      ]
    }
  ]);

  // Get active conversation
  const activeConversation = conversations?.find(conv => conv?.id === activeConversationId);
  const participant = activeConversation?.participants?.find(p => p?.id !== currentUser?.id);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setActiveConversationId(conversation?.id);
    setMobileView('chat');
    
    // Mark messages as read
    setConversations(prev => prev?.map(conv => 
      conv?.id === conversation?.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  // Handle sending messages
  const handleSendMessage = (messageData) => {
    if (currentUser?.subscriptionTier === 'free') {
      setShowUpgradePrompt(true);
      return;
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id,
      content: messageData?.content,
      timestamp: new Date(),
      status: 'sent',
      type: messageData?.type,
      file: messageData?.file,
      replyTo: messageData?.replyTo
    };

    setConversations(prev => prev?.map(conv => 
      conv?.id === activeConversationId
        ? {
            ...conv,
            messages: [...conv?.messages, newMessage],
            lastMessage: newMessage
          }
        : conv
    ));

    setReplyTo(null);
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    if (currentUser?.subscriptionTier === 'free') {
      setShowUpgradePrompt(true);
      return;
    }

    const fileMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id,
      content: '',
      timestamp: new Date(),
      status: 'sent',
      type: 'file',
      file: {
        name: file?.name,
        size: file?.size,
        type: file?.type,
        url: URL.createObjectURL(file)
      }
    };

    setConversations(prev => prev?.map(conv => 
      conv?.id === activeConversationId
        ? {
            ...conv,
            messages: [...conv?.messages, fileMessage],
            lastMessage: fileMessage
          }
        : conv
    ));
  };

  // Handle message reactions
  const handleReaction = (messageId, emoji) => {
    setConversations(prev => prev?.map(conv => 
      conv?.id === activeConversationId
        ? {
            ...conv,
            messages: conv?.messages?.map(msg => 
              msg?.id === messageId
                ? {
                    ...msg,
                    reactions: [
                      ...(msg?.reactions || []),
                      { emoji, count: 1, users: [currentUser?.id] }
                    ]
                  }
                : msg
            )
          }
        : conv
    ));
  };

  // Handle reply
  const handleReply = (message) => {
    setReplyTo({
      id: message?.id,
      content: message?.content,
      senderName: message?.senderId === currentUser?.id ? 'You' : participant?.name
    });
  };

  // Handle upgrade
  const handleUpgrade = () => {
    console.log('Redirecting to upgrade page...');
    setShowUpgradePrompt(false);
  };

  // Handle mobile navigation
  const handleMobileBack = () => {
    if (mobileView === 'details') {
      setMobileView('chat');
    } else if (mobileView === 'chat') {
      setMobileView('list');
    }
  };

  // Responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileView('list');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={currentUser} 
        notifications={conversations?.reduce((sum, conv) => sum + conv?.unreadCount, 0)}
        onNavigate={(path) => navigate(path)}
      />
      <div className="pt-16 h-screen flex">
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full">
          {/* Conversation List - Left Panel */}
          <div className="w-80 flex-shrink-0">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
              currentUser={currentUser}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={participant?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant?.name}`}
                          alt={participant?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {participant?.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {participant?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {participant?.isOnline ? 'Online' : 'Last seen recently'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Icon name="Phone" size={20} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icon name="Video" size={20} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        <Icon name="Info" size={20} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeConversation?.messages?.map((message, index) => {
                    const isOwn = message?.senderId === currentUser?.id;
                    const showAvatar = !isOwn && (
                      index === 0 || 
                      activeConversation?.messages?.[index - 1]?.senderId !== message?.senderId
                    );

                    return (
                      <MessageBubble
                        key={message?.id}
                        message={message}
                        isOwn={isOwn}
                        participant={participant}
                        onReaction={handleReaction}
                        onReply={handleReply}
                        showAvatar={showAvatar}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onFileUpload={handleFileUpload}
                  isTyping={isTyping}
                  disabled={currentUser?.subscriptionTier === 'free'}
                  replyTo={replyTo}
                  onCancelReply={() => setReplyTo(null)}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageSquare" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Conversation Details - Right Panel */}
          {showDetails && activeConversation && (
            <div className="w-80 flex-shrink-0">
              <ConversationDetails
                conversation={activeConversation}
                participant={participant}
                currentUser={currentUser}
                onClose={() => setShowDetails(false)}
              />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full">
          {mobileView === 'list' && (
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
              currentUser={currentUser}
            />
          )}

          {mobileView === 'chat' && activeConversation && (
            <div className="flex flex-col h-full">
              {/* Mobile Chat Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleMobileBack}
                    >
                      <Icon name="ArrowLeft" size={20} />
                    </Button>
                    <div className="relative">
                      <img
                        src={participant?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant?.name}`}
                        alt={participant?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {participant?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-card rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {participant?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {participant?.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setMobileView('details')}
                  >
                    <Icon name="Info" size={20} />
                  </Button>
                </div>
              </div>

              {/* Mobile Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation?.messages?.map((message, index) => {
                  const isOwn = message?.senderId === currentUser?.id;
                  const showAvatar = !isOwn && (
                    index === 0 || 
                    activeConversation?.messages?.[index - 1]?.senderId !== message?.senderId
                  );

                  return (
                    <MessageBubble
                      key={message?.id}
                      message={message}
                      isOwn={isOwn}
                      participant={participant}
                      onReaction={handleReaction}
                      onReply={handleReply}
                      showAvatar={showAvatar}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Mobile Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                isTyping={isTyping}
                disabled={currentUser?.subscriptionTier === 'free'}
                replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)}
              />
            </div>
          )}

          {mobileView === 'details' && activeConversation && (
            <ConversationDetails
              conversation={activeConversation}
              participant={participant}
              currentUser={currentUser}
              onClose={() => setMobileView('chat')}
            />
          )}
        </div>
      </div>
      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <UpgradePrompt
          onUpgrade={handleUpgrade}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};

export default MessagingSystem;