import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PitchManager = ({ currentPitch, onUpload, onAnalyze }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const pdfFile = files?.find(file => file?.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileUpload(pdfFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type === 'application/pdf') {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadProgress(100);
      
      if (onUpload) {
        onUpload(file);
      }
      
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysisResults({
          overallScore: 78,
          strengths: [
            "Clear problem statement and market opportunity",
            "Strong financial projections with realistic assumptions",
            "Experienced team with relevant background"
          ],
          weaknesses: [
            "Limited competitive analysis provided",
            "Go-to-market strategy needs more detail",
            "Risk mitigation section could be expanded"
          ],
          recommendations: [
            "Add more market research data to support claims",
            "Include customer testimonials or case studies",
            "Provide clearer timeline for key milestones"
          ]
        });
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Pitch Deck Management</h3>
      </div>
      <div className="p-4 space-y-4">
        {!currentPitch ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
              isDragging 
                ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted/30 rounded-full flex items-center justify-center">
                <Icon name="Upload" size={32} className="text-muted-foreground" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Upload Your Pitch Deck</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your PDF file here, or click to browse
                </p>
                
                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                >
                  Choose File
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                PDF files only, max 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Pitch */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-error" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{currentPitch?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentPitch?.size} • Uploaded {currentPitch?.uploadDate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="Eye">
                  Preview
                </Button>
                <Button variant="ghost" size="sm" iconName="Download">
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="Upload"
                  onClick={triggerFileSelect}
                >
                  Replace
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="text-foreground font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* AI Analysis Results */}
        {analysisResults && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">AI Analysis Results</h4>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{analysisResults?.overallScore}</span>
                </div>
                <span className="text-sm text-muted-foreground">Overall Score</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strengths */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-success flex items-center space-x-1">
                  <Icon name="CheckCircle" size={16} />
                  <span>Strengths</span>
                </h5>
                <ul className="space-y-1">
                  {analysisResults?.strengths?.map((strength, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Weaknesses */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-warning flex items-center space-x-1">
                  <Icon name="AlertCircle" size={16} />
                  <span>Areas to Improve</span>
                </h5>
                <ul className="space-y-1">
                  {analysisResults?.weaknesses?.map((weakness, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Recommendations */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-accent flex items-center space-x-1">
                  <Icon name="Lightbulb" size={16} />
                  <span>Recommendations</span>
                </h5>
                <ul className="space-y-1">
                  {analysisResults?.recommendations?.map((rec, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchManager;