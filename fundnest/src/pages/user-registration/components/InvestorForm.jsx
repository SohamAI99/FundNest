import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InvestorForm = ({ formData, onChange, errors }) => {
  const investmentFocusOptions = [
    { value: 'angel', label: 'Angel Investor' },
    { value: 'vc', label: 'Venture Capital' },
    { value: 'private-equity', label: 'Private Equity' },
    { value: 'family-office', label: 'Family Office' },
    { value: 'corporate', label: 'Corporate Venture' },
    { value: 'accelerator', label: 'Accelerator/Incubator' }
  ];

  const checkSizeOptions = [
    { value: '25k-50k', label: '₹20L - ₹40L' },
    { value: '50k-100k', label: '₹40L - ₹80L' },
    { value: '100k-250k', label: '₹80L - ₹2Cr' },
    { value: '250k-500k', label: '₹2Cr - ₹4Cr' },
    { value: '500k-1m', label: '₹4Cr - ₹8Cr' },
    { value: '1m-5m', label: '₹8Cr - ₹41Cr' },
    { value: '5m+', label: '₹41Cr+' }
  ];

  const sectorOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'fintech', label: 'Financial Technology' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'education', label: 'Education' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'food-beverage', label: 'Food & Beverage' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const stageOptions = [
    { value: 'pre-seed', label: 'Pre-Seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B' },
    { value: 'series-c', label: 'Series C' },
    { value: 'growth', label: 'Growth Stage' }
  ];

  const handleSectorChange = (sector, checked) => {
    const currentSectors = formData?.preferredSectors || [];
    if (checked) {
      onChange('preferredSectors', [...currentSectors, sector]);
    } else {
      onChange('preferredSectors', currentSectors?.filter(s => s !== sector));
    }
  };

  const handleStageChange = (stage, checked) => {
    const currentStages = formData?.preferredStages || [];
    if (checked) {
      onChange('preferredStages', [...currentStages, stage]);
    } else {
      onChange('preferredStages', currentStages?.filter(s => s !== stage));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Investment Profile</h3>
        <div className="space-y-4">
          <Select
            label="Investment Focus"
            placeholder="Select your investment type"
            options={investmentFocusOptions}
            value={formData?.investmentFocus || ''}
            onChange={(value) => onChange('investmentFocus', value)}
            error={errors?.investmentFocus}
            required
          />
          
          <Select
            label="Typical Check Size"
            placeholder="Select your typical investment amount"
            options={checkSizeOptions}
            value={formData?.checkSize || ''}
            onChange={(value) => onChange('checkSize', value)}
            error={errors?.checkSize}
            required
          />
          
          <Input
            label="Years of Investment Experience"
            type="number"
            placeholder="5"
            value={formData?.experienceYears || ''}
            onChange={(e) => onChange('experienceYears', e?.target?.value)}
            error={errors?.experienceYears}
            min="0"
            max="50"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Investment Preferences</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Preferred Sectors <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {sectorOptions?.map((sector) => (
                <Checkbox
                  key={sector?.value}
                  label={sector?.label}
                  checked={(formData?.preferredSectors || [])?.includes(sector?.value)}
                  onChange={(e) => handleSectorChange(sector?.value, e?.target?.checked)}
                />
              ))}
            </div>
            {errors?.preferredSectors && (
              <p className="mt-1 text-sm text-error">{errors?.preferredSectors}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Preferred Funding Stages <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {stageOptions?.map((stage) => (
                <Checkbox
                  key={stage?.value}
                  label={stage?.label}
                  checked={(formData?.preferredStages || [])?.includes(stage?.value)}
                  onChange={(e) => handleStageChange(stage?.value, e?.target?.checked)}
                />
              ))}
            </div>
            {errors?.preferredStages && (
              <p className="mt-1 text-sm text-error">{errors?.preferredStages}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorForm;