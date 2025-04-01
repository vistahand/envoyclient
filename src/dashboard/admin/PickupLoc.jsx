import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import LocationSelector from "../../components/LocationSelector";
import TabsAndSearch from "../../components/TabsAndSearch";
import PickupLocationCard from "../../components/PickupLocationCard";
import CreatePickupLocation from "./CreatePickupLocation"; // Import the form component

const PickupLoc = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [creating, setCreating] = useState(false); // Track if user is creating a new location

  const locations = [
    {
      name: "Dublin 248 Metropolis Pickup Station",
      address: "No. 5 Ansel Jump Street, Fransz Avenue, Dublin, Ireland 182917",
      phone: "0800 123 5689, 0811 234 5909",
      days: "Mon - Fri (9AM - 6PM)",
      shippingTypes: ["Standard Parcels", "Bulk shipping"],
    },
    {
      name: "Dublin 248 Metropolis Pickup Station",
      address: "No. 5 Ansel Jump Street, Fransz Avenue, Dublin, Ireland 182917",
      phone: "0800 123 5689, 0811 234 5909",
      days: "Mon - Sat (9AM - 6PM)",
      shippingTypes: ["Standard Parcels", "Bulk shipping", "Large Container"],
    },
    {
      name: "Dublin 248 Metropolis Pickup Station",
      address: "No. 5 Ansel Jump Street, Fransz Avenue, Dublin, Ireland 182917",
      phone: "0800 123 5689, 0811 234 5909",
      days: "Mon - Fri (9AM - 6PM)",
      shippingTypes: ["Standard Parcels", "Bulk shipping", "Small container"],
    },
  ];

  return (
    <div>
      {creating ? (
        // Show CreatePickupLocation if user is in creation mode
        <CreatePickupLocation onBack={() => setCreating(false)} />
      ) : (
        // Default Pickup Locations List
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center w-full pb-4">
            <div>
              <h2 className="text-[22px] font-semibold text-primary">Pickup Locations</h2>
              <p className="text-[15px] text-gray-600">
                Manage and update all available and operating pickup stations here
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

          {/* Location Selector */}
          <LocationSelector />

          {/* Tabs and Search Component */}
          <TabsAndSearch activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Pickup Locations List */}
          <div className="space-y-4 mt-5">
            {locations.map((location, index) => (
              <PickupLocationCard key={index} {...location} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PickupLoc;
