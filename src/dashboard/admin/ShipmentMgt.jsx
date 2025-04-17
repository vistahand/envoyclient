import React, { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import { HiOutlineDotsHorizontal, HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import LocationSelectorMgt from "../../components/LocationSelectorMgt";
import { format } from "date-fns";

// Helper function to get authentication token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

// Updated ShipmentTrackMgt component with improved API integration and filtering
const ShipmentTrackMgt = ({ locationFilter }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); // Changed default to "all"
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Status mapping for tabs
  const statusMappings = {
    all: [], // Show all shipments
    active: ["processed", "payment_confirmed", "awaiting_pickup", "in_transit", "out_for_delivery"],
    delivered: ["delivered"],
    pending: ["awaiting_processing", "draft"]
  };

  // Fetch shipments directly from API
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      // Direct API call to your endpoint
      const response = await fetch("https://envoyserver-pyxd.onrender.com/api/admin/shipments", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response Data:", data);
      
      if (data && Array.isArray(data.items)) {
        setShipments(data.items);
        setFilteredShipments(data.items); // Initially set filtered shipments to all shipments
      } else {
        console.warn("API didn't return expected data structure");
        setShipments([]);
        setFilteredShipments([]);
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of shipments
  useEffect(() => {
    fetchShipments();
  }, []);

  // Apply filters whenever shipments data, active tab, location filter, or search query changes
  useEffect(() => {
    if (!shipments.length) {
      setFilteredShipments([]);
      return;
    }

    // Start with all shipments
    let filtered = [...shipments];
    
    // Filter by tab (status)
    if (activeTab !== 'all' && activeTab in statusMappings && statusMappings[activeTab].length > 0) {
      filtered = filtered.filter(shipment => 
        statusMappings[activeTab].includes(shipment.status)
      );
    } else if (activeTab !== 'all') {
      // Direct status filter (e.g., "payment_confirmed")
      filtered = filtered.filter(shipment => shipment.status === activeTab);
    }

    // Apply location filtering if provided
    if (locationFilter && Object.values(locationFilter).some(val => val !== "")) {
      // Country filter - check both origin/destination countries and sender/recipient addresses
      if (locationFilter.country && locationFilter.country !== '') {
        filtered = filtered.filter(shipment => {
          // Convert country names to country codes or vice versa as needed
          // This depends on how your API returns country data vs how locationFilter stores it
          const originCountry = shipment.origin?.country;
          const destCountry = shipment.destination?.country;
          const senderCountry = shipment.sender?.address?.country;
          const recipientCountry = shipment.recipient?.address?.country;
          
          // Check if the country matches any of the country fields
          return [originCountry, destCountry, senderCountry, recipientCountry].some(country => 
            country && (
              country === locationFilter.country || 
              country === getCountryCode(locationFilter.country) ||
              getCountryName(country) === locationFilter.country
            )
          );
        });
      }
      
      // State filter
      if (locationFilter.state && locationFilter.state !== '') {
        const stateToMatch = locationFilter.state.toLowerCase();
        filtered = filtered.filter(shipment => {
          const senderState = shipment.sender?.address?.state?.toLowerCase();
          const recipientState = shipment.recipient?.address?.state?.toLowerCase();
          
          return [senderState, recipientState].some(state => 
            state && state === stateToMatch
          );
        });
      }
      
      // Pickup location filter
      if (locationFilter.pickup && locationFilter.pickup !== '') {
        const pickupToMatch = locationFilter.pickup.toLowerCase();
        filtered = filtered.filter(shipment => {
          const pickupCity = shipment.pickup?.location?.city?.toLowerCase();
          return pickupCity && pickupCity === pickupToMatch;
        });
      }
    }

    // Apply search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(shipment => {
        // Search in multiple fields for better matching
        return [
          shipment.trackingNumber,
          shipment.sender?.name,
          shipment.recipient?.name,
          shipment.sender?.address?.city,
          shipment.recipient?.address?.city,
          shipment.sender?.email,
          shipment.recipient?.email,
          shipment.pickup?.location?.city,
          shipment.destination?.country,
          shipment.origin?.country
        ].some(field => field && field.toString().toLowerCase().includes(query));
      });
    }

    setFilteredShipments(filtered);
  }, [shipments, activeTab, locationFilter, searchQuery]);

  // Simple helper functions for country code/name conversion if needed
  // Implement these based on your data format
  const getCountryCode = (countryName) => {
    // Map country names to codes as needed
    const countryCodes = {
      "Ireland": "IE",
      "Nigeria": "NG",
      // Add more mappings as needed
    };
    return countryCodes[countryName] || countryName;
  };
  
  const getCountryName = (countryCode) => {
    // Map country codes to names as needed
    const countryNames = {
      "IE": "Ireland",
      "NG": "Nigeria",
      // Add more mappings as needed
    };
    return countryNames[countryCode] || countryCode;
  };

  // Reset selections when changing tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAll(false);
    setSelectedShipments([]);
    setActiveDropdown(null);
  };

  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
    if (!selectedAll) {
      setSelectedShipments(filteredShipments.map((shipment) => shipment._id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectShipment = (id) => {
    if (selectedShipments.includes(id)) {
      setSelectedShipments(selectedShipments.filter((shipmentId) => shipmentId !== id));
      
      if (selectedAll) {
        setSelectedAll(false);
      }
    } else {
      setSelectedShipments([...selectedShipments, id]);
      
      if (selectedShipments.length + 1 === filteredShipments.length) {
        setSelectedAll(true);
      }
    }
  };

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  const handleViewDetails = (shipmentId) => {
    navigate(`/admin/shipmentmanagement/details/${shipmentId}`);
    setActiveDropdown(null);
  };

  // Get shipping type from delivery options
  const getShippingType = (shipment) => {
    return shipment.delivery?.options?.deliveryOption || "Standard";
  };

  // Get shipping status with better formatting
  const getFormattedStatus = (status) => {
    if (!status) return "Unknown";
    
    // Convert snake_case to Title Case
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get destination info
  const getDestination = (shipment) => {
    if (shipment.recipient?.address) {
      const city = shipment.recipient.address.city || '';
      const country = shipment.destination?.country || shipment.recipient.address.country || '';
      return `${city}${city && country ? ', ' : ''}${country}`;
    }
    return "N/A";
  };

  if (loading) {
    return <div className="w-full text-center py-8">Loading shipments...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col space-y-4">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          <button 
            className={`pb-2 ${activeTab === 'all' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => handleTabChange('all')}
          >
            All Shipments
          </button>
          <button 
            className={`pb-2 ${activeTab === 'active' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => handleTabChange('active')}
          >
            Active
          </button>
          <button 
            className={`pb-2 ${activeTab === 'delivered' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => handleTabChange('delivered')}
          >
            Delivered
          </button>
          <button 
            className={`pb-2 ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => handleTabChange('pending')}
          >
            Pending
          </button>
          <button 
            className={`pb-2 ${activeTab === 'payment_confirmed' ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => handleTabChange('payment_confirmed')}
          >
            Payment Confirmed
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-4 w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by tracking ID, recipient, destination..."
            className="w-full p-3 pl-4 border border-gray-200 rounded-lg text-gray-500 bg-gray-50 text-xs sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <HiOutlineSearch size={20} />
          </div>
        </div>

        {/* Filter Summary */}
        {locationFilter && (Object.values(locationFilter).some(value => value !== "")) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {locationFilter.country && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                Country: {locationFilter.country}
              </div>
            )}
            {locationFilter.state && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                State: {locationFilter.state}
              </div>
            )}
            {locationFilter.pickup && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                Pickup: {locationFilter.pickup}
              </div>
            )}
          </div>
        )}

        {/* Stats summary */}
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">{filteredShipments.length}</span> shipment{filteredShipments.length !== 1 ? 's' : ''} found
          {activeTab !== 'all' ? ` with status: ${activeTab.replace('_', ' ')}` : ''}
        </div>

        {/* Shipments Table */}
        <div className="border border-gray-200 rounded-lg mt-4 overflow-hidden">
          <div className="md:overflow-visible overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 h-4 w-4 accent-primary"
                      checked={selectedAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">Tracking ID</th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Pickup Date
                    <span className="inline-block ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Est. Delivery
                    <span className="inline-block ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">Shipping Type</th>
                  <th className="p-4 text-left text-gray-500 font-medium">Destination</th>
                  <th className="p-4 text-left text-gray-500 font-medium">Recipient</th>
                  <th className="p-4 text-left text-gray-500 font-medium">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 h-4 w-4 accent-primary"
                          checked={selectedShipments.includes(shipment._id)}
                          onChange={() => handleSelectShipment(shipment._id)}
                        />
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-800">
                        {shipment.trackingNumber}
                      </td>
                      <td className="p-4 text-sm font-semibold text-black">
                        {formatDate(shipment.pickup?.date)}
                      </td>
                      <td className="p-4 text-sm font-semibold text-black">
                        {formatDate(shipment.delivery?.estimatedDate)}
                      </td>
                      <td className="p-4 text-sm font-semibold text-black">
                        {getShippingType(shipment)}
                      </td>
                      <td className="p-4 text-sm font-semibold text-black">
                        {getDestination(shipment)}
                      </td>
                      <td className="p-4 text-sm font-semibold text-black">
                        {shipment.recipient?.name || "N/A"}
                      </td>
                      <td className="p-4 text-sm font-semibold text-black">
                        {getFormattedStatus(shipment.status)}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-400 relative">
                        <button 
                          onClick={() => toggleDropdown(shipment._id)}
                          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
                        >
                          <HiOutlineDotsHorizontal className="h-5 w-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeDropdown === shipment._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button 
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => handleViewDetails(shipment._id)}
                              >
                                See Full Detail
                              </button>
                              <button 
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                  navigate(`/tracking/${shipment.trackingNumber}`);
                                  setActiveDropdown(null);
                                }}
                              >
                                Track Shipment
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No shipments found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end p-4 space-x-2">
            <div className="text-sm text-gray-600">Rows per page:</div>
            <div className="flex items-center text-sm text-gray-600">
              10
              <span className="ml-1 text-xs">▼</span>
            </div>
            <div className="ml-4 px-4 text-sm text-gray-600">
              {filteredShipments.length > 0 
                ? `1-${Math.min(filteredShipments.length, 10)} of ${filteredShipments.length}` 
                : '0 of 0'}
            </div>
            <div className="flex space-x-1">
              <button className="px-1 text-gray-400">⟪</button>
              <button className="px-1 text-gray-400">⟨</button>
              <button className="px-1 text-gray-400">⟩</button>
              <button className="px-1 text-gray-400">⟫</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated main ShipmentMgt component
const ShipmentMgt = () => {
  const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState({
    country: "",
    state: "",
    pickup: ""
  });

  // Handler to update filters from LocationSelectorMgt
  const handleFilterChange = (filter) => {
    console.log("Filter changed in parent:", filter);
    setLocationFilter(filter);
  };

  // Handler to reset filters
  const handleResetFilters = () => {
    setLocationFilter({
      country: "",
      state: "",
      pickup: ""
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full pb-4">
        <div>
          <h2 className="text-[22px] font-semibold text-primary">
            Shipment Management
          </h2>
          <p className="text-[15px] text-gray-600">
            Create, view, track, and manage all active and delivered shipments
            in one place.
          </p>
        </div>

        {/* Button Section */}
        <button
          type="button"
          onClick={() => navigate('/admin/shipment/create')}
          className="bg-primary text-white flex items-center justify-center gap-3 rounded-lg md:rounded-xl transition-all cursor-pointer
                    px-2.5 py-2.5 md:px-6 md:py-3 text-[13px] md:text-[14px] ss:text-[15px] md:w-auto ss:w-[27%] sm:w-10 sm:h-10"
        >
          <span className="hidden md:block">Create New</span>
          <GoPlus className="text-[20px]" />
        </button>
      </div>

      {/* Location Selector Management Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filter Shipments</h3>
          {Object.values(locationFilter).some(val => val !== "") && (
            <button 
              onClick={handleResetFilters}
              className="text-primary text-sm hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
        <LocationSelectorMgt onFilterChange={handleFilterChange} />
      </div>
      
      {/* Shipment Table with location filtering */}
      <div>
        <ShipmentTrackMgt locationFilter={locationFilter} />
      </div>
    </div>
  );
};

export { ShipmentTrackMgt };
export default ShipmentMgt;