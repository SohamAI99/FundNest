import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BusinessDetailsTab = ({ data, onChange, userRole }) => {
  const [showPitchUpload, setShowPitchUpload] = useState(false);
  
  const industries = [
    'FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'B2B SaaS', 'E-commerce',
    'Clean Energy', 'Biotech', 'Gaming', 'Real Estate', 'Food & Beverage', 'Other'
  ];

  const investmentRanges = [
    '10k-50k', '50k-100k', '100k-250k', '250k-500k', '500k-1m', '1m-5m', '5m+'
  ];

  const teamSizes = [
    '1-5', '6-10', '11-50', '51-200', '201-500', '500+'
  ];

  const handlePitchUpload = (file) => {
    if (file) {
      const pitchData = {
        name: file?.name,
        size: (file?.size / (1024 * 1024))?.toFixed(1) + ' MB',
        uploadDate: new Date()?.toLocaleDateString(),
        file: file
      };
      onChange(null, 'pitchDeck', pitchData);
      setShowPitchUpload(false);
    }
  };

  if (userRole === 'startup') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Company Information</h2>
          <p className="text-muted-foreground">
            Share your startup details to help investors understand your business.
          </p>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={data?.companyName || ''}
            onChange={(e) => onChange(null, 'companyName', e?.target?.value)}
            placeholder="Your Company Inc."
            required
          />

          <Input
            label="Founding Date"
            type="date"
            value={data?.foundingDate || ''}
            onChange={(e) => onChange(null, 'foundingDate', e?.target?.value)}
            required
          />

          <Select
            label="Team Size"
            value={data?.teamSize || ''}
            onChange={(value) => onChange(null, 'teamSize', value)}
            placeholder="Select team size"
            options={teamSizes?.map(size => ({ value: size, label: size }))}
          />

          <Select
            label="Industry"
            value={data?.industry || ''}
            onChange={(value) => onChange(null, 'industry', value)}
            placeholder="Select industry"
            options={industries?.map(industry => ({ value: industry, label: industry }))}
          />
        </div>

        {/* Company Description */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Company Description
          </label>
          <div className="relative">
            <textarea
              value={data?.companyDescription || ''}
              onChange={(e) => onChange(null, 'companyDescription', e?.target?.value)}
              placeholder="Describe your company, mission, and what problem you're solving..."
              rows={4}
              maxLength={1000}
              className="w-full p-3 border border-input rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {data?.companyDescription?.length || 0}/1000
            </div>
          </div>
        </div>

        {/* Pitch Deck Management */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-foreground">Pitch Deck</h3>
          
          {data?.pitchDeck ? (
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{data?.pitchDeck?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data?.pitchDeck?.size} • Uploaded {data?.pitchDeck?.uploadDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" iconName="Eye">
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    iconName="Upload"
                    onClick={() => setShowPitchUpload(true)}
                  >
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    iconName="Trash2"
                    onClick={() => onChange(null, 'pitchDeck', null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setShowPitchUpload(true)}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
            >
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Icon name="Upload" size={24} className="text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Upload Pitch Deck</h4>
              <p className="text-sm text-muted-foreground">
                PDF, PPT, or PPTX files up to 10MB
              </p>
            </div>
          )}
        </div>

        {/* Pitch Upload Modal */}
        {showPitchUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPitchUpload(false)} />
            <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full animate-fadeIn">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upload Pitch Deck</h3>
              
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={(e) => {
                    const file = e?.target?.files?.[0];
                    if (file) handlePitchUpload(file);
                  }}
                  className="w-full p-3 border border-input rounded-lg text-sm"
                />
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPitchUpload(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Investor Business Details
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Investment Profile</h2>
        <p className="text-muted-foreground">
          Share your investment criteria and portfolio to attract relevant startups.
        </p>
      </div>

      {/* Investment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Investment Firm/Fund"
          value={data?.firm || ''}
          onChange={(e) => onChange(null, 'firm', e?.target?.value)}
          placeholder="Your Investment Firm"
        />

        <Select
          label="Investment Range"
          value={data?.investmentRange || ''}
          onChange={(value) => onChange(null, 'investmentRange', value)}
          placeholder="Select investment range"
          options={investmentRanges?.map(range => ({ value: range, label: range }))}
        />

        <Input
          label="Portfolio Companies"
          type="number"
          value={data?.portfolioCompanies || ''}
          onChange={(e) => onChange(null, 'portfolioCompanies', e?.target?.value)}
          placeholder="Number of portfolio companies"
        />

        <Input
          label="Years of Experience"
          type="number"
          value={data?.yearsExperience || ''}
          onChange={(e) => onChange(null, 'yearsExperience', e?.target?.value)}
          placeholder="Years in investment"
        />
      </div>

      {/* Investment Focus */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          Investment Focus Areas
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {industries?.map((industry) => (
            <label key={industry} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data?.investmentFocus?.includes(industry) || false}
                onChange={(e) => {
                  const currentFocus = data?.investmentFocus || [];
                  const newFocus = e?.target?.checked
                    ? [...currentFocus, industry]
                    : currentFocus?.filter(item => item !== industry);
                  onChange(null, 'investmentFocus', newFocus);
                }}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">{industry}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Verification Badges */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Verification Status</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="ShieldCheck" size={20} className="text-success" />
            <div>
              <p className="font-medium text-foreground">Identity Verified</p>
              <p className="text-xs text-muted-foreground">Verified on Dec 1, 2024</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Building" size={20} className="text-success" />
            <div>
              <p className="font-medium text-foreground">Accredited Investor</p>
              <p className="text-xs text-muted-foreground">SEC verification complete</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Trophy" size={20} className="text-warning" />
            <div>
              <p className="font-medium text-foreground">Pro Member</p>
              <p className="text-xs text-muted-foreground">Premium features unlocked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsTab;