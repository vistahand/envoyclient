import React, { useState } from "react";
import { FiMoreHorizontal, FiTrash2, FiEdit } from "react-icons/fi";
import { MdOutlineWarehouse } from "react-icons/md";
import Modal from "../components/Modal"; // Import the Modal component
import { pickup } from "../services/api";
import toast from "react-hot-toast";

const PickupLocationCard = ({ location, onRefresh }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Extract data from the location object
  const {
    name,
    address,
    contactPhone,
    contactEmail,
    operatingHours,
    isActive,
    _id,
  } = location;

  // Format address if it exists
  const formattedAddress = address
    ? `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
    : "No address available";

  // Format operating hours for display
  const formatOperatingHours = () => {
    if (!operatingHours) return "Hours not available";

    // Get a sample of operating hours to display
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const openDays = daysOfWeek.filter((day) => operatingHours[day]);

    if (openDays.length === 0) return "No operating hours set";
    if (openDays.length === 7) {
      const mondayHours = operatingHours.monday;
      return `Open daily: ${mondayHours.open} - ${mondayHours.close}`;
    }

    return `Open ${openDays.length} days/week`;
  };

  // Mock shipping types (as they're not in your API response)
  const shippingTypes = ["Standard Delivery"];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Initiate delete process
  const initiateDelete = () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  // Initiate edit process
  const initiateEdit = () => {
    setShowDropdown(false);

    // Format operating hours data
    const formattedHours = {};
    if (operatingHours) {
      Object.keys(operatingHours).forEach((day) => {
        // Handle both object format {open, close} and string format "9:00 AM - 5:00 PM"
        if (
          typeof operatingHours[day] === "object" &&
          operatingHours[day] !== null
        ) {
          const open = operatingHours[day].open || "";
          const close = operatingHours[day].close || "";
          formattedHours[day] = open && close ? `${open} - ${close}` : "";
        } else {
          formattedHours[day] = operatingHours[day] || "";
        }
      });
    }

    // Initialize the edit form with the current location data
    setEditForm({
      name: name || "",
      address: {
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zipCode || "",
        country: address?.country || "",
      },
      contactInfo: {
        phone: contactPhone || "",
        email: contactEmail || "",
      },
      notes: location.notes || "",
      operatingHours: formattedHours || {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
      },
      active: isActive,
    });

    setShowEditModal(true);
  };

  // Delete functionality
  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    setShowDeleteModal(false);

    try {
      const data = await pickup.deletePickupLocation(_id);

      if (data.status === false) {
        toast.error("Failed to delete pickup location");
      }

      // Call the refresh function to update the list
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Error deleting pickup location:", err);
      setDeleteError(err.message);
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested properties like address.street or contactInfo.phone
      const [parent, child] = name.split(".");
      setEditForm((prevForm) => ({
        ...prevForm,
        [parent]: {
          ...prevForm[parent],
          [child]: value,
        },
      }));
    } else if (name.includes("_")) {
      // Handle operating hours
      const [day, period] = name.split("_");
      const currentHours = editForm.operatingHours[day] || "";
      const parts = currentHours.split(" - ");

      let newHoursValue;
      if (period === "open") {
        // If open time is being updated
        newHoursValue = `${value}${parts[1] ? `arts[1]}` : ""}`;
      } else {
        // If close time is being updated
        newHoursValue = `${parts[0] ? `${parts[0]} - ` : ""}${value}`;
      }

      // Ensure we don't save just " - " when both values are empty
      if (newHoursValue === " - " || (!value && !parts[0] && !parts[1])) {
        neValue = "";
      }

      setEditForm((prevForm) => ({
        ...prevForm,
        operatingHours: {
          ...prevForm.operatingHours,
          [day]: newHoursValue,
        },
      }));
    } else {
      // Handle top-level properties
      setEditForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  // Helper function to extract open/close time from formatted hour string
  const getTimeFromHourString = (hourString, type) => {
    if (!hourString || typeof hourString !== "string") return "";

    // Handle format like "9:00 AM - 5:00 PM"
    if (hourString.includes(" - ")) {
      const parts = hourString.split(" - ");
      return type === "open" ? parts[0] || "" : parts[1] || "";
    }

    // Handle object format if somehow passed through
    if (typeof hourString === "object" && hourString !== null) {
      return type === "open" ? hourString.open || "" : hourString.close || "";
    }

    // Return empty string for unrecognized formats
    return "";
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    setIsEditing(true);

    try {
      // Submit with the correct format for the API
      await pickup.updatePickupLocation(_id, editForm);
      toast.success("Pickup location updated successfully");
      setShowEditModal(false);

      // Call the refresh function to update the list
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Error updating pickup location:", err);
      toast.error("Failed to update pickup location");
    } finally {
      setIsEditing(false);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Toggle active status
  const handleActiveChange = (e) => {
    setEditForm((prevForm) => ({
      ...prevForm,
      active: e.target.checked,
    }));
  };

  return (
    <>
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Top Section (Icon & Details) - Mobile & Desktop */}
        <div className="flex items-start sm:items-center gap-4">
          <MdOutlineWarehouse className="text-2xl md:text-3xl text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-[16px] md:text-lg">
                {name}
              </h3>
              {isActive ? (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  Unavailable
                </span>
              )}
            </div>
            <p className="text-gray-600 text-[14px] md:text-sm">
              {formattedAddress}
            </p>
            <p className="font-semibold text-gray-900 text-[14px] md:text-sm">
              {contactPhone}
            </p>
          </div>
        </div>

        {/* Horizontal Divider for Mobile */}
        <div className="border-t border-gray-300 my-3 md:hidden"></div>

        {/* Middle Section - Operating Hours (Mobile & Desktop) */}
        <p className="text-gray-700 text-[14px] md:text-sm">
          {formatOperatingHours()}
        </p>

        {/* Horizontal Divider for Mobile */}
        <div className="border-t border-gray-300 my-3 md:hidden"></div>

        {/* Bottom Section - Shipping Types & More Icon */}
        <div className="flex justify-between items-center md:gap-6">
          {/* Shipping Types */}
          <div className="text-[14px] md:text-sm text-gray-700">
            {shippingTypes.map((type, index) => (
              <p key={index}>{type}</p>
            ))}
          </div>

          {/* More Options Icon - Dropdown menu */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              disabled={isDeleting || isEditing}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <FiMoreHorizontal className="text-gray-500 text-xl cursor-pointer" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={initiateEdit}
                    disabled={isEditing}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    onClick={initiateDelete}
                    disabled={isDeleting}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        type="warning"
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${name}" pickup location? This action cannot be undone.`}
        buttons={[
          {
            label: "Delete",
            onClick: handleDelete,
            variant: "danger",
          },
          {
            label: "Cancel",
            onClick: () => setShowDeleteModal(false),
            variant: "secondary",
          },
        ]}
      />

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="error"
        title="Deletion Failed"
        message={
          deleteError || "An error occurred while deleting the pickup location."
        }
        buttons={[
          {
            label: "OK",
            onClick: () => setShowErrorModal(false),
            variant: "primary",
          },
        ]}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        type="info"
        title="Edit Pickup Location"
        message={
          <div className="mt-4 space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                name="name"
                value={editForm.name || ""}
                onChange={handleEditFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Address Fields */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address.street"
                placeholder="Street"
                value={editForm.address?.street || ""}
                onChange={handleEditFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={editForm.address?.city || ""}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="address.state"
                  placeholder="State"
                  value={editForm.address?.state || ""}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="address.zipCode"
                  placeholder="Zip Code"
                  value={editForm.address?.zipCode || ""}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="address.country"
                  placeholder="Country"
                  value={editForm.address?.country || ""}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <input
                type="tel"
                name="contactInfo.phone"
                placeholder="Phone"
                value={editForm.contactInfo?.phone || ""}
                onChange={handleEditFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <input
                type="email"
                name="contactInfo.email"
                placeholder="Email"
                value={editForm.contactInfo?.email || ""}
                onChange={handleEditFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Operating Hours */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Operating Hours
              </label>
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <div key={day} className="flex  flex-col items-start gap-y-2">
                  <span className="text-sm w-24 capitalize">{day}:</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name={`${day}_open`}
                      placeholder="Open (e.g. 9:00 AM)"
                      value={getTimeFromHourString(
                        editForm.operatingHours?.[day],
                        "open"
                      )}
                      onChange={handleEditFormChange}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                    />
                    <span className="text-sm">to</span>
                    <input
                      type="text"
                      name={`${day}_close`}
                      placeholder="Close (e.g. 5:00 PM)"
                      value={getTimeFromHourString(
                        editForm.operatingHours?.[day],
                        "close"
                      )}
                      onChange={handleEditFormChange}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={editForm.active || false}
                onChange={handleActiveChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm text-gray-900"
              >
                Location is active and available
              </label>
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                name="notes"
                placeholder="Add any additional information about this location"
                value={editForm.notes || ""}
                onChange={handleEditFormChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        }
        buttons={[
          {
            label: isEditing ? "Updating..." : "Save Changes",
            onClick: handleEditSubmit,
            variant: "primary",
            disabled: isEditing,
          },
          {
            label: "Cancel",
            onClick: () => setShowEditModal(false),
            variant: "secondary",
          },
        ]}
      />
    </>
  );
};

export default PickupLocationCard;
