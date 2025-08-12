import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import NotificationBadge from './NotificationBadge';

const UserDropdown = ({ user, notifications = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (action) => {
    setIsOpen(false);
    
    switch (action) {
      case 'profile':
        navigate('/user-profile-management');
        break;
      case 'settings':
        navigate('/user-profile-management');
        break;
      case 'billing':
        navigate('/subscription-management');
        break;
      case 'logout':
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/landing-page');
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: 'Profile',
      icon: 'User',
      action: 'profile',
      description: 'Manage your account'
    },
    {
      label: 'Settings',
      icon: 'Settings',
      action: 'settings',
      description: 'Preferences & privacy'
    },
    {
      label: 'Billing',
      icon: 'CreditCard',
      action: 'billing',
      description: 'Subscription & payments'
    }
  ];

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'startup':
        return 'Startup Founder';
      case 'investor':
        return 'Investor';
      default:
        return 'User';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'unverified':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'unverified':
        return 'AlertCircle';
      default:
        return 'User';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center space-x-2 p-1 rounded-lg hover:bg-muted/50 transition-smooth focus-ring"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          {user?.avatar ? (
            <Image
              src={user?.avatar}
              alt={user?.name || 'User avatar'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {getUserInitials(user?.name)}
            </div>
          )}
          {notifications > 0 && (
            <NotificationBadge 
              count={notifications} 
              size="xs" 
              className="absolute -top-1 -right-1" 
            />
          )}
        </div>
        <div className="hidden sm:block">
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground transition-smooth" 
          />
        </div>
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 z-60 animate-fadeIn">
          {/* User Info Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start space-x-3">
              <div className="relative">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    alt={user?.name || 'User avatar'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-medium">
                    {getUserInitials(user?.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {user?.name || 'User Name'}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon 
                    name={getStatusIcon(user?.kycStatus)} 
                    size={12} 
                    className={getStatusColor(user?.kycStatus)} 
                  />
                  <span className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user?.role)}
                  </span>
                  {user?.kycStatus && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className={`text-xs ${getStatusColor(user?.kycStatus)}`}>
                        {user?.kycStatus === 'verified' ? 'Verified' : 
                         user?.kycStatus === 'pending' ? 'Pending' : 'Unverified'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item) => (
              <button
                key={item?.action}
                onClick={() => handleItemClick(item?.action)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-smooth focus-ring"
              >
                <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs text-muted-foreground">{item?.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-border py-2">
            <button
              onClick={() => handleItemClick('logout')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-error hover:bg-error/5 transition-smooth focus-ring"
            >
              <Icon name="LogOut" size={16} className="text-error" />
              <div className="flex-1 text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-xs text-muted-foreground">End your session</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;