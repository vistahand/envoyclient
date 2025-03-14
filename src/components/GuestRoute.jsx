import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    // Get the redirect path from location state or default to user dashboard
    const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/user');
    return <Navigate to={from} replace />;
  }

  return children;
};

export default GuestRoute;
