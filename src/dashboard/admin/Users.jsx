import React, { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { FiSearch, FiFilter, FiDownload, FiEdit, FiTrash, FiEye } from "react-icons/fi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { RiUserSettingsLine } from "react-icons/ri";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showActions, setShowActions] = useState(null);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock data configuration
  const roleOptions = ["all", "admin", "user", "manager", "guest"];
  const statusOptions = ["all", "active", "inactive", "pending", "suspended"];

  // Generate mock data on component mount
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Generate 30 mock users
      const mockUsers = Array(30).fill().map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: roleOptions[Math.floor(Math.random() * (roleOptions.length - 1)) + 1],
        status: statusOptions[Math.floor(Math.random() * (statusOptions.length - 1)) + 1],
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0]
      }));
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  // Apply filters and search whenever users, filters, or searchTerm changes
  useEffect(() => {
    let result = [...users];

    // Apply role filter
    if (filters.role !== "all") {
      result = result.filter(user => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter(user => user.status === filters.status);
    }

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, filters, searchTerm]);

  // Close action menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActions !== null) {
        setShowActions(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle action button clicks
  const handleActionClick = (e, userId) => {
    e.stopPropagation();
    setShowActions(showActions === userId ? null : userId);
  };

  // Handle user actions (mock implementations)
  const handleViewUser = (userId) => {
    alert(`View user with ID: ${userId}`);
    setShowActions(null);
  };

  const handleEditUser = (userId) => {
    alert(`Edit user with ID: ${userId}`);
    setShowActions(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
      // Remove user from the list (mock delete)
      setUsers(users.filter(user => user.id !== userId));
      setShowActions(null);
    }
  };

  // Create new user (mock implementation)
  const handleCreateUser = () => {
    const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name: `New User ${newId}`,
      email: `newuser${newId}@example.com`,
      role: "user",
      status: "active",
      lastLogin: "N/A"
    };
    
    setUsers([newUser, ...users]);
    setIsCreating(false);
    alert("New user created!");
  };

  // Export users data (mock implementation)
  const handleExportUsers = () => {
    alert(`Exporting ${filteredUsers.length} users to CSV`);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-4">
        <div>
          <h2 className="text-[22px] font-semibold text-primary">User Management</h2>
          <p className="text-[15px] text-gray-600">
            View and manage all registered users on the platform
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            type="button"
            onClick={handleExportUsers}
            className="bg-white border border-gray-300 text-gray-700 flex items-center justify-center gap-2 rounded-lg transition-all cursor-pointer px-4 py-2.5 text-[14px]"
          >
            <FiDownload className="text-[16px]" />
            <span>Export</span>
          </button>
          
          <button
            type="button"
            onClick={handleCreateUser}
            className="bg-primary text-white flex items-center justify-center gap-2 rounded-lg transition-all cursor-pointer px-4 py-2.5 text-[14px]"
          >
            <GoPlus className="text-[16px]" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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
                {(filters.role !== "all" ? 1 : 0) + (filters.status !== "all" ? 1 : 0)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  {roleOptions.map(role => (
                    <option key={role} value={role}>
                      {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setFilters({ role: 'all', status: 'all' });
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
                <span>{filters.role.charAt(0).toUpperCase() + filters.role.slice(1)}</span>
                <button
                  onClick={() => handleFilterChange('role', 'all')}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            )}
            {filters.status !== "all" && (
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <HiOutlineStatusOnline size={14} />
                <span>{filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}</span>
                <button
                  onClick={() => handleFilterChange('status', 'all')}
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
        Showing {filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
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
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{user.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center relative">
                      <button
                        onClick={(e) => handleActionClick(e, user.id)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <BsThreeDots className="text-gray-600 text-xl" />
                      </button>

                      {/* Actions Dropdown */}
                      {showActions === user.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ul>
                            <li>
                              <button
                                onClick={() => handleViewUser(user.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FiEye size={14} />
                                <span>View</span>
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleEditUser(user.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <FiEdit size={14} />
                                <span>Edit</span>
                              </button>
                            </li>
                            <li className="border-t border-gray-100">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                              >
                                <FiTrash size={14} />
                                <span>Delete</span>
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
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p>No users found matching your criteria</p>
                    {(searchTerm || filters.role !== "all" || filters.status !== "all") && (
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
      {filteredUsers.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                    {currentPage > 3 && <span className="text-gray-500">...</span>}
                  </>
                )}
                
                {Array.from({ length: Math.min(3, totalPages) }).map((_, idx) => {
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
                            ? 'bg-primary text-white'
                            : 'border border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}
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
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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