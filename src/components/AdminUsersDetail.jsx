import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash, FiUser} from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import axios from "axios";

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
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
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
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
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

  // Handle edit user
  const handleEditUser = () => {
    navigate(`/admin/users/edit/${userId}`);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete this user?`)) {
      try {
        const token = getAuthToken();
        await axios.delete(`${apiUrl}/api/admin/users/${userId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Redirect back to users list after successful deletion
        navigate('/admin/users');
      } catch (err) {
        console.error("Error deleting user:", err);

        if (err.response && err.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert("Failed to delete user. Please try again.");
        }
      }
    }
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

  return (
    <div className="w-full space-y-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToUsers}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-[22px] font-semibold text-primary">User Details</h2>
          <p className="text-[15px] text-gray-600">
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
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            <button 
              onClick={handleEditUser}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <FiEdit size={16} />
              <span>Edit</span>
            </button>
            <button 
              onClick={handleDeleteUser}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-100"
            >
              <FiTrash size={16} />
              <span>Delete</span>
            </button>
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