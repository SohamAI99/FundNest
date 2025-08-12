import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const navigate = useNavigate();
  const [counters, setCounters] = useState({
    startups: 0,
    investors: 0,
    matches: 0,
    funding: 0
  });

  const [targetCounters, setTargetCounters] = useState({
    startups: 2847,
    investors: 1523,
    matches: 892,
    funding: 0 // Default fallback values
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch real-time stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats/platform-stats');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // If we have real data, use it, otherwise keep fallback values
            const realStats = data.data;
            const updatedTargets = {
              startups: Math.max(realStats.startups, 50), // Ensure minimum for demo
              investors: Math.max(realStats.investors, 25),
              matches: Math.max(realStats.matches, 10),
              funding: Math.max(realStats.funding, 127500000) // Fallback amount
            };
            setTargetCounters(updatedTargets);
          }
        }
      } catch (error) {
        console.log('Using fallback stats data');
        // Keep the existing fallback values
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Animate counters when target values are loaded
  useEffect(() => {
    if (isLoading) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = Object.keys(targetCounters)?.map(key => {
      const target = targetCounters?.[key];
      const increment = target / steps;
      let current = 0;
      let step = 0;

      return setInterval(() => {
        step++;
        current = Math.min(Math.floor(increment * step), target);
        
        setCounters(prev => ({
          ...prev,
          [key]: current
        }));

        if (step >= steps) {
          clearInterval(intervals?.find(interval => interval === this));
        }
      }, stepDuration);
    });

    return () => {
      intervals?.forEach(interval => clearInterval(interval));
    };
  }, [targetCounters, isLoading]);

  const formatFunding = (amount) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000)?.toFixed(1)}Cr`;
    } else if (amount >= 1000000) {
      return `₹${(amount / 1000000)?.toFixed(1)}M`;
    }
    return `₹${amount?.toLocaleString()}`;
  };

  const handleGetStarted = () => {
    navigate('/user-registration');
  };

  const handleWatchDemo = () => {
    // Demo video modal trigger - placeholder for future implementation
    console.log('Open demo video modal');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight"
            >
              Connect Startups with 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary"> Smart Investors</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              FundNest uses AI-powered matching to connect promising startups with verified investors. 
              Get funding faster with our intelligent ecosystem and real-time communication platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Button
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                iconName="ArrowRight"
                iconPosition="right"
                className="text-lg px-8 py-4"
              >
                Get Started Free
              </Button>
            </motion.div>

            {/* Real-time Counters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {counters?.startups?.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Active Startups</div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-secondary mb-1">
                  {counters?.investors?.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Verified Investors</div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                  {counters?.matches?.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground">Successful Matches</div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-success mb-1">
                  {formatFunding(counters?.funding)}+
                </div>
                <div className="text-sm text-muted-foreground">Funding Raised</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Dashboard Preview */}
              <div className="glass-card rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <Icon name="TrendingUp" size={20} color="white" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">FundNest Dashboard</div>
                        <div className="text-sm text-muted-foreground">AI-Powered Matching</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-xs text-success font-medium">Live</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/5 rounded-lg p-3">
                      <div className="text-lg font-bold text-primary">94%</div>
                      <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                    <div className="bg-accent/5 rounded-lg p-3">
                      <div className="text-lg font-bold text-accent">$2.5M</div>
                      <div className="text-xs text-muted-foreground">Funding Goal</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Investor Interest</span>
                      <span className="text-foreground font-medium">87%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full w-[87%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 glass-card rounded-lg p-3 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={16} className="text-accent" />
                  <span className="text-xs font-medium text-foreground">New Match!</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-card rounded-lg p-3 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-xs font-medium text-foreground">Verified</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;