import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd?.length >= 8,
      icon: 'Check'
    },
    {
      label: 'One uppercase letter',
      test: (pwd) => /[A-Z]/?.test(pwd),
      icon: 'Check'
    },
    {
      label: 'One lowercase letter',
      test: (pwd) => /[a-z]/?.test(pwd),
      icon: 'Check'
    },
    {
      label: 'One number',
      test: (pwd) => /\d/?.test(pwd),
      icon: 'Check'
    },
    {
      label: 'One special character',
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/?.test(pwd),
      icon: 'Check'
    }
  ];

  const getStrengthScore = () => {
    return requirements?.filter(req => req?.test(password))?.length;
  };

  const getStrengthLevel = () => {
    const score = getStrengthScore();
    if (score === 0) return { label: '', color: '' };
    if (score <= 2) return { label: 'Weak', color: 'text-error' };
    if (score <= 3) return { label: 'Fair', color: 'text-warning' };
    if (score <= 4) return { label: 'Good', color: 'text-primary' };
    return { label: 'Strong', color: 'text-success' };
  };

  const getStrengthBarColor = () => {
    const score = getStrengthScore();
    if (score <= 2) return 'bg-error';
    if (score <= 3) return 'bg-warning';
    if (score <= 4) return 'bg-primary';
    return 'bg-success';
  };

  const strengthLevel = getStrengthLevel();
  const strengthScore = getStrengthScore();

  if (!password) return null;

  return (
    <div className="mt-4 space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Password Strength</span>
          <span className={`text-sm font-medium ${strengthLevel?.color}`}>
            {strengthLevel?.label}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor()}`}
            style={{ width: `${(strengthScore / 5) * 100}%` }}
          />
        </div>
      </div>
      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Requirements:</p>
        <div className="space-y-1">
          {requirements?.map((requirement, index) => {
            const isValid = requirement?.test(password);
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className={`
                  w-4 h-4 rounded-full flex items-center justify-center
                  ${isValid ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon 
                    name={isValid ? "Check" : "X"} 
                    size={10} 
                    strokeWidth={2.5} 
                  />
                </div>
                <span className={`text-xs ${isValid ? 'text-success' : 'text-muted-foreground'}`}>
                  {requirement?.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;