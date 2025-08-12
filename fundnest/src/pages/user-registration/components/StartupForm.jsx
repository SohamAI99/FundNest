import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StartupForm = ({ formData, onChange, errors }) => {
  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'fintech', label: 'Financial Technology' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'education', label: 'Education' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
  ];

  const fundingStageOptions = [
    { value: 'pre-seed', label: 'Pre-Seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B' },
    { value: 'series-c', label: 'Series C' },
    { value: 'growth', label: 'Growth Stage' }
  ];

  const fundingAmountOptions = [
    { value: '50k-100k', label: '₹41.5L - ₹83L' },
    { value: '100k-250k', label: '₹83L - ₹2.07Cr' },
    { value: '250k-500k', label: '₹2.07Cr - ₹4.15Cr' },
    { value: '500k-1m', label: '₹4.15Cr - ₹8.3Cr' },
    { value: '1m-5m', label: '₹8.3Cr - ₹41.5Cr' },
    { value: '5m-10m', label: '₹41.5Cr - ₹83Cr' },
    { value: '10m+', label: '₹83Cr+' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Company Information</h3>
        <div className="space-y-4">
          <Input
            label="Company Name"
            type="text"
            placeholder="Enter your company name"
            value={formData?.companyName || ''}
            onChange={(e) => onChange('companyName', e?.target?.value)}
            error={errors?.companyName}
            required
          />
          
          <Input
            label="Company Description"
            type="text"
            placeholder="Brief description of your company"
            value={formData?.companyDescription || ''}
            onChange={(e) => onChange('companyDescription', e?.target?.value)}
            error={errors?.companyDescription}
            description="Tell us what your company does in one sentence"
          />
          
          <Select
            label="Industry Sector"
            placeholder="Select your industry"
            options={industryOptions}
            value={formData?.industry || ''}
            onChange={(value) => onChange('industry', value)}
            error={errors?.industry}
            required
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Funding Details</h3>
        <div className="space-y-4">
          <Select
            label="Current Funding Stage"
            placeholder="Select your funding stage"
            options={fundingStageOptions}
            value={formData?.fundingStage || ''}
            onChange={(value) => onChange('fundingStage', value)}
            error={errors?.fundingStage}
            required
          />
          
          <Select
            label="Funding Amount Sought"
            placeholder="Select funding range"
            options={fundingAmountOptions}
            value={formData?.fundingAmount || ''}
            onChange={(value) => onChange('fundingAmount', value)}
            error={errors?.fundingAmount}
            required
          />
          
          <Input
            label="Founded Year"
            type="number"
            placeholder="2024"
            value={formData?.foundedYear || ''}
            onChange={(e) => onChange('foundedYear', e?.target?.value)}
            error={errors?.foundedYear}
            min="1900"
            max="2025"
          />
        </div>
      </div>
    </div>
  );
};

export default StartupForm;