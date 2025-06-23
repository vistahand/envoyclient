import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiUsers,
  FiActivity
} from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { RiUserSettingsLine } from "react-icons/ri";
import axios from "axios";

// Fixed authentication helper function
const getAuthToken = () => {
  let token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  // Remove quotes if present (critical fix)
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  return token;
};

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showActions, setShowActions] = useState(null);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  
  // Create a ref for dropdown menus to detect outside clicks
  const dropdownRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get token from our dedicated auth function
      const token = getAuthToken();
   

      // Prepare query parameters based on filters
      const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.role !== "all" && { role: filters.role }),
      };

      // Fix for status filter - properly handle suspended status
      if (filters.status !== "all") {
        // Set isSuspended=true when 'suspended' is selected
        // Set isSuspended=false when 'active' is selected
        queryParams.isSuspended = filters.status === "suspended";
      }

  

      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      });

      // Handle successful response
      const { items, total, page, limit, pages } = response.data;

      setUsers(items);
      setFilteredUsers(items);
      setTotalUsers(total);
      setTotalPages(pages);
      setCurrentPage(page);
      setItemsPerPage(limit);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);

      // More detailed error handling
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        if (err.response.status === 401) {
          setError("Session expired or invalid token. Redirecting to login...");
          // Clear auth token and redirect to login
          localStorage.removeItem("authToken");

          // Redirect to login page - use your app's navigation method
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          setError(
            `Failed to load users. Server error: ${
              err.response.data.error || "Unknown error"
            }`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Server not responding. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError("Failed to load users. Please try again later.");
      }

      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts and when filters/pagination changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  // Handle search separately to avoid too many API calls
  useEffect(() => {
    // If search is implemented client-side:
    if (users.length > 0 && searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const result = users.filter(
        (user) =>
          (user.firstName &&
            user.firstName.toLowerCase().includes(lowerSearchTerm)) ||
          (user.lastName &&
            user.lastName.toLowerCase().includes(lowerSearchTerm)) ||
          (user.email && user.email.toLowerCase().includes(lowerSearchTerm))
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Close action menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle action button clicks
  const handleActionClick = (e, userId) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActions(prevState => prevState === userId ? null : userId);
  };

  // Handle view user
  const handleViewUser = (userId) => {
  
    // Explicitly set the path to include /admin prefix
    navigate(`/admin/users/${userId}`);
    setShowActions(null);
  };

  // Create new user
  const handleCreateUser = () => {
    // Navigate to create user page or open modal
    navigate('/admin/users/create');
  };

  // Get status badge color
  const getStatusBadgeColor = (isSuspended) => {
    return isSuspended
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  // Format date string to a readable format
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

  if (loading && users.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
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
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-4 bg-gradient-to-r from-slate-100 to-slate-50 p-5 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-3 rounded-full text-white">
            <FiUsers className="text-xl" />
          </div>
          <div>
            <h2 className="text-[22px] font-semibold text-primary">
              User Management
            </h2>
            <p className="text-[15px] text-gray-600">
              View and manage all registered users on the platform
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="bg-gradient-to-r from-green to-primary text-white rounded-lg p-3 shadow-md flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <HiOutlineStatusOnline className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-100">Active Users</p>
              <p className="text-lg font-semibold">{totalUsers > 0 ? filteredUsers.filter(user => !user.isSuspended).length : 0}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-600 to-primary text-white rounded-lg p-3 shadow-md flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <RiUserSettingsLine className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium text-red-100">Suspended Users</p>
              <p className="text-lg font-semibold">{totalUsers > 0 ? filteredUsers.filter(user => user.isSuspended).length : 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FiUsers className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <HiOutlineStatusOnline className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-gray-800">{totalUsers > 0 ? filteredUsers.filter(user => !user.isSuspended).length : 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <FiActivity className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Suspended Users</p>
            <p className="text-2xl font-bold text-gray-800">{totalUsers > 0 ? filteredUsers.filter(user => user.isSuspended).length : 0}</p>
          </div>
        </div>
      </div>
        
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Filter Button */}
        <div className="relative w-full md:w-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilters(!showFilters);
            }}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
          >
            <FiFilter className="text-gray-500" />
            <span>Filters</span>
            {(filters.role !== "all" || filters.status !== "all") && (
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filters.role !== "all" ? 1 : 0) +
                  (filters.status !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div
              className="absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-64"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Role Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setFilters({ role: "all", status: "all" });
                    setShowFilters(false);
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filter Tags */}
        {(filters.role !== "all" || filters.status !== "all") && (
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
            {filters.role !== "all" && (
              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <RiUserSettingsLine size={14} />
                <span>
                  {filters.role.charAt(0).toUpperCase() + filters.role.slice(1)}
                </span>
                <button
                  onClick={() => handleFilterChange("role", "all")}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            )}
            {filters.status !== "all" && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <HiOutlineStatusOnline size={14} />
                <span>
                  {filters.status.charAt(0).toUpperCase() +
                    filters.status.slice(1)}
                </span>
                <button
                  onClick={() => handleFilterChange("status", "all")}
                  className="ml-1 text-green-700 hover:text-green-900"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing{" "}
        {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
        {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 text-[14px] font-medium text-gray-700 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Last Login</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-medium text-xs">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        user.isSuspended 
                          ? "bg-red-100 text-red-800" 
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isSuspended ? "bg-red-500" : "bg-green-500"}`}></span>
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatDate(user.lastLogin)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center relative" ref={showActions === user._id ? dropdownRef : null}>
                      <button
                        onClick={(e) => handleActionClick(e, user._id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <BsThreeDots className="text-gray-600 text-xl" />
                      </button>

                      {/* Actions Dropdown - Simplified with only View option */}
                      {showActions === user._id && (
                        <div
                          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40"
                        >
                          <ul>
                            <li>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleViewUser(user._id);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FiEye size={14} />
                                <span>View</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-300 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p>No users found matching your criteria</p>
                    {(searchTerm ||
                      filters.role !== "all" ||
                      filters.status !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilters({ role: "all", status: "all" });
                        }}
                        className="mt-3 text-primary hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            {totalPages > 5 ? (
              <div className="flex items-center gap-1">
                {currentPage > 2 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      1
                    </button>
                    {currentPage > 3 && (
                      <span className="text-gray-500">...</span>
                    )}
                  </>
                )}

                {Array.from({ length: Math.min(3, totalPages) }).map(
                  (_, idx) => {
                    let pageNum;
                    if (currentPage === 1) {
                      pageNum = idx + 1;
                    } else if (currentPage === totalPages) {
                      pageNum = totalPages - 2 + idx;
                    } else {
                      pageNum = currentPage - 1 + idx;
                    }

                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "border border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  }
                )}

                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && (
                      <span className="text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === idx + 1
                        ? "bg-primary text-white"
                        : "border border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;