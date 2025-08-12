import React, { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import StatusBadge from './StatusBadge';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VerificationStep = ({
  step,
  stepIndex,
  status,
  canProceed,
  isActive,
  statusData,
  onStepClick,
  onDocumentUpload
}) => {
  const [expandedDocuments, setExpandedDocuments] = useState({});

  const toggleDocumentExpand = (docType) => {
    setExpandedDocuments(prev => ({
      ...prev,
      [docType]: !prev?.[docType]
    }));
  };

  const getStepIcon = () => {
    switch (status) {
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const getStepIconColor = () => {
    switch (status) {
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-error';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDocumentStatus = (docType) => {
    return statusData?.[docType] || { status: 'not_uploaded', uploadDate: null, rejectReason: null };
  };

  return (
    <div className={`
      border rounded-lg transition-all duration-200
      ${isActive 
        ? 'border-primary bg-primary/5' 
        : status === 'approved' ?'border-success bg-success/5'
          : status === 'rejected' ?'border-error bg-error/5' :'border-border bg-card'
      }
    `}>
      {/* Step Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => canProceed && onStepClick(step?.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Step Number/Icon */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${status === 'approved' ?'bg-success/20' 
                : status === 'rejected' ?'bg-error/20'
                  : status === 'pending' ?'bg-warning/20' :'bg-muted'
              }
            `}>
              {status === 'not_started' ? (
                <span className="text-sm font-medium text-muted-foreground">
                  {step?.id}
                </span>
              ) : (
                <Icon 
                  name={getStepIcon()} 
                  size={20} 
                  className={getStepIconColor()} 
                />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {step?.title}
                </h3>
                <StatusBadge status={status} />
                {step?.required && (
                  <span className="text-xs bg-error/10 text-error px-2 py-1 rounded-full">
                    Required
                  </span>
                )}
              </div>
              
              <p className="text-muted-foreground mt-1">
                {step?.description}
              </p>

              {/* Show reject reasons if any */}
              {status === 'rejected' && (
                <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-error">Action Required</p>
                      <div className="text-sm text-muted-foreground mt-1">
                        {step?.documents?.map(doc => {
                          const docStatus = getDocumentStatus(doc?.type);
                          if (docStatus?.status === 'rejected') {
                            return (
                              <div key={doc?.type} className="mt-1">
                                <span className="font-medium">{doc?.name}:</span> {docStatus?.rejectReason}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName={isActive ? "ChevronUp" : "ChevronDown"}
            disabled={!canProceed}
          />
        </div>
      </div>

      {/* Step Content - Documents */}
      {isActive && canProceed && (
        <div className="border-t border-border/50 p-6 pt-0">
          <div className="mt-6 space-y-6">
            {step?.documents?.map((document) => {
              const docStatus = getDocumentStatus(document?.type);
              const isExpanded = expandedDocuments?.[document?.type];

              return (
                <div key={document?.type} className="space-y-4">
                  {/* Document Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name="FileText" size={20} className="text-muted-foreground" />
                      <div>
                        <h4 className="font-medium text-foreground">{document?.name}</h4>
                        <p className="text-sm text-muted-foreground">{document?.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={docStatus?.status} size="sm" />
                      {document?.required && (
                        <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                        onClick={() => toggleDocumentExpand(document?.type)}
                      />
                    </div>
                  </div>

                  {/* Document Upload Area */}
                  {(isExpanded || docStatus?.status === 'rejected' || !docStatus?.uploadDate) && (
                    <div className="ml-8">
                      <DocumentUpload
                        document={document}
                        status={docStatus}
                        onUpload={(file, additionalData) => 
                          onDocumentUpload(step?.id, document?.type, file, additionalData)
                        }
                      />
                    </div>
                  )}

                  {/* Document Status Info */}
                  {docStatus?.uploadDate && (
                    <div className="ml-8 text-sm text-muted-foreground">
                      {docStatus?.status === 'approved' && (
                        <div className="flex items-center space-x-2">
                          <Icon name="CheckCircle" size={14} className="text-success" />
                          <span>Approved on {new Date(docStatus?.uploadDate)?.toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {docStatus?.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Icon name="Clock" size={14} className="text-warning" />
                          <span>Under review since {new Date(docStatus?.uploadDate)?.toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {docStatus?.status === 'rejected' && docStatus?.rejectReason && (
                        <div className="flex items-start space-x-2 mt-2">
                          <Icon name="XCircle" size={14} className="text-error flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-error font-medium">Rejected</p>
                            <p className="mt-1">{docStatus?.rejectReason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Step Guidelines */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">
                <Icon name="Info" size={16} className="inline mr-2" />
                Document Guidelines
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure documents are clear and readable</li>
                <li>• All four corners should be visible</li>
                <li>• No glare, shadows, or blurred text</li>
                <li>• Information must match your account details</li>
                <li>• Documents should be recent and unexpired</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Disabled Step Message */}
      {!canProceed && step?.id > 1 && (
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Lock" size={14} />
            <span>Complete previous steps to unlock this section</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationStep;