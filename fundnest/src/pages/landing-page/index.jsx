import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async"; 
import SEO, { seoConfigs } from '../../components/SEO';
import analytics from '../../utils/analytics';
import AppHeader from '../../components/ui/AppHeader';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
// TestimonialsSection removed as requested
import NewsletterSection from './components/NewsletterSection';
import DemoVideoModal from './components/DemoVideoModal';
import Footer from './components/Footer';

const LandingPage = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    analytics.trackPageView('/', 'FundNest - Home');
    analytics.trackEvent('landing_page_view', {
      referrer: document.referrer,
      utm_source: new URLSearchParams(window.location.search).get('utm_source'),
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
    });
  }, []);

  const handleOpenDemoModal = () => setIsDemoModalOpen(true);
  const handleCloseDemoModal = () => setIsDemoModalOpen(false);

  return (
    <>
      <Helmet>
        <title>FundNest - Connect Startups with Smart Investors</title>
        <meta 
          name="description" 
          content="FundNest uses AI-powered matching to connect promising startups with verified investors. Get funding faster with our intelligent ecosystem and real-time communication platform." 
        />
        <meta name="keywords" content="startup funding, investors, AI matching, venture capital, angel investors, crowdfunding" />
        <meta property="og:title" content="FundNest - Connect Startups with Smart Investors" />
        <meta property="og:description" content="AI-powered platform connecting startups with investors through intelligent matching and real-time communication." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fundnest.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FundNest - Connect Startups with Smart Investors" />
        <meta name="twitter:description" content="AI-powered platform connecting startups with investors through intelligent matching and real-time communication." />
        <link rel="canonical" href="https://fundnest.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="pt-16">
          <HeroSection onWatchDemo={handleOpenDemoModal} />
          <BenefitsSection />
          <NewsletterSection />
        </main>
        <Footer />
        <DemoVideoModal isOpen={isDemoModalOpen} onClose={handleCloseDemoModal} />
      </div>
    </>
  );
};

export default LandingPage;
