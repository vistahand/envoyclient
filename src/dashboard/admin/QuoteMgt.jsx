import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineSave,
  AiOutlinePlus,
} from "react-icons/ai";
import Modal from "../../components/Modal"; // Update this path based on your project structure

const QuoteMgt = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    vatRate: 0.075,
    baseRateInternational: 20,
    baseRateLocal: 10,
    insuranceRateBasic: 0.01,
    insuranceRatePremium: 0.02,
  });

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [savingRates, setSavingRates] = useState(false);
  const [savingDeliveryOption, setSavingDeliveryOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "info", // success, error, warning, info
    title: "",
    message: "",
    buttons: [],
    optionIdToDelete: null, // Additional state to track which option to delete
  });

  const [newOption, setNewOption] = useState({
    name: "",
    description: "Standard delivery option",
    estimatedDeliveryTime: "3-5 days",
    percentageMarkup: 0,
    isExpress: false,
    daysToAdd: 3,
    active: true,
  });

  // Function to get auth token
  const getAuthToken = () => {
    // Get token from localStorage or wherever you store it
    return localStorage.getItem("authToken");
  };

  // Modal helper functions
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const showModal = (type, title, message, buttons = []) => {
    setModalState({
      isOpen: true,
      type,
      title,
      message,
      buttons,
      optionIdToDelete: null,
    });
  };

  // Fetch shipping rates from API
  const fetchShippingRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/shipping-rates`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch shipping rates");
      }

      const data = await response.json();

      if (data.success && data.data && data.data.rates) {
        const { rates } = data.data;

        // Update formData with rates from API
        setFormData({
          vatRate: rates.vatRate,
          baseRateInternational: rates.baseRateInternational,
          baseRateLocal: rates.baseRateLocal,
          insuranceRateBasic: rates.insuranceRateBasic,
          insuranceRatePremium: rates.insuranceRatePremium,
        });
      }
    } catch (err) {
      console.error("Error fetching shipping rates:", err);
      setError(err.message);
    }
  };

  // Fetch delivery options from API
  const fetchDeliveryOptions = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delivery-options`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch delivery options"
        );
      }

      const data = await response.json();

      if (data.success && data.data && data.data.deliveryOptions) {
        setDeliveryOptions(data.data.deliveryOptions);
      }
    } catch (err) {
      console.error("Error fetching delivery options:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    const loadAllData = async () => {
      await fetchShippingRates();
      await fetchDeliveryOptions();
    };

    loadAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleNewOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    let parsedValue;

    if (type === "checkbox") {
      parsedValue = checked;
    } else if (type === "number") {
      parsedValue = parseFloat(value);
    } else {
      parsedValue = value;
    }

    setNewOption((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const validateNewOption = () => {
    if (!newOption.name.trim()) {
      setError("Option name cannot be empty");
      return false;
    }

    if (newOption.percentageMarkup < 0 || newOption.percentageMarkup > 1) {
      setError("Percentage markup must be between 0 and 1");
      return false;
    }

    if (newOption.daysToAdd < 0) {
      setError("Days to add must be a positive number");
      return false;
    }

    return true;
  };

  const addDeliveryOption = async (e) => {
    if (e) e.preventDefault();

    if (!validateNewOption()) {
      return;
    }

    setError(null);
    setSavingDeliveryOption(true);
    setIsSubmitting(true);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Prepare payload for API
      const payload = {
        name: newOption.name,
        description: newOption.description,
        estimatedDeliveryTime: newOption.estimatedDeliveryTime,
        percentageMarkup: newOption.percentageMarkup,
        isExpress: newOption.isExpress,
        daysToAdd: newOption.daysToAdd,
        active: newOption.active,
      };

      console.log("Sending delivery option payload:", payload);

      // Send data to API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delivery-options`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create delivery option"
        );
      }

      const responseData = await response.json();
      console.log("Delivery option created successfully:", responseData);

      // Refresh delivery options
      await fetchDeliveryOptions();

      // Reset new option form
      setNewOption({
        name: "",
        description: "Standard delivery option",
        estimatedDeliveryTime: "3-5 days",
        percentageMarkup: 0,
        isExpress: false,
        daysToAdd: 3,
        active: true,
      });

      // Show success modal instead of alert
      showModal("success", "Success", "Delivery option added successfully!", [
        { label: "OK", onClick: closeModal, variant: "primary" },
      ]);
    } catch (err) {
      console.error("Error creating delivery option:", err);
      setError(err.message);

      // Show error modal instead of alert
      showModal(
        "error",
        "Error",
        `Failed to add delivery option: ${err.message}`,
        [{ label: "OK", onClick: closeModal, variant: "primary" }]
      );
    } finally {
      setSavingDeliveryOption(false);
      setIsSubmitting(false);
    }
  };

  const toggleDeliveryOptionStatus = async (id, currentStatus) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // First update UI optimistically
      setDeliveryOptions((prevOptions) =>
        prevOptions.map((option) =>
          option._id === id ? { ...option, active: !currentStatus } : option
        )
      );

      // Send toggle request to API
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/delivery-options/${id}/toggle-active`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Revert UI change if API call fails
        setDeliveryOptions((prevOptions) =>
          prevOptions.map((option) =>
            option._id === id ? { ...option, active: currentStatus } : option
          )
        );
        throw new Error(
          errorData.message || "Failed to toggle delivery option status"
        );
      }
    } catch (err) {
      console.error("Error toggling delivery option status:", err);
      setError(err.message);

      showModal("error", "Error", `Failed to update status: ${err.message}`, [
        { label: "OK", onClick: closeModal, variant: "primary" },
      ]);
    }
  };

  // Show confirmation modal before deleting
  const confirmDeleteOption = (id) => {
    setModalState({
      isOpen: true,
      type: "warning",
      title: "Confirm Deletion",
      message:
        "Are you sure you want to delete this delivery option? This action cannot be undone.",
      buttons: [
        {
          label: "Cancel",
          onClick: closeModal,
          variant: "secondary",
        },
        {
          label: "Delete",
          onClick: () => {
            closeModal();
            executeDeleteOption(id);
          },
          variant: "danger",
        },
      ],
      optionIdToDelete: id,
    });
  };

  const executeDeleteOption = async (id) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Optimistically remove from UI
      const originalOptions = [...deliveryOptions];
      setDeliveryOptions((prevOptions) =>
        prevOptions.filter((option) => option._id !== id)
      );

      // Send delete request to API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/delivery-options/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Revert UI if API call fails
        setDeliveryOptions(originalOptions);
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to delete delivery option"
        );
      }

      showModal("success", "Success", "Delivery option deleted successfully!", [
        { label: "OK", onClick: closeModal, variant: "primary" },
      ]);
    } catch (err) {
      console.error("Error deleting delivery option:", err);
      setError(err.message);

      showModal(
        "error",
        "Error",
        `Failed to delete delivery option: ${err.message}`,
        [{ label: "OK", onClick: closeModal, variant: "primary" }]
      );
    }
  };

  const saveConfiguration = async () => {
    setSavingRates(true);
    setError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Prepare payload for API - only include the rates data
      const payload = {
        vatRate: formData.vatRate,
        baseRateInternational: formData.baseRateInternational,
        baseRateLocal: formData.baseRateLocal,
        insuranceRateBasic: formData.insuranceRateBasic,
        insuranceRatePremium: formData.insuranceRatePremium,
      };

      // Send data to API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/shipping-rates`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update shipping rates");
      }

      // Show success modal instead of alert
      showModal("success", "Success", "Shipping rates updated successfully!", [
        { label: "OK", onClick: closeModal, variant: "primary" },
      ]);
    } catch (err) {
      console.error("Error saving configuration:", err);
      setError(err.message);

      showModal(
        "error",
        "Error",
        `Failed to save shipping rates: ${err.message}`,
        [{ label: "OK", onClick: closeModal, variant: "primary" }]
      );
    } finally {
      setSavingRates(false);
    }
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + "%";
  };

  // Function to check if an option is the standard delivery option
  const isStandardOption = (option) => {
    return option.description === "Standard delivery option";
  };

  if (loading) {
    return (
      <div className="w-full mx-auto p-4 text-center">
        Loading shipping configuration...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 md:p-6 bg-white">
      {/* Modal Component */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        buttons={modalState.buttons}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">
          Quote Management
        </h2>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <AiOutlineArrowLeft className="mr-2 text-lg" /> Go back
          </button>
        )}
      </div>
      <p className="text-sm md:text-base text-gray-600">
        Configure shipping rates, VAT, insurance rates, and delivery options for
        quotes.
      </p>

      {error && (
        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
          <button
            className="ml-2 text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Basic Rates Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Basic Rate Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VAT Rate
            </label>
            <div className="flex items-center">
              <input
                type="tel"
                name="vatRate"
                value={formData.vatRate}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="1"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">
                {formatPercentage(formData.vatRate)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Rate (International) per kg
            </label>
            <input
              type="tel"
              name="baseRateInternational"
              value={formData.baseRateInternational}
              onChange={handleChange}
              min="0"
              className="w-full border p-3 rounded-lg text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Rate (Local) per kg
            </label>
            <input
              type="tel"
              name="baseRateLocal"
              value={formData.baseRateLocal}
              onChange={handleChange}
              min="0"
              className="w-full border p-3 rounded-lg text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      {/* Insurance Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Insurance Rate Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Insurance Rate
            </label>
            <div className="flex items-center">
              <input
                type="tel"
                name="insuranceRateBasic"
                value={formData.insuranceRateBasic}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="1"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">
                {formatPercentage(formData.insuranceRateBasic)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Premium Insurance Rate
            </label>
            <div className="flex items-center">
              <input
                type="tel"
                name="insuranceRatePremium"
                value={formData.insuranceRatePremium}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="1"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">
                {formatPercentage(formData.insuranceRatePremium)}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button for Rates */}
        <button
          className={`mt-4 flex items-center justify-center px-6 py-2 ${
            savingRates ? "bg-gray-400" : "bg-primary"
          } text-white rounded-lg`}
          onClick={saveConfiguration}
          disabled={savingRates}
        >
          {savingRates ? (
            "Saving Rates..."
          ) : (
            <>
              <AiOutlineSave className="mr-2" /> Save Rate Configuration
            </>
          )}
        </button>
      </div>

      {/* Delivery Options Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Delivery Options
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Est. Delivery
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Markup %
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Express
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryOptions.map((option) => (
                <tr key={option._id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{option.name}</td>
                  <td className="px-4 py-3">{option.description}</td>
                  <td className="px-4 py-3">{option.estimatedDeliveryTime}</td>
                  <td className="px-4 py-3">
                    {formatPercentage(option.percentageMarkup)}
                  </td>
                  <td className="px-4 py-3">
                    {option.isExpress ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        option.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {option.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isStandardOption(option) ? (
                      <span className="text-xs text-gray-500 italic"></span>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            toggleDeliveryOptionStatus(
                              option._id,
                              option.active
                            )
                          }
                          className={`px-2 py-1 rounded-md text-xs ${
                            option.active
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {option.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => confirmDeleteOption(option._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {deliveryOptions.length === 0 && (
                <tr className="border-t border-gray-200">
                  <td
                    colSpan="7"
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No delivery options found. Add your first one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Option */}
        <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Add New Delivery Option
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={newOption.name}
                onChange={handleNewOptionChange}
                placeholder="e.g. Express"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={newOption.description}
                onChange={handleNewOptionChange}
                placeholder="e.g. Fast delivery option"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                name="estimatedDeliveryTime"
                value={newOption.estimatedDeliveryTime}
                onChange={handleNewOptionChange}
                placeholder="e.g. 1-2 days"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage Markup
              </label>
              <div className="flex items-center">
                <input
                  type="tel"
                  name="percentageMarkup"
                  value={newOption.percentageMarkup}
                  onChange={handleNewOptionChange}
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="e.g. 0.25 for 25%"
                  className="w-full border p-3 rounded-lg text-sm md:text-base"
                />
                <span className="ml-2 text-gray-700">
                  {formatPercentage(newOption.percentageMarkup)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days to Add
              </label>
              <input
                type="tel"
                name="daysToAdd"
                value={newOption.daysToAdd}
                onChange={handleNewOptionChange}
                min="0"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
            </div>

            <div className="flex items-center space-x-4 mt-6">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  name="isExpress"
                  checked={newOption.isExpress}
                  onChange={handleNewOptionChange}
                  className="mr-2 w-4 h-4"
                />
                Express Option
              </label>

              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  name="active"
                  checked={newOption.active}
                  onChange={handleNewOptionChange}
                  className="mr-2 w-4 h-4"
                />
                Active
              </label>
            </div>
          </div>

          <button
            onClick={addDeliveryOption}
            disabled={savingDeliveryOption || isSubmitting}
            className="mt-4 flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg  transition-colors"
          >
            {savingDeliveryOption ? (
              "Adding..."
            ) : (
              <>
                <AiOutlinePlus className="mr-2" /> Add Delivery Option
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteMgt;
