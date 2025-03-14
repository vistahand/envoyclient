import { createContext, useContext, useState } from "react";
import { auth } from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import { handleApiError } from "../utils/errorHandler";

const RegisterContext = createContext(null);

export const RegisterProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    verificationToken: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startRegistration = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await auth.register({ email, password });
      if (response.success) {
        setRegistrationData((prev) => ({
          ...prev,
          email,
          password,
        }));
        return response;
      } else {
        setError(response.error || "Registration failed");
        throw new Error(response.error || "Registration failed");
      }
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: "start_registration", email },
        defaultMessage: "Registration failed",
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code) => {
    try {
      setLoading(true);
      setError(null);
      const response = await auth.verifyEmail(code);
      if (response.success) {
        return response;
      } else {
        setError(response.error || "Verification failed");
        throw new Error(response.error || "Verification failed");
      }
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: { action: "verify_email", code },
        defaultMessage: "Verification failed",
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await auth.completeRegistration(userData);

      if (response.success) {
        return response;
      } else {
        setError(response.error || "Registration completion failed");
        throw new Error(response.error || "Registration completion failed");
      }
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: {
          action: "complete_registration",
          userData,
        },
        defaultMessage: "Registration completion failed",
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await auth.resendVerificationCode(
        registrationData.email
      );
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err, {
        context: {
          action: "resend_verification_code",
          email: registrationData.email,
        },
        defaultMessage: "Failed to resend verification code",
      });
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    registrationData,
    loading,
    error,
    startRegistration,
    verifyEmail,
    completeRegistration,
    resendVerificationCode,
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }
  return context;
};
