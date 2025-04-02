import { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  updatePassword as apiUpdatePassword,
  updateProfile as apiUpdateProfile,
  updateProfileImage as apiUpdateProfileImage,
} from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import { handleApiError } from "../utils/errorHandler";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Function to clear auth data and log out the user
  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Generic API request handler
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
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Verify token with API
          const response = await auth.getMe();
          if (response?.success) {
            setUser(response.data.user);
          } else {
            logoutUser(); // 🔥 Call logoutUser() if verification fails
          }
        } catch (err) {
          logoutUser(); // 🔥 Logout if API request fails
        }
      } else {
        logoutUser(); // 🔥 Logout if no stored token/user
      }

      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials) =>
    handleAuthRequest(
      async () => {
        const response = await auth.login(credentials);
        if (response.success) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data
          setUser(response.data.user);
        }
        return response;
      },
      "login",
      "Login failed"
    );

  const logout = async () => {
    try {
      await auth.logout();
      logoutUser(); // 🔥 Use logoutUser() for consistency
    } catch (err) {
      handleApiError(err, {
        context: { action: "logout" },
        defaultMessage: "Logout failed",
      });
      logoutUser();
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Update localStorage
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiUpdatePassword(currentPassword, newPassword);
      if (response.success) {
        if (response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        if (response.data?.user) {
          updateUser(response.data.user);
        }
      }
      return response;
    } catch (error) {
      console.error("Password update failed:", error);
      throw error;
    }
  };

  const updateProfileImage = async (file) => {
    try {
      const response = await apiUpdateProfileImage(file);
      if (response.success) {
        // Create updated user object
        const updatedUser = {
          ...user,
          profileImage: response.data.profileImageUrl,
        };

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update state
        setUser(updatedUser);

        return response;
      }
      return response;
    } catch (error) {
      console.error("Profile image update failed:", error);
      throw error;
    }
  };

  const updateProfile = async ({ phone, address, country, profileImage }) => {
    try {
      const response = await apiUpdateProfile({
        phone,
        address,
        country,
        profileImage,
      });
      if (response.success) {
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            phone: response.data.phone,
            address: response.data.address,
            country: response.data.country,
            profileImage:
              response.data.profileImageUrl || prevUser.profileImage,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return updatedUser;
        });
      }
      return response;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

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
    updatePassword,
    updateProfileImage,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  if (loading) return <LoadingScreen />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
