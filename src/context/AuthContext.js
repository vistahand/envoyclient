import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { handleApiError } from '../utils/errorHandler';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Only verify token if one exists
    const verifyAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await auth.getMe();
        if (response.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          // Clear invalid data but don't redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        // Log error but don't redirect
        handleApiError(err, { 
          context: { action: 'verify_auth' },
          defaultMessage: 'Authentication verification failed'
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await auth.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return response;
      } else {
        setError(response.error);
        return response;
      }
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'login' },
        defaultMessage: 'Login failed'
      });
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await auth.register(userData);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'register' },
        defaultMessage: 'Registration failed'
      });
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (err) {
      handleApiError(err, { 
        context: { action: 'logout' },
        defaultMessage: 'Logout failed'
      });
      // Still clear local data even if API call fails
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await auth.forgotPassword(email);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'forgot_password' },
        defaultMessage: 'Password reset request failed'
      });
      setError(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await auth.resetPassword(token, password);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'reset_password' },
        defaultMessage: 'Password reset failed'
      });
      setError(errorMessage);
      throw err;
    }
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      const response = await auth.verifyEmail(token);
      if (response.success) {
        // Update user verification status if they're logged in
        if (user) {
          setUser({ ...user, isVerified: true });
          localStorage.setItem('user', JSON.stringify({ ...user, isVerified: true }));
        }
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: 'verify_email' },
        defaultMessage: 'Email verification failed'
      });
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
