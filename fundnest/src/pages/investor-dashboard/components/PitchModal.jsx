import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PitchModal = ({ startup, isOpen, onClose, onDownload, onConnect, userTier }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  if (!isOpen || !startup) return null;

  const pitchSlides = [
    {
      title: "Problem Statement",
      content: `${startup?.name} addresses the critical challenge of inefficient financial management for small businesses. Current solutions are either too complex or lack essential features, leaving 60% of SMBs struggling with cash flow visibility and financial planning.`
    },
    {
      title: "Solution Overview",
      content: `Our AI-powered platform provides automated bookkeeping, real-time cash flow forecasting, and intelligent financial insights. We've simplified complex financial processes into an intuitive dashboard that any business owner can understand and use effectively.`
    },
    {
      title: "Market Opportunity",
      content: `The global SMB financial software market is valued at ₹12.4B and growing at 8.5% CAGR. With over 30M small businesses in the US alone, our addressable market represents a ₹4.2B opportunity in North America.`
    },
    {
      title: "Business Model",
      content: `SaaS subscription model with three tiers: Basic (₹29/month), Professional (₹79/month), and Enterprise (₹199/month). Average customer lifetime value of ₹2,400 with 92% annual retention rate.`
    },
    {
      title: "Traction & Growth",
      content: `Currently serving 2,500+ active customers with ₹180K MRR. Growing 15% month-over-month with strong unit economics: CAC of ₹120 and LTV/CAC ratio of 20:1. Featured in TechCrunch and Forbes.`
    },
    {
      title: "Financial Projections",
      content: `Projecting ₹5M ARR by end of year 2 with 40% gross margins. Seeking ₹2M Series A to accelerate customer acquisition and expand our engineering team. Clear path to profitability within 18 months.`
    }
  ];

  const handleDownload = () => {
    if (userTier === 'free') {
      setShowUpgradePrompt(true);
    } else {
      onDownload(startup?.id);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % pitchSlides?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + pitchSlides?.length) % pitchSlides?.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={startup?.logo}
                  alt={`${startup?.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{startup?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {startup?.sector} • {startup?.location}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                {startup?.matchScore}% Match
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Pitch Content */}
        <div className="p-6">
          <div className="bg-muted/30 rounded-lg p-8 mb-6 min-h-80">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {pitchSlides?.[currentSlide]?.title}
              </h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {pitchSlides?.[currentSlide]?.content}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              iconName="ChevronLeft"
              iconSize={16}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {pitchSlides?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-smooth ${
                    index === currentSlide ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={nextSlide}
              disabled={currentSlide === pitchSlides?.length - 1}
              iconName="ChevronRight"
              iconPosition="right"
              iconSize={16}
            >
              Next
            </Button>
          </div>

          {/* Startup Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Funding Target</h4>
              <p className="text-lg font-bold text-primary">
                ${(startup?.fundingTarget / 1000000)?.toFixed(1)}M
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Valuation</h4>
              <p className="text-lg font-bold text-primary">
                ${(startup?.valuation / 1000000)?.toFixed(1)}M
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Stage</h4>
              <p className="text-lg font-bold text-primary capitalize">
                {startup?.stage?.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Eye" size={16} />
              <span>Viewed by {startup?.viewCount || 0} investors</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleDownload}
                iconName="Download"
                iconSize={16}
              >
                Download PDF
                {userTier === 'free' && (
                  <Icon name="Lock" size={14} className="ml-1" />
                )}
              </Button>
              <Button
                onClick={() => onConnect(startup?.id)}
                iconName="MessageSquare"
                iconSize={16}
              >
                Connect with Founder
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lock" size={32} className="text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upgrade to Pro
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download full pitch decks and access advanced features with a Pro subscription.
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">Full pitch deck downloads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">Unlimited messaging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">Advanced matching algorithms</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowUpgradePrompt(false)}
                >
                  Maybe Later
                </Button>
                <Button fullWidth>
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

export default PitchModal;