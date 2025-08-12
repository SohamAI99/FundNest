import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileImageUpload = ({ formData, onChange, errors }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(formData?.profileImage || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e?.target?.result;
        setPreview(imageUrl);
        onChange('profileImage', imageUrl);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handleFileSelect(files?.[0]);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange('profileImage', null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add a professional photo to help build trust with potential partners.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-6">
        {/* Preview Section */}
        <div className="relative">
          {preview ? (
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-lg">
                <Image
                  src={preview}
                  alt="Profile preview"
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
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`
            w-full max-w-md p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50 hover:bg-muted/30'
            }
          `}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              <Icon name="Upload" size={24} strokeWidth={2} />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop your image here, or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {errors?.profileImage && (
          <p className="text-sm text-error text-center">{errors?.profileImage}</p>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;