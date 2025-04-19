import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { format, parse } from "date-fns";
import LocationSelector from "../../components/LocationSelector";
import Modal from "../../components/Modal";

const CreatePickupLocation = ({ onBack, onNavigateToView }) => {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    contactInfo: {
      phone: "",
      email: ""
    },
    operatingHours: {
      monday: { open: "", close: "", isOpen: true },
      tuesday: { open: "", close: "", isOpen: true },
      wednesday: { open: "", close: "", isOpen: true },
      thursday: { open: "", close: "", isOpen: true },
      friday: { open: "", close: "", isOpen: true },
      saturday: { open: "", close: "", isOpen: true },
      sunday: { open: "", close: "", isOpen: false }
    },
    active: true,
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdLocationId, setCreatedLocationId] = useState(null);

  // Get token from localStorage and remove quotes if they exist
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token ? token.replace(/^"|"$/g, '') : '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      if (name === "active") {
        setFormData((prev) => ({ ...prev, active: checked }));
        return;
      }
      
      if (name.startsWith("operatingHours.")) {
        const day = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          operatingHours: {
            ...prev.operatingHours,
            [day]: {
              ...prev.operatingHours[day],
              isOpen: checked
            }
          }
        }));
        return;
      }
    }

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child, subField] = name.split(".");
      
      if (parent === "operatingHours" && (subField === "open" || subField === "close")) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subField]: value
            }
          }
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
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
          state: origin.state || ""
        }
      }));
      setLocationSelected(!!origin.country && !!origin.state);
    }
  };

  // Format operating hours for API submission
  const formatOperatingHoursForSubmission = () => {
    const formattedHours = {};
    
    Object.entries(formData.operatingHours).forEach(([day, hours]) => {
      if (hours.isOpen) {
        if (hours.open && hours.close) {
          formattedHours[day] = `${hours.open} - ${hours.close}`;
        } else {
          formattedHours[day] = ""; // Empty string for incomplete hours
        }
      } else {
        formattedHours[day] = "Closed";
      }
    });
    
    return formattedHours;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.address.state) {
      setError("State is required");
      return;
    }
    
    if (!formData.contactInfo.phone) {
      setError("Contact phone is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      // Format the data for submission
      const submissionData = {
        ...formData,
        operatingHours: formatOperatingHoursForSubmission()
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pickup-locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create pickup location');
      }

      const data = await response.json();
      setSuccess(true);
      setCreatedLocationId(data._id || data.id);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the pickup location');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLocation = () => {
    setShowSuccessModal(false);
    if (typeof onNavigateToView === 'function') {
      onNavigateToView(createdLocationId);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setFormData({
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      },
      contactInfo: {
        phone: "",
        email: ""
      },
      operatingHours: {
        monday: { open: "", close: "", isOpen: true },
        tuesday: { open: "", close: "", isOpen: true },
        wednesday: { open: "", close: "", isOpen: true },
        thursday: { open: "", close: "", isOpen: true },
        friday: { open: "", close: "", isOpen: true },
        saturday: { open: "", close: "", isOpen: true },
        sunday: { open: "", close: "", isOpen: false }
      },
      active: true,
      notes: ""
    });
    setLocationSelected(false);
  };

  const handleBackToList = () => {
    setShowSuccessModal(false);
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  // Time options for dropdowns
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '30']) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
        const time12 = format(parse(time24, 'HH:mm', new Date()), 'h:mm a');
        options.push({ value: time12, label: time12 });
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();

  return (
    <div className="w-full mx-auto p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Create Pickup Location</h2>
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
          {!locationSelected && 
            <p className="text-sm text-amber-600 mt-2">Please select both country and state</p>
          }
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
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
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center w-32">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      name={`operatingHours.${day}`}
                      checked={formData.operatingHours[day].isOpen}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor={`day-${day}`} className="capitalize text-sm font-medium">{day}</label>
                  </div>
                  
                  {formData.operatingHours[day].isOpen ? (
                    <div className="flex flex-1 flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">From:</span>
                        <select
                          name={`operatingHours.${day}.open`}
                          value={formData.operatingHours[day].open}
                          onChange={handleChange}
                          className="border p-2 rounded-lg text-sm"
                          required={formData.operatingHours[day].isOpen}
                        >
                          <option value="">Select time</option>
                          {timeOptions.map(option => (
                            <option key={`${day}-open-${option.value}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm mx-2">To:</span>
                        <select
                          name={`operatingHours.${day}.close`}
                          value={formData.operatingHours[day].close}
                          onChange={handleChange}
                          className="border p-2 rounded-lg text-sm"
                          required={formData.operatingHours[day].isOpen}
                        >
                          <option value="">Select time</option>
                          {timeOptions.map(option => (
                            <option key={`${day}-close-${option.value}`} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Closed</span>
                  )}
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
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Location is active and available for pickups
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                rows="3"
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
            (loading || !locationSelected) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Pickup Location'}
        </button>
      </form>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Pickup Location Created"
        message={`"${formData.name}" has been successfully created and is now available in the system.`}
        buttons={[
          {
            label: "Create Another",
            onClick: handleCreateAnother,
            variant: "secondary"
          },
          {
            label: "Back to List",
            onClick: handleBackToList,
            variant: "secondary"
          }
        ]}
      />
    </div>
  );
};

export default CreatePickupLocation;