import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import LocationSelector from "../../components/LocationSelector";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";

const CreatePickupLocation = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    contactInfo: {
      phone: "",
      email: "",
    },
    operatingHours: {
      monday: {
        start: "",
        end: "",
      },
      tuesday: {
        start: "",
        end: "",
      },
      wednesday: {
        start: "",
        end: "",
      },
      thursday: {
        start: "",
        end: "",
      },
      friday: {
        start: "",
        end: "",
      },
      saturday: {
        start: "",
        end: "",
      },
      sunday: {
        start: "",
        end: "",
      },
    },
    active: true,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get token from localStorage and remove quotes if they exist
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? token.replace(/^"|"$/g, "") : "";
  };

  // Format time from 24h to 12h with AM/PM
  const formatTime = (time) => {
    if (!time) return "";

    // Parse the time string (assuming format: HH:MM)
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);

    // Convert to 12-hour format with AM/PM
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM

    return `${hour12}:${minutes} ${period}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "active") {
      setFormData((prev) => ({ ...prev, active: checked }));
      return;
    }

    // Handle operating hours
    if (name.includes("operatingHours")) {
      const [_, day, timeType] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: {
            ...prev.operatingHours[day],
            [timeType]: value,
          },
        },
      }));
      return;
    }

    // Handle other nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelection = ({ origin }) => {
    if (origin) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          country: origin.country || "",
          state: origin.state || "",
        },
      }));
      setLocationSelected(!!origin.country && !!origin.state);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if state is selected

    if (!formData.address.state) {
      setError("State is required");
      return;
    }

    if (!formData.contactInfo.phone) {
      setError("Contact phone is required");
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      // Format operating hours as "9:00 AM - 10:00 PM" strings
      operatingHours: Object.keys(formData.operatingHours).reduce(
        (acc, day) => {
          if (
            formData.operatingHours[day].start !== "" &&
            formData.operatingHours[day].end !== ""
          ) {
            const { start, end } = formData.operatingHours[day];
            acc[day] = `${formatTime(start)} - ${formatTime(end)}`;
            return acc;
          } else {
            acc[day] = "";
            return acc;
          }
        },
        {}
      ),
    };

    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/pickup-locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create pickup location"
        );
      }

      await response.json();
      setShowSuccessModal(true);
      setFormData({
        name: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        contactInfo: {
          phone: "",
          email: "",
        },
        operatingHours: {
          monday: {
            start: "",
            end: "",
          },
          tuesday: {
            start: "",
            end: "",
          },
          wednesday: {
            start: "",
            end: "",
          },
          thursday: {
            start: "",
            end: "",
          },
          friday: {
            start: "",
            end: "",
          },
          saturday: {
            start: "",
            end: "",
          },
          sunday: {
            start: "",
            end: "",
          },
        },
        active: true,
        notes: "",
      });
      toast.success("Pickup Location created");
      // Reset form or redirect if needed
    } catch (err) {
      setError(
        err.message || "An error occurred while creating the pickup location"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    if (typeof onBack === "function") {
      onBack();
    }
  };

  const handleBackToList = () => {
    setShowSuccessModal(false);
    if (typeof onBack === "function") {
      onBack();
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">
          Create Pickup Location
        </h2>
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <AiOutlineArrowLeft className="mr-2 text-lg" /> Go back
        </button>
      </div>
      <p className="text-sm md:text-base text-gray-600">
        Create a new pickup location for users to drop-off parcels and packages.
      </p>

      {/* Display success or error messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Location Selector */}
        <div className="mb-6">
          <LocationSelector onSelection={handleLocationSelection} />
          {!locationSelected && (
            <p className="text-sm text-amber-600 mt-2">
              Please select both country and state
            </p>
          )}
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter pickup location name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg text-sm md:text-base"
            />
          </div>

          {/* Address Fields */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-3">Address Information</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="address.street"
                placeholder="Street Address"
                value={formData.address.street}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg text-sm md:text-base"
                />
                <input
                  type="text"
                  name="address.zipCode"
                  placeholder="Zip/Postal Code"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="tel"
                name="contactInfo.phone"
                placeholder="Phone Number"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <input
                type="email"
                name="contactInfo.email"
                placeholder="Email Address"
                value={formData.contactInfo.email}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
            </div>
          </div>

          {/* Operating Hours - Calendar Style */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium mb-3">Operating Hours</h3>
            <div className="space-y-3">
              {Object.keys(formData.operatingHours).map((day) => (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  <label className="w-24 capitalize text-sm">{day}:</label>
                  <div className="flex flex-row items-center space-x-2">
                    <input
                      type="time"
                      name={`operatingHours.${day}.start`}
                      value={formData.operatingHours[day].start}
                      onChange={handleChange}
                      className="border p-2 rounded-lg text-sm"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      name={`operatingHours.${day}.end`}
                      value={formData.operatingHours[day].end}
                      onChange={handleChange}
                      className="border p-2 rounded-lg text-sm"
                    />
                    {formData.operatingHours[day].start &&
                      formData.operatingHours[day].end && (
                        <span className="text-sm text-gray-500">
                          ({formatTime(formData.operatingHours[day].start)} -{" "}
                          {formatTime(formData.operatingHours[day].end)})
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status and Notes */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="mr-2 h-4 w-4"
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-gray-700"
              >
                Location is active and available for pickups
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                rows="3"
                required
                placeholder="Add any additional information about this pickup location"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !locationSelected}
          className={`mt-6 w-full md:w-[30%] bg-primary text-white p-3 rounded-lg text-lg ${
            loading || !locationSelected ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Pickup Location"}
        </button>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Pickup Location Created"
        message={`A new Pickup Location has been successfully created and is now available in the system.`}
        buttons={[
          {
            label: "Close",
            onClick: () => setShowSuccessModal(false),
            variant: "secondary",
          },
          {
            label: "Back to List",
            onClick: handleBackToList,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
};

export default CreatePickupLocation;
