import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, investorAPI, startupAPI } from '../../utils/api';
import AppHeader from '../../components/ui/AppHeader';
import FilterPanel from './components/FilterPanel';
import MetricsBar from './components/MetricsBar';
import StartupCard from './components/StartupCard';
import ActivityPanel from './components/ActivityPanel';
import PitchModal from './components/PitchModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const REAL_WORLD_STARTUPS = [
  {
    id: 'startup_rw1',
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    description: 'Razorpay is India’s leading full-stack financial services provider, offering payments, banking, and credit solutions for businesses of all sizes.',
    sector: 'FinTech',
    stage: 'growth',
    location: 'Bengaluru, India',
    fundingTarget: 15000000,
    valuation: 7500000000,
    fundingProgress: 98,
    matchScore: 96,
    isVerified: true,
    isBookmarked: false,
    monthlyRevenue: 12000000,
    teamSize: 2200,
    riskLevel: 'low',
    aiThesis: 'Razorpay has established a commanding 60%+ market share in India’s payment gateway market. Strong growth, clear path to IPO, and excellent capital efficiency.',
    viewCount: 142
  },
  {
    id: 'startup_rw2',
    name: 'CRED',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
    description: 'CRED is a high-trust community of credit-worthy individuals, offering rewards, financial services, and premium commerce options to credit card users.',
    sector: 'FinTech',
    stage: 'growth',
    location: 'Bengaluru, India',
    fundingTarget: 8000000,
    valuation: 6400000000,
    fundingProgress: 88,
    matchScore: 92,
    isVerified: true,
    isBookmarked: true,
    monthlyRevenue: 4500000,
    teamSize: 800,
    riskLevel: 'medium',
    aiThesis: 'Highly engaged premium consumer base. CRED is expanding monetization via CRED Cash, CRED Pay, and premium travel/lifestyle products, raising average revenue per user.',
    viewCount: 98
  },
  {
    id: 'startup_rw3',
    name: 'Meesho',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
    description: 'Meesho is India’s largest social e-commerce platform, enabling small businesses and individuals to start online stores with zero capital via WhatsApp/Facebook.',
    sector: 'E-commerce',
    stage: 'growth',
    location: 'Bengaluru, India',
    fundingTarget: 12000000,
    valuation: 4900000000,
    fundingProgress: 92,
    matchScore: 89,
    isVerified: true,
    isBookmarked: false,
    monthlyRevenue: 18000000,
    teamSize: 1500,
    riskLevel: 'low',
    aiThesis: 'Superb traction in tier-2 and tier-3 towns. Meesho has optimized logistics and eliminated commissions, leading to a massive active transacting user count.',
    viewCount: 120
  },
  {
    id: 'startup_rw4',
    name: 'Zepto',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=100&h=100&fit=crop',
    description: 'Zepto is a 10-minute grocery delivery service that is transforming retail in India through dark stores, highly optimized supply chains, and fast delivery.',
    sector: 'Q-Commerce',
    stage: 'series-e',
    location: 'Mumbai, India',
    fundingTarget: 5000000,
    valuation: 3600000000,
    fundingProgress: 85,
    matchScore: 87,
    isVerified: true,
    isBookmarked: false,
    monthlyRevenue: 8000000,
    teamSize: 1100,
    riskLevel: 'medium',
    aiThesis: 'Quick commerce is expanding rapidly. Zepto demonstrates impressive dark-store level EBITDA profitability and high retention rates, outperforming traditional grocery apps.',
    viewCount: 115
  },
  {
    id: 'startup_rw5',
    name: 'PhysicsWallah',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
    description: 'PhysicsWallah is an educational platform offering affordable, high-quality coaching for JEE, NEET, and school board exams via online and offline learning hubs.',
    sector: 'EdTech',
    stage: 'series-b',
    location: 'Noida, India',
    fundingTarget: 2500000,
    valuation: 1100000000,
    fundingProgress: 60,
    matchScore: 83,
    isVerified: true,
    isBookmarked: true,
    monthlyRevenue: 3500000,
    teamSize: 3500,
    riskLevel: 'low',
    aiThesis: 'One of the few highly profitable EdTech giants in India. Deep community loyalty and successful offline (Vidyapeeth) expansion make it highly resilient.',
    viewCount: 88
  },
  {
    id: 'startup_rw6',
    name: 'Ola Electric',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
    description: 'Ola Electric is a leading electric vehicle manufacturer building India’s largest EV ecosystem, including state-of-the-art gigafactories and two-wheeler products.',
    sector: 'CleanTech',
    stage: 'growth',
    location: 'Bengaluru, India',
    fundingTarget: 20000000,
    valuation: 4200000000,
    fundingProgress: 95,
    matchScore: 80,
    isVerified: true,
    isBookmarked: false,
    monthlyRevenue: 9500000,
    teamSize: 4000,
    riskLevel: 'medium',
    aiThesis: 'Market leader in Indian electric two-wheelers. Backed by government PLI schemes and a massive vertically integrated factory, creating strong long-term barriers.',
    viewCount: 104
  }
];

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    sectors: [],
    stages: [],
    amounts: [],
    locations: [],
    hasRevenue: false,
    isVerified: false,
    hasTeam: false,
    minMatchScore: 0
  });
  const [sortBy, setSortBy] = useState('match_score');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        const response = await statsAPI.getDashboardStats(user.id);
        if (response.success) {
          setDashboardStats(response.stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Use real user data from AuthContext
  const currentUser = user || {
    id: 'unknown',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'investor',
    avatar: null,
    kycStatus: 'unverified',
    tier: 'free'
  };

  // Dynamic metrics data using real stats
  const getPortfolioMetrics = () => {
    if (loading || !dashboardStats) {
      return {
        portfolioValue: 0,
        portfolioChange: 0,
        activeDeals: 0,
        activeDealsChange: 0,
        pendingOpportunities: 0,
        pendingChange: 0,
        monthlyROI: 0,
        roiChange: 0
      };
    }

    const portfolioVal = (dashboardStats.portfolioSize || 0) * 250000;
    return {
      portfolioValue: portfolioVal,
      portfolioChange: portfolioVal > 0 ? 12.5 : 0,
      activeDeals: dashboardStats.dealsCompleted || 0,
      activeDealsChange: dashboardStats.dealsCompleted > 0 ? 1 : 0,
      pendingOpportunities: dashboardStats.meetingsScheduled || 0,
      pendingChange: dashboardStats.meetingsScheduled > 0 ? 2 : 0,
      monthlyROI: portfolioVal > 0 ? 8.2 : 0,
      roiChange: portfolioVal > 0 ? 1.8 : 0
    };
  };

  const [allStartups, setAllStartups] = useState([]);
  const [startupsLoading, setStartupsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setStartupsLoading(true);
        const response = await startupAPI.getAll();
        let dbStartups = [];
        if (response && response.success && Array.isArray(response.startups)) {
          dbStartups = response.startups.map(st => ({
            id: `db_${st.id}`,
            name: st.company_name,
            logo: st.pitch_deck_url || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
            description: st.company_description,
            sector: st.industry?.charAt(0)?.toUpperCase() + st.industry?.slice(1),
            stage: st.funding_stage || 'seed',
            location: 'Bengaluru, India',
            fundingTarget: st.funding_amount_max || 1000000,
            valuation: (st.funding_amount_max || 1000000) * 5,
            fundingProgress: Math.floor(Math.random() * 40) + 10,
            matchScore: 80 + Math.floor(Math.random() * 19),
            isVerified: true,
            isBookmarked: false,
            monthlyRevenue: 25000,
            teamSize: st.team_size || 5,
            riskLevel: 'low',
            aiThesis: `Strong technological foundation focusing on ${st.industry}. The team is targeting a sensible valuation step for their ${st.funding_stage} stage.`,
            viewCount: 15
          }));
        }
        setAllStartups([...dbStartups, ...REAL_WORLD_STARTUPS]);
      } catch (error) {
        console.error('Failed to fetch startups:', error);
        setAllStartups(REAL_WORLD_STARTUPS);
      } finally {
        setStartupsLoading(false);
      }
    };

    fetchStartups();
  }, []);

  // Mock activity data
  const recentActivities = [
    {
      id: 'act_001',
      type: 'new_match',
      message: 'New 94% match found: CyberShield Security',
      timestamp: new Date(Date.now() - 300000),
      actionable: true
    },
    {
      id: 'act_002',
      type: 'message_received',
      message: 'Message from FinanceFlow founder',
      timestamp: new Date(Date.now() - 900000),
      actionable: true
    },
    {
      id: 'act_003',
      type: 'pitch_downloaded',
      message: 'Downloaded pitch deck for GreenEnergy Pro',
      timestamp: new Date(Date.now() - 1800000),
      actionable: false
    },
    {
      id: 'act_004',
      type: 'connection_request',
      message: 'Connection request sent to HealthTech Solutions',
      timestamp: new Date(Date.now() - 3600000),
      actionable: false
    },
    {
      id: 'act_005',
      type: 'bookmark_added',
      message: 'Bookmarked FoodTech Innovations',
      timestamp: new Date(Date.now() - 7200000),
      actionable: false
    }
  ];

  // Mock conversation data
  const conversations = [
    {
      id: 'conv_001',
      startup: {
        id: 'startup_001',
        name: 'FinanceFlow',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop'
      },
      lastMessage: {
        preview: 'Thanks for your interest! I\'d love to discuss our Series A round...',
        timestamp: new Date(Date.now() - 900000)
      },
      unreadCount: 2
    },
    {
      id: 'conv_002',
      startup: {
        id: 'startup_004',
        name: 'GreenEnergy Pro',
        logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=100&h=100&fit=crop'
      },
      lastMessage: {
        preview: 'Here are the financial projections you requested...',
        timestamp: new Date(Date.now() - 3600000)
      },
      unreadCount: 0
    },
    {
      id: 'conv_003',
      startup: {
        id: 'startup_002',
        name: 'HealthTech Solutions',
        logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop'
      },
      lastMessage: {
        preview: 'Great meeting you at the conference. Looking forward to...',
        timestamp: new Date(Date.now() - 86400000)
      },
      unreadCount: 1
    }
  ];

  const sortOptions = [
    { value: 'match_score', label: 'Match Score (High to Low)' },
    { value: 'funding_target', label: 'Funding Amount (High to Low)' },
    { value: 'funding_progress', label: 'Funding Progress' },
    { value: 'recent', label: 'Recently Added' },
    { value: 'alphabetical', label: 'Company Name (A-Z)' }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveSearch = (name, searchFilters) => {
    const newSearch = {
      id: `search_${Date.now()}`,
      name,
      filters: searchFilters,
      createdAt: new Date()
    };
    setSavedSearches([...savedSearches, newSearch]);
  };

  const handleClearFilters = () => {
    setFilters({
      sectors: [],
      stages: [],
      amounts: [],
      locations: [],
      hasRevenue: false,
      isVerified: false,
      hasTeam: false,
      minMatchScore: 0
    });
  };

  const handleViewPitch = (startupId) => {
    const startup = allStartups?.find(s => s?.id === startupId);
    setSelectedStartup(startup);
    setShowPitchModal(true);
  };

  const handleConnect = (startupId) => {
    // Navigate to messaging system with startup context
    navigate('/messaging-system', { state: { startupId } });
  };

  const handleBookmark = (startupId, isBookmarked) => {
    // Update bookmark status in real application
    console.log(`Bookmark ${startupId}: ${isBookmarked}`);
  };

  const handleDownloadPitch = (startupId) => {
    // Handle pitch download
    console.log(`Download pitch for ${startupId}`);
  };

  const handleViewConversation = (conversationId) => {
    navigate('/messaging-system', { state: { conversationId } });
  };

  const getFilteredStartups = () => {
    let filtered = [...allStartups];

    // Apply filters
    if (filters?.sectors?.length > 0) {
      filtered = filtered?.filter(s => filters?.sectors?.includes(s?.sector?.toLowerCase()));
    }
    if (filters?.stages?.length > 0) {
      filtered = filtered?.filter(s => filters?.stages?.includes(s?.stage));
    }
    if (filters?.locations?.length > 0) {
      filtered = filtered?.filter(s => 
        filters?.locations?.some(loc => s?.location?.toLowerCase()?.includes(loc))
      );
    }
    if (filters?.hasRevenue) {
      filtered = filtered?.filter(s => s?.monthlyRevenue > 0);
    }
    if (filters?.isVerified) {
      filtered = filtered?.filter(s => s?.isVerified);
    }
    if (filters?.minMatchScore > 0) {
      filtered = filtered?.filter(s => s?.matchScore >= filters?.minMatchScore);
    }

    // Apply sorting
    switch (sortBy) {
      case 'match_score':
        filtered?.sort((a, b) => b?.matchScore - a?.matchScore);
        break;
      case 'funding_target':
        filtered?.sort((a, b) => b?.fundingTarget - a?.fundingTarget);
        break;
      case 'funding_progress':
        filtered?.sort((a, b) => b?.fundingProgress - a?.fundingProgress);
        break;
      case 'alphabetical':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredStartups = getFilteredStartups();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={currentUser} 
        notifications={conversations?.reduce((sum, c) => sum + c?.unreadCount, 0)}
      />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Investment Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover AI-curated startup opportunities and manage your deal flow
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Bell"
                  iconSize={16}
                >
                  Set Alerts
                </Button>
                <Button
                  iconName="Plus"
                  iconSize={16}
                >
                  Create Watchlist
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          <MetricsBar metrics={getPortfolioMetrics()} />

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-8">
            {/* Filter Panel */}
            <div className="col-span-12 lg:col-span-3">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSaveSearch={handleSaveSearch}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Startup Grid */}
            <div className="col-span-12 lg:col-span-6">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredStartups?.length} startups found
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-smooth ${
                        viewMode === 'grid' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name="Grid3X3" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-smooth ${
                        viewMode === 'list' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                  </div>
                </div>

                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by..."
                  className="w-48"
                />
              </div>

              {/* Startup Cards */}
              <div className={`${
                viewMode === 'grid' ?'grid grid-cols-1 gap-6' :'space-y-4'
              }`}>
                {filteredStartups?.map((startup) => (
                  <StartupCard
                    key={startup?.id}
                    startup={startup}
                    onViewPitch={handleViewPitch}
                    onConnect={handleConnect}
                    onBookmark={handleBookmark}
                  />
                ))}
              </div>

              {filteredStartups?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No startups found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more opportunities
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Activity Panel */}
            <div className="col-span-12 lg:col-span-3">
              <ActivityPanel
                activities={recentActivities}
                conversations={conversations}
                onViewConversation={handleViewConversation}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Pitch Modal */}
      <PitchModal
        startup={selectedStartup}
        isOpen={showPitchModal}
        onClose={() => setShowPitchModal(false)}
        onDownload={handleDownloadPitch}
        onConnect={handleConnect}
        userTier={currentUser?.tier}
      />
    </div>
  );
};

export default InvestorDashboard;