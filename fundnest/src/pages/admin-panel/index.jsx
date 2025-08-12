import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import UserManagementTab from './components/UserManagementTab';
import KycReviewsTab from './components/KycReviewsTab';
import ContentModerationTab from './components/ContentModerationTab';
import SystemSettingsTab from './components/SystemSettingsTab';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Select from '../../components/ui/Select';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [isLoading, setIsLoading] = useState(false);

  // Mock admin user data
  const currentUser = {
    id: 'admin_001',
    name: 'John Administrator',
    email: 'admin@fundnest.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    kycStatus: 'verified',
    tier: 'admin',
    adminLevel: 'super_admin' // super_admin, admin, moderator
  };

  // Mock dashboard metrics
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalUsers: 12458,
    userGrowth: 18.5,
    pendingKyc: 89,
    kycChange: -12,
    activeSubscriptions: 2847,
    subscriptionChange: 23.7,
    platformActivity: 94.2,
    activityChange: 5.8,
    monthlyRevenue: 157890,
    revenueChange: 31.2
  });

  // Mock activity data
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 'act_001',
      type: 'user_registration',
      message: 'New startup registered: TechFlow Solutions',
      timestamp: new Date(Date.now() - 300000),
      severity: 'info',
      actionRequired: false
    },
    {
      id: 'act_002',
      type: 'kyc_submission',
      message: 'KYC document submitted for review: Demo User',
      timestamp: new Date(Date.now() - 600000),
      severity: 'warning',
      actionRequired: true
    },
    {
      id: 'act_003',
      type: 'subscription_upgrade',
      message: 'Pro subscription activated: InvestCorp LLC',
      timestamp: new Date(Date.now() - 1200000),
      severity: 'success',
      actionRequired: false
    },
    {
      id: 'act_004',
      type: 'content_report',
      message: 'Profile reported for inappropriate content',
      timestamp: new Date(Date.now() - 1800000),
      severity: 'error',
      actionRequired: true
    },
    {
      id: 'act_005',
      type: 'system_alert',
      message: 'High API usage detected on payment processing',
      timestamp: new Date(Date.now() - 3600000),
      severity: 'warning',
      actionRequired: true
    }
  ]);

  const tabOptions = [
    {
      id: 'users',
      name: 'User Management',
      icon: 'Users',
      description: 'Manage user accounts, permissions, and registrations',
      count: dashboardMetrics?.totalUsers
    },
    {
      id: 'kyc',
      name: 'KYC Reviews',
      icon: 'ShieldCheck',
      description: 'Review and approve identity verification documents',
      count: dashboardMetrics?.pendingKyc
    },
    {
      id: 'content',
      name: 'Content Moderation',
      icon: 'Flag',
      description: 'Monitor and moderate platform content and reports',
      count: 12
    },
    {
      id: 'settings',
      name: 'System Settings',
      icon: 'Settings',
      description: 'Configure platform settings and feature flags',
      count: null
    }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'custom', label: 'Custom range' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Exporting ${activeTab} data for ${dateRange}`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UserManagementTab
            searchQuery={searchQuery}
            dateRange={dateRange}
            onUserAction={(action, userId) => console.log(`${action} user ${userId}`)}
          />
        );
      case 'kyc':
        return (
          <KycReviewsTab
            searchQuery={searchQuery}
            dateRange={dateRange}
            onKycAction={(action, kycId) => console.log(`${action} KYC ${kycId}`)}
          />
        );
      case 'content':
        return (
          <ContentModerationTab
            searchQuery={searchQuery}
            dateRange={dateRange}
            onContentAction={(action, contentId) => console.log(`${action} content ${contentId}`)}
          />
        );
      case 'settings':
        return (
          <SystemSettingsTab
            onSettingChange={(setting, value) => console.log(`Changed ${setting} to ${value}`)}
          />
        );
      default:
        return null;
    }
  };

  const MetricCard = ({ title, value, change, icon, isPercentage = false, isCurrency = false }) => {
    const isPositive = change > 0;
    const formattedValue = isCurrency 
      ? `$${value?.toLocaleString()}` 
      : isPercentage 
        ? `${value}%` 
        : value?.toLocaleString();

    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{formattedValue}</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={24} className="text-primary" />
          </div>
        </div>
        
        <div className="flex items-center mt-4 space-x-2">
          <Icon 
            name={isPositive ? "TrendingUp" : "TrendingDown"} 
            size={16} 
            className={isPositive ? "text-success" : "text-destructive"}
          />
          <span className={`text-sm font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
            {Math?.abs(change)}%
          </span>
          <span className="text-sm text-muted-foreground">vs last period</span>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getSeverityStyles = (severity) => {
      switch (severity) {
        case 'error': return 'bg-destructive/10 text-destructive border-destructive/20';
        case 'warning': return 'bg-warning/10 text-warning border-warning/20';
        case 'success': return 'bg-success/10 text-success border-success/20';
        default: return 'bg-primary/10 text-primary border-primary/20';
      }
    };

    const getSeverityIcon = (severity) => {
      switch (severity) {
        case 'error': return 'AlertTriangle';
        case 'warning': return 'AlertCircle';
        case 'success': return 'CheckCircle';
        default: return 'Info';
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-muted/20 rounded-lg transition-smooth">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getSeverityStyles(activity?.severity)}`}>
          <Icon name={getSeverityIcon(activity?.severity)} size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{activity?.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(activity?.timestamp)?.toLocaleString()}
          </p>
        </div>
        {activity?.actionRequired && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={currentUser} 
        notifications={recentActivity?.filter(a => a?.actionRequired)?.length}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive platform management and oversight tools
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Select
                  options={dateRangeOptions}
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Select range"
                  className="w-48"
                />
                <Button
                  variant="outline"
                  iconName="Download"
                  onClick={handleExportData}
                  loading={isLoading}
                >
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Users"
              value={dashboardMetrics?.totalUsers}
              change={dashboardMetrics?.userGrowth}
              icon="Users"
            />
            <MetricCard
              title="Pending KYC"
              value={dashboardMetrics?.pendingKyc}
              change={dashboardMetrics?.kycChange}
              icon="ShieldCheck"
            />
            <MetricCard
              title="Active Subscriptions"
              value={dashboardMetrics?.activeSubscriptions}
              change={dashboardMetrics?.subscriptionChange}
              icon="CreditCard"
            />
            <MetricCard
              title="Platform Activity"
              value={dashboardMetrics?.platformActivity}
              change={dashboardMetrics?.activityChange}
              icon="Activity"
              isPercentage
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="xl:col-span-3">
              {/* Tab Navigation */}
              <div className="bg-card border border-border rounded-lg mb-6">
                <div className="border-b border-border p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-1 overflow-x-auto">
                      {tabOptions?.map((tab) => (
                        <button
                          key={tab?.id}
                          onClick={() => handleTabChange(tab?.id)}
                          className={`
                            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth
                            whitespace-nowrap focus-ring
                            ${activeTab === tab?.id
                              ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }
                          `}
                        >
                          <Icon name={tab?.icon} size={16} />
                          <span>{tab?.name}</span>
                          {tab?.count !== null && (
                            <div className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {tab?.count}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Search ${tabOptions?.find(t => t?.id === activeTab)?.name?.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e?.target?.value)}
                        className="w-64 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Button variant="outline" size="sm" iconName="Filter">
                        Filter
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>

            {/* Activity Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                  <div className="flex items-center space-x-2">
                    {recentActivity?.filter(a => a?.actionRequired)?.length > 0 && (
                      <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                    )}
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {recentActivity?.map((activity) => (
                    <ActivityItem key={activity?.id} activity={activity} />
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => console.log('View all activity')}
                >
                  View All Activity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;