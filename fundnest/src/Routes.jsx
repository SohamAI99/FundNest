import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import LandingPage from './pages/landing-page';
import UserRegistration from './pages/user-registration';
import StartupDashboard from './pages/startup-dashboard';
import InvestorDashboard from './pages/investor-dashboard';
import MessagingSystem from './pages/messaging-system';
import UserProfileManagement from './pages/user-profile-management';
import KycVerification from './pages/kyc-verification';
import AdminPanel from './pages/admin-panel';
import SubscriptionManagement from './pages/subscription-management';
import ResetPassword from './pages/reset-password';


const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        
        {/* Protected Routes */}
        <Route path="/startup-dashboard" element={
          <ProtectedRoute requiredRole="startup">
            <StartupDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/investor-dashboard" element={
          <ProtectedRoute requiredRole="investor">
            <InvestorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/messaging-system" element={
          <ProtectedRoute>
            <MessagingSystem />
          </ProtectedRoute>
        } />
        
        <Route path="/user-profile-management" element={
          <ProtectedRoute>
            <UserProfileManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/kyc-verification" element={
          <ProtectedRoute>
            <KycVerification />
          </ProtectedRoute>
        } />
        
        <Route path="/subscription-management" element={
          <ProtectedRoute>
            <SubscriptionManagement />
          </ProtectedRoute>
        } />
        
        {/* Admin Only Route */}
        <Route path="/admin-panel" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;