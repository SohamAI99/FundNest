import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const UserManagementTab = ({ searchQuery, dateRange, onUserAction }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortBy, setSortBy] = useState('registration_date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock user data
  const mockUsers = [
    {
      id: 'user_001',
      name: 'Demo User',
      email: 'demo.user@techstartup.com',
      role: 'startup',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      registrationDate: '2024-12-01',
      kycStatus: 'verified',
      subscriptionTier: 'pro',
      lastActive: '2024-12-09',
      status: 'active',
      companyName: 'TechFlow Solutions',
      totalFunding: 2500000,
      connectionsCount: 47
    },
    {
      id: 'user_002',
      name: 'Michael Rodriguez',
      email: 'michael@investcorp.com',
      role: 'investor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      registrationDate: '2024-11-28',
      kycStatus: 'pending',
      subscriptionTier: 'free',
      lastActive: '2024-12-08',
      status: 'active',
      firm: 'InvestCorp LLC',
      totalInvestments: 15000000,
      portfolioSize: 23
    },
    {
      id: 'user_003',
      name: 'Emma Thompson',
      email: 'emma.thompson@gmail.com',
      role: 'startup',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      registrationDate: '2024-11-25',
      kycStatus: 'rejected',
      subscriptionTier: 'free',
      lastActive: '2024-12-05',
      status: 'suspended',
      companyName: 'GreenTech Innovations',
      totalFunding: 0,
      connectionsCount: 12
    },
    {
      id: 'user_004',
      name: 'David Kim',
      email: 'david@techventures.com',
      role: 'investor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      registrationDate: '2024-11-20',
      kycStatus: 'verified',
      subscriptionTier: 'pro',
      lastActive: '2024-12-09',
      status: 'active',
      firm: 'Tech Ventures',
      totalInvestments: 8500000,
      portfolioSize: 15
    },
    {
      id: 'user_005',
      name: 'Lisa Wang',
      email: 'lisa@healthtech.com',
      role: 'startup',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      registrationDate: '2024-11-15',
      kycStatus: 'verified',
      subscriptionTier: 'free',
      lastActive: '2024-12-07',
      status: 'inactive',
      companyName: 'HealthTech Solutions',
      totalFunding: 1200000,
      connectionsCount: 31
    }
  ];

  const sortOptions = [
    { value: 'registration_date', label: 'Registration Date' },
    { value: 'last_active', label: 'Last Active' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'funding', label: 'Total Funding' },
    { value: 'connections', label: 'Connections' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const getFilteredUsers = () => {
    let filtered = [...mockUsers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(user => 
        user?.name?.toLowerCase()?.includes(query) ||
        user?.email?.toLowerCase()?.includes(query) ||
        user?.companyName?.toLowerCase()?.includes(query) ||
        user?.firm?.toLowerCase()?.includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered?.filter(user => user?.status === filterStatus);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'registration_date':
          return new Date(b?.registrationDate) - new Date(a?.registrationDate);
        case 'last_active':
          return new Date(b?.lastActive) - new Date(a?.lastActive);
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'funding':
          return (b?.totalFunding || b?.totalInvestments || 0) - (a?.totalFunding || a?.totalInvestments || 0);
        case 'connections':
          return (b?.connectionsCount || b?.portfolioSize || 0) - (a?.connectionsCount || a?.portfolioSize || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(u => u?.id));
    }
  };

  const handleBulkAction = (action) => {
    selectedUsers?.forEach(userId => onUserAction(action, userId));
    setSelectedUsers([]);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-success/10 text-success border-success/20',
      inactive: 'bg-muted text-muted-foreground border-border',
      suspended: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[status]}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getKycBadge = (kycStatus) => {
    const styles = {
      verified: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles?.[kycStatus]}`}>
        {kycStatus?.charAt(0)?.toUpperCase() + kycStatus?.slice(1)}
      </span>
    );
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

        {selectedUsers?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedUsers?.length} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('suspend')}
              iconName="Ban"
            >
              Suspend
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('activate')}
              iconName="CheckCircle"
            >
              Activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('delete')}
              iconName="Trash2"
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border focus:ring-2 focus:ring-primary"
                  />
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground">KYC Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Subscription</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleUserSelect(user?.id)}
                      className="rounded border-border focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        {user?.companyName && (
                          <p className="text-xs text-muted-foreground">{user?.companyName}</p>
                        )}
                        {user?.firm && (
                          <p className="text-xs text-muted-foreground">{user?.firm}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={user?.role === 'startup' ? 'Briefcase' : 'TrendingUp'} 
                        size={16} 
                        className="text-muted-foreground" 
                      />
                      <span className="capitalize text-sm">{user?.role}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getKycBadge(user?.kycStatus)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                      user?.subscriptionTier === 'pro' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
                    }`}>
                      {user?.subscriptionTier?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(user?.lastActive)?.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                        iconName="Eye"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUserAction('edit', user?.id)}
                        iconName="Edit"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUserAction(user?.status === 'active' ? 'suspend' : 'activate', user?.id)}
                        iconName={user?.status === 'active' ? 'Ban' : 'CheckCircle'}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">User Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUserModal(false)}
                iconName="X"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedUser?.avatar}
                  alt={selectedUser?.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{selectedUser?.name}</h4>
                  <p className="text-muted-foreground">{selectedUser?.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge(selectedUser?.status)}
                    {getKycBadge(selectedUser?.kycStatus)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{new Date(selectedUser?.registrationDate)?.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Active</p>
                  <p className="font-medium">{new Date(selectedUser?.lastActive)?.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{selectedUser?.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Subscription</p>
                  <p className="font-medium">{selectedUser?.subscriptionTier?.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;