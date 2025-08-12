import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const KycReviewsTab = ({ searchQuery, dateRange, onKycAction }) => {
  const [selectedKyc, setSelectedKyc] = useState([]);
  const [sortBy, setSortBy] = useState('submission_date');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Mock KYC submissions
  const mockKycSubmissions = [
    {
      id: 'kyc_001',
      user: {
        id: 'user_001',
        name: 'Demo User',
        email: 'demo.user@techstartup.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'startup'
      },
      submissionDate: '2024-12-08',
      status: 'pending',
      priority: 'high',
      documents: [
        {
          type: 'government_id',
          name: 'Driver License',
          url: '/documents/government_id_001.jpg',
          status: 'pending',
          uploadDate: '2024-12-08'
        },
        {
          type: 'proof_of_address',
          name: 'Utility Bill',
          url: '/documents/address_proof_001.pdf',
          status: 'pending',
          uploadDate: '2024-12-08'
        },
        {
          type: 'selfie',
          name: 'Live Selfie',
          url: '/documents/selfie_001.jpg',
          status: 'rejected',
          uploadDate: '2024-12-07',
          rejectReason: 'Poor image quality. Please ensure good lighting and face is clearly visible.'
        }
      ],
      completionPercentage: 67,
      assignedReviewer: 'admin_002',
      reviewDeadline: '2024-12-15'
    },
    {
      id: 'kyc_002',
      user: {
        id: 'user_002',
        name: 'Michael Rodriguez',
        email: 'michael@investcorp.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'investor'
      },
      submissionDate: '2024-12-07',
      status: 'in_review',
      priority: 'medium',
      documents: [
        {
          type: 'government_id',
          name: 'Passport',
          url: '/documents/government_id_002.jpg',
          status: 'approved',
          uploadDate: '2024-12-07'
        },
        {
          type: 'proof_of_address',
          name: 'Bank Statement',
          url: '/documents/address_proof_002.pdf',
          status: 'pending',
          uploadDate: '2024-12-07'
        },
        {
          type: 'selfie',
          name: 'Live Selfie',
          url: '/documents/selfie_002.jpg',
          status: 'approved',
          uploadDate: '2024-12-07'
        }
      ],
      completionPercentage: 67,
      assignedReviewer: 'admin_001',
      reviewDeadline: '2024-12-14'
    },
    {
      id: 'kyc_003',
      user: {
        id: 'user_003',
        name: 'Emma Thompson',
        email: 'emma.thompson@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'startup'
      },
      submissionDate: '2024-12-05',
      status: 'rejected',
      priority: 'low',
      documents: [
        {
          type: 'government_id',
          name: 'Driver License',
          url: '/documents/government_id_003.jpg',
          status: 'rejected',
          uploadDate: '2024-12-05',
          rejectReason: 'Document appears to be expired. Please upload a valid, current ID.'
        },
        {
          type: 'proof_of_address',
          name: 'Lease Agreement',
          url: '/documents/address_proof_003.pdf',
          status: 'approved',
          uploadDate: '2024-12-05'
        }
      ],
      completionPercentage: 50,
      assignedReviewer: 'admin_003',
      reviewDeadline: '2024-12-12'
    }
  ];

  const sortOptions = [
    { value: 'submission_date', label: 'Submission Date' },
    { value: 'review_deadline', label: 'Review Deadline' },
    { value: 'priority', label: 'Priority' },
    { value: 'completion', label: 'Completion %' },
    { value: 'user_name', label: 'User Name' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Submissions' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'in_review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const getFilteredKyc = () => {
    let filtered = [...mockKycSubmissions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(kyc => 
        kyc?.user?.name?.toLowerCase()?.includes(query) ||
        kyc?.user?.email?.toLowerCase()?.includes(query) ||
        kyc?.id?.toLowerCase()?.includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered?.filter(kyc => kyc?.status === filterStatus);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'submission_date':
          return new Date(b?.submissionDate) - new Date(a?.submissionDate);
        case 'review_deadline':
          return new Date(a?.reviewDeadline) - new Date(b?.reviewDeadline);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
        case 'completion':
          return b?.completionPercentage - a?.completionPercentage;
        case 'user_name':
          return a?.user?.name?.localeCompare(b?.user?.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredKyc = getFilteredKyc();

  const handleDocumentView = (document, kycSubmission) => {
    setSelectedDocument({ ...document, kycId: kycSubmission?.id, user: kycSubmission?.user });
    setShowDocumentModal(true);
  };

  const handleDocumentAction = (action) => {
    if (!selectedDocument) return;
    
    const actionData = {
      action,
      documentType: selectedDocument?.type,
      notes: reviewNotes
    };
    
    onKycAction(action, selectedDocument?.kycId, actionData);
    setShowDocumentModal(false);
    setReviewNotes('');
    setSelectedDocument(null);
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-destructive/10 text-destructive border-destructive/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-success/10 text-success border-success/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[priority]}`}>
        {priority?.charAt(0)?.toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      in_review: 'bg-primary/10 text-primary border-primary/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[status]}`}>
        {status?.replace('_', ' ')?.charAt(0)?.toUpperCase() + status?.replace('_', ' ')?.slice(1)}
      </span>
    );
  };

  const getDocumentStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[status]}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math?.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
            className="w-48"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-48"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log('Bulk approve')}
            iconName="CheckCircle"
          >
            Bulk Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log('Export KYC data')}
            iconName="Download"
          >
            Export
          </Button>
        </div>
      </div>

      {/* KYC Submissions List */}
      <div className="space-y-4">
        {filteredKyc?.map((kycSubmission) => {
          const daysUntilDeadline = getDaysUntilDeadline(kycSubmission?.reviewDeadline);
          const isUrgent = daysUntilDeadline <= 2;

          return (
            <div key={kycSubmission?.id} className={`bg-background border rounded-lg p-6 ${isUrgent ? 'border-destructive/50 bg-destructive/5' : 'border-border'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={kycSubmission?.user?.avatar}
                    alt={kycSubmission?.user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{kycSubmission?.user?.name}</h4>
                    <p className="text-sm text-muted-foreground">{kycSubmission?.user?.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon 
                        name={kycSubmission?.user?.role === 'startup' ? 'Briefcase' : 'TrendingUp'} 
                        size={14} 
                        className="text-muted-foreground" 
                      />
                      <span className="text-xs text-muted-foreground capitalize">{kycSubmission?.user?.role}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getPriorityBadge(kycSubmission?.priority)}
                  {getStatusBadge(kycSubmission?.status)}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{kycSubmission?.completionPercentage}% Complete</p>
                    <p className={`text-xs ${isUrgent ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : `${Math?.abs(daysUntilDeadline)} days overdue`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${kycSubmission?.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {kycSubmission?.documents?.map((document) => (
                  <div key={document?.type} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={document?.type === 'selfie' ? 'Camera' : 'FileText'} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                        <span className="text-sm font-medium">{document?.name}</span>
                      </div>
                      {getDocumentStatusBadge(document?.status)}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      Uploaded: {new Date(document?.uploadDate)?.toLocaleDateString()}
                    </p>
                    
                    {document?.rejectReason && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 mb-3">
                        <p className="text-xs text-destructive">{document?.rejectReason}</p>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDocumentView(document, kycSubmission)}
                      className="w-full"
                      iconName="Eye"
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={14} />
                  <span>Submitted: {new Date(kycSubmission?.submissionDate)?.toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onKycAction('reject', kycSubmission?.id)}
                    iconName="X"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onKycAction('approve', kycSubmission?.id)}
                    iconName="CheckCircle"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredKyc?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ShieldCheck" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No KYC submissions found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Document Review Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Document Review</h3>
                <p className="text-muted-foreground">
                  {selectedDocument?.name} - {selectedDocument?.user?.name}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDocumentModal(false)}
                iconName="X"
              />
            </div>
            
            <div className="p-6">
              {/* Document Preview */}
              <div className="bg-muted rounded-lg p-8 mb-6 text-center">
                <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Document preview would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  In a real application, this would show the actual document image/PDF
                </p>
              </div>
              
              {/* Review Notes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e?.target?.value)}
                    placeholder="Add notes for approval/rejection..."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDocumentModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDocumentAction('reject')}
                    iconName="X"
                  >
                    Reject Document
                  </Button>
                  <Button
                    onClick={() => handleDocumentAction('approve')}
                    iconName="CheckCircle"
                  >
                    Approve Document
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

export default KycReviewsTab;