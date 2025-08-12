import React from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelectionCard = ({ 
  role, 
  title, 
  description, 
  icon, 
  benefits, 
  isSelected, 
  onSelect 
}) => {
  return (
    <div
      onClick={() => onSelect(role)}
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'border-primary bg-primary/5 shadow-lg transform scale-105' 
          : 'border-border bg-card hover:border-primary/50 hover:shadow-md hover:transform hover:scale-102'
        }
      `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
        `}>
          <Icon name={icon} size={32} strokeWidth={2} />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="w-full">
          <h4 className="text-sm font-medium text-foreground mb-2">What you get:</h4>
          <ul className="space-y-1">
            {benefits?.map((benefit, index) => (
              <li key={index} className="flex items-center text-xs text-muted-foreground">
                <Icon name="Check" size={14} className="text-success mr-2 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" strokeWidth={2.5} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionCard;