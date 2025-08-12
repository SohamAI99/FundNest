import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PlanComparisonCard = ({ plan, billingCycle, currentPlan, onUpgrade }) => {
  const isCurrentPlan = currentPlan === plan?.id;
  const isPro = plan?.id === 'pro';
  const price = billingCycle === 'yearly' ? plan?.yearlyPrice : plan?.price;
  const originalPrice = billingCycle === 'yearly' ? plan?.price * 12 : plan?.price;
  const savings = originalPrice - price;

  return (
    <div className={`
      relative bg-card border rounded-xl p-8 transition-smooth hover:shadow-lg
      ${isPro ? 'border-primary shadow-lg scale-105' : 'border-border'}
      ${isCurrentPlan ? 'ring-2 ring-primary ring-offset-2' : ''}
    `}>
      {/* Popular Badge */}
      {plan?.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Icon name="Check" size={14} />
            <span>Current Plan</span>
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan?.name}</h3>
        <p className="text-muted-foreground text-sm mb-6">{plan?.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-end justify-center space-x-1">
            <span className="text-4xl font-bold text-foreground">₹{price}</span>
            <span className="text-muted-foreground">
              /{billingCycle === 'yearly' ? 'year' : 'month'}
            </span>
          </div>
          
          {billingCycle === 'yearly' && savings > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground line-through">
                ${originalPrice}/year
              </p>
              <p className="text-sm text-success font-medium">
                Save ${savings} per year
              </p>
            </div>
          )}
          
          {plan?.id === 'free' && (
            <p className="text-sm text-muted-foreground">Forever free</p>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-6 mb-8">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Check" size={16} className="text-success mr-2" />
            Included Features
          </h4>
          <ul className="space-y-2">
            {plan?.features?.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {plan?.limitations?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
              <Icon name="X" size={16} className="text-muted-foreground mr-2" />
              Limitations
            </h4>
            <ul className="space-y-2">
              {plan?.limitations?.map((limitation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Icon name="X" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="space-y-3">
        {isCurrentPlan ? (
          <Button
            variant="outline"
            className="w-full"
            disabled
            iconName="Check"
          >
            Current Plan
          </Button>
        ) : plan?.id === 'free' ? (
          <Button
            variant="outline"
            className="w-full"
            disabled
          >
            Downgrade Available on Cancel
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onUpgrade(plan?.id)}
            iconName="ArrowUp"
          >
            Upgrade to {plan?.name}
          </Button>
        )}
        
        {isPro && !isCurrentPlan && (
          <p className="text-xs text-center text-muted-foreground">
            Cancel anytime • No setup fees • Instant activation
          </p>
        )}
      </div>

      {/* Money Back Guarantee */}
      {isPro && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>30-day money back guarantee</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanComparisonCard;