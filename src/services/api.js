import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      localStorage.setItem("token", JSON.stringify(response.data.data.token));
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
      const response = await api.post(
        "/shipments/calculate-cost",
        shipmentDetails
      );
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

  // Update insurance
  updateInsurance: async (shipmentId, insuranceData) => {
    try {
      const response = await api.put(
        `/shipments/${shipmentId}/insurance`,
        insuranceData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to updatye insurance"
      );
    }
  },

  // Finalize shipment
  finalizeShipment: async (shipment_Id) => {
    const shipmentId = {
      shipmentId: shipment_Id,
    };
    try {
      const response = await api.post(`/shipments/finalize`, shipmentId);
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
      const response = await api.get(`/shipments`);
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

  // Get shipment by ID
  getDraftById: async (id) => {
    try {
      const response = await api.get(`/shipments/draft/${id}`);
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

  // Get shipment by Tracking Id
  getByTrackingId: async (id) => {
    try {
      const response = await api.get(`/shipments/get-by-trackingId/${id}`);
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

  // Set payment method for shipment
  setPaymentMethod: async (shipmentId, paymentMethodData) => {
    try {
      console.log(paymentMethodData);
      const response = await api.post(
        `/shipments/${shipmentId}/payment-method`,
        paymentMethodData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to set payment method"
      );
    }
  },

  // For admin approval of cash payments
  approvePayment: async (shipmentId, approvalData) => {
    try {
      const response = await api.post(
        `/payments/${shipmentId}/approve`,
        approvalData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to approve payment");
    }
  },

  // Get pending cash payments (admin only)
  getPendingPayments: async () => {
    try {
      const response = await api.get("/shipments", {
        params: {
          paymentStatus: "awaiting_confirmation",
          paymentMethod: "cash",
        },
      });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to fetch pending payments"
      );
    }
  },
};

// Payment endpoints
export const payments = {
  create: async (paymentData) => {
    try {
      const response = await api.post(
        "/payments/bank-transfer/initialize",
        paymentData
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to process payment");
    }
  },

  getAll: async (params = { page: 1, limit: 10, method: "stripe" }) => {
    try {
      const response = await api.get("/payments/history", { params });
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

//Update user Password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("authToken"); // Ensure token is stored

    if (!token) {
      throw new Error("Authentication token is missing. Please log in.");
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/update-password`, // 🔥 Fix here
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Password update error:", error.response?.data || error);
    throw error.response?.data?.message || "Password update failed.";
  }
};

// Update profile (phone, address, country, optionally profile image)
export const updateProfile = async ({
  phone,
  address,
  country,
  profileImage,
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ Ensure API base URL is properly loaded
  const token = localStorage.getItem("authToken");

  if (!token)
    throw new Error("Authentication token is missing. Please log in.");

  const formData = new FormData();
  if (phone) formData.append("phone", phone);
  if (address) formData.append("address", address);
  if (country) formData.append("country", country);
  if (profileImage instanceof File) {
    formData.append("profileImage", profileImage);
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/user/profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Profile update error:", error.response?.data || error);
    throw error.response?.data?.message || "Profile update failed.";
  }
};

// Update only profile image
export const updateProfileImage = async (file) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL; // ✅ Fix API_BASE_URL reference
  const token = localStorage.getItem("authToken");

  if (!token)
    throw new Error("Authentication token is missing. Please log in.");

  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/users/update-profile-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Profile image update error:", error.response?.data || error);
    throw error.response?.data?.message || "Profile image update failed.";
  }
};

export const admin = {
  payments : {
    getAll: async () => {
      try {
        const response = await api.get(`/admin/payments`);
        return response.data;
      } catch (err) {
        if (!err.response) {
          throw new Error("Network error. Please check your connection.");
        }
        throw new Error(err.response?.data?.error || "Failed to fetch admin payments");
      }
    },

      getById: async (params) => {
        try {
          const response = await api.get(`/admin/payments/${params}`);
          return response.data;
        } catch (err) {
          if (!err.response) {
            throw new Error("Network error. Please check your connection.");
          }
          throw new Error(err.response?.data?.error || "Failed to fetch admin payment detail");
        }
      },
  }
}

export default api;
