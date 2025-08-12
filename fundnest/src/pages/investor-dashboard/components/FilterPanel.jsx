import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, onSaveSearch, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const sectorOptions = [
    { value: 'fintech', label: 'FinTech' },
    { value: 'healthtech', label: 'HealthTech' },
    { value: 'edtech', label: 'EdTech' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'iot', label: 'IoT' },
    { value: 'cleantech', label: 'CleanTech' },
    { value: 'foodtech', label: 'FoodTech' }
  ];

  const stageOptions = [
    { value: 'pre-seed', label: 'Pre-Seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B' },
    { value: 'series-c', label: 'Series C+' },
    { value: 'growth', label: 'Growth Stage' }
  ];

  const amountOptions = [
    { value: '0-100k', label: '$0 - $100K' },
    { value: '100k-500k', label: '$100K - $500K' },
    { value: '500k-1m', label: '$500K - $1M' },
    { value: '1m-5m', label: '$1M - $5M' },
    { value: '5m-10m', label: '$5M - $10M' },
    { value: '10m+', label: '$10M+' }
  ];

  const locationOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'germany', label: 'Germany' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'india', label: 'India' },
    { value: 'australia', label: 'Australia' },
    { value: 'israel', label: 'Israel' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSaveSearch = () => {
    if (searchName?.trim()) {
      onSaveSearch(searchName, filters);
      setSearchName('');
      setShowSaveModal(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.sectors?.length > 0) count++;
    if (filters?.stages?.length > 0) count++;
    if (filters?.amounts?.length > 0) count++;
    if (filters?.locations?.length > 0) count++;
    if (filters?.hasRevenue) count++;
    if (filters?.isVerified) count++;
    if (filters?.hasTeam) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Filter Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSaveModal(true)}
              iconName="Bookmark"
              iconSize={16}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={16}
            >
              Clear
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Sector Filter */}
          <div>
            <Select
              label="Sectors"
              description="Select industries of interest"
              options={sectorOptions}
              value={filters?.sectors || []}
              onChange={(value) => handleFilterChange('sectors', value)}
              multiple
              searchable
              clearable
              placeholder="Choose sectors..."
              className="mb-4"
            />
          </div>

          {/* Funding Stage Filter */}
          <div>
            <Select
              label="Funding Stage"
              description="Investment stage preferences"
              options={stageOptions}
              value={filters?.stages || []}
              onChange={(value) => handleFilterChange('stages', value)}
              multiple
              clearable
              placeholder="Select stages..."
              className="mb-4"
            />
          </div>

          {/* Investment Amount Filter */}
          <div>
            <Select
              label="Investment Amount"
              description="Target funding ranges"
              options={amountOptions}
              value={filters?.amounts || []}
              onChange={(value) => handleFilterChange('amounts', value)}
              multiple
              clearable
              placeholder="Choose amounts..."
              className="mb-4"
            />
          </div>

          {/* Location Filter */}
          <div>
            <Select
              label="Location"
              description="Geographic preferences"
              options={locationOptions}
              value={filters?.locations || []}
              onChange={(value) => handleFilterChange('locations', value)}
              multiple
              searchable
              clearable
              placeholder="Select locations..."
              className="mb-4"
            />
          </div>

          {/* Additional Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Additional Criteria</h4>
            
            <Checkbox
              label="Has Revenue"
              description="Companies with proven revenue streams"
              checked={filters?.hasRevenue || false}
              onChange={(e) => handleFilterChange('hasRevenue', e?.target?.checked)}
            />

            <Checkbox
              label="KYC Verified"
              description="Only verified startups"
              checked={filters?.isVerified || false}
              onChange={(e) => handleFilterChange('isVerified', e?.target?.checked)}
            />

            <Checkbox
              label="Complete Team"
              description="Startups with full founding team"
              checked={filters?.hasTeam || false}
              onChange={(e) => handleFilterChange('hasTeam', e?.target?.checked)}
            />
          </div>

          {/* Match Score Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Match Score
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filters?.minMatchScore || 0}
                onChange={(e) => handleFilterChange('minMatchScore', parseInt(e?.target?.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground min-w-12">
                {filters?.minMatchScore || 0}%
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Save Search</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSaveModal(false)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Search Name
                  </label>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e?.target?.value)}
                    placeholder="e.g., FinTech Seed Rounds"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveSearch}
                    disabled={!searchName?.trim()}
                  >
                    Save Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;