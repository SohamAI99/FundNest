import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import Icon from '../../../components/AppIcon';

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Michael Chen",
      role: "Founder & CEO",
      company: "TechFlow Solutions",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "FundNest connected us with the perfect investor who understood our vision. We raised $2M in just 3 months through their platform."
    },
    {
      id: 2,
      name: "Sarah Rodriguez",
      role: "Angel Investor",
      company: "Rodriguez Ventures",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "The AI matching system is incredible. I\'ve found 5 promising startups that align perfectly with my investment criteria and portfolio strategy."
    },
    {
      id: 3,
      name: "David Park",
      role: "Co-founder",
      company: "GreenTech Innovations",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The pitch review feature helped us refine our presentation. We went from 20% to 80% investor interest rate after implementing their suggestions."
    },
    {
      id: 4,
      name: "Lisa Thompson",
      role: "Managing Partner",
      company: "Future Capital",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "FundNest streamlined our deal flow process. We can now evaluate 3x more opportunities while maintaining our high investment standards."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials?.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials?.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials?.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Success Stories
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Previous testimonial"
          >
            <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Next testimonial"
          >
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials?.map((testimonial, index) => (
            <div key={testimonial?.id} className="w-full flex-shrink-0">
              <TestimonialCard 
                testimonial={testimonial} 
                isActive={index === currentIndex}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-2">
        {testimonials?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-accent' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;