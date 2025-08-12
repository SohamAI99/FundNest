import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PreferencesTab = ({ data, onChange }) => {
  const timeZones = [
    { value: 'PST', label: 'Pacific Standard Time (PST)' },
    { value: 'MST', label: 'Mountain Standard Time (MST)' },
    { value: 'CST', label: 'Central Standard Time (CST)' },
    { value: 'EST', label: 'Eastern Standard Time (EST)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
    { value: 'GMT', label: 'Greenwich Mean Time (GMT)' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
  ];

  const communicationMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'video', label: 'Video Call' },
    { value: 'message', label: 'Platform Messages' },
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public - Visible to everyone' },
    { value: 'connections', label: 'Connections Only - Visible to your network' },
    { value: 'private', label: 'Private - Only visible to you' },
  ];

  const contactOptions = [
    { value: 'everyone', label: 'Everyone can contact me' },
    { value: 'connections', label: 'Only my connections' },
    { value: 'verified', label: 'Only verified users' },
  ];

  const PreferenceSection = ({ title, description, children }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-start justify-between">
      <div className="flex-1 mr-4">
        <label className="text-sm font-medium text-foreground block">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-primary' : 'bg-muted'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Preferences</h2>
        <p className="text-muted-foreground">
          Customize your FundNest experience and control how you interact with the platform.
        </p>
      </div>

      {/* Email Notifications */}
      <PreferenceSection
        title="Email Notifications"
        description="Choose what updates you'd like to receive via email"
      >
        <ToggleSwitch
          checked={data?.emailNotifications?.newMatches || false}
          onChange={(value) => onChange('emailNotifications', 'newMatches', value)}
          label="New Matches"
          description="When we find potential partners that match your criteria"
        />
        
        <ToggleSwitch
          checked={data?.emailNotifications?.messages || false}
          onChange={(value) => onChange('emailNotifications', 'messages', value)}
          label="Messages"
          description="New messages from your connections"
        />
        
        <ToggleSwitch
          checked={data?.emailNotifications?.funding || false}
          onChange={(value) => onChange('emailNotifications', 'funding', value)}
          label="Funding Updates"
          description="Important funding milestones and opportunities"
        />
        
        <ToggleSwitch
          checked={data?.emailNotifications?.marketing || false}
          onChange={(value) => onChange('emailNotifications', 'marketing', value)}
          label="Marketing & Updates"
          description="Product updates, tips, and promotional content"
        />
      </PreferenceSection>

      {/* Push Notifications */}
      <PreferenceSection
        title="Push Notifications"
        description="Manage browser and mobile notifications"
      >
        <ToggleSwitch
          checked={data?.pushNotifications?.instantMessages || false}
          onChange={(value) => onChange('pushNotifications', 'instantMessages', value)}
          label="Instant Messages"
          description="Real-time notifications for new messages"
        />
        
        <ToggleSwitch
          checked={data?.pushNotifications?.dailyDigest || false}
          onChange={(value) => onChange('pushNotifications', 'dailyDigest', value)}
          label="Daily Digest"
          description="Summary of daily activity and opportunities"
        />
        
        <ToggleSwitch
          checked={data?.pushNotifications?.weeklyReport || false}
          onChange={(value) => onChange('pushNotifications', 'weeklyReport', value)}
          label="Weekly Report"
          description="Weekly performance and networking insights"
        />
      </PreferenceSection>

      {/* Privacy Settings */}
      <PreferenceSection
        title="Privacy & Visibility"
        description="Control who can see your information and activity"
      >
        <div className="space-y-4">
          <div>
            <Select
              label="Profile Visibility"
              value={data?.privacy?.profileVisibility || 'public'}
              onChange={(value) => onChange('privacy', 'profileVisibility', value)}
              options={visibilityOptions}
            />
          </div>
          
          <div>
            <Select
              label="Contact Information"
              value={data?.privacy?.contactInfo || 'connections'}
              onChange={(value) => onChange('privacy', 'contactInfo', value)}
              options={contactOptions}
            />
          </div>
          
          <ToggleSwitch
            checked={data?.privacy?.activityStatus || false}
            onChange={(value) => onChange('privacy', 'activityStatus', value)}
            label="Show Activity Status"
            description="Let others see when you're online and active"
          />
        </div>
      </PreferenceSection>

      {/* Communication Preferences */}
      <PreferenceSection
        title="Communication"
        description="Set your preferred methods and settings for communication"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Preferred Contact Method"
            value={data?.communication?.preferredMethod || 'email'}
            onChange={(value) => onChange('communication', 'preferredMethod', value)}
            options={communicationMethods}
          />
          
          <Select
            label="Time Zone"
            value={data?.communication?.timeZone || 'PST'}
            onChange={(value) => onChange('communication', 'timeZone', value)}
            options={timeZones}
          />
          
          <Select
            label="Language"
            value={data?.communication?.language || 'en'}
            onChange={(value) => onChange('communication', 'language', value)}
            options={languages}
          />
        </div>
      </PreferenceSection>

      {/* Data & Privacy */}
      <PreferenceSection
        title="Data & Privacy"
        description="Manage your data and account security"
      >
        <div className="space-y-4">
          <Button variant="outline" iconName="Download" size="sm">
            Download My Data
          </Button>
          
          <Button variant="outline" iconName="Shield" size="sm">
            Two-Factor Authentication
          </Button>
          
          <Button variant="outline" iconName="Key" size="sm">
            Change Password
          </Button>
        </div>
      </PreferenceSection>

      {/* Account Actions */}
      <div className="border-t border-border pt-8">
        <PreferenceSection
          title="Account Management"
          description="Manage your account status and data"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" iconName="Pause" size="sm">
              Deactivate Account
            </Button>
            
            <Button variant="outline" iconName="Trash2" size="sm">
              Delete Account
            </Button>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Account Deletion</p>
                <p className="text-muted-foreground mt-1">
                  Deleting your account is permanent and cannot be undone. All your data, connections, and messages will be permanently removed.
                </p>
              </div>
            </div>
          </div>
        </PreferenceSection>
      </div>
    </div>
  );
};

export default PreferencesTab;