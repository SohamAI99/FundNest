import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";

// Beautiful Page Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <p className="text-muted-foreground text-sm font-medium">Loading Page...</p>
  </div>
);

// Lazy Loaded Page Components
const NotFound = lazy(() => import("pages/NotFound"));
const Login = lazy(() => import("./pages/login"));
const ForgotPassword = lazy(() => import("./pages/forgot-password"));
const LandingPage = lazy(() => import("./pages/landing-page"));
const UserRegistration = lazy(() => import("./pages/user-registration"));
const StartupDashboard = lazy(() => import("./pages/startup-dashboard"));
const InvestorDashboard = lazy(() => import("./pages/investor-dashboard"));
const MessagingSystem = lazy(() => import("./pages/messaging-system"));
const UserProfileManagement = lazy(() => import("./pages/user-profile-management"));
const KycVerification = lazy(() => import("./pages/kyc-verification"));
const AdminPanel = lazy(() => import("./pages/admin-panel"));
const SubscriptionManagement = lazy(() => import("./pages/subscription-management"));
const ResetPassword = lazy(() => import("./pages/reset-password"));

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;