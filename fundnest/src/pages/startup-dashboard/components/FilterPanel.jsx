import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFiltersChange, totalResults }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    matchScore: '',
    investmentRange: '',
    sector: '',
    stage: '',
    location: ''
  });

  const matchScoreOptions = [
    { value: '', label: 'All Match Scores' },
    { value: '85-100', label: '85-100% (Excellent)' },
    { value: '70-84', label: '70-84% (Good)' },
    { value: '50-69', label: '50-69% (Fair)' },
    { value: '0-49', label: 'Below 50% (Poor)' }
  ];

  const investmentRangeOptions = [
    { value: '', label: 'All Investment Ranges' },
    { value: '0-50k', label: '$0 - $50K' },
    { value: '50k-250k', label: '$50K - $250K' },
    { value: '250k-1m', label: '$250K - $1M' },
    { value: '1m-5m', label: '$1M - $5M' },
    { value: '5m+', label: '$5M+' }
  ];

  const sectorOptions = [
    { value: '', label: 'All Sectors' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'healthtech', label: 'HealthTech' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'iot', label: 'IoT' },
    { value: 'cleantech', label: 'CleanTech' }
  ];

  const stageOptions = [
    { value: '', label: 'All Stages' },
    { value: 'pre-seed', label: 'Pre-Seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B' },
    { value: 'series-c', label: 'Series C+' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'san-francisco', label: 'San Francisco, CA' },
    { value: 'new-york', label: 'New York, NY' },
    { value: 'boston', label: 'Boston, MA' },
    { value: 'austin', label: 'Austin, TX' },
    { value: 'seattle', label: 'Seattle, WA' },
    { value: 'chicago', label: 'Chicago, IL' },
    { value: 'los-angeles', label: 'Los Angeles, CA' },
    { value: 'remote', label: 'Remote/Global' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      matchScore: '',
      investmentRange: '',
      sector: '',
      stage: '',
      location: ''
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-foreground">Filter Investors</h3>
            {totalResults && (
              <span className="text-sm text-muted-foreground">
                {totalResults} results
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Match Score"
              options={matchScoreOptions}
              value={filters?.matchScore}
              onChange={(value) => handleFilterChange('matchScore', value)}
              placeholder="Select match score range"
            />
            
            <Select
              label="Investment Range"
              options={investmentRangeOptions}
              value={filters?.investmentRange}
              onChange={(value) => handleFilterChange('investmentRange', value)}
              placeholder="Select investment range"
            />
            
            <Select
              label="Sector Focus"
              options={sectorOptions}
              value={filters?.sector}
              onChange={(value) => handleFilterChange('sector', value)}
              placeholder="Select sector"
              searchable
            />
            
            <Select
              label="Investment Stage"
              options={stageOptions}
              value={filters?.stage}
              onChange={(value) => handleFilterChange('stage', value)}
              placeholder="Select stage"
            />
            
            <Select
              label="Location"
              options={locationOptions}
              value={filters?.location}
              onChange={(value) => handleFilterChange('location', value)}
              placeholder="Select location"
              searchable
            />
          </div>
          
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {Object.entries(filters)?.map(([key, value]) => {
                if (!value) return null;
                
                const getFilterLabel = (filterKey, filterValue) => {
                  const optionMap = {
                    matchScore: matchScoreOptions,
                    investmentRange: investmentRangeOptions,
                    sector: sectorOptions,
                    stage: stageOptions,
                    location: locationOptions
                  };
                  
                  const option = optionMap?.[filterKey]?.find(opt => opt?.value === filterValue);
                  return option ? option?.label : filterValue;
                };
                
                return (
                  <span
                    key={key}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs"
                  >
                    <span>{getFilterLabel(key, value)}</span>
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="hover:text-accent/80 transition-smooth"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;