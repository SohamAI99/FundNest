import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, startupAPI } from '../../utils/api';
import AppHeader from '../../components/ui/AppHeader';
import MetricsCard from './components/MetricsCard';
import InvestorCard from './components/InvestorCard';
import ActivityFeed from './components/ActivityFeed';
import PitchManager from './components/PitchManager';
import FilterPanel from './components/FilterPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const StartupDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock user data
  const currentUser = {
    id: 1,
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
    role: "startup",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    kycStatus: "verified",
    subscriptionTier: "free"
  };

  // Mock metrics data
  const metricsData = [
    {
      title: "Funding Progress",
      value: "₹125K",
      subtitle: "of ₹500K goal (25%)",
      icon: "Target",
      trend: "up",
      trendValue: "+12%",
      color: "primary"
    },
    {
      title: "Active Conversations",
      value: "8",
      subtitle: "with potential investors",
      icon: "MessageCircle",
      trend: "up",
      trendValue: "+3",
      color: "accent"
    },
    {
      title: "Average Match Score",
      value: "78%",
      subtitle: "compatibility rating",
      icon: "TrendingUp",
      trend: "up",
      trendValue: "+5%",
      color: "success"
    },
    {
      title: "Pitch Deck Views",
      value: "24",
      subtitle: "in the last 7 days",
      icon: "Eye",
      trend: "up",
      trendValue: "+8",
      color: "warning"
    }
  ];

  // Mock investors data
  const investorsData = [
    {
      id: 1,
      name: "Michael Rodriguez",
      firm: "TechVentures Capital",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      matchScore: 92,
      minInvestment: 100000,
      maxInvestment: 500000,
      sector: "FinTech",
      stage: "Seed",
      location: "San Francisco, CA",
      portfolioSize: 23,
      matchReasoning: "Strong alignment with your FinTech focus, previous investments in similar stage companies, and geographic proximity for hands-on support. Your revenue model matches their investment thesis perfectly."
    },
    {
      id: 2,
      name: "Jennifer Park",
      firm: "Innovation Partners",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      matchScore: 87,
      minInvestment: 250000,
      maxInvestment: 1000000,
      sector: "SaaS",
      stage: "Series A",
      location: "New York, NY",
      portfolioSize: 31,
      matchReasoning: "Excellent track record with B2B SaaS companies, particularly those with strong recurring revenue models. Your customer acquisition metrics align with their success criteria."
    },
    {
      id: 3,
      name: "David Kim",
      firm: "Future Fund",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      matchScore: 81,
      minInvestment: 50000,
      maxInvestment: 300000,
      sector: "AI/ML",
      stage: "Pre-Seed",
      location: "Austin, TX",
      portfolioSize: 18,
      matchReasoning: "Deep expertise in AI/ML technologies with a focus on early-stage companies. Your technical approach and market opportunity resonate with their investment philosophy."
    },
    {
      id: 4,
      name: "Lisa Thompson",
      firm: "Growth Equity Partners",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      matchScore: 76,
      minInvestment: 500000,
      maxInvestment: 2000000,
      sector: "HealthTech",
      stage: "Series B",
      location: "Boston, MA",
      portfolioSize: 42,
      matchReasoning: "Strong background in healthcare technology investments with a focus on scalable solutions. Your regulatory approach and market validation strategy align with their due diligence criteria."
    },
    {
      id: 5,
      name: "Robert Chen",
      firm: "Seed Accelerator Fund",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      matchScore: 73,
      minInvestment: 25000,
      maxInvestment: 150000,
      sector: "EdTech",
      stage: "Seed",
      location: "Seattle, WA",
      portfolioSize: 67,
      matchReasoning: "Extensive experience with education technology startups and a proven track record of helping companies scale. Your user engagement metrics and growth potential match their investment criteria."
    },
    {
      id: 6,
      name: "Amanda Foster",
      firm: "Digital Ventures",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      matchScore: 69,
      minInvestment: 100000,
      maxInvestment: 750000,
      sector: "E-commerce",
      stage: "Series A",
      location: "Los Angeles, CA",
      portfolioSize: 29,
      matchReasoning: "Strong focus on consumer-facing technologies with expertise in e-commerce platforms. Your customer acquisition strategy and market positioning align with their portfolio approach."
    }
  ];

  // Mock activity data
  const activitiesData = [
    {
      id: 1,
      type: 'match',
      user: 'Michael Rodriguez',
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      action: 'was matched with you',
      description: '92% compatibility score',
      timestamp: new Date(Date.now() - 300000),
      unread: true
    },
    {
      id: 2,
      type: 'message',
      user: 'Jennifer Park',
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      action: 'sent you a message',
      description: 'Interested in learning more about your revenue model',
      timestamp: new Date(Date.now() - 1800000),
      unread: true
    },
    {
      id: 3,
      type: 'pitch_view',
      user: 'David Kim',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      action: 'viewed your pitch deck',
      description: 'Spent 8 minutes reviewing your presentation',
      timestamp: new Date(Date.now() - 3600000),
      unread: false
    },
    {
      id: 4,
      type: 'connection',
      user: 'Lisa Thompson',
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      action: 'accepted your connection request',
      description: 'You can now message each other directly',
      timestamp: new Date(Date.now() - 7200000),
      unread: false
    },
    {
      id: 5,
      type: 'funding',
      user: 'System',
      action: 'updated your funding progress',
      description: 'New milestone: 25% of funding goal reached',
      timestamp: new Date(Date.now() - 86400000),
      unread: false
    }
  ];

  // Mock current pitch data
  const currentPitch = {
    name: "TechStartup_PitchDeck_v2.1.pdf",
    size: "2.4 MB",
    uploadDate: "Dec 8, 2024"
  };

  useEffect(() => {
    setFilteredInvestors(investorsData);
  }, []);

  // Dynamic metrics data using real stats
  const getMetricsData = () => {
    if (loading || !dashboardStats) {
      return [
        {
          title: "Loading...",
          value: "...",
          subtitle: "Fetching data",
          icon: "Target",
          trend: "neutral",
          trendValue: "",
          color: "primary"
        }
      ];
    }

    const startup = dashboardStats.startup_info;
    const fundingProgress = startup?.is_funded 
      ? 100
      : Math.min(((startup?.revenue_last_year || 0) / (startup?.funding_amount_max || 1)) * 100, 25);

    return [
      {
        title: "Funding Progress",
        value: startup?.is_funded 
          ? `₹${((startup.funding_amount_max || 0) / 1000000)?.toFixed(1)}M` 
          : `₹${((startup?.revenue_last_year || 0) / 1000000)?.toFixed(1)}M`,
        subtitle: startup?.is_funded 
          ? "Funding secured!" 
          : `of ₹${((startup?.funding_amount_max || 0) / 1000000)?.toFixed(1)}M goal`,
        icon: "Target",
        trend: startup?.is_funded ? "up" : "neutral",
        trendValue: startup?.is_funded ? "✓ Funded" : `${fundingProgress?.toFixed(0)}%`,
        color: startup?.is_funded ? "success" : "primary"
      },
      {
        title: "Active Conversations",
        value: dashboardStats.messages_count?.toString() || "0",
        subtitle: "with potential investors",
        icon: "MessageCircle",
        trend: dashboardStats.messages_count > 0 ? "up" : "neutral",
        trendValue: dashboardStats.messages_count > 0 ? `+${dashboardStats.messages_count}` : "New",
        color: "accent"
      },
      {
        title: "Average Match Score",
        value: dashboardStats.investor_matches > 0 ? "85%" : "0%",
        subtitle: "compatibility rating",
        icon: "TrendingUp",
        trend: dashboardStats.investor_matches > 0 ? "up" : "neutral",
        trendValue: dashboardStats.investor_matches > 0 ? "+5%" : "0%",
        color: "success"
      },
      {
        title: "Pitch Deck Views",
        value: dashboardStats.profile_completion >= 90 ? "24" : "0",
        subtitle: "in the last 7 days",
        icon: "Eye",
        trend: dashboardStats.profile_completion >= 90 ? "up" : "neutral",
        trendValue: dashboardStats.profile_completion >= 90 ? "+8" : "0",
        color: "warning"
      }
    ];
  };

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    
    let filtered = [...investorsData];
    
    // Apply match score filter
    if (filters?.matchScore) {
      const [min, max] = filters?.matchScore?.split('-')?.map(v => parseInt(v) || 0);
      filtered = filtered?.filter(investor => {
        if (filters?.matchScore === '5m+') return investor?.maxInvestment >= 5000000;
        return investor?.matchScore >= min && investor?.matchScore <= (max || 100);
      });
    }
    
    // Apply investment range filter
    if (filters?.investmentRange) {
      filtered = filtered?.filter(investor => {
        const range = filters?.investmentRange;
        if (range === '0-50k') return investor?.maxInvestment <= 50000;
        if (range === '50k-250k') return investor?.minInvestment >= 50000 && investor?.maxInvestment <= 250000;
        if (range === '250k-1m') return investor?.minInvestment >= 250000 && investor?.maxInvestment <= 1000000;
        if (range === '1m-5m') return investor?.minInvestment >= 1000000 && investor?.maxInvestment <= 5000000;
        if (range === '5m+') return investor?.minInvestment >= 5000000;
        return true;
      });
    }
    
    // Apply sector filter
    if (filters?.sector) {
      filtered = filtered?.filter(investor => 
        investor?.sector?.toLowerCase()?.includes(filters?.sector?.toLowerCase())
      );
    }
    
    // Apply stage filter
    if (filters?.stage) {
      filtered = filtered?.filter(investor => 
        investor?.stage?.toLowerCase()?.replace(/\s+/g, '-') === filters?.stage
      );
    }
    
    // Apply location filter
    if (filters?.location) {
      filtered = filtered?.filter(investor => 
        investor?.location?.toLowerCase()?.includes(filters?.location?.replace('-', ' '))
      );
    }
    
    setFilteredInvestors(filtered);
  };

  const handleConnect = (investor) => {
    if (currentUser?.subscriptionTier === 'free') {
      setShowUpgradeModal(true);
    } else {
      navigate('/messaging-system', { state: { selectedInvestor: investor } });
    }
  };

  const handleViewProfile = (investor) => {
    console.log('View profile:', investor);
  };

  const handleUpgradeToPro = () => {
    setShowUpgradeModal(false);
    // Navigate to subscription page when implemented
    console.log('Upgrade to Pro');
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {currentUser?.name?.split(' ')?.[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your funding journey today.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getMetricsData().map((metric, index) => (
              <MetricsCard 
                key={index} 
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                icon={metric.icon}
                trend={metric.trend}
                trendValue={metric.trendValue}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Investors */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter Panel */}
              <FilterPanel 
                onFiltersChange={handleFiltersChange}
                totalResults={filteredInvestors?.length}
              />

              {/* Investors Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    AI-Recommended Investors
                  </h2>
                  <Button variant="outline" size="sm" iconName="RefreshCw">
                    Refresh Matches
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredInvestors?.map((investor) => (
                    <InvestorCard
                      key={investor?.id}
                      investor={investor}
                      onConnect={handleConnect}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
                
                {filteredInvestors?.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-muted/30 rounded-full flex items-center justify-center mb-4">
                      <Icon name="Search" size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No investors found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters to see more results.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => handleFiltersChange({})}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Activity & Pitch */}
            <div className="space-y-6">
              {/* Activity Feed */}
              <ActivityFeed activities={activitiesData} />
              
              {/* Pitch Manager */}
              <PitchManager 
                currentPitch={currentPitch}
                onUpload={(file) => console.log('Upload:', file)}
                onAnalyze={() => console.log('Analyze pitch')}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                <Icon name="Crown" size={32} className="text-accent" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upgrade to Pro
                </h3>
                <p className="text-muted-foreground">
                  Connect with investors and unlock messaging features with a Pro subscription.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  variant="default"
                  onClick={handleUpgradeToPro}
                  className="flex-1"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupDashboard;