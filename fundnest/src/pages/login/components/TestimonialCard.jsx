import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TestimonialCard = ({ testimonial, isActive = false }) => {
  return (
    <div className={`
      p-6 rounded-xl border transition-all duration-300
      ${isActive 
        ? 'bg-card border-accent/20 shadow-lg' 
        : 'bg-muted/30 border-border/50'
      }
    `}>
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)]?.map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={16}
            className="text-warning fill-current"
          />
        ))}
      </div>
      <blockquote className="text-foreground mb-6 leading-relaxed">
        "{testimonial?.content}"
      </blockquote>
      <div className="flex items-center space-x-3">
        <Image
          src={testimonial?.avatar}
          alt={testimonial?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {testimonial?.name}
          </h4>
          <p className="text-xs text-muted-foreground">
            {testimonial?.role} • {testimonial?.company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;