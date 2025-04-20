import axios from "axios";
import toast from "react-hot-toast";

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

  // Update pickup location
  selectPickupLocation: async (shipmentId, pickupData) => {
    try {
      const response = await api.post(
        `/shipments/${shipmentId}/pickup/select`,
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
        err.response?.data?.error || "Failed to update insurance"
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
  getAll: async () => {
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
  updateShipmentStatus: async (shipmentId, statusData) => {
    try {
      const response = await api.put(`/admin/shipments/${shipmentId}/status`, statusData);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to update shipment status");
    }
  },


  // Get all shipments
  getAllDrafts: async () => {
    try {
      console.log("Fetching all draft shipments...");
      const response = await api.get(`/shipments/drafts`);
      console.log("Drafts fetched successfully");
      return response.data;
    } catch (err) {
      console.error("Error fetching drafts:", err);
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      const errorMessage =
        err.response?.data?.error || "Failed to fetch draft shipments";
      console.error("Error message:", errorMessage);
      throw new Error(errorMessage);
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
      console.log("Draft shipment fetched successfully");
      return response.data;
    } catch (err) {
      console.error(`Error fetching draft shipment with ID ${id}:`, err);
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch shipment details";
      console.error("Error message:", errorMessage);
      throw new Error(errorMessage);
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

  getAdminDashboard: async () => {
    try {
      const response = await api.get("/admin/dashboard");
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(err.response?.data?.error || "Failed to track shipment");
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

// Delivery Options endpoints
export const deliveryOptions = {
  getAll: async () => {
    try {
      const response = await api.get("/admin/delivery-options");
      return response.data;
    } catch (err) {
      toast.error("Error fetching delivery options from server");

      // // Return mocked delivery options in the expected format in case the endpoint isn't ready
      // return {
      //   success: true,
      //   message: "Mocked delivery options (no server endpoint)",
      //   data: {
      //     deliveryOptions: [
      //       {
      //         _id: "mock-option-1",
      //         name: "QuickWing",
      //         description: "Enjoy fast, priority shipping",
      //         estimatedDeliveryTime: "2PM at the earliest",
      //         percentageMarkup: 20,
      //         isExpress: true,
      //         daysToAdd: 1,
      //         active: true,
      //       },
      //       {
      //         _id: "mock-option-2",
      //         name: "Standard",
      //         description: "Regular shipping option",
      //         estimatedDeliveryTime: "Within 3 days",
      //         percentageMarkup: 0,
      //         isExpress: false,
      //         daysToAdd: 3,
      //         active: true,
      //       },
      //     ],
      //   },
      // };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/delivery-options/${id}`);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Network error. Please check your connection.");
      }
      throw new Error(
        err.response?.data?.error || "Failed to fetch delivery option details"
      );
    }
  },
};

//Update user Password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put(`/auth/update-password`, {
      currentPassword,
      newPassword,
    });

    return response.data;
  } catch (error) {
    throw error.response.data.error || "Password Update failed";
  }
};

// Update profile (phone, address, country, optionally profile image)
export const updateProfile = async ({
  phone,
  country,
  firstName,
  lastName,
}) => {
  const formData = {
    phone,
    country,
    firstName,
    lastName,
  };
  try {
    const response = await api.put(`/user/profile`, formData);
    return response.data;
  } catch (error) {
    console.error("Profile update error:", error.response?.data || error);
    throw error.response?.data?.error || "Profile update failed.";
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
      `${API_BASE_URL}/api/user/update-profile-image`,
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
  payments: {
    getAll: async () => {
      try {
        const response = await api.get(`/admin/payments`);
        return response.data;
      } catch (err) {
        if (!err.response) {
          throw new Error("Network error. Please check your connection.");
        }
        throw new Error(
          err.response?.data?.error || "Failed to fetch admin payments"
        );
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
        throw new Error(
          err.response?.data?.error || "Failed to fetch admin payment detail"
        );
      }
    },
  },
};

export const pickup = {
  fetchPickupLocation: async () => {
    try {
      const response = await api.get(`/admin/pickup-locations`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
};


export default api;
