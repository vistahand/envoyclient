import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import LocationSelector from "../../components/LocationSelector";

const CreatePickupLocation = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactPhone: "",
    alternatePhone: "",
    operatingDays: "",
    operatingHours: "",
    shippingTypes: [],
    country: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        shippingTypes: checked
          ? [...prev.shippingTypes, value]
          : prev.shippingTypes.filter((type) => type !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (country, state) => {
    setFormData((prev) => ({ ...prev, country, state }));
  };

  return (
    <div className="w-full  mx-auto p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Create Pickup Location</h2>
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
          <AiOutlineArrowLeft className="mr-2 text-lg" /> Go back
        </button>
      </div>
      <p className="text-sm md:text-base text-gray-600">
        Create a new pickup location for users to drop-off parcels and packages.
      </p>

      {/* Location Selector */}
      <LocationSelector onLocationChange={handleLocationChange} />

      {/* Form */}
      <div className="mt-6 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Enter pickup location name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-sm md:text-base"
        />
        <input
          type="text"
          name="address"
          placeholder="Enter pickup location address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg text-sm md:text-base"
        />

        {/* Phone Number Inputs (Stacked on small screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="contactPhone"
            placeholder="Enter contact phone number"
            value={formData.contactPhone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm md:text-base"
          />
          <input
            type="text"
            name="alternatePhone"
            placeholder="Enter alternate phone number (optional)"
            value={formData.alternatePhone}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm md:text-base"
          />
        </div>

        {/* Operating Days & Hours (Stacked on small screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="operatingDays"
            placeholder="Select operating days"
            value={formData.operatingDays}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm md:text-base"
          />
          <input
            type="text"
            name="operatingHours"
            placeholder="Select operating hours"
            value={formData.operatingHours}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg text-sm md:text-base"
          />
        </div>

        {/* Shipping Types (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm md:text-base">
          {["Standard Parcels", "Bulk Shipping", "Small container", "Large container"].map((type) => (
            <label key={type} className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="shippingTypes"
                value={type}
                checked={formData.shippingTypes.includes(type)}
                onChange={handleChange}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button (Full Width on Small Screens) */}
      <button
        className="mt-6 w-full md:w-[30%] bg-primary text-white p-3 rounded-lg text-lg"
        onClick={() => alert("Pickup Location Created")}
      >
        Create
      </button>
    </div>
  );
};

export default CreatePickupLocation;
