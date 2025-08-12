import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const SystemSettingsTab = ({ onSettingChange }) => {
  const [activeSection, setActiveSection] = useState('platform');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    platform: {
      platformName: 'FundNest',
      maintenanceMode: false,
      registrationOpen: true,
      maxDailyRegistrations: 100,
      emailVerificationRequired: true,
      kycRequired: true,
      platformFeePercentage: 2.5
    },
    notifications: {
      emailNotificationsEnabled: true,
      pushNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      marketingEmailsEnabled: true,
      systemAlertsEnabled: true,
      emailProvider: 'sendgrid',
      emailTemplate: 'default'
    },
    security: {
      passwordMinLength: 8,
      requireStrongPassword: true,
      maxLoginAttempts: 5,
      sessionTimeout: 1800,
      twoFactorRequired: false,
      ipWhitelisting: false,
      fraudDetection: true
    },
    features: {
      messagingEnabled: true,
      messagingFreeLimit: 10,
      videoCallsEnabled: true,
      documentSharingEnabled: true,
      analyticsEnabled: true,
      aiMatchingEnabled: true,
      subscriptionPlansEnabled: true
    },
    integration: {
      stripeEnabled: true,
      paypalEnabled: false,
      slackWebhook: '',
      analyticsProvider: 'google',
      crmIntegration: 'none',
      emailProvider: 'sendgrid',
      storageProvider: 'aws'
    }
  });

  const sections = [
    {
      id: 'platform',
      name: 'Platform Settings',
      icon: 'Settings',
      description: 'Core platform configuration and business rules'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: 'Bell',
      description: 'Email, push, and communication settings'
    },
    {
      id: 'security',
      name: 'Security',
      icon: 'Shield',
      description: 'Authentication, passwords, and security policies'
    },
    {
      id: 'features',
      name: 'Features',
      icon: 'Zap',
      description: 'Enable/disable platform features and limits'
    },
    {
      id: 'integration',
      name: 'Integrations',
      icon: 'Link',
      description: 'Third-party services and API configurations'
    }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [key]: value
      }
    }));
    onSettingChange(`${section}.${key}`, value);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${checked ? 'bg-primary' : 'bg-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Platform Name
          </label>
          <input
            type="text"
            value={settings?.platform?.platformName}
            onChange={(e) => handleSettingChange('platform', 'platformName', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Daily Registrations
          </label>
          <input
            type="number"
            value={settings?.platform?.maxDailyRegistrations}
            onChange={(e) => handleSettingChange('platform', 'maxDailyRegistrations', parseInt(e?.target?.value))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Platform Fee (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={settings?.platform?.platformFeePercentage}
            onChange={(e) => handleSettingChange('platform', 'platformFeePercentage', parseFloat(e?.target?.value))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Maintenance Mode</p>
            <p className="text-sm text-muted-foreground">Temporarily disable platform access for maintenance</p>
          </div>
          <ToggleSwitch
            checked={settings?.platform?.maintenanceMode}
            onChange={(value) => handleSettingChange('platform', 'maintenanceMode', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Open Registration</p>
            <p className="text-sm text-muted-foreground">Allow new user registrations</p>
          </div>
          <ToggleSwitch
            checked={settings?.platform?.registrationOpen}
            onChange={(value) => handleSettingChange('platform', 'registrationOpen', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Email Verification Required</p>
            <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
          </div>
          <ToggleSwitch
            checked={settings?.platform?.emailVerificationRequired}
            onChange={(value) => handleSettingChange('platform', 'emailVerificationRequired', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">KYC Required</p>
            <p className="text-sm text-muted-foreground">Require identity verification for full access</p>
          </div>
          <ToggleSwitch
            checked={settings?.platform?.kycRequired}
            onChange={(value) => handleSettingChange('platform', 'kycRequired', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Provider
          </label>
          <Select
            options={[
              { value: 'sendgrid', label: 'SendGrid' },
              { value: 'mailgun', label: 'Mailgun' },
              { value: 'ses', label: 'AWS SES' }
            ]}
            value={settings?.notifications?.emailProvider}
            onChange={(value) => handleSettingChange('notifications', 'emailProvider', value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Template
          </label>
          <Select
            options={[
              { value: 'default', label: 'Default' },
              { value: 'modern', label: 'Modern' },
              { value: 'minimal', label: 'Minimal' }
            ]}
            value={settings?.notifications?.emailTemplate}
            onChange={(value) => handleSettingChange('notifications', 'emailTemplate', value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Send transactional and system emails</p>
          </div>
          <ToggleSwitch
            checked={settings?.notifications?.emailNotificationsEnabled}
            onChange={(value) => handleSettingChange('notifications', 'emailNotificationsEnabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Push Notifications</p>
            <p className="text-sm text-muted-foreground">Send browser push notifications</p>
          </div>
          <ToggleSwitch
            checked={settings?.notifications?.pushNotificationsEnabled}
            onChange={(value) => handleSettingChange('notifications', 'pushNotificationsEnabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">SMS Notifications</p>
            <p className="text-sm text-muted-foreground">Send SMS for critical alerts</p>
          </div>
          <ToggleSwitch
            checked={settings?.notifications?.smsNotificationsEnabled}
            onChange={(value) => handleSettingChange('notifications', 'smsNotificationsEnabled', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            min="6"
            max="20"
            value={settings?.security?.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e?.target?.value))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings?.security?.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e?.target?.value))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Session Timeout (seconds)
          </label>
          <input
            type="number"
            min="300"
            max="7200"
            value={settings?.security?.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e?.target?.value))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Require Strong Passwords</p>
            <p className="text-sm text-muted-foreground">Enforce complex password requirements</p>
          </div>
          <ToggleSwitch
            checked={settings?.security?.requireStrongPassword}
            onChange={(value) => handleSettingChange('security', 'requireStrongPassword', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
          </div>
          <ToggleSwitch
            checked={settings?.security?.twoFactorRequired}
            onChange={(value) => handleSettingChange('security', 'twoFactorRequired', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Fraud Detection</p>
            <p className="text-sm text-muted-foreground">Enable automated fraud detection systems</p>
          </div>
          <ToggleSwitch
            checked={settings?.security?.fraudDetection}
            onChange={(value) => handleSettingChange('security', 'fraudDetection', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderFeatureSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Free Messaging Limit (per month)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings?.features?.messagingFreeLimit}
            onChange={(e) => handleSettingChange('features', 'messagingFreeLimit', parseInt(e?.target?.value))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Messaging System</p>
            <p className="text-sm text-muted-foreground">Enable platform messaging between users</p>
          </div>
          <ToggleSwitch
            checked={settings?.features?.messagingEnabled}
            onChange={(value) => handleSettingChange('features', 'messagingEnabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Video Calls</p>
            <p className="text-sm text-muted-foreground">Allow video calls between users</p>
          </div>
          <ToggleSwitch
            checked={settings?.features?.videoCallsEnabled}
            onChange={(value) => handleSettingChange('features', 'videoCallsEnabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">AI Matching</p>
            <p className="text-sm text-muted-foreground">Enable AI-powered startup-investor matching</p>
          </div>
          <ToggleSwitch
            checked={settings?.features?.aiMatchingEnabled}
            onChange={(value) => handleSettingChange('features', 'aiMatchingEnabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Subscription Plans</p>
            <p className="text-sm text-muted-foreground">Enable Pro and premium subscription tiers</p>
          </div>
          <ToggleSwitch
            checked={settings?.features?.subscriptionPlansEnabled}
            onChange={(value) => handleSettingChange('features', 'subscriptionPlansEnabled', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Analytics Provider
          </label>
          <Select
            options={[
              { value: 'google', label: 'Google Analytics' },
              { value: 'mixpanel', label: 'Mixpanel' },
              { value: 'amplitude', label: 'Amplitude' }
            ]}
            value={settings?.integration?.analyticsProvider}
            onChange={(value) => handleSettingChange('integration', 'analyticsProvider', value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Storage Provider
          </label>
          <Select
            options={[
              { value: 'aws', label: 'AWS S3' },
              { value: 'gcp', label: 'Google Cloud Storage' },
              { value: 'azure', label: 'Azure Blob Storage' }
            ]}
            value={settings?.integration?.storageProvider}
            onChange={(value) => handleSettingChange('integration', 'storageProvider', value)}
            className="w-full"
          />
        </div>
        
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Slack Webhook URL
          </label>
          <input
            type="url"
            value={settings?.integration?.slackWebhook}
            onChange={(e) => handleSettingChange('integration', 'slackWebhook', e?.target?.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">Stripe Integration</p>
            <p className="text-sm text-muted-foreground">Enable Stripe for payment processing</p>
          </div>
          <ToggleSwitch
            checked={settings?.integration?.stripeEnabled}
            onChange={(value) => handleSettingChange('integration', 'stripeEnabled', value)}
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">PayPal Integration</p>
            <p className="text-sm text-muted-foreground">Enable PayPal as payment option</p>
          </div>
          <ToggleSwitch
            checked={settings?.integration?.paypalEnabled}
            onChange={(value) => handleSettingChange('integration', 'paypalEnabled', value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'platform': return renderPlatformSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'features': return renderFeatureSettings();
      case 'integration': return renderIntegrationSettings();
      default: return renderPlatformSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections?.map((section) => (
          <button
            key={section?.id}
            onClick={() => setActiveSection(section?.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth
              ${activeSection === section?.id
                ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon name={section?.icon} size={16} />
            <span>{section?.name}</span>
          </button>
        ))}
      </div>

      {/* Active Section Description */}
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          {sections?.find(s => s?.id === activeSection)?.description}
        </p>
      </div>

      {/* Section Content */}
      <div className="bg-background border border-border rounded-lg p-6">
        {renderSectionContent()}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-4 border-t border-border">
        <Button
          onClick={handleSaveSettings}
          loading={isSaving}
          iconName="Save"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SystemSettingsTab;