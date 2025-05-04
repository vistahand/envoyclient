import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiUserX, FiUserCheck, FiUserMinus } from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component

const getAuthToken = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  // Remove quotes if present
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  return token;
};

const AdminUserDetail = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const navigate = useNavigate(); // Add navigate for back button functionality
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);
  
  // Modal content states
  const [currentAction, setCurrentAction] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to fetch user details from the API
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${apiUrl}/api/admin/users/${userId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user details:", err);
      
      if (err.response && err.response.status === 401) {
        setModalMessage("Your session has expired. Please log in again.");
        setSessionExpiredModalOpen(true);
      } else {
        setError(
          `Failed to load user details. ${
            err.response?.data?.error || "Please try again later."
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId, apiUrl]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle back button - navigate back to users list
  const handleBackToUsers = () => {
    navigate('/admin/users');
  };

  // Handle session expired
  const handleSessionExpired = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Handle user status change
  const handleStatusChange = (statusAction) => {
    // Store the current action for later use
    setCurrentAction(statusAction);
    
    // Reset other modal states
    setReasonInput("");
    
    // Open confirmation modal
    setConfirmModalOpen(true);
  };

  // Handle confirmation
  const handleConfirmAction = () => {
    // Close confirmation modal
    setConfirmModalOpen(false);
    
    // Open reason modal
    setReasonModalOpen(true);
  };

  // Handle submit with reason
  const handleSubmitWithReason = async () => {
    // Validate reason
    if (!reasonInput || reasonInput.trim() === "") {
      // If reason is empty, show error but keep modal open
      setModalMessage("A reason is required to perform this action.");
      setErrorModalOpen(true);
      return;
    }
    
    // Close reason modal
    setReasonModalOpen(false);
    
    // Convert action to expected API status values
    const statusMap = {
      "activate": "active",
      "deactivate": "inactive",
      "suspend": "suspended"
    };
    
    const statusValue = statusMap[currentAction];
    
    try {
      const token = getAuthToken();
      
      await axios.put(`${apiUrl}/api/admin/users/${userId}/status`, 
        { 
          status: statusValue,
          reason: reasonInput.trim()
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Show success message
      setModalMessage(`User ${currentAction}d successfully`);
      setSuccessModalOpen(true);
      
    } catch (err) {
      console.error(`Error ${currentAction}ing user:`, err);

      if (err.response && err.response.status === 401) {
        setModalMessage("Your session has expired. Please log in again.");
        setSessionExpiredModalOpen(true);
      } else {
        const errorMessage = err.response?.data?.error || `Failed to ${currentAction} user`;
        setModalMessage(`${errorMessage}. Please try again.`);
        setErrorModalOpen(true);
      }
    }
  };

  // Handle success dismiss
  const handleSuccessDismiss = () => {
    setSuccessModalOpen(false);
    // Refresh the user data
    fetchUserDetails();
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-gray-800">{error}</p>
          <button
            onClick={handleBackToUsers}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-xl mb-4">⚠️</div>
          <p className="text-lg font-medium text-gray-800">User not found</p>
          <button
            onClick={handleBackToUsers}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }
  
  // Get button variant and text based on action
  const getActionStyles = (action) => {
    switch(action) {
      case 'activate':
        return { variant: 'success', color: 'green' };
      case 'suspend':
        return { variant: 'warning', color: 'orange' };
      case 'deactivate':
        return { variant: 'danger', color: 'red' };
      default:
        return { variant: 'primary', color: 'blue' };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        type="warning"
        title={`${currentAction.charAt(0).toUpperCase() + currentAction.slice(1)} User`}
        message={`Are you sure you want to ${currentAction} this user?`}
        buttons={[
          {
            label: "Cancel",
            onClick: () => setConfirmModalOpen(false),
            variant: "secondary"
          },
          {
            label: "Continue",
            onClick: handleConfirmAction,
            variant: "primary",
          }
        ]}
      />
      
      {/* Reason Input Modal */}
      <Modal
        isOpen={reasonModalOpen}
        onClose={() => setReasonModalOpen(false)}
        type="info"
        title={`${currentAction.charAt(0).toUpperCase() + currentAction.slice(1)} User - Provide Reason`}
        message={`Please provide a reason for ${currentAction}ing this user:`}
        buttons={[
          {
            label: "Cancel",
            onClick: () => setReasonModalOpen(false),
            variant: "secondary"
          },
          {
            label: "Submit",
            onClick: handleSubmitWithReason,
            variant: "primary"
          }
        ]}
      >
        <div className="mt-4">
          <label htmlFor="reasonInput" className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            id="reasonInput"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
            placeholder="Enter your reason here..."
            autoFocus
          />
        </div>
      </Modal>
      
      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={handleSuccessDismiss}
        type="success"
        title="Success"
        message={modalMessage}
        buttons={[
          {
            label: "OK",
            onClick: handleSuccessDismiss,
            variant: "primary"
          }
        ]}
      />
      
      {/* Error Modal */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        type="error"
        title="Error"
        message={modalMessage}
        buttons={[
          {
            label: "OK",
            onClick: () => setErrorModalOpen(false),
            variant: "primary"
          }
        ]}
      />
      
      {/* Session Expired Modal */}
      <Modal
        isOpen={sessionExpiredModalOpen}
        onClose={handleSessionExpired}
        type="error"
        title="Session Expired"
        message={modalMessage}
        buttons={[
          {
            label: "Login",
            onClick: handleSessionExpired,
            variant: "primary"
          }
        ]}
      />

      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToUsers}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-primary">User Details</h2>
          <p className="text-sm text-gray-600">
            View detailed information about {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      {/* User profile section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Avatar or initial */}
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0 md:mr-6">
            {user.firstName ? user.firstName.charAt(0) : '?'}
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-1">
              {user.firstName} {user.lastName}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-gray-600">{user.email}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isSuspended
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.isSuspended ? "Suspended" : "Active"}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                {user.role}
              </span>
            </div>
          </div>
          
          {/* Action buttons - Modified to use status management pattern */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {/* Show Activate button if user is suspended */}
            {user.isSuspended && (
              <button 
                onClick={() => handleStatusChange("activate")}
                className="bg-white border border-green-200 text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-100"
              >
                <FiUserCheck size={16} />
                <span>Activate</span>
              </button>
            )}
            
            {/* Show Suspend button if user is active */}
            {!user.isSuspended && (
              <button 
                onClick={() => handleStatusChange("suspend")}
                className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-100"
              >
                <FiUserX size={16} />
                <span>Suspend</span>
              </button>
            )}
            
            {/* Show Deactivate button if user is active */}
            {!user.isSuspended && (
              <button 
                onClick={() => handleStatusChange("deactivate")}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100"
              >
                <FiUserMinus size={16} />
                <span>Deactivate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User details cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiUser className="text-primary" />
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{user.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
          </div>
        </div>
        
        {/* Activity & Status */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiClock className="text-primary" />
            Activity & Status
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <div className="flex items-center gap-2 mt-1">
                <HiOutlineStatusOnline className={user.isSuspended ? "text-red-500" : "text-green-500"} />
                <span className="font-medium">{user.isSuspended ? "Suspended" : "Active"}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">{formatDate(user.lastLogin)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Updated At</p>
              <p className="font-medium">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;