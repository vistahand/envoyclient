import React, { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal, HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Modal from "../components/Modal";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch (error) {
    return "Invalid Date";
  }
};

// Logistics status progression order - for reference only
const statusProgression = [
  "draft",
  "pending",
  "payment_confirmed",
  "awaiting_processing",
  "processed",
  "awaiting_pickup",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

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

// Optimized ShipmentTrackMgt component with improved API integration
const ShipmentTrackMgt = ({
  locationFilter,
  shipments,
  loading,
  error,
  filteredShipment,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [filteredShipments, setFilteredShipments] = useState(filteredShipment);

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Status update modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [isPendingPayment, setIsPendingPayment] = useState(false);

  // Status mapping for tabs
  const statusMappings = {
    all: [], // Show all shipments
    active: [
      "processed",
      "payment_confirmed",
      "awaiting_pickup",
      "in_transit",
      "out_for_delivery",
    ],
    delivered: ["delivered"],
    pending: ["awaiting_processing", "draft", "pending"],
  };

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

  // Get shipping status with better formatting
  const getFormattedStatus = (status) => {
    if (!status) return "Unknown";

    // Convert snake_case to Title Case
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
    if (shipment.payment.method === "cash_on_pickup") {
      if (!shipment.payment.paidAt) {
        setIsPendingPayment(true);
      } else {
        setIsStatusModalOpen(true);
      }
    } else {
      setIsStatusModalOpen(true);
    }
  };

  // Handle updating the shipment status - UPDATED to use the API service
  const handleUpdateStatus = async () => {
    if (!selectedShipment || !newStatus) return;

    setUpdateStatusLoading(true);

    try {
      // Use the shipments API endpoint instead of direct fetch
      await shipmentEndpoint.updateShipmentStatus(selectedShipment._id, {
        status: newStatus,
      });

      // Update local state
      const updatedShipments = shipments.map((shipment) => {
        if (shipment._id === selectedShipment._id) {
          return { ...shipment, status: newStatus };
        }
        return shipment;
      });

      setShipments(updatedShipments);
      setIsStatusModalOpen(false);
      setSelectedShipment(null);

      // Log success
      console.log(`Status updated to ${getFormattedStatus(newStatus)}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      setError(`Failed to update status: ${err.message}`);
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

  if (loading) {
    return <div className="w-full text-center py-8">Loading shipments...</div>;
  }

  if (error) {
    return (
      <div className="w-full text-center py-8 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col space-y-4">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            className={`pb-2 ${
              activeTab === "all"
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("all")}
          >
            All Shipments
          </button>
          <button
            className={`pb-2 ${
              activeTab === "active"
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("active")}
          >
            Active
          </button>
          <button
            className={`pb-2 ${
              activeTab === "delivered"
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("delivered")}
          >
            Delivered
          </button>
          <button
            className={`pb-2 ${
              activeTab === "pending"
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("pending")}
          >
            Pending
          </button>
          <button
            className={`pb-2 ${
              activeTab === "payment_confirmed"
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("payment_confirmed")}
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
        {locationFilter &&
          Object.values(locationFilter).some((value) => value !== "") && (
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
          <span className="font-medium">{filteredShipments.length}</span>{" "}
          shipment{filteredShipments.length !== 1 ? "s" : ""} found
          {activeTab !== "all"
            ? ` with status: ${activeTab.replace("_", " ")}`
            : ""}
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
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Tracking ID
                  </th>
                  <th className="p-4 text-left text-gray-500 font-medium">
                    Pickup Date
                    <span className="inline-block ml-1 text-gray-400">↑↓</span>
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
                  <th
                    className="p-4 text-left text-gray-500 font-medium"
                    colSpan="2"
                  >
                    Status
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((shipment) => (
                    <tr
                      key={shipment._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
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
                      <td className="p-0 text-xs">
                        {/* Update Status Button - Only show if valid next statuses exist */}
                        {getNextStatusOptions(shipment).length > 0 && (
                          <button
                            // disabled={isPendingPayment}
                            onClick={() => handleUpdateStatusClick(shipment)}
                            className="text-primary hover:text-primary-dark hover:underline"
                          >
                            Update Status
                          </button>
                        )}
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
                                  navigate(
                                    `/trackshipment?tracking=${shipment.trackingNumber}`
                                  );
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
                    <td colSpan="10" className="p-4 text-center text-gray-500">
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
                ? `1-${Math.min(filteredShipments.length, 10)} of ${
                    filteredShipments.length
                  }`
                : "0 of 0"}
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

      {/* Status Update Modal */}
      {selectedShipment && (
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
              label: updateStatusLoading ? "Updating..." : "Update Status",
              onClick: handleUpdateStatus,
              variant: "primary",
              disabled: !newStatus || updateStatusLoading,
            },
          ]}
        >
          <StatusSelector />
        </Modal>
      )}
      {isPendingPayment && (
        <Modal
          isOpen={isPendingPayment}
          onClose={() => setIsPendingPayment(false)}
          type="warning"
          title="Sorry, missed Your way"
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
    </div>
  );
};

export { ShipmentTrackMgt };
