import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FullScreenLoader } from './LoadingSpinner';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Ensure page is cacheable for bfcache by setting proper status
  useEffect(() => {
    // Ensure the page has a successful status for bfcache
    // This helps with back/forward cache restoration
    if (document.readyState === 'complete') {
      // Page loaded successfully
      window.history.replaceState(
        { ...window.history.state, bfcache: true },
        '',
        location.pathname
      );
    }
  }, [location.pathname]);

  // If we have a user, we're authenticated - don't wait for loading to finish
  // This prevents the loading screen from showing after successful signin
  if (loading && !user) {
    return <FullScreenLoader message="Loading..." />;
  }

  if (!isAuthenticated && !user) {
    // Use replace to avoid breaking bfcache, but ensure page renders first
    return <Navigate to="/auth/signin" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect non-admin users, but ensure page renders successfully first
    return <Navigate to="/dashboard" replace state={{ from: location.pathname }} />;
  }

  // If user is authenticated and admin, redirect to admin if trying to access dashboard
  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;

