import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConversationDetails = ({ conversation, participant, currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const getMatchScore = () => {
    return participant?.matchScore || 0;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getMatchScoreBg = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const sharedFiles = conversation?.messages?.filter(msg => msg?.type === 'file') || [];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'files', label: 'Files', icon: 'Paperclip' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
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

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-smooth focus-ring lg:hidden"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Participant Info */}
      <div className="p-4 border-b border-border">
        <div className="text-center">
          <div className="relative inline-block mb-3">
            <Image
              src={participant?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${participant?.name}`}
              alt={participant?.name || 'User'}
              className="w-16 h-16 rounded-full object-cover"
            />
            {participant?.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success border-2 border-card rounded-full"></div>
            )}
          </div>
          
          <h4 className="text-lg font-semibold text-foreground mb-1">
            {participant?.name || 'Unknown User'}
          </h4>
          
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              participant?.role === 'investor' ?'bg-secondary/10 text-secondary' :'bg-accent/10 text-accent'
            }`}>
              {participant?.role === 'investor' ? 'Investor' : 'Startup'}
            </span>
            {participant?.kycStatus === 'verified' && (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="CheckCircle" size={14} />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>

          {/* Match Score */}
          {getMatchScore() > 0 && (
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg ${getMatchScoreBg(getMatchScore())}`}>
              <Icon name="Target" size={16} className={getMatchScoreColor(getMatchScore())} />
              <span className={`text-sm font-semibold ${getMatchScoreColor(getMatchScore())}`}>
                {getMatchScore()}% Match
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-smooth ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            {/* Basic Info */}
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-2">About</h5>
              <p className="text-sm text-muted-foreground">
                {participant?.bio || 'No bio available'}
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-2">Contact</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{participant?.email}</span>
                </div>
                {participant?.phone && (
                  <div className="flex items-center space-x-2">
                    <Icon name="Phone" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{participant?.phone}</span>
                  </div>
                )}
                {participant?.location && (
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{participant?.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Preferences (for investors) */}
            {participant?.role === 'investor' && participant?.investmentPreferences && (
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Investment Focus</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Range:</span>
                    <span className="text-sm text-foreground">
                      ${participant?.investmentPreferences?.minAmount?.toLocaleString()} - ${participant?.investmentPreferences?.maxAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sectors:</span>
                    <div className="flex flex-wrap gap-1">
                      {participant?.investmentPreferences?.sectors?.slice(0, 2)?.map((sector) => (
                        <span key={sector} className="px-2 py-1 bg-muted text-xs rounded">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Company Info (for startups) */}
            {participant?.role === 'startup' && participant?.company && (
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Company</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm text-foreground">{participant?.company?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stage:</span>
                    <span className="text-sm text-foreground">{participant?.company?.stage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sector:</span>
                    <span className="text-sm text-foreground">{participant?.company?.sector}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                <Icon name="User" size={16} className="mr-2" />
                View Full Profile
              </Button>
              <Button variant="outline" className="w-full">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Connect
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-4">
            <h5 className="text-sm font-semibold text-foreground mb-4">
              Shared Files ({sharedFiles?.length})
            </h5>
            
            {sharedFiles?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="FileX" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No files shared yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sharedFiles?.map((message) => (
                  <div key={message?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-shrink-0">
                      <Icon name={getFileIcon(message?.file?.name)} size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {message?.file?.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(message?.file?.size)}</span>
                        <span>•</span>
                        <span>{new Date(message.timestamp)?.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 p-1 hover:bg-muted/50 rounded transition-smooth">
                      <Icon name="Download" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 space-y-4">
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-3">Conversation Settings</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified of new messages</p>
                  </div>
                  <button className="w-11 h-6 bg-primary rounded-full relative transition-smooth">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-smooth"></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Read Receipts</p>
                    <p className="text-xs text-muted-foreground">Show when you've read messages</p>
                  </div>
                  <button className="w-11 h-6 bg-muted rounded-full relative transition-smooth">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-smooth"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h5 className="text-sm font-semibold text-foreground mb-3">Actions</h5>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Search" size={16} className="mr-2" />
                  Search in Conversation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Archive" size={16} className="mr-2" />
                  Archive Conversation
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Delete Conversation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationDetails;