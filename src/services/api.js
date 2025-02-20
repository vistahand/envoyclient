import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for 401 errors that aren't from /auth/me
    if (
      error.response?.status === 401 &&
      !error.config.url.endsWith("/auth/me")
    ) {
      // Clear any local state
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Login failed");
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Registration failed");
    }
  },

  verifyEmail: async (code) => {
    try {
      const response = await api.get(`/auth/verify-email/${code}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Email verification failed");
    }
  },

  completeRegistration: async (userData) => {
    try {
      const response = await api.post("/auth/complete-registration", userData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Registration completion failed"
      );
    }
  },

  resendVerificationCode: async (email) => {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to resend verification code"
      );
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.clear();
      return { success: true };
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Logout failed");
    }
  },

  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to fetch user data");
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to process password reset request"
      );
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to reset password");
    }
  },
};

// User endpoints
export const users = {
  updateProfile: async (userData) => {
    try {
      const response = await api.put("/users/profile", userData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to update profile");
    }
  },

  changePassword: async (passwords) => {
    try {
      const response = await api.put("/users/change-password", passwords);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to change password");
    }
  },
};

// Shipment endpoints
export const shipments = {
  // Initialize shipment
  initializeShipment: async (initialData) => {
    try {
      const response = await api.post("/shipments/initialize", initialData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to initialize shipment"
      );
    }
  },

  // Update package details
  updatePackageDetails: async (shipmentId, packageData) => {
    try {
      const response = await api.put(
        `/shipments/${shipmentId}/package`,
        packageData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to update package details"
      );
    }
  },

  // Calculate shipping cost
  calculateCost: async (shipmentDetails) => {
    try {
      const response = await api.post("/shipments/calculate", shipmentDetails);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to calculate shipping cost"
      );
    }
  },

  // Update delivery options
  updateDeliveryOptions: async (shipmentId, deliveryData) => {
    try {
      const response = await api.put(
        `/shipments/${shipmentId}/delivery`,
        deliveryData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to update delivery options"
      );
    }
  },

  // Update sender information
  updateSenderInfo: async (shipmentId, senderData) => {
    try {
      const response = await api.put(
        `/shipments/${shipmentId}/sender`,
        senderData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to update sender information"
      );
    }
  },

  // Update recipient information
  updateRecipientInfo: async (shipmentId, recipientData) => {
    try {
      const response = await api.put(
        `/shipments/${shipmentId}/recipient`,
        recipientData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to update recipient information"
      );
    }
  },

  // Update pickup location
  updatePickupLocation: async (shipmentId, pickupData) => {
    try {
      const response = await api.put(
        `/shipments/${shipmentId}/pickup`,
        pickupData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to update pickup location"
      );
    }
  },

  // Finalize shipment
  finalizeShipment: async (shipmentId) => {
    try {
      const response = await api.post(`/shipments/${shipmentId}/finalize`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to finalize shipment"
      );
    }
  },

  // Get all shipments
  getAll: async (params) => {
    try {
      const response = await api.get("/shipments", { params });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to fetch shipments");
    }
  },

  // Get shipment by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/shipments/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to fetch shipment details"
      );
    }
  },

  // Track shipment
  track: async (trackingNumber) => {
    try {
      const response = await api.get(`/shipments/track/${trackingNumber}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to track shipment");
    }
  },
};

// Payment endpoints
export const payments = {
  create: async (paymentData) => {
    try {
      const response = await api.post("/payments", paymentData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to process payment");
    }
  },

  getAll: async (params) => {
    try {
      const response = await api.get("/payments", { params });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to fetch payments");
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to fetch payment details"
      );
    }
  },
};

export default api;
