import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineDotsHorizontal,
  HiOutlineSearch,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import { shipments as shipmentEndpoint } from "../services/api";
import { getFormattedStatus } from "../utils";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

// Get valid next statuses based on backend logic
const getValidStatusTransitions = (currentStatus, paymentMethod) => {
  const commonTransitions = {
    picked_up: ["in_transit", "cancelled"],
    in_transit: ["out_for_delivery", "cancelled"],
    out_for_delivery: ["delivered", "in_transit", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  // Stripe-specific transitions
  if (paymentMethod === "stripe") {
    return (
      {
        pending: ["payment_confirmed", "payment_failed", "cancelled"],
        payment_confirmed: ["awaiting_processing", "cancelled"],
        payment_failed: ["pending", "cancelled"],
        awaiting_processing: ["processed", "cancelled"],
        processed: ["awaiting_pickup", "cancelled"],
        awaiting_pickup: ["picked_up", "cancelled"],
        ...commonTransitions,
      }[currentStatus] || []
    );
  }
  // Cash on pickup transitions
  else if (paymentMethod === "cash_on_pickup") {
    return (
      {
        pending: ["awaiting_processing", "cancelled"],
        awaiting_processing: ["processed", "cancelled"],
        processed: ["awaiting_pickup", "cancelled"],
        awaiting_pickup: ["picked_up", "cancelled"],
        ...commonTransitions,
      }[currentStatus] || []
    );
  }

  // Default transitions if no payment method specified
  return commonTransitions[currentStatus] || [];
};

// Optimized ShipmentTrackMgt component with improved API integration and animations
const ShipmentTrackMgt = ({
  locationFilter,
  shipments,
  loading,
  error,
  filteredShipment,
  fetchShipments,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [filteredShipments, setFilteredShipments] = useState(filteredShipment);

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Tab scrolling references
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Status update modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [isPendingPayment, setIsPendingPayment] = useState(false);

  // Animation states
  const [isTableLoaded, setIsTableLoaded] = useState(false);

  // Status mapping for tabs
  const tabs = [
    { id: "all", label: "All Shipments", statuses: [] },
    {
      id: "active",
      label: "Active",
      statuses: [
        "processed",
        "payment_confirmed",
        "awaiting_pickup",
        "in_transit",
        "out_for_delivery",
      ],
    },
    { id: "delivered", label: "Delivered", statuses: ["delivered"] },
    {
      id: "pending",
      label: "Pending",
      statuses: ["awaiting_processing", "draft", "pending"],
    },
    {
      id: "payment_confirmed",
      label: "Payment Confirmed",
      statuses: ["payment_confirmed"],
    },
  ];

  // Add a mapping object for easier lookup
  const statusMappings = tabs.reduce((acc, tab) => {
    acc[tab.id] = tab.statuses;
    return acc;
  }, {});

  // Handle tab scrolling
  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          tabsContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
      }
    };

    // Check on mount
    checkScroll();

    // Add scroll event listener
    if (tabsContainerRef.current) {
      tabsContainerRef.current.addEventListener("scroll", checkScroll);
      return () => {
        if (tabsContainerRef.current) {
          tabsContainerRef.current.removeEventListener("scroll", checkScroll);
        }
      };
    }
  }, []);

  // Handle scroll tabs
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Apply animations after initial render
  useEffect(() => {
    setTimeout(() => {
      setIsTableLoaded(true);
    }, 300);
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
    if (
      activeTab !== "all" &&
      activeTab in statusMappings &&
      statusMappings[activeTab].length > 0
    ) {
      filtered = filtered.filter((shipment) =>
        statusMappings[activeTab].includes(shipment.status)
      );
    } else if (activeTab !== "all") {
      // Direct status filter (e.g., "payment_confirmed")
      filtered = filtered.filter((shipment) => shipment.status === activeTab);
    }

    // Apply location filtering if provided
    if (
      locationFilter &&
      Object.values(locationFilter).some((val) => val !== "")
    ) {
      // Country filter - check both origin/destination countries and sender/recipient addresses
      if (locationFilter.country && locationFilter.country !== "") {
        filtered = filtered.filter((shipment) => {
          // Convert country names to country codes or vice versa as needed
          // This depends on how your API returns country data vs how locationFilter stores it
          const originCountry = shipment.origin?.country;
          const destCountry = shipment.destination?.country;
          const senderCountry = shipment.sender?.address?.country;
          const recipientCountry = shipment.recipient?.address?.country;
          const pickupCountry = shipment.pickup?.address?.country;

          const countryToMatch = locationFilter.country.toLowerCase();

          return [
            originCountry,
            destCountry,
            senderCountry,
            recipientCountry,
            pickupCountry,
          ].some(
            (country) => country && country.toLowerCase() === countryToMatch
          );
        });
      }

      // State filter
      if (locationFilter.state && locationFilter.state !== "") {
        const stateToMatch = locationFilter.state.toLowerCase();
        filtered = filtered.filter((shipment) => {
          const senderState = shipment.sender?.address?.state?.toLowerCase();
          const recipientState =
            shipment.recipient?.address?.state?.toLowerCase();
          const pickupState = shipment.pickup?.address?.state?.toLowerCase();

          return [senderState, recipientState, pickupState].some(
            (state) =>
              state && (state === stateToMatch || state.includes(stateToMatch))
          );
        });
      }

      // Pickup location filter
      if (locationFilter.pickup && locationFilter.pickup !== "") {
        const pickupToMatch = locationFilter.pickup.toLowerCase();
        filtered = filtered.filter((shipment) => {
          const pickupCity = shipment.pickup?.address?.city?.toLowerCase();

          return (
            pickupCity &&
            (pickupCity === pickupToMatch || pickupCity.includes(pickupToMatch))
          );
        });
      }
    }

    // Apply search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((shipment) => {
        // Search in multiple fields for better matching
        return [
          shipment.trackingNumber,
          shipment.sender?.name,
          shipment.recipient?.name,
          shipment.sender?.address?.city,
          shipment.recipient?.address?.city,
          shipment.sender?.email,
          shipment.recipient?.email,
          shipment.pickup?.address?.city,
          shipment.destination?.country,
          shipment.origin?.country,
        ].some(
          (field) => field && field.toString().toLowerCase().includes(query)
        );
      });
    }

    setFilteredShipments(filtered);
  }, [shipments, activeTab, locationFilter, searchQuery]);

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
      setSelectedShipments(
        selectedShipments.filter((shipmentId) => shipmentId !== id)
      );

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

  // Get destination info
  const getDestination = (shipment) => {
    if (shipment.recipient?.address) {
      const city = shipment.recipient.address.city || "";
      const country =
        shipment.destination?.country ||
        shipment.recipient.address.country ||
        "";
      return `${city}${city && country ? ", " : ""}${country}`;
    }
    return "N/A";
  };

  // Get the next available status options for a shipment
  const getNextStatusOptions = (shipment) => {
    if (!shipment || !shipment.status) return [];

    const currentStatus = shipment.status;
    const paymentMethod = shipment.payment?.method || "stripe"; // Default to stripe if not specified

    return getValidStatusTransitions(currentStatus, paymentMethod);
  };

  // Handle opening status update modal
  const handleUpdateStatusClick = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus("");
    if (shipment.payment?.method === "cash_on_pickup") {
      if (!shipment.payment?.paidAt) {
        setIsPendingPayment(true);
      } else {
        setIsStatusModalOpen(true);
      }
    } else {
      setIsStatusModalOpen(true);
    }
  };

  // Handle updating the shipment status
  const handleUpdateStatus = async () => {
    if (!selectedShipment || !newStatus) console.log("issue");

    setUpdateStatusLoading(true);

    try {
      // Use the shipments API endpoint instead of direct fetch
      await shipmentEndpoint.updateShipmentStatus(selectedShipment._id, {
        status: newStatus,
      });

      setIsStatusModalOpen(false);
      setSelectedShipment(null);
      fetchShipments(); // Refresh shipments after update

      // Log success
      console.log(`Status updated to ${getFormattedStatus(newStatus)}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      // setError(`Failed to update status: ${err.message}`);
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  // Status selection component for the modal
  const StatusSelector = () => {
    if (!selectedShipment) return null;

    const validNextStatuses = getNextStatusOptions(selectedShipment);

    if (validNextStatuses.length === 0) {
      return (
        <div className="mt-4 text-sm text-gray-700">
          No further status updates are available for this shipment.
        </div>
      );
    }

    return (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select new status:
        </label>
        <select
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="">Select a status</option>
          {validNextStatuses.map((status) => (
            <option key={status} value={status}>
              {getFormattedStatus(status)}
            </option>
          ))}
        </select>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">
            Current Status Flow:
          </h4>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span className="font-medium">
              {getFormattedStatus(selectedShipment.status)}
            </span>
            <span className="mx-2">→</span>
            <span className="text-primary">
              {newStatus ? getFormattedStatus(newStatus) : "Select next status"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading shipments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8 text-red-500 rounded-lg bg-red-50 p-4 animate-fadeIn">
        <div className="flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Error
        </div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Tabs with horizontal scrolling */}
        <div className="relative">
          {/* Left scroll button */}
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10"
                onClick={() => scrollTabs("left")}
              >
                <HiChevronLeft className="h-5 w-5 text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scrollable tabs */}
          <div
            ref={tabsContainerRef}
            className="flex overflow-x-auto space-x-2 sm:space-x-6 no-scrollbar border-b border-gray-200 pb-2 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-2 whitespace-nowrap px-3 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary font-medium bg-primary-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right scroll button */}
          <AnimatePresence>
            {showRightArrow && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1 z-10"
                onClick={() => scrollTabs("right")}
              >
                <HiChevronRight className="h-5 w-5 text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search and filters section */}
        <div className="px-4 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by tracking ID, recipient, destination..."
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg text-gray-500 bg-gray-50 text-xs sm:text-sm focus:ring-primary focus:border-primary transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <HiOutlineSearch size={20} />
            </div>
          </div>

          {/* Filter badges */}
          {locationFilter &&
            Object.values(locationFilter).some((value) => value !== "") && (
              <div className="flex flex-wrap gap-2">
                {locationFilter.country && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 flex items-center"
                  >
                    Country: {locationFilter.country}
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                      ×
                    </button>
                  </motion.div>
                )}
                {locationFilter.state && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 flex items-center"
                  >
                    State: {locationFilter.state}
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                      ×
                    </button>
                  </motion.div>
                )}
                {locationFilter.pickup && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 flex items-center"
                  >
                    Pickup: {locationFilter.pickup}
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                      ×
                    </button>
                  </motion.div>
                )}
              </div>
            )}
        </div>

        {/* Stats summary */}
        <div className="px-4 mt-2 text-sm text-gray-600">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium"
          >
            {filteredShipments.length}
          </motion.span>{" "}
          shipment{filteredShipments.length !== 1 ? "s" : ""} found
          {activeTab !== "all"
            ? ` with status: ${activeTab.replace("_", " ")}`
            : ""}
        </div>

        {/* Shipments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isTableLoaded ? 1 : 0,
            y: isTableLoaded ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="border border-gray-200 rounded-lg mx-4 overflow-hidden"
        >
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 h-4 w-4 accent-primary transition-all"
                      checked={selectedAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="py-4 text-center text-gray-500 font-medium"
                    colSpan="2"
                  >
                    Tracking ID
                  </th>

                  <th className="p-4 text-left text-gray-500 font-medium">
                    Est. Delivery
                    <span className="inline-block ml-1 text-gray-400">↑↓</span>
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Shipping Type
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Destination
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Recipient
                  </th>
                  <th className="p-4 text-center text-gray-500 font-medium">
                    Status
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment, index) => (
                    <motion.tr
                      key={shipment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 h-4 w-4 accent-primary transition-all"
                          checked={selectedShipments.includes(shipment._id)}
                          onChange={() => handleSelectShipment(shipment._id)}
                        />
                      </td>
                      <td
                        className="p-4 text-sm font-semibold text-left text-gray-800"
                        colSpan="2"
                      >
                        {shipment.sender.name}
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
                      <td className="p-4 text-sm text-center font-semibold">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            shipment.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : shipment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : shipment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "text-blue-800"
                          }`}
                        >
                          {getFormattedStatus(shipment.status)}
                        </span>
                      </td>
                      <td className="p-0 text-xs">
                        {/* Update Status Button - Only show if valid next statuses exist */}
                        {getNextStatusOptions(shipment).length > 0 && (
                          <button
                            onClick={() => handleUpdateStatusClick(shipment)}
                            className="bg-primary  hover:bg-primary-dark text-white p-2 rounded-lg transition-colors"
                          >
                            Update
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-400 relative">
                        <button
                          onClick={() => toggleDropdown(shipment._id)}
                          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Options"
                        >
                          <HiOutlineDotsHorizontal className="h-5 w-5" />
                        </button>

                        {/* Dropdown Menu with animation */}
                        <AnimatePresence>
                          {activeDropdown === shipment._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                <button
                                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                                  onClick={() =>
                                    handleViewDetails(shipment._id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  See Full Detail
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                                  onClick={() => {
                                    navigate(
                                      `/trackshipment?tracking=${shipment.trackingNumber}`
                                    );
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                  Track Shipment
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-300 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p>No shipments found matching the current filters.</p>
                        <button
                          onClick={() => {
                            setActiveTab("all");
                            setSearchQuery("");
                          }}
                          className="mt-4 text-primary hover:underline text-sm"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Shipment Cards */}
          <div className="md:hidden">
            {filteredShipments.length > 0 ? (
              <div className="space-y-4 p-4">
                {filteredShipments.map((shipment, index) => (
                  <motion.div
                    key={shipment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-left text-gray-800">
                          {shipment.trackingNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {shipment.recipient?.name || "N/A"}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(shipment._id)}
                          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
                        >
                          <HiOutlineDotsHorizontal className="h-5 w-5" />
                        </button>

                        {/* Dropdown for mobile */}
                        <AnimatePresence>
                          {activeDropdown === shipment._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                            >
                              <div className="py-1">
                                <button
                                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                                  onClick={() =>
                                    handleViewDetails(shipment._id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  See Full Detail
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                                  onClick={() => {
                                    navigate(
                                      `/trackshipment?tracking=${shipment.trackingNumber}`
                                    );
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                  Track Shipment
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            shipment.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : shipment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : shipment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getFormattedStatus(shipment.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Destination:</span>
                        <span className="ml-2 font-medium">
                          {getDestination(shipment)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Pickup:</span>
                        <span className="ml-2 font-medium">
                          {formatDate(shipment.pickup?.date)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Delivery:</span>
                        <span className="ml-2 font-medium">
                          {formatDate(shipment.delivery?.estimatedDate)}
                        </span>
                      </div>
                    </div>

                    {getNextStatusOptions(shipment).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleUpdateStatusClick(shipment)}
                          className="w-full py-2 bg-primary-50 hover:bg-primary-100 text-primary rounded-md text-sm transition-colors font-medium"
                        >
                          Update Status
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p>No shipments found matching the current filters.</p>
                  <button
                    onClick={() => {
                      setActiveTab("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 text-primary hover:underline text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredShipments.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600 mb-4 sm:mb-0">
                <span className="mr-2">Rows per page:</span>
                <div className="relative">
                  <select className="appearance-none bg-transparent pl-2 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-4 text-sm text-gray-600">
                  {filteredShipments.length > 0
                    ? `1-${Math.min(filteredShipments.length, 10)} of ${
                        filteredShipments.length
                      }`
                    : "0 of 0"}
                </div>
                <div className="flex space-x-1">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 disabled:opacity-50 transition-colors"
                    disabled
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 disabled:opacity-50 transition-colors"
                    disabled
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {isStatusModalOpen && selectedShipment && (
          <Modal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            type="warning"
            title="Update Shipment Status"
            message={`Update status for shipment ${selectedShipment.trackingNumber}?`}
            buttons={[
              {
                label: "Cancel",
                onClick: () => setIsStatusModalOpen(false),
                variant: "secondary",
              },
              {
                label: updateStatusLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  "Update Status"
                ),
                onClick: handleUpdateStatus,
                variant: "primary",
                disabled: !newStatus || updateStatusLoading,
              },
            ]}
          >
            <StatusSelector />
          </Modal>
        )}
      </AnimatePresence>

      {/* Pending Payment Modal */}
      <AnimatePresence>
        {isPendingPayment && (
          <Modal
            isOpen={isPendingPayment}
            onClose={() => setIsPendingPayment(false)}
            type="warning"
            title="Payment Action Required"
            message={`Please approve this cash payment first before proceeding with updating status`}
            buttons={[
              {
                label: "Go to Pending Payments",
                onClick: () => navigate("/admin/pending-payments"),
                variant: "primary",
              },
            ]}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export { ShipmentTrackMgt };
