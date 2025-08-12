import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/ui/AppHeader';
import PersonalInfoTab from './components/PersonalInfoTab';
import BusinessDetailsTab from './components/BusinessDetailsTab';
import PreferencesTab from './components/PreferencesTab';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const UserProfileManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Use real user data from AuthContext with proper fallbacks
  const currentUser = user || {
    id: 'unknown',
    name: "Guest User",
    email: "guest@example.com",
    role: "startup",
    avatar: null,
    kycStatus: "unverified",
    subscriptionTier: "free"
  };

  // Profile data initialized with real user data
  const [profileData, setProfileData] = useState({
    // Personal Info
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    website: currentUser?.website || "",
    linkedin: currentUser?.linkedin || "",
    profileImage: currentUser?.avatar || null,
    
    // Business Details (will be loaded from API in real app)
    companyName: currentUser?.companyName || "",
    foundingDate: currentUser?.foundedYear ? `${currentUser.foundedYear}-01-01` : "",
    teamSize: currentUser?.teamSize || "",
    industry: currentUser?.industry || "",
    companyDescription: currentUser?.companyDescription || "",
    pitchDeck: null,
    
    // Business Details (for investors)
    firm: currentUser?.firm || "",
    investmentFocus: currentUser?.investmentFocus || [],
    investmentRange: currentUser?.checkSize || "",
    portfolioCompanies: currentUser?.portfolioCompanies || 0,
    yearsExperience: currentUser?.experienceYears || 0,
    
    // Preferences
    emailNotifications: {
      newMatches: true,
      messages: true,
      funding: true,
      marketing: false
    },
    pushNotifications: {
      instantMessages: true,
      dailyDigest: false,
      weeklyReport: true
    },
    privacy: {
      profileVisibility: "public",
      contactInfo: "connections",
      activityStatus: true
    },
    communication: {
      preferredMethod: "email",
      timeZone: "PST",
      language: "en"
    }
  });

  // Update profile data when user changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        linkedin: user.linkedin || "",
        profileImage: user.avatar || null,
        companyName: user.companyName || "",
        foundingDate: user.foundedYear ? `${user.foundedYear}-01-01` : "",
        teamSize: user.teamSize || "",
        industry: user.industry || "",
        companyDescription: user.companyDescription || "",
        firm: user.firm || "",
        investmentFocus: user.investmentFocus || [],
        investmentRange: user.checkSize || "",
        portfolioCompanies: user.portfolioCompanies || 0,
        yearsExperience: user.experienceYears || 0
      }));
    }
  }, [user]);

  const tabs = [
    {
      id: 'personal',
      name: 'Personal Info',
      icon: 'User',
      description: 'Update your personal details and contact information'
    },
    {
      id: 'business',
      name: 'Business Details', 
      icon: 'Building',
      description: currentUser?.role === 'startup' ?'Manage your company information and pitch materials' :'Update your investment criteria and portfolio details'
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: 'Settings',
      description: 'Configure notifications, privacy, and communication settings'
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 3000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [profileData, hasUnsavedChanges]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      console.log('Profile auto-saved:', profileData);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleDataChange = (section, field, value) => {
    setProfileData(prev => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev?.[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
    
    setHasUnsavedChanges(true);
  };

  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(tabId);
      setShowConfirmDialog(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleConfirmNavigation = () => {
    setActiveTab(pendingNavigation);
    setShowConfirmDialog(false);
    setPendingNavigation(null);
    setHasUnsavedChanges(false);
  };

  const handleSaveChanges = async () => {
    try {
      setIsAutoSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user data
      setCurrentUser(prev => ({
        ...prev,
        name: profileData?.name,
        email: profileData?.email,
        phone: profileData?.phone,
        bio: profileData?.bio,
        avatar: profileData?.profileImage
      }));
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      console.log('Profile saved successfully:', profileData);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoTab
            data={profileData}
            onChange={handleDataChange}
            currentUser={currentUser}
          />
        );
      case 'business':
        return (
          <BusinessDetailsTab
            data={profileData}
            onChange={handleDataChange}
            userRole={currentUser?.role}
          />
        );
      case 'preferences':
        return (
          <PreferencesTab
            data={profileData}
            onChange={handleDataChange}
          />
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={currentUser} 
        notifications={2} 
        onNavigate={navigate}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile Management</h1>
                <p className="text-muted-foreground">
                  Update your information and customize your FundNest experience
                </p>
              </div>
            </div>

            {/* Save Status */}
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {isAutoSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-muted-foreground">Saving...</span>
                    </>
                  ) : hasUnsavedChanges ? (
                    <>
                      <div className="w-2 h-2 bg-warning rounded-full" />
                      <span className="text-sm text-muted-foreground">Unsaved changes</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-muted-foreground">
                        Last saved {formatTimeAgo(lastSaved)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {hasUnsavedChanges && (
                <Button
                  onClick={handleSaveChanges}
                  loading={isAutoSaving}
                  size="sm"
                  iconName="Save"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`
                      w-full text-left p-4 rounded-lg transition-colors flex items-start space-x-3 hover:bg-muted/50
                      ${activeTab === tab?.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <Icon name={tab?.icon} size={20} strokeWidth={2} />
                    <div className="min-w-0">
                      <div className="font-medium">{tab?.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tab?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* KYC Status Card */}
              {currentUser?.kycStatus === 'verified' && (
                <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="ShieldCheck" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">Verified Account</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your identity has been verified. You have access to all platform features.
                  </p>
                </div>
              )}

              {currentUser?.kycStatus !== 'verified' && (
                <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-warning">Verification Pending</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Complete your identity verification to unlock all features.
                  </p>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => navigate('/kyc-verification')}
                  >
                    Verify Now
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={32} className="text-warning" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Unsaved Changes
                </h3>
                <p className="text-muted-foreground">
                  You have unsaved changes that will be lost. Are you sure you want to continue?
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleConfirmNavigation}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileManagement;