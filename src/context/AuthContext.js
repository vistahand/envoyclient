import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import { handleApiError } from "../utils/errorHandler";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to handle API requests with error handling
  const handleAuthRequest = async (apiCall, action, defaultMessage) => {
    try {
      setError(null);
      const response = await apiCall();
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action },
        defaultMessage,
      });
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    // Only verify token if one exists
    const verifyAuth = async () => {
      try {
        const response = await auth.getMe();
        if (response.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Log error but don't redirect
        handleApiError(err, {
          context: { action: "verify_auth" },
          defaultMessage: "Authentication verification failed",
        });
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
      }
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: "login" },
        defaultMessage: "Login failed",
      });
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
    } catch (err) {
      handleApiError(err, {
        context: { action: "logout" },
        defaultMessage: "Logout failed",
      });
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  // Simplified auth methods using the helper function
  const register = (userData) =>
    handleAuthRequest(
      () => auth.register(userData),
      "register",
      "Registration failed"
    );

  const forgotPassword = (email) =>
    handleAuthRequest(
      () => auth.forgotPassword(email),
      "forgot_password",
      "Password reset request failed"
    );

  const resetPassword = (token, password) =>
    handleAuthRequest(
      () => auth.resetPassword(token, password),
      "reset_password",
      "Password reset failed"
    );

  const verifyEmail = (token) =>
    handleAuthRequest(
      () => auth.verifyEmail(token),
      "verify_email",
      "Email verification failed"
    );

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
    isAdmin: user?.role === "admin",
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
