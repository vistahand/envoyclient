import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationSelectorMgt from "../../components/LocationSelectorMgt";
import { ShipmentTrackMgt } from "../../components/ShipmentTrackMgt";

// Updated main ShipmentMgt component
const ShipmentMgt = () => {
  const navigate = useNavigate();
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
        <LocationSelectorMgt onFilterChange={handleFilterChange} />
      </div>

      {/* Shipment Table with location filtering */}
      <div>
        <ShipmentTrackMgt locationFilter={locationFilter} />
      </div>
    </div>
  );
};

export default ShipmentMgt;