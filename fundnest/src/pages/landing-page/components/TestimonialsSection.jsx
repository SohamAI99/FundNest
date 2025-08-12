import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Demo Founder',
      role: 'CEO & Founder',
      company: 'TechFlow Solutions',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: `FundNest's AI matching was incredible. Within 2 weeks, I connected with 3 perfect investors who understood our vision. We closed our Series A in just 6 weeks - something that typically takes months. The platform's verification process gave investors confidence in our legitimacy.`,
      funding: '₹2.3M Series A',
      rating: 5,
      sector: 'SaaS'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Angel Investor',
      company: 'Rodriguez Ventures',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: `As an investor, FundNest saves me countless hours. The AI pre-screens startups based on my criteria, and I only see high-quality matches. I've invested in 4 companies through the platform, and 3 are already showing exceptional growth. The due diligence tools are outstanding.`,
      funding: '₹850K Invested',rating: 5,sector: 'Multiple'
    },
    {
      id: 3,
      name: 'Emily Watson',role: 'Co-Founder',company: 'GreenTech Innovations',avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',content: `The real-time communication feature was a game-changer. We could instantly share updates, financial projections, and answer investor questions. The transparency built through FundNest helped us secure funding 40% faster than traditional methods. Highly recommend to any startup.`,funding: '₹1.8M Seed Round',rating: 5,sector: 'CleanTech'
    },
    {
      id: 4,
      name: 'David Park',role: 'Managing Partner',company: 'Innovation Capital',avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: `FundNest has transformed how we discover investment opportunities. The platform's analytics and startup scoring system help us make data-driven decisions. We've increased our deal flow by 300% while maintaining quality. The KYC verification ensures we're working with legitimate entrepreneurs.`,
      funding: '₹12M Portfolio',
      rating: 5,
      sector: 'VC Fund'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials?.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning fill-current' : 'text-muted'}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Success Stories
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from startups and investors who have transformed their funding journey with FundNest
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/20 min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  {/* Testimonial Content */}
                  <div className="md:col-span-2">
                    <div className="flex items-center mb-4">
                      {renderStars(testimonials?.[currentIndex]?.rating)}
                    </div>
                    
                    <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                      "{testimonials?.[currentIndex]?.content}"
                    </blockquote>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-primary text-lg">
                          {testimonials?.[currentIndex]?.name}
                        </div>
                        <div className="text-muted-foreground">
                          {testimonials?.[currentIndex]?.role} at {testimonials?.[currentIndex]?.company}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-success text-lg">
                          {testimonials?.[currentIndex]?.funding}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials?.[currentIndex]?.sector}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center md:justify-end">
                    <div className="relative">
                      <Image
                        src={testimonials?.[currentIndex]?.avatar}
                        alt={testimonials?.[currentIndex]?.name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous/Next Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                className="w-12 h-12 rounded-full glass-card border border-white/20 flex items-center justify-center hover:border-primary/40 transition-smooth focus-ring"
                aria-label="Previous testimonial"
              >
                <Icon name="ChevronLeft" size={20} className="text-primary" />
              </button>
              
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full glass-card border border-white/20 flex items-center justify-center hover:border-primary/40 transition-smooth focus-ring"
                aria-label="Next testimonial"
              >
                <Icon name="ChevronRight" size={20} className="text-primary" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center space-x-2">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-smooth focus-ring ${
                    index === currentIndex 
                      ? 'bg-primary' :'bg-muted hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`w-12 h-12 rounded-full glass-card border border-white/20 flex items-center justify-center transition-smooth focus-ring ${
                isAutoPlaying ? 'border-primary/40' : 'border-muted'
              }`}
              aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
              <Icon 
                name={isAutoPlaying ? "Pause" : "Play"} 
                size={16} 
                className={isAutoPlaying ? 'text-primary' : 'text-muted-foreground'} 
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;