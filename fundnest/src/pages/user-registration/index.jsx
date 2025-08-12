import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import AppHeader from '../../components/ui/AppHeader';
import RoleSelectionCard from './components/RoleSelectionCard';
import ProgressIndicator from './components/ProgressIndicator';
import StartupForm from './components/StartupForm';
import InvestorForm from './components/InvestorForm';
import ProfileImageUpload from './components/ProfileImageUpload';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';
import RegistrationBenefits from './components/RegistrationBenefits';

const UserRegistration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: 'Role', description: 'Choose your role on the platform' },
    { title: 'Details', description: 'Provide your information' },
    { title: 'Profile', description: 'Complete your profile' }
  ];

  const roleData = {
    startup: {
      title: 'Startup Founder',
      description: 'Raise funding for your startup and connect with investors who believe in your vision.',
      icon: 'Rocket',
      benefits: [
        'AI-powered investor matching',
        'Pitch deck analysis & feedback',
        'Direct investor communication',
        'Funding progress tracking',
        'Verified investor network'
      ]
    },
    investor: {
      title: 'Investor',
      description: 'Discover promising startups and make strategic investments in the next big thing.',
      icon: 'TrendingUp',
      benefits: [
        'Curated startup deal flow',
        'AI investment insights',
        'Portfolio management tools',
        'Advanced filtering options',
        'Early access opportunities'
      ]
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.role) {
        newErrors.role = 'Please select your role';
      }
    }

    if (step === 2) {
      if (!formData?.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData?.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData?.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }

      // Role-specific validation
      if (formData?.role === 'startup') {
        if (!formData?.companyName?.trim()) {
          newErrors.companyName = 'Company name is required';
        }
        if (!formData?.industry) {
          newErrors.industry = 'Industry sector is required';
        }
        if (!formData?.fundingStage) {
          newErrors.fundingStage = 'Funding stage is required';
        }
        if (!formData?.fundingAmount) {
          newErrors.fundingAmount = 'Funding amount is required';
        }
      }

      if (formData?.role === 'investor') {
        if (!formData?.investmentFocus) {
          newErrors.investmentFocus = 'Investment focus is required';
        }
        if (!formData?.checkSize) {
          newErrors.checkSize = 'Check size is required';
        }
        if (!formData?.preferredSectors?.length) {
          newErrors.preferredSectors = 'Please select at least one preferred sector';
        }
        if (!formData?.preferredStages?.length) {
          newErrors.preferredStages = 'Please select at least one preferred stage';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Prepare registration data
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        // Include role-specific data
        ...(formData.role === 'startup' && {
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          industry: formData.industry,
          fundingStage: formData.fundingStage,
          fundingAmount: formData.fundingAmount,
          foundedYear: formData.foundedYear
        }),
        ...(formData.role === 'investor' && {
          investmentFocus: formData.investmentFocus,
          checkSize: formData.checkSize,
          experienceYears: formData.experienceYears,
          preferredSectors: formData.preferredSectors,
          preferredStages: formData.preferredStages
        })
      };

      // Call registration API
      const result = await register(registrationData);
      
      if (result.success) {
        // Navigate using the redirectTo from AuthContext response
        navigate(result.redirectTo || '/');
      } else {
        setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Role</h2>
              <p className="text-muted-foreground">
                Select how you'd like to use FundNest to get started
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(roleData)?.map(([role, data]) => (
                <RoleSelectionCard
                  key={role}
                  role={role}
                  title={data?.title}
                  description={data?.description}
                  icon={data?.icon}
                  benefits={data?.benefits}
                  isSelected={formData?.role === role}
                  onSelect={(selectedRole) => handleInputChange('role', selectedRole)}
                />
              ))}
            </div>
            {errors?.role && (
              <p className="text-error text-sm text-center">{errors?.role}</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {formData?.role === 'startup' ? 'Startup Information' : 'Investor Profile'}
                </h2>
                <p className="text-muted-foreground">
                  Tell us about yourself to get better matches
                </p>
              </div>

              {/* Basic Information */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="first name"
                    value={formData?.firstName}
                    onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                    error={errors?.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="last name"
                    value={formData?.lastName}
                    onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                    error={errors?.lastName}
                    required
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your email "
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={errors?.email}
                  required
                  className="mt-4"
                />
              </div>

              {/* Password Section */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
                <div className="space-y-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    error={errors?.password}
                    required
                  />
                  <PasswordStrengthIndicator password={formData?.password} />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData?.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
                    error={errors?.confirmPassword}
                    required
                  />
                </div>
              </div>

              {/* Role-specific Form */}
              <div className="bg-card rounded-xl p-6 border border-border">
                {formData?.role === 'startup' ? (
                  <StartupForm
                    formData={formData}
                    onChange={handleInputChange}
                    errors={errors}
                  />
                ) : (
                  <InvestorForm
                    formData={formData}
                    onChange={handleInputChange}
                    errors={errors}
                  />
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <Checkbox
                  label="I agree to the Terms of Service and Privacy Policy"
                  checked={formData?.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
                  error={errors?.agreeToTerms}
                  required
                />
              </div>
            </div>
            {/* Benefits Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <RegistrationBenefits userRole={formData?.role} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Profile</h2>
                <p className="text-muted-foreground">
                  Add a profile picture to build trust with potential partners
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <ProfileImageUpload
                  formData={formData}
                  onChange={handleInputChange}
                  errors={errors}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <RegistrationBenefits userRole={formData?.role} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNavigate={(path) => navigate(path)} />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={steps?.length}
            steps={steps}
          />

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Already have an account?
              </Button>

              {currentStep < steps?.length ? (
                <Button
                  onClick={handleNext}
                  iconName="ChevronRight"
                  iconPosition="right"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={isLoading}
                  iconName="Check"
                  iconPosition="left"
                >
                  Create Account
                </Button>
              )}
            </div>
          </div>

          {errors?.submit && (
            <div className="mt-4 text-center">
              <p className="text-error text-sm">{errors?.submit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
