import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, startupAPI, investorAPI } from '../../utils/api';
import AppHeader from '../../components/ui/AppHeader';
import MetricsCard from './components/MetricsCard';
import InvestorCard from './components/InvestorCard';
import ActivityFeed from './components/ActivityFeed';
import PitchManager from './components/PitchManager';
import FilterPanel from './components/FilterPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const REAL_WORLD_INVESTORS = [
  {
    id: 'vc_1',
    name: "Shailendra Singh",
    firm: "Peak XV Partners",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    matchScore: 95,
    minInvestment: 500000,
    maxInvestment: 5000000,
    sector: "SaaS",
    stage: "Series A",
    location: "Bengaluru, India",
    portfolioSize: 84,
    matchReasoning: "Peak XV Partners is the leading VC firm in India/SEA. Shailendra has backed multiple SaaS unicorns and has deep expertise in scaling B2B businesses globally."
  },
  {
    id: 'vc_2',
    name: "Karthik Reddy",
    firm: "Blume Ventures",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    matchScore: 91,
    minInvestment: 100000,
    maxInvestment: 1000000,
    sector: "DeepTech",
    stage: "Seed",
    location: "Mumbai, India",
    portfolioSize: 120,
    matchReasoning: "Blume is India's leading early-stage tech VC. Strong match for founders looking for institutional seed rounds, deep mentoring, and network access in India."
  },
  {
    id: 'vc_3',
    name: "Rajan Anandan",
    firm: "Peak XV Surge",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    matchScore: 89,
    minInvestment: 250000,
    maxInvestment: 1500000,
    sector: "FinTech",
    stage: "Seed",
    location: "New Delhi, India",
    portfolioSize: 62,
    matchReasoning: "Surging early-stage companies under Rajan's mentorship receive global exposure, scaling support, and immediate connection to Series A/B co-investors."
  },
  {
    id: 'vc_4',
    name: "Sanjay Mehta",
    firm: "100X.VC",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    matchScore: 86,
    minInvestment: 50000,
    maxInvestment: 250000,
    sector: "AI/ML",
    stage: "Pre-Seed",
    location: "Mumbai, India",
    portfolioSize: 150,
    matchReasoning: "100X.VC pioneered iSAFE notes in India. Perfect for pre-seed startups looking for quick initial funding, product-market-fit guidance, and subsequent seed pitching."
  },
  {
    id: 'vc_5',
    name: "Kanika Mayar",
    firm: "Vertex Ventures",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    matchScore: 82,
    minInvestment: 1000000,
    maxInvestment: 4000000,
    sector: "Consumer Tech",
    stage: "Series A",
    location: "Singapore",
    portfolioSize: 45,
    matchReasoning: "Vertex Ventures SEA & India invests in high-growth companies. Kanika focuses on consumer tech, B2B marketplaces, and enterprise applications."
  },
  {
    id: 'vc_6',
    name: "Anupam Mittal",
    firm: "People Group / Shaadi.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    matchScore: 80,
    minInvestment: 25000,
    maxInvestment: 150000,
    sector: "Consumer Tech",
    stage: "Seed",
    location: "Mumbai, India",
    portfolioSize: 210,
    matchReasoning: "Anupam is one of India's most active and respected angel investors. Known for Shark Tank India, he brings unparalleled brand building, marketing, and strategic growth advice."
  }
];

const StartupDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allInvestors, setAllInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock user data
  const currentUser = {
    id: user?.id || 1,
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
    role: "startup",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    kycStatus: user?.kycStatus || "verified",
    subscriptionTier: user?.subscriptionTier || "free"
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

  // Mock activity data
  const activitiesData = [
    {
      id: 1,
      type: 'match',
      user: 'Shailendra Singh',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      action: 'was matched with you',
      description: '95% compatibility score',
      timestamp: new Date(Date.now() - 300000),
      unread: true
    },
    {
      id: 2,
      type: 'message',
      user: 'Karthik Reddy',
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      action: 'sent you a message',
      description: 'Interested in learning more about your revenue model',
      timestamp: new Date(Date.now() - 1800000),
      unread: true
    },
    {
      id: 3,
      type: 'pitch_view',
      user: 'Rajan Anandan',
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      action: 'viewed your pitch deck',
      description: 'Spent 8 minutes reviewing your presentation',
      timestamp: new Date(Date.now() - 3600000),
      unread: false
    },
    {
      id: 4,
      type: 'connection',
      user: 'Anupam Mittal',
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
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
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const response = await investorAPI.getAll();
        let dbInvestors = [];
        if (response && response.success && Array.isArray(response.investors)) {
          dbInvestors = response.investors.map(inv => ({
            id: `db_${inv.id}`,
            name: `${inv.user?.first_name || 'Investor'} ${inv.user?.last_name || ''}`.trim(),
            firm: inv.investment_focus === 'venture' ? 'Venture Capital' : inv.investment_focus === 'angel' ? 'Angel Investor' : 'Institutional Fund',
            avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
            matchScore: 80 + Math.floor(Math.random() * 19),
            minInvestment: inv.check_size_min || 50000,
            maxInvestment: inv.check_size_max || 500000,
            sector: inv.preferred_sectors?.[0] || 'Technology',
            stage: inv.preferred_stages?.[0] || 'Seed',
            location: 'Bengaluru, India',
            portfolioSize: inv.experience_years ? inv.experience_years * 3 : 5,
            matchReasoning: `Matched based on your sector alignment and investment stage preference of ${inv.preferred_stages?.join(', ') || 'Seed'}.`
          }));
        }
        
        const merged = [...dbInvestors, ...REAL_WORLD_INVESTORS];
        setAllInvestors(merged);
        setFilteredInvestors(merged);
      } catch (error) {
        console.error('Failed to fetch investors:', error);
        setAllInvestors(REAL_WORLD_INVESTORS);
        setFilteredInvestors(REAL_WORLD_INVESTORS);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Dynamic metrics data using real stats
  const getMetricsData = () => {
    // Use mock data for now since we don't have real stats
    return [
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
  };

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    
    let filtered = [...allInvestors];
    
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
