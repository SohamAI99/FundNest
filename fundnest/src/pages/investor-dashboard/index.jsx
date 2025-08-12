import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, investorAPI } from '../../utils/api';
import AppHeader from '../../components/ui/AppHeader';
import FilterPanel from './components/FilterPanel';
import MetricsBar from './components/MetricsBar';
import StartupCard from './components/StartupCard';
import ActivityPanel from './components/ActivityPanel';
import PitchModal from './components/PitchModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

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
          setDashboardStats(response.data);
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

    const investor = dashboardStats.investor_info;
    return {
      portfolioValue: investor?.total_invested || 0,
      portfolioChange: investor?.total_invested > 0 ? 12.5 : 0,
      activeDeals: dashboardStats.startup_matches || 0,
      activeDealsChange: dashboardStats.startup_matches || 0,
      pendingOpportunities: investor?.portfolio_size || 0,
      pendingChange: investor?.portfolio_size > 0 ? Math.floor(investor.portfolio_size / 3) : 0,
      monthlyROI: investor?.total_invested > 0 ? 8.2 : 0,
      roiChange: investor?.total_invested > 0 ? 1.8 : 0
    };
  };

  // Mock startup data
  const mockStartups = [
    {
      id: 'startup_001',
      name: 'FinanceFlow',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
      description: 'AI-powered financial management platform for small businesses. Automated bookkeeping, cash flow forecasting, and intelligent insights to help SMBs make better financial decisions.',
      sector: 'FinTech',
      stage: 'series-a',
      location: 'San Francisco, CA',
      fundingTarget: 2000000,
      valuation: 12000000,
      fundingProgress: 65,
      matchScore: 92,
      isVerified: true,
      isBookmarked: false,
      monthlyRevenue: 180000,
      teamSize: 12,
      riskLevel: 'low',
      aiThesis: 'Strong product-market fit with proven traction in the SMB segment. Experienced team with previous exits. Growing market with clear monetization strategy.',
      viewCount: 47
    },
    {
      id: 'startup_002',
      name: 'HealthTech Solutions',
      logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop',
      description: 'Telemedicine platform connecting patients with healthcare providers through secure video consultations and AI-powered symptom assessment.',
      sector: 'HealthTech',
      stage: 'seed',
      location: 'Austin, TX',
      fundingTarget: 1500000,
      valuation: 8000000,
      fundingProgress: 40,
      matchScore: 87,
      isVerified: true,
      isBookmarked: true,
      monthlyRevenue: 85000,
      teamSize: 8,
      riskLevel: 'medium',
      aiThesis: 'Addressing critical healthcare accessibility issues with proven technology. Strong regulatory compliance and growing user base.',
      viewCount: 32
    },
    {
      id: 'startup_003',
      name: 'EduLearn AI',
      logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
      description: 'Personalized learning platform using AI to adapt educational content to individual student needs and learning styles.',
      sector: 'EdTech',
      stage: 'pre-seed',
      location: 'Boston, MA',
      fundingTarget: 800000,
      valuation: 4000000,
      fundingProgress: 25,
      matchScore: 78,
      isVerified: false,
      isBookmarked: false,
      monthlyRevenue: 0,
      teamSize: 5,
      riskLevel: 'high',
      aiThesis: 'Innovative approach to personalized education with strong technical team. Early stage with significant market potential.',
      viewCount: 18
    },
    {
      id: 'startup_004',
      name: 'GreenEnergy Pro',
      logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=100&h=100&fit=crop',
      description: 'Smart energy management system for commercial buildings, reducing energy consumption by up to 30% through IoT sensors and AI optimization.',
      sector: 'CleanTech',
      stage: 'series-a',
      location: 'Seattle, WA',
      fundingTarget: 3000000,
      valuation: 15000000,
      fundingProgress: 80,
      matchScore: 85,
      isVerified: true,
      isBookmarked: false,
      monthlyRevenue: 220000,
      teamSize: 15,
      riskLevel: 'low',
      aiThesis: 'Proven technology with strong customer traction in commercial real estate. ESG-focused investment with clear ROI.',
      viewCount: 63
    },
    {
      id: 'startup_005',
      name: 'FoodTech Innovations',
      logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      description: 'Plant-based protein production using precision fermentation technology. Sustainable alternative to traditional meat production.',
      sector: 'FoodTech',
      stage: 'seed',
      location: 'Denver, CO',
      fundingTarget: 2500000,
      valuation: 10000000,
      fundingProgress: 55,
      matchScore: 73,
      isVerified: true,
      isBookmarked: true,
      monthlyRevenue: 45000,
      teamSize: 10,
      riskLevel: 'medium',
      aiThesis: 'Addressing growing demand for sustainable protein sources. Strong IP portfolio and experienced food industry team.',
      viewCount: 29
    },
    {
      id: 'startup_006',
      name: 'CyberShield Security',
      logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
      description: 'AI-powered cybersecurity platform providing real-time threat detection and automated response for enterprise networks.',
      sector: 'CyberSecurity',
      stage: 'series-b',
      location: 'New York, NY',
      fundingTarget: 5000000,
      valuation: 25000000,
      fundingProgress: 90,
      matchScore: 94,
      isVerified: true,
      isBookmarked: false,
      monthlyRevenue: 450000,
      teamSize: 25,
      riskLevel: 'low',
      aiThesis: 'Market-leading cybersecurity solution with enterprise customers. Strong recurring revenue and expansion opportunities.',
      viewCount: 89
    }
  ];

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
    const startup = mockStartups?.find(s => s?.id === startupId);
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
    let filtered = [...mockStartups];

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