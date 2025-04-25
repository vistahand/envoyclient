import React, { useState, useEffect } from "react";
import LocationSelectorFilter from "../../components/LocationSelectorMgt";
import { ShipmentTrackMgt } from "../../components/ShipmentTrackMgt";
import { shipments as shipmentEndpoint } from "../../services/api";
// Updated main ShipmentMgt component
const ShipmentMgt = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredShipments, setFilteredShipments] = useState([]);

  const [locationFilter, setLocationFilter] = useState({
    country: "",
    state: "",
    pickup: "",
  });

  // Handler to update filters from LocationSelectorMgt
  const handleFilterChange = (filter) => {
    console.log("Filter changed in parent:", filter);
    setLocationFilter(filter);
  };

  // Fetch shipments from API
  const fetchShipments = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await shipmentEndpoint.getAll();
      const data = res.data.shipments;
      if (data && Array.isArray(data)) {
        setShipments(data);
        setFilteredShipments(data);
      } else {
        setShipments([]);
        setFilteredShipments([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of shipments
  useEffect(() => {
    fetchShipments();
  }, []);

  // Handler to reset filters
  const handleResetFilters = () => {
    setLocationFilter({
      country: "",
      state: "",
      pickup: "",
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
      </div>

      {/* Location Selector Management Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filter Shipments</h3>
          {Object.values(locationFilter).some((val) => val !== "") && (
            <button
              onClick={handleResetFilters}
              className="text-primary text-sm hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
        <LocationSelectorFilter
          onFilterChange={handleFilterChange}
          shipments={shipments}
        />
      </div>

      {/* Shipment Table with location filtering */}
      <div>
        <ShipmentTrackMgt
          locationFilter={locationFilter}
          shipments={shipments}
          error={error}
          loading={loading}
          filteredShipment={filteredShipments}
          fetchShipments={fetchShipments}
        />
      </div>
    </div>
  );
};

export default ShipmentMgt;
