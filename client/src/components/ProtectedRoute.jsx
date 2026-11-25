import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingScreen from './LoadingScreen.jsx';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen label="Checking your session..." />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen label="Loading..." />;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
