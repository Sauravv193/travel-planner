import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import { useAuth } from './hooks/useAuth';
import ToastProvider from './components/common/Toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy loaded pages for performance (Phase 14)
const Home = lazy(() => import('./pages/Home'));
const Planner = lazy(() => import('./pages/Planner'));
const Journal = lazy(() => import('./pages/Journal'));
const Trip = lazy(() => import('./pages/Trip'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

// Loading fallback for lazy loaded routes
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner size="large" text="Loading..." />
  </div>
);

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

const PublicOnlyRoute = () => {
    const { user, loading } = useAuth();
    if (loading) {
      return <div className="h-screen flex justify-center items-center"><LoadingSpinner /></div>;
    }
    return !user ? <Outlet /> : <Navigate to="/profile" replace />;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route element={<PublicOnlyRoute />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/planner" element={<Planner />} />
            <Route path="/journal/:tripId" element={<Journal />} />
            <Route path="/trip/:tripId" element={<Trip />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;