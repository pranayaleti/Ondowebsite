import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FullScreenLoader } from './LoadingSpinner';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // If we have a user, we're authenticated - don't wait for loading to finish
  // This prevents the loading screen from showing after successful signin
  if (loading && !user) {
    return <FullScreenLoader message="Loading..." />;
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated and admin, redirect to admin if trying to access dashboard
  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

