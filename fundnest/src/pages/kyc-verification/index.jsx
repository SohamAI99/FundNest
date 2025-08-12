import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import VerificationStep from './components/VerificationStep';


import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const KycVerification = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock current user data
  const { user } = useAuth();
  const currentUser = user || {
    id: 'unknown',
    name: "Guest User",
    email: "guest@example.com",
    role: "startup",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    kycStatus: "pending",
    subscriptionTier: "pro",
    accountType: "individual" // individual or business
  };

  // Define verification steps based on user type
  const getVerificationSteps = () => {
    const baseSteps = [
      {
        id: 1,
        title: "Personal Identity",
        description: "Government-issued ID verification",
        required: true,
        documents: [
          {
            type: "government_id",
            name: "Government ID",
            description: "Driver's license, passport, or national ID",
            accepted: ["jpg", "jpeg", "png", "pdf"],
            maxSize: "5MB",
            required: true
          }
        ]
      },
      {
        id: 2,
        title: "Proof of Address",
        description: "Verify your residential address",
        required: true,
        documents: [
          {
            type: "proof_of_address",
            name: "Proof of Address",
            description: "Utility bill, bank statement, or lease agreement (within 3 months)",
            accepted: ["jpg", "jpeg", "png", "pdf"],
            maxSize: "5MB",
            required: true
          }
        ]
      },
      {
        id: 3,
        title: "Selfie Verification",
        description: "Liveness detection and photo verification",
        required: true,
        documents: [
          {
            type: "selfie",
            name: "Live Selfie",
            description: "Take a clear photo of yourself",
            accepted: ["jpg", "jpeg", "png"],
            maxSize: "5MB",
            required: true,
            isLive: true
          }
        ]
      }
    ];

    // Add business verification steps if account is business
    if (currentUser?.accountType === "business" || currentUser?.role === "startup") {
      baseSteps?.push({
        id: 4,
        title: "Business Documents",
        description: "Company incorporation and tax documents",
        required: true,
        documents: [
          {
            type: "incorporation",
            name: "Certificate of Incorporation",
            description: "Business registration certificate",
            accepted: ["jpg", "jpeg", "png", "pdf"],
            maxSize: "10MB",
            required: true
          },
          {
            type: "tax_certificate",
            name: "Tax Certificate",
            description: "EIN certificate or tax ID document",
            accepted: ["jpg", "jpeg", "png", "pdf"],
            maxSize: "10MB",
            required: true
          },
          {
            type: "beneficial_ownership",
            name: "Beneficial Ownership",
            description: "UBO (Ultimate Beneficial Owner) information",
            accepted: ["jpg", "jpeg", "png", "pdf"],
            maxSize: "10MB",
            required: false
          }
        ]
      });
    }

    return baseSteps;
  };

  const verificationSteps = getVerificationSteps();

  // Mock verification status data
  const [statusData, setStatusData] = useState({
    overallStatus: 'in_progress', // pending, in_progress, approved, rejected
    documents: {
      government_id: { status: 'approved', uploadDate: '2024-12-08', rejectReason: null },
      proof_of_address: { status: 'pending', uploadDate: '2024-12-09', rejectReason: null },
      selfie: { status: 'rejected', uploadDate: '2024-12-08', rejectReason: 'Photo quality too low. Please ensure good lighting and face is clearly visible.' },
      incorporation: { status: 'pending', uploadDate: null, rejectReason: null },
      tax_certificate: { status: 'pending', uploadDate: null, rejectReason: null },
      beneficial_ownership: { status: 'pending', uploadDate: null, rejectReason: null }
    },
    submissionDate: '2024-12-08',
    reviewDeadline: '2024-12-15',
    completionPercentage: 65
  });

  useEffect(() => {
    // Calculate completion percentage based on approved documents
    const totalRequired = verificationSteps?.reduce((acc, step) => {
      return acc + step?.documents?.filter(doc => doc?.required)?.length;
    }, 0);
    
    const approvedRequired = Object?.entries(statusData?.documents)?.filter(([key, doc]) => {
      const isRequired = verificationSteps?.some(step => 
        step?.documents?.some(stepDoc => stepDoc?.type === key && stepDoc?.required)
      );
      return isRequired && doc?.status === 'approved';
    })?.length;
    
    const percentage = Math?.round((approvedRequired / totalRequired) * 100);
    setStatusData(prev => ({ ...prev, completionPercentage: percentage }));
  }, [statusData?.documents]);

  const handleDocumentUpload = (stepId, documentType, file, additionalData = {}) => {
    setVerificationData(prev => ({
      ...prev,
      [`${stepId}_${documentType}`]: {
        file,
        uploadDate: new Date(),
        ...additionalData
      }
    }));

    // Simulate uploading and update status
    setStatusData(prev => ({
      ...prev,
      documents: {
        ...prev?.documents,
        [documentType]: {
          status: 'pending',
          uploadDate: new Date()?.toISOString()?.split('T')?.[0],
          rejectReason: null
        }
      }
    }));
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatusData(prev => ({
        ...prev,
        overallStatus: 'in_progress',
        submissionDate: new Date()?.toISOString()?.split('T')?.[0]
      }));
      
      console.log('KYC submitted for review:', verificationData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepId) => {
    const step = verificationSteps?.find(s => s?.id === stepId);
    if (!step) return 'pending';
    
    const stepDocuments = step?.documents;
    const allApproved = stepDocuments?.every(doc => 
      !doc?.required || statusData?.documents?.[doc?.type]?.status === 'approved'
    );
    const anyRejected = stepDocuments?.some(doc => 
      statusData?.documents?.[doc?.type]?.status === 'rejected'
    );
    const anyUploaded = stepDocuments?.some(doc => 
      statusData?.documents?.[doc?.type]?.uploadDate
    );
    
    if (allApproved) return 'approved';
    if (anyRejected) return 'rejected';
    if (anyUploaded) return 'pending';
    return 'not_started';
  };

  const canProceedToStep = (stepId) => {
    if (stepId === 1) return true;
    
    // Check if all previous required steps are approved
    for (let i = 1; i < stepId; i++) {
      if (getStepStatus(i) !== 'approved') {
        return false;
      }
    }
    return true;
  };

  const allRequiredStepsCompleted = () => {
    return verificationSteps?.every(step => 
      getStepStatus(step?.id) === 'approved' || !step?.required
    );
  };

  const ProgressHeader = () => (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Identity Verification Progress
          </h2>
          <p className="text-muted-foreground">
            Complete all required steps to verify your identity and unlock full platform access.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {statusData?.completionPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
          
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${statusData?.completionPercentage * 2.51} 251.2`}
                className="text-primary transition-all duration-500"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {statusData?.reviewDeadline && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">
              Review deadline: {new Date(statusData?.reviewDeadline)?.toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={currentUser} 
        notifications={2} 
        onNavigate={navigate}
      />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="ShieldCheck" size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">KYC Verification</h1>
                <p className="text-muted-foreground">
                  Secure identity verification to protect your account and enable full platform features
                </p>
              </div>
            </div>
          </div>

          <ProgressHeader />

          {/* Verification Steps */}
          <div className="space-y-6">
            {verificationSteps?.map((step, index) => (
              <VerificationStep
                key={step?.id}
                step={step}
                stepIndex={index}
                status={getStepStatus(step?.id)}
                canProceed={canProceedToStep(step?.id)}
                isActive={currentStep === step?.id}
                statusData={statusData?.documents}
                onStepClick={setCurrentStep}
                onDocumentUpload={handleDocumentUpload}
              />
            ))}
          </div>

          {/* Submit Section */}
          {allRequiredStepsCompleted() && (
            <div className="mt-8 p-6 bg-success/10 border border-success/20 rounded-lg text-center">
              <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Verification Complete!
              </h3>
              <p className="text-muted-foreground mb-4">
                All required documents have been uploaded and approved. Your account is now fully verified.
              </p>
              <Button
                onClick={() => navigate('/user-profile-management')}
                iconName="ArrowRight"
              >
                Continue to Profile
              </Button>
            </div>
          )}

          {/* Security Assurance */}
          <div className="mt-8 bg-muted/30 border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name="Lock" size={20} className="text-primary mr-2" />
              Your Security is Our Priority
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Bank-Grade Encryption</p>
                  <p className="text-muted-foreground">All documents are encrypted using AES-256</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Icon name="Eye" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Limited Access</p>
                  <p className="text-muted-foreground">Only authorized personnel can review documents</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Icon name="Trash2" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Auto-Deletion</p>
                  <p className="text-muted-foreground">Documents deleted after verification completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KycVerification;