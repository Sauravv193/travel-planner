import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Journal from './pages/Journal';
import Trip from './pages/Trip';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

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
          </Route>

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
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;