import React from 'react';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = ({ testimonials }) => {
  const renderStars = (rating) => {
    return Array?.from({ length: 5 })?.map((_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning fill-current' : 'text-muted'}
      />
    ));
  };

  const stats = [
    {
      label: 'Average ROI Increase',
      value: '340%',
      description: 'Pro users see significant returns on their investment',
      icon: 'TrendingUp'
    },
    {
      label: 'Success Rate',
      value: '87%',
      description: 'Of Pro users successfully close deals within 6 months',
      icon: 'Target'
    },
    {
      label: 'Time Saved',
      value: '15hrs',
      description: 'Average weekly time saved with Pro features',
      icon: 'Clock'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.9/5',
      description: 'Based on 500+ customer reviews',
      icon: 'Star'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Stats Section */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Pro Users Get Results
          </h2>
          <p className="text-muted-foreground">
            See the measurable impact of upgrading to Pro
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Icon name={stat?.icon} size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
                <div className="text-sm font-medium text-foreground">{stat?.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat?.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Success Stories from Our Pro Users
          </h2>
          <p className="text-muted-foreground">
            Hear how Pro features transformed their fundraising and investment journeys
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
            <div
              key={testimonial?.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-smooth"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial?.rating)}
              </div>
              
              {/* Content */}
              <blockquote className="text-foreground mb-6">
                "{testimonial?.content}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial?.role}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial?.company}
                  </div>
                </div>
              </div>
              
              {/* Pro Badge */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                    <Icon name="Star" size={12} className="text-primary-foreground" />
                  </div>
                  <span className="text-muted-foreground">Verified Pro User</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div className="bg-card border border-border rounded-lg p-8">
        <h3 className="text-xl font-semibold text-foreground mb-6">Featured Success Stories</h3>
        
        <div className="space-y-6">
          <div className="border-l-4 border-primary pl-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">TechFlow Solutions</h4>
                <p className="text-sm text-muted-foreground">Series A Startup</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-success">$2.5M Raised</div>
                <div className="text-xs text-muted-foreground">in 3 months</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Used Pro analytics to identify 47 qualified investors, resulting in 12 meetings and successful Series A funding.
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">InvestCorp Partners</h4>
                <p className="text-sm text-muted-foreground">Venture Capital Firm</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-success">15 Investments</div>
                <div className="text-xs text-muted-foreground">in 6 months</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced filters and AI matching helped identify portfolio companies that aligned with their investment thesis.
            </p>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Calculate Your ROI
          </h3>
          <p className="text-muted-foreground">
            Based on average Pro user results
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">3x</div>
              <div className="text-sm text-muted-foreground">More qualified connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">50%</div>
              <div className="text-sm text-muted-foreground">Faster deal closure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">15hrs</div>
              <div className="text-sm text-muted-foreground">Saved per week</div>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              For just $29/month, Pro users typically see ROI within the first month
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-8 text-muted-foreground mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} />
            <span className="text-sm">500+ Pro Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} />
            <span className="text-sm">₹50M+ Raised</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Star" size={20} />
            <span className="text-sm">4.9/5 Rating</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm">
          Join successful entrepreneurs and investors who trust FundNest Pro
        </p>
      </div>
    </div>
  );
};

export default TestimonialsSection;