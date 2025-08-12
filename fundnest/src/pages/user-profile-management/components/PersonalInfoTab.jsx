import React, { useState, useRef } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PersonalInfoTab = ({ data, onChange, currentUser }) => {
  const [dragActive, setDragActive] = useState(false);
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e?.target?.result;
        setTempImageUrl(imageUrl);
        setShowImageCrop(true);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragActive(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleImageUpload(files?.[0]);
    }
  };

  const handleImageCrop = (croppedImage) => {
    onChange(null, 'profileImage', croppedImage);
    setShowImageCrop(false);
    setTempImageUrl(null);
  };

  const handleRemoveImage = () => {
    onChange(null, 'profileImage', null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Personal Information</h2>
        <p className="text-muted-foreground">
          Update your personal details and contact information to build trust with your network.
        </p>
      </div>

      {/* Profile Image Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-foreground">Profile Photo</h3>
        
        <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-8">
          {/* Current Image */}
          <div className="relative">
            {data?.profileImage ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-lg">
                  <Image
                    src={data?.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-error text-error-foreground rounded-full flex items-center justify-center hover:bg-error/90 transition-colors shadow-lg"
                  aria-label="Remove image"
                >
                  <Icon name="X" size={16} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted border-4 border-border flex items-center justify-center">
                <Icon name="User" size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div className="flex-1 max-w-md">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e?.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => fileInputRef?.current?.click()}
              className={`
                w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                ${dragActive 
                  ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/30'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  <Icon name="Upload" size={20} strokeWidth={2} />
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Drop image here or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                if (file) handleImageUpload(file);
              }}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          value={data?.name || ''}
          onChange={(e) => onChange(null, 'name', e?.target?.value)}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={data?.email || ''}
          onChange={(e) => onChange(null, 'email', e?.target?.value)}
          placeholder="your.email@example.com"
          required
        />

        <Input
          label="Phone Number"
          value={data?.phone || ''}
          onChange={(e) => onChange(null, 'phone', e?.target?.value)}
          placeholder="+1 (555) 123-4567"
        />

        <Input
          label="Location"
          value={data?.location || ''}
          onChange={(e) => onChange(null, 'location', e?.target?.value)}
          placeholder="City, State/Country"
        />

        <Input
          label="Website"
          value={data?.website || ''}
          onChange={(e) => onChange(null, 'website', e?.target?.value)}
          placeholder="https://yourwebsite.com"
        />

        <Input
          label="LinkedIn Profile"
          value={data?.linkedin || ''}
          onChange={(e) => onChange(null, 'linkedin', e?.target?.value)}
          placeholder="https://linkedin.com/in/yourname"
        />
      </div>

      {/* Bio Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Professional Bio
        </label>
        <div className="relative">
          <textarea
            value={data?.bio || ''}
            onChange={(e) => onChange(null, 'bio', e?.target?.value)}
            placeholder="Tell your professional story, highlight your experience, achievements, and what drives you..."
            rows={4}
            maxLength={500}
            className="w-full p-3 border border-input rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {data?.bio?.length || 0}/500
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          A compelling bio helps build trust and makes meaningful connections with potential partners.
        </p>
      </div>

      {/* Rich Text Editor Placeholder */}
      <div className="bg-muted/30 border border-border rounded-lg p-6 text-center">
        <Icon name="Type" size={32} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Rich text editor for bio formatting coming soon
        </p>
      </div>

      {/* Image Crop Modal Placeholder */}
      {showImageCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowImageCrop(false)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-lg w-full animate-fadeIn">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Crop Profile Photo
              </h3>
              
              {/* Image Preview */}
              <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Image cropping interface</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowImageCrop(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleImageCrop(tempImageUrl)}
                  className="flex-1"
                >
                  Save Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTab;