import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const ContentModerationTab = ({ searchQuery, dateRange, onContentAction }) => {
  const [sortBy, setSortBy] = useState('report_date');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');

  // Mock content reports
  const mockReports = [
    {
      id: 'report_001',
      type: 'inappropriate_content',
      status: 'pending',
      severity: 'high',
      reportDate: '2024-12-09',
      reportedBy: {
        id: 'user_005',
        name: 'Lisa Wang',
        email: 'lisa@healthtech.com'
      },
      targetUser: {
        id: 'user_003',
        name: 'Emma Thompson',
        email: 'emma.thompson@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'startup'
      },
      reason: 'Inappropriate profile description with false claims',
      description: 'User claims to have secured $10M in funding without any verification. Profile contains misleading information about company achievements.',
      contentType: 'profile',
      evidence: [
        {
          type: 'screenshot',
          url: '/evidence/screenshot_001.png',
          description: 'Screenshot of inappropriate profile content'
        }
      ],
      assignedModerator: null,
      actionTaken: null,
      escalated: false
    },
    {
      id: 'report_002',
      type: 'spam',
      status: 'in_review',
      severity: 'medium',
      reportDate: '2024-12-08',
      reportedBy: {
        id: 'user_001',
        name: 'Demo User',
        email: 'demo.user@techstartup.com'
      },
      targetUser: {
        id: 'user_004',
        name: 'David Kim',
        email: 'david@techventures.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'investor'
      },
      reason: 'Excessive promotional messaging',
      description: 'User is sending identical promotional messages to multiple startups without personalization. Messages appear to be automated spam.',
      contentType: 'message',
      evidence: [
        {
          type: 'message_thread',
          url: '/evidence/messages_002.json',
          description: 'Message thread showing spam behavior'
        }
      ],
      assignedModerator: 'admin_002',
      actionTaken: null,
      escalated: false
    },
    {
      id: 'report_003',
      type: 'harassment',
      status: 'resolved',
      severity: 'high',
      reportDate: '2024-12-07',
      reportedBy: {
        id: 'user_006',
        name: 'Michael Johnson',
        email: 'michael@startup.com'
      },
      targetUser: {
        id: 'user_007',
        name: 'Robert Wilson',
        email: 'robert@investments.com',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
        role: 'investor'
      },
      reason: 'Harassment and inappropriate communication',
      description: 'User has been sending threatening messages after being declined for investment. Messages contain unprofessional language and threats.',
      contentType: 'message',
      evidence: [
        {
          type: 'message_thread',
          url: '/evidence/harassment_003.json',
          description: 'Threatening message thread'
        }
      ],
      assignedModerator: 'admin_001',
      actionTaken: 'account_suspended',
      escalated: true,
      resolutionDate: '2024-12-08',
      resolutionNotes: 'Account suspended for 30 days. User warned about platform policies.'
    },
    {
      id: 'report_004',
      type: 'fake_information',
      status: 'pending',
      severity: 'medium',
      reportDate: '2024-12-06',
      reportedBy: {
        id: 'user_008',
        name: 'Jennifer Davis',
        email: 'jennifer@ventures.com'
      },
      targetUser: {
        id: 'user_009',
        name: 'Alex Foster',
        email: 'alex@faketech.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: 'startup'
      },
      reason: 'False company information',
      description: 'Company claims to have partnerships with major tech companies but no evidence found. Website and documentation appear to be fabricated.',
      contentType: 'profile',
      evidence: [
        {
          type: 'website_analysis',
          url: '/evidence/website_analysis_004.pdf',
          description: 'Analysis of company website and claims'
        }
      ],
      assignedModerator: null,
      actionTaken: null,
      escalated: false
    }
  ];

  const sortOptions = [
    { value: 'report_date', label: 'Report Date' },
    { value: 'severity', label: 'Severity' },
    { value: 'status', label: 'Status' },
    { value: 'target_user', label: 'Reported User' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_review', label: 'In Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'escalated', label: 'Escalated' }
  ];

  const getFilteredReports = () => {
    let filtered = [...mockReports];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(report => 
        report?.targetUser?.name?.toLowerCase()?.includes(query) ||
        report?.targetUser?.email?.toLowerCase()?.includes(query) ||
        report?.reason?.toLowerCase()?.includes(query) ||
        report?.id?.toLowerCase()?.includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered?.filter(report => report?.status === filterStatus);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'report_date':
          return new Date(b?.reportDate) - new Date(a?.reportDate);
        case 'severity':
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder?.[b?.severity] - severityOrder?.[a?.severity];
        case 'status':
          return a?.status?.localeCompare(b?.status);
        case 'target_user':
          return a?.targetUser?.name?.localeCompare(b?.targetUser?.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredReports = getFilteredReports();

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleModerationAction = (action) => {
    if (!selectedReport) return;
    
    const actionData = {
      action,
      notes: moderationNotes,
      reportId: selectedReport?.id
    };
    
    onContentAction(action, selectedReport?.id, actionData);
    setShowReportModal(false);
    setModerationNotes('');
    setSelectedReport(null);
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      high: 'bg-destructive/10 text-destructive border-destructive/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      low: 'bg-success/10 text-success border-success/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[severity]}`}>
        {severity?.charAt(0)?.toUpperCase() + severity?.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      in_review: 'bg-primary/10 text-primary border-primary/20',
      resolved: 'bg-success/10 text-success border-success/20',
      escalated: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[status]}`}>
        {status?.replace('_', ' ')?.charAt(0)?.toUpperCase() + status?.replace('_', ' ')?.slice(1)}
      </span>
    );
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'inappropriate_content': return 'Flag';
      case 'spam': return 'Mail';
      case 'harassment': return 'Shield';
      case 'fake_information': return 'AlertTriangle';
      default: return 'Flag';
    }
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
            onClick={() => console.log('Bulk resolve')}
            iconName="CheckCircle"
          >
            Bulk Resolve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log('Export reports')}
            iconName="Download"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports?.map((report) => (
          <div key={report?.id} className={`bg-background border rounded-lg p-6 ${
            report?.severity === 'high' ? 'border-destructive/50 bg-destructive/5' : 'border-border'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  report?.severity === 'high' ?'bg-destructive/10 text-destructive' 
                    : report?.severity === 'medium' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
                }`}>
                  <Icon name={getReportTypeIcon(report?.type)} size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{report?.reason}</h4>
                  <p className="text-sm text-muted-foreground">
                    Reported by: {report?.reportedBy?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Report #{report?.id?.toUpperCase()} • {new Date(report?.reportDate)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getSeverityBadge(report?.severity)}
                {getStatusBadge(report?.status)}
                {report?.escalated && (
                  <span className="px-2 py-1 text-xs font-medium rounded-md border bg-destructive/10 text-destructive border-destructive/20">
                    Escalated
                  </span>
                )}
              </div>
            </div>

            {/* Target User Info */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={report?.targetUser?.avatar}
                  alt={report?.targetUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">Reported User: {report?.targetUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{report?.targetUser?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon 
                      name={report?.targetUser?.role === 'startup' ? 'Briefcase' : 'TrendingUp'} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-xs text-muted-foreground capitalize">{report?.targetUser?.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Description */}
            <div className="mb-4">
              <p className="text-sm text-foreground mb-2">
                <span className="font-medium">Content Type:</span> {report?.contentType?.charAt(0)?.toUpperCase() + report?.contentType?.slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">{report?.description}</p>
            </div>

            {/* Evidence */}
            {report?.evidence?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Evidence:</p>
                <div className="flex flex-wrap gap-2">
                  {report?.evidence?.map((evidence, index) => (
                    <div key={index} className="bg-muted rounded-lg p-2 text-xs">
                      <Icon name="Paperclip" size={12} className="inline mr-1" />
                      {evidence?.description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Info */}
            {report?.status === 'resolved' && report?.resolutionNotes && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">
                    Resolved on {new Date(report?.resolutionDate)?.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Action:</span> {report?.actionTaken?.replace('_', ' ')?.charAt(0)?.toUpperCase() + report?.actionTaken?.replace('_', ' ')?.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{report?.resolutionNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {report?.assignedModerator ? (
                  <>
                    <Icon name="User" size={14} />
                    <span>Assigned to: {report?.assignedModerator}</span>
                  </>
                ) : (
                  <>
                    <Icon name="UserX" size={14} />
                    <span>Unassigned</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewReport(report)}
                  iconName="Eye"
                >
                  Review
                </Button>
                {report?.status !== 'resolved' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onContentAction('dismiss', report?.id)}
                      iconName="X"
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onContentAction('escalate', report?.id)}
                      iconName="AlertTriangle"
                    >
                      Escalate
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Flag" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No content reports found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Report Review Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Content Report Review</h3>
                <p className="text-muted-foreground">
                  Report #{selectedReport?.id?.toUpperCase()} - {selectedReport?.reason}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(false)}
                iconName="X"
              />
            </div>
            
            <div className="p-6 space-y-6">
              {/* Report Details */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Report Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Report Type</p>
                    <p className="font-medium">{selectedReport?.type?.replace('_', ' ')?.charAt(0)?.toUpperCase() + selectedReport?.type?.replace('_', ' ')?.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Severity</p>
                    <p className="font-medium capitalize">{selectedReport?.severity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Content Type</p>
                    <p className="font-medium capitalize">{selectedReport?.contentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Report Date</p>
                    <p className="font-medium">{new Date(selectedReport?.reportDate)?.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Description</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
                  {selectedReport?.description}
                </p>
              </div>
              
              {/* Moderation Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Moderation Notes
                </label>
                <textarea
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e?.target?.value)}
                  placeholder="Add notes for your moderation decision..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleModerationAction('dismiss')}
                  iconName="X"
                >
                  Dismiss Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleModerationAction('warn_user')}
                  iconName="AlertTriangle"
                >
                  Warn User
                </Button>
                <Button
                  onClick={() => handleModerationAction('suspend_user')}
                  iconName="Ban"
                >
                  Suspend User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModerationTab;