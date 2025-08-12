import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const DocumentUpload = ({ document, status, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (file && validateFile(file)) {
      setIsUploading(true);
      setUploadProgress(0);

      // Create preview for images
      if (file?.type?.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e?.target?.result);
        reader?.readAsDataURL(file);
      }

      // Simulate upload progress
      const uploadSimulation = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadSimulation);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      try {
        // Simulate API upload
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setUploadProgress(100);
        onUpload(file, { 
          fileName: file?.name,
          fileSize: file?.size,
          fileType: file?.type,
          uploadTimestamp: new Date()
        });
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
        
      } catch (error) {
        console.error('Upload failed:', error);
        setIsUploading(false);
        setUploadProgress(0);
      } finally {
        clearInterval(uploadSimulation);
      }
    }
  };

  const validateFile = (file) => {
    const maxSize = parseInt(document?.maxSize?.replace('MB', '')) * 1024 * 1024;
    const acceptedTypes = document?.accepted?.map(ext => {
      switch (ext?.toLowerCase()) {
        case 'jpg': case'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'pdf':
          return 'application/pdf';
        default:
          return `image/${ext}`;
      }
    });

    if (file?.size > maxSize) {
      alert(`File size must be less than ${document?.maxSize}`);
      return false;
    }

    if (!acceptedTypes?.includes(file?.type)) {
      alert(`File type must be one of: ${document?.accepted?.join(', ')}`);
      return false;
    }

    return true;
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

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const handleCameraCapture = () => {
    if (document?.isLive) {
      setShowCamera(true);
    }
  };

  const simulateCameraCapture = async () => {
    // Simulate camera capture process
    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock captured image
    const mockImageFile = new File([''], 'selfie_capture.jpg', { type: 'image/jpeg' });
    handleFileSelect(mockImageFile);
    setShowCamera(false);
  };

  // Render upload area based on document status
  const renderUploadArea = () => {
    if (status?.status === 'approved') {
      return (
        <div className="border-2 border-success bg-success/5 rounded-lg p-6 text-center">
          <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-3" />
          <p className="font-medium text-success mb-2">Document Approved</p>
          <p className="text-sm text-muted-foreground">
            Your {document?.name?.toLowerCase()} has been verified and approved.
          </p>
        </div>
      );
    }

    if (status?.status === 'pending' && !status?.rejectReason) {
      return (
        <div className="border-2 border-warning bg-warning/5 rounded-lg p-6 text-center">
          <Icon name="Clock" size={32} className="text-warning mx-auto mb-3" />
          <p className="font-medium text-warning mb-2">Under Review</p>
          <p className="text-sm text-muted-foreground">
            Your {document?.name?.toLowerCase()} is being reviewed. We'll notify you once complete.
          </p>
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            onClick={openFileDialog}
            className="mt-3"
          >
            Upload New Version
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Main Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!isUploading ? openFileDialog : undefined}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'border-primary bg-primary/10 scale-105' 
              : isUploading
                ? 'border-muted bg-muted/10'
                : status?.status === 'rejected' ?'border-error bg-error/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
            }
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          {isUploading ? (
            <div className="space-y-3">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-medium text-foreground">Uploading...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Icon 
                name="Upload" 
                size={32} 
                className={`mx-auto ${
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <div>
                <p className="font-medium text-foreground">
                  {isDragging ? 'Drop file here' : `Upload ${document?.name}`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click to browse or drag and drop
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {document?.accepted?.join(', ')?.toUpperCase()} • Max {document?.maxSize}
              </div>
            </div>
          )}
        </div>
        {/* Camera Option for Live Selfie */}
        {document?.isLive && (
          <div className="flex items-center space-x-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>
        )}
        {document?.isLive && (
          <Button
            variant="outline"
            onClick={handleCameraCapture}
            iconName="Camera"
            disabled={isUploading}
            className="w-full"
          >
            Use Camera
          </Button>
        )}
        {/* File Requirements */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Requirements:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Clear, readable image or document</li>
            <li>All corners and edges visible</li>
            <li>Good lighting, no shadows or glare</li>
            {document?.isLive && <li>Look directly at camera, remove glasses</li>}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderUploadArea()}

      {/* Preview */}
      {preview && !isUploading && (
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-foreground">Preview</h5>
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              onClick={() => setPreview(null)}
            />
          </div>
          <div className="max-w-xs mx-auto">
            <Image
              src={preview}
              alt="Document preview"
              className="w-full rounded-lg border border-border"
            />
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCamera(false)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full animate-fadeIn">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Camera" size={20} className="mr-2" />
              Live Selfie Capture
            </h3>
            
            {/* Mock Camera Interface */}
            <div className="bg-muted rounded-lg aspect-square flex items-center justify-center mb-4">
              <div className="text-center">
                <Icon name="User" size={64} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Camera interface would appear here</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCamera(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={simulateCameraCapture}
                iconName="Camera"
                className="flex-1"
              >
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={document?.accepted?.map(ext => `.${ext}`)?.join(',')}
        onChange={(e) => {
          const file = e?.target?.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
    </div>
  );
};

export default DocumentUpload;