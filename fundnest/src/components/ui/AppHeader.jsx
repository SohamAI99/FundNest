import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import UserDropdown from './UserDropdown';
import NotificationBadge from './NotificationBadge';

const AppHeader = ({ notifications = 0, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  const currentPath = location?.pathname;

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: user?.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard',
      icon: 'LayoutDashboard',
      roles: ['startup', 'investor']
    },
    {
      label: 'Messages',
      path: '/messaging-system',
      icon: 'MessageSquare',
      roles: ['startup', 'investor'],
      hasNotifications: notifications > 0
    },
    {
      label: 'Profile',
      path: '/user-profile-management',
      icon: 'User',
      roles: ['startup', 'investor']
    },
    {
      label: 'Subscription',
      path: '/subscription-management',
      icon: 'CreditCard',
      roles: ['startup', 'investor']
    }
  ];

  const publicNavigationItems = [
    {
      label: 'How It Works',
      path: '/#how-it-works',
      icon: 'Lightbulb',
      isAnchor: true
    },
    {
      label: 'Pricing',
      path: '/#pricing',
      icon: 'CreditCard',
      isAnchor: true
    }
  ];

  const shouldShowNavigation = currentPath !== '/' && isAuthenticated;

  const handleNavigation = (path, isAnchor = false) => {
    if (isAnchor) {
      const elementId = path.replace('/#', '');
      if (currentPath === '/') {
        // Already on landing page, scroll to section
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to landing page first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleAuthAction = (action) => {
    if (action === 'login') {
      navigate('/login');
    } else if (action === 'register') {
      navigate('/user-registration');
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef?.current && !mobileMenuRef?.current?.contains(event?.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  const Logo = () => (
    <div 
      className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
      onClick={() => handleNavigation(isAuthenticated ? (user?.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard') : '/')}
    >
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-md">
          <Icon name="TrendingUp" size={20} color="white" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-sans">
          FundNest
        </span>
      </div>
    </div>
  );

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = currentPath === item?.path;
    const baseClasses = `
      relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
      transition-smooth focus-ring
      ${isMobile ? 'w-full justify-start' : ''}
    `;
    
    const activeClasses = isActive 
      ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50';

    return (
      <button
        onClick={() => handleNavigation(item?.path, item?.isAnchor)}
        className={`${baseClasses} ${activeClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon name={item?.icon} size={18} strokeWidth={2} />
        <span>{item?.label}</span>
        {item?.hasNotifications && (
          <NotificationBadge count={notifications} size="sm" />
        )}
      </button>
    );
  };

  const AuthButtons = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-3'}`}>
      <button
        onClick={() => handleAuthAction('login')}
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth focus-ring rounded-lg"
      >
        Sign In
      </button>
      <button
        onClick={() => handleAuthAction('register')}
        className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-smooth focus-ring rounded-xl shadow-md hover:shadow-lg"
      >
        Get Started Free
      </button>
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-nav border-b border-border/50 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {shouldShowNavigation ? (
              <>
                {navigationItems?.filter(item => !item?.roles || item?.roles?.includes(user?.role))?.map((item) => (
                    <NavItem key={item?.path} item={item} />
                  ))}
              </>
            ) : (
              <>
                {publicNavigationItems?.map((item) => (
                  <NavItem key={item?.path} item={item} />
                ))}
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserDropdown user={user} notifications={notifications} />
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <UserDropdown user={user} notifications={notifications} />
            )}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth focus-ring"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div 
            ref={mobileMenuRef}
            className="fixed top-16 left-0 right-0 bg-card border-b border-border shadow-elevation-3 animate-slideIn"
          >
            <div className="px-6 py-4 space-y-2">
              {shouldShowNavigation ? (
                <>
                  {navigationItems?.filter(item => !item?.roles || item?.roles?.includes(user?.role))?.map((item) => (
                      <NavItem key={item?.path} item={item} isMobile />
                    ))}
                </>
              ) : (
                <>
                  {publicNavigationItems?.map((item) => (
                    <NavItem key={item?.path} item={item} isMobile />
                  ))}
                  <div className="pt-4 border-t border-border">
                    <AuthButtons isMobile />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
