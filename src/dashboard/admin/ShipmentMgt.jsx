import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import LocationSelectorMgt from "../../components/LOcationSelectorMgt";
import ShipmentTrackMgt from "../../components/ShipmentMgt";

const ShipmentMgt = () => {
  const [creating, setCreating] = useState(false); // Initialize state for creating mode

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
          onClick={() => setCreating(true)} // Switch to create mode
          className="bg-primary text-white flex items-center justify-center gap-3 rounded-lg md:rounded-xl transition-all cursor-pointer 
                     px-2.5 py-2.5 md:px-6 md:py-3 text-[13px] md:text-[14px] ss:text-[15px] md:w-auto ss:w-[27%] sm:w-10 sm:h-10"
        >
          <span className="hidden md:block">Create New</span>
          <GoPlus className="text-[20px]" />
        </button>
      </div>

      {/* Location Selector Management Section */}
      <div>
        <LocationSelectorMgt />
      </div>
      <div>
        {/* Add ShipmentTable component here */}
        <ShipmentTrackMgt />
      </div>
    </div>
  );
};

export default ShipmentMgt;
