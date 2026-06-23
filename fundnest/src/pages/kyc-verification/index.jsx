import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
import AppHeader from '../../components/ui/AppHeader';
import VerificationStep from './components/VerificationStep';


import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const KycVerification = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use real user data from AuthContext with proper fallback
  const currentUser = user || {
    id: 'unknown',
    name: "Guest User",
    email: "guest@example.com",
    role: "startup",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    kycStatus: "unverified",
    subscriptionTier: "free",
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

  const getInitialStatusData = () => {
    const kyc = currentUser?.kycStatus || 'unverified';
    const isVerified = kyc === 'verified';
    const isPending = kyc === 'pending';
    
    return {
      overallStatus: isVerified ? 'approved' : isPending ? 'in_progress' : 'not_started',
      documents: {
        government_id: { 
          status: isVerified ? 'approved' : isPending ? 'pending' : 'not_uploaded', 
          uploadDate: isVerified || isPending ? '2026-06-23' : null, 
          rejectReason: null 
        },
        proof_of_address: { 
          status: isVerified ? 'approved' : isPending ? 'pending' : 'not_uploaded', 
          uploadDate: isVerified || isPending ? '2026-06-23' : null, 
          rejectReason: null 
        },
        selfie: { 
          status: isVerified ? 'approved' : isPending ? 'pending' : 'not_uploaded', 
          uploadDate: isVerified || isPending ? '2026-06-23' : null, 
          rejectReason: null 
        },
        incorporation: { 
          status: isVerified ? 'approved' : isPending ? 'pending' : 'not_uploaded', 
          uploadDate: isVerified || isPending ? '2026-06-23' : null, 
          rejectReason: null 
        },
        tax_certificate: { 
          status: isVerified ? 'approved' : isPending ? 'pending' : 'not_uploaded', 
          uploadDate: isVerified || isPending ? '2026-06-23' : null, 
          rejectReason: null 
        },
        beneficial_ownership: { 
          status: isVerified ? 'approved' : isPending ? 'pending' : 'not_uploaded', 
          uploadDate: isVerified || isPending ? '2026-06-23' : null, 
          rejectReason: null 
        }
      },
      submissionDate: isVerified || isPending ? '2026-06-23' : null,
      reviewDeadline: null,
      completionPercentage: isVerified ? 100 : isPending ? 50 : 0
    };
  };

  const [statusData, setStatusData] = useState(getInitialStatusData());

  useEffect(() => {
    setStatusData(getInitialStatusData());
  }, [currentUser?.kycStatus]);

  const handleDocumentUpload = (stepId, documentType, file, additionalData = {}) => {
    setVerificationData(prev => ({
      ...prev,
      [`${stepId}_${documentType}`]: {
        file,
        uploadDate: new Date(),
        ...additionalData
      }
    }));

    setStatusData(prev => {
      const nextDocs = {
        ...prev.documents,
        [documentType]: {
          status: 'approved', // Auto-approving for smooth prototyping experience on file select
          uploadDate: new Date().toISOString().split('T')[0],
          rejectReason: null
        }
      };

      const totalRequired = verificationSteps.reduce((acc, step) => {
        return acc + step.documents.filter(doc => doc.required).length;
      }, 0);

      const approvedRequired = Object.entries(nextDocs).filter(([key, doc]) => {
        const isRequired = verificationSteps.some(step => 
          step.documents.some(stepDoc => stepDoc.type === key && stepDoc.required)
        );
        return isRequired && doc.status === 'approved';
      }).length;

      const percentage = Math.round((approvedRequired / totalRequired) * 100);

      return {
        ...prev,
        documents: nextDocs,
        completionPercentage: percentage
      };
    });
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      const response = await userAPI.submitKyc(verificationData);
      if (response.success) {
        updateUser({ kycStatus: 'verified' });
        setStatusData(prev => ({
          ...prev,
          overallStatus: 'approved',
          completionPercentage: 100,
          submissionDate: new Date().toISOString().split('T')[0]
        }));
        console.log('KYC Verification Successful:', response);
      }
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

  const allRequiredUploaded = () => {
    return verificationSteps?.every(step => 
      step?.documents?.every(doc => 
        !doc?.required || statusData?.documents?.[doc?.type]?.uploadDate
      )
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
          {!allRequiredStepsCompleted() && allRequiredUploaded() && (
            <div className="mt-8 p-6 bg-card border border-border rounded-lg text-center space-y-4">
              <Icon name="UploadCloud" size={32} className="text-primary mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">
                Ready for Verification
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You have uploaded all required documents. Submit them now for instant automated verification.
              </p>
              <Button
                onClick={handleSubmitForReview}
                loading={isSubmitting}
                iconName="ShieldCheck"
                className="w-full sm:w-auto"
              >
                Submit Documents for Verification
              </Button>
            </div>
          )}

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
                onClick={() => navigate('/investor-dashboard')}
                iconName="ArrowRight"
              >
                Go to Dashboard
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