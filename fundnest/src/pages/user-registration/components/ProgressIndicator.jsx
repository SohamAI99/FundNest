import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} strokeWidth={2.5} />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`
                  mt-2 text-xs font-medium text-center
                  ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                `}>
                  {step?.title}
                </span>
              </div>
              {index < steps?.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-all duration-300
                  ${isCompleted ? 'bg-success' : 'bg-muted'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}: {steps?.[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;