import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async"; 
import { AnimatePresence } from 'framer-motion';
import analytics from '../../utils/analytics';
import AppHeader from '../../components/ui/AppHeader';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import BenefitsSection from './components/BenefitsSection';
import PricingSection from './components/PricingSection';
import TrustSection from './components/TrustSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import DemoVideoModal from './components/DemoVideoModal';
import Footer from './components/Footer';
import IntroAnimation from './components/IntroAnimation';

const LandingPage = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    // Show intro only if visited_intro is not set in sessionStorage
    return !sessionStorage.getItem('visited_intro');
  });

  useEffect(() => {
    analytics.trackPageView('/', 'FundNest - Home');
    analytics.trackEvent('landing_page_view', {
      referrer: document.referrer,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
    });
  }, []);

  useEffect(() => {
    // Lock body scrolling while intro is active
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  const handleIntroComplete = () => {
    sessionStorage.setItem('visited_intro', 'true');
    setShowIntro(false);
  };

  const handleOpenDemoModal = () => setIsDemoModalOpen(true);
  const handleCloseDemoModal = () => setIsDemoModalOpen(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroAnimation key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
      <Helmet>
        <title>FundNest — Where Startups Meet Smart Capital | AI-Powered Funding Platform</title>
        <meta 
          name="description" 
          content="FundNest connects promising startups with verified investors using AI-powered matching. Find funding, build partnerships, and scale your vision with India's leading startup-investor platform." 
        />
        <meta name="keywords" content="startup funding india, investors, AI matching, venture capital, angel investors, seed funding, series A, fundraising platform, startup ecosystem" />
        <meta property="og:title" content="FundNest — Where Startups Meet Smart Capital" />
        <meta property="og:description" content="AI-powered platform connecting startups with investors through intelligent matching and real-time communication." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fundnest.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FundNest — Where Startups Meet Smart Capital" />
        <meta name="twitter:description" content="AI-powered platform connecting startups with investors through intelligent matching and real-time communication." />
        <link rel="canonical" href="https://fundnest.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="pt-16">
          <HeroSection onWatchDemo={handleOpenDemoModal} />
          <HowItWorksSection />
          <BenefitsSection />
          <TrustSection />
          <PricingSection />
          <TestimonialsSection />
          <NewsletterSection />
        </main>
        <Footer />
        <DemoVideoModal isOpen={isDemoModalOpen} onClose={handleCloseDemoModal} />
      </div>
    </>
  );
};

export default LandingPage;
