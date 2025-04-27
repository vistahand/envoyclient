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

  // Extract data from the location object
  const { name, address, contactPhone, operatingHours, isActive, _id } =
    location;

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

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
              disabled={isDeleting}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <FiMoreHorizontal className="text-gray-500 text-xl cursor-pointer" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {/* You can uncomment this when ready to implement edit functionality */}
                  {/* <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      setShowDropdown(false);
                      // You can add edit functionality here
                    }}
                  >
                    <FiEdit /> Edit
                  </button> */}
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
    </>
  );
};

export default PickupLocationCard;
