import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import CreatePickupLocation from "./CreatePickupLocation";
import PickupLocationCard from "../../components/PickupLocationCard";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

const TabsAndSearch = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      {/* Tabs Section */}
      <div className="flex items-center gap-6 border-b border-gray-200 w-full md:w-auto">
        <button
          className={`pb-4 px-1 ${
            activeTab === "active"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-2/5">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

const PickupLoc = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [creating, setCreating] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // info, success, error, warning
    buttons: []
  });

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const showModal = (title, message, type = "info", buttons = []) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      buttons: buttons.length > 0 ? buttons : [
        { 
          label: "OK", 
          onClick: () => closeModal(), 
          variant: type === "error" ? "danger" : 
                   type === "success" ? "success" : "primary" 
        }
      ]
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const fetchPickupLocations = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        showModal(
          "Authentication Error", 
          "Authentication token not found. Please log in again.", 
          "error",
          [
            { 
              label: "Login", 
              onClick: () => navigate("/login"), 
              variant: "primary" 
            },
            { 
              label: "Cancel", 
              onClick: closeModal, 
              variant: "secondary" 
            }
          ]
        );
        return;
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/pickup-locations?page=${pagination.page}&limit=${pagination.limit}&status=${activeTab}${searchQuery ? `&search=${searchQuery}` : ''}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pickup locations');
      }
      
      const data = await response.json();
      setLocations(data.items || []);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        pages: data.pages 
      });
    } catch (err) {
      console.error("Error fetching pickup locations:", err);
      showModal("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations when component mounts or when tab/search changes
  useEffect(() => {
    fetchPickupLocations();
  }, [activeTab, searchQuery, pagination.page]);

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle navigation to view a specific location
  const handleNavigateToView = (locationId) => {
    navigate(`/admin/pickup-locations/${locationId}`);
  };

  // Handle back button click - This is the function we pass to the CreatePickupLocation component
  // Added shouldRefresh parameter to determine if we need to refresh the list
  const handleBack = (shouldRefresh = false) => {
    setCreating(false); // This changes the view back to the main page
    
    // If shouldRefresh is true, fetch locations again
    if (shouldRefresh) {
      fetchPickupLocations();
    }
  };

  // Placeholder for when we have no results or are loading
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading pickup locations...</div>;
    }
    
    if (locations.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {activeTab} pickup locations found.
          {searchQuery && " Try adjusting your search query."}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {locations.map((location, index) => (
          <PickupLocationCard 
            key={location._id || index} 
            location={location} 
            onRefresh={fetchPickupLocations}
            onShowModal={(title, message, type, buttons) => showModal(title, message, type, buttons)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Modal Component */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttons={modal.buttons}
      />

      {creating ? (
        // Show CreatePickupLocation if user is in creation mode
        <CreatePickupLocation 
          onBack={handleBack} // Pass the back handler function
          onNavigateToView={handleNavigateToView} // Pass the navigation handler
        />
      ) : (
        // Default Pickup Locations List
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Pickup Locations</h1>
              <p className="text-gray-500">
                Manage and update all available and operating pickup stations here
              </p>
            </div>
            
            {/* Button Section */}
            <button
              onClick={() => setCreating(true)}
              className="bg-primary text-white flex items-center justify-center gap-3 rounded-lg md:rounded-xl transition-all cursor-pointer
                      px-2.5 py-2.5 md:px-6 md:py-3 text-[13px] md:text-[14px] ss:text-[15px] md:w-auto ss:w-[27%] sm:w-10 sm:h-10 mt-4 md:mt-0"
            >
              <GoPlus />
              <span className="sm:inline">Create New</span>
            </button>
          </div>
          
          {/* Tabs and Search Component */}
          <TabsAndSearch 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          {/* Pickup Locations List */}
          <div className="mt-6">
            {renderContent()}
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded ${pagination.page === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-1 rounded ${pagination.page === pagination.pages ? 'bg-gray-200 text-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PickupLoc;