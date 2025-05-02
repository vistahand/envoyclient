import React, { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Tv, Car, Package } from "lucide-react";
import { admin } from "../../services/api";
import toast from "react-hot-toast";

// Reusable components
const Modal = ({ isOpen, onClose, title, children, modalRef }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-semibold text-lg">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  disabled,
  className,
}) => (
  <FormField label={label}>
    <input
      type={type || "text"}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100" : ""
      } ${className || ""}`}
    />
  </FormField>
);

const ActionButton = ({ variant, onClick, children }) => {
  const baseClasses = "rounded-full px-4 py-2 text-sm flex items-center gap-2";
  const variantClasses =
    variant === "primary"
      ? "bg-primary text-white"
      : "border border-primary text-primary hover:bg-blue-50";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      {children}
    </button>
  );
};

const ItemTypeButton = ({ icon, label, selected, onClick }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
        selected
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const CreateShipmentPkg = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    packageType: "",
    amount: "",
    description: "",
    otherOptions: {},
  });

  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState({
    field: "packageType",
    direction: "asc",
  });
  const modalRef = useRef(null);

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await admin.packages.getAll();
      console.log(result);
      if (result.success) {
        setPackages(result.data.packages);
      } else {
        setError(result.message || "Failed to fetch packages");
      }
    } catch (err) {
      setError("Error fetching packages: " + err.message);
      console.error("Error fetching packages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAddModal(false);
        setShowEditModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItemType = (itemType) => {
    if (itemType === "TV") {
      setFormData((prev) => ({
        ...prev,
        packageType: "TV",
        amount: "",
        description: "TV Package",
        otherOptions: { tv: { size: [] } },
      }));
    } else if (itemType === "Car") {
      setFormData((prev) => ({
        ...prev,
        packageType: "Car",
        amount: "",
        description: "Car Package",
        otherOptions: { car: { make: "", model: "", year: "" } },
      }));
    } else {
      // Standard item
      setFormData((prev) => ({
        ...prev,
        packageType: "",
        amount: "",
        description: "",
        otherOptions: {},
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("otherOptions.")) {
      const [_, category, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        otherOptions: {
          ...prev.otherOptions,
          [category]: {
            ...prev.otherOptions[category],
            [field]: value,
          },
        },
      }));
    } else if (name === "amount" && value !== "") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddTVSize = () => {
    const sizeInput = document.getElementById("tvSizeInput");
    const size = Number(sizeInput.value);

    if (!size || size <= 0) {
      toast.error("Please enter a valid TV size");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      otherOptions: {
        ...prev.otherOptions,
        tv: {
          ...prev.otherOptions.tv,
          size: [...prev.otherOptions.tv.size, size],
        },
      },
    }));

    sizeInput.value = ""; // Clear input after adding
  };

  const handleRemoveTVSize = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      otherOptions: {
        ...prev.otherOptions,
        tv: {
          ...prev.otherOptions.tv,
          size: prev.otherOptions.tv.size.filter(
            (_, index) => index !== indexToRemove
          ),
        },
      },
    }));
  };

  const validateForm = (formData) => {
    if (!formData.packageType) {
      toast.error("Please enter package type");
      return false;
    }

    // Amount validation for standard packages (not TV or Car)
    if (formData.packageType !== "TV" && formData.packageType !== "Car") {
      if (formData.amount === "" || isNaN(formData.amount)) {
        toast.error("Please enter a valid amount");
        return false;
      }
      if (Number(formData.amount) <= 0) {
        toast.error("Amount must be greater than 0");
        return false;
      }
    }

    if (!formData.description) {
      toast.error("Please enter a description");
      return false;
    }

    if (
      formData.packageType === "TV" &&
      (!formData.otherOptions.tv?.size ||
        formData.otherOptions.tv.size.length === 0)
    ) {
      toast.error("Please add at least one TV size");
      return false;
    }

    if (formData.packageType === "Car") {
      if (!formData.otherOptions.car?.make) {
        toast.error("Please enter car make");
        return false;
      }
      if (!formData.otherOptions.car?.model) {
        toast.error("Please enter car model");
        return false;
      }
      if (!formData.otherOptions.car?.year) {
        toast.error("Please enter car year");
        return false;
      }
    }

    return true;
  };

  const handleAddItem = async () => {
    if (!validateForm(formData)) return;

    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = {
        ...formData,
        amount: Number(formData.amount),
      };
      const result = await admin.packages.createPackage(formDataToSend);

      if (result.success) {
        setPackages([...packages, result.data.newPackage]);
        resetForm();
        setShowAddModal(false);
      } else {
        setError(result.message || "Failed to add package");
      }
    } catch (err) {
      setError("Error adding package: " + err.message);
      console.error("Error adding package:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setIsLoading(true);
      setError(null);

      try {
        await admin.packages.deletePackage(id);

        // Update the packages list after successful deletion
        setPackages(packages.filter((pkg) => pkg._id !== id));
        toast.success("Package deleted successfully");
      } catch (err) {
        setError("Error deleting package: " + err.message);
        console.error("Error deleting package:", err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      packageType: "",
      amount: "",
      description: "",
      otherOptions: {},
    });
    setEditingItem(null);
  };

  const handleSort = (field) => {
    const direction =
      sorting.field === field && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ field, direction });
  };

  const sortedPackages = [...packages].sort((a, b) => {
    if (sorting.field === "packageType") {
      return sorting.direction === "asc"
        ? a.packageType.localeCompare(b.packageType)
        : b.packageType.localeCompare(a.packageType);
    } else if (sorting.field === "amount") {
      return sorting.direction === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    return 0;
  });

  const filteredPackages = sortedPackages.filter((pkg) =>
    pkg.packageType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItemTypeSelector = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Quick Select Item Type
      </h3>
      <div className="grid grid-cols-3 gap-2">
        <ItemTypeButton
          icon={<Package className="w-5 h-5" />}
          label="Standard Item"
          selected={
            formData.packageType !== "TV" && formData.packageType !== "Car"
          }
          onClick={() => handleSelectItemType("Standard")}
        />
        <ItemTypeButton
          icon={<Tv className="w-5 h-5" />}
          label="TV"
          selected={formData.packageType === "TV"}
          onClick={() => handleSelectItemType("TV")}
        />
        <ItemTypeButton
          icon={<Car className="w-5 h-5" />}
          label="Car"
          selected={formData.packageType === "Car"}
          onClick={() => handleSelectItemType("Car")}
        />
      </div>
    </div>
  );

  const renderFormFields = () => (
    <div className="flex flex-col gap-4">
      {renderItemTypeSelector()}

      <FormField label="Package Type">
        <input
          type="text"
          name="packageType"
          value={formData.packageType}
          onChange={handleInputChange}
          className="py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      {formData.packageType !== "TV" && formData.packageType !== "Car" && (
        <InputField
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
        />
      )}

      <FormField label="Description">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </FormField>

      {formData.packageType === "TV" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              id="tvSizeInput"
              placeholder="Enter TV size in inches"
              className="py-2 px-3 flex-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTVSize}
              className="bg-primary text-white px-3 py-2 rounded-md hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {formData.otherOptions.tv?.size?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.otherOptions.tv.size.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{size}"</span>
                  <button
                    onClick={() => handleRemoveTVSize(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {formData.packageType === "Car" && (
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Car Make"
            type="text"
            name="otherOptions.car.make"
            value={formData.otherOptions.car?.make || ""}
            onChange={handleInputChange}
          />
          <InputField
            label="Car Model"
            type="text"
            name="otherOptions.car.model"
            value={formData.otherOptions.car?.model || ""}
            onChange={handleInputChange}
          />
          <InputField
            label="Car Year"
            type="number"
            name="otherOptions.car.year"
            value={formData.otherOptions.car?.year || ""}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex items-center w-full flex-col">
        <div className="w-full flex flex-col gap-2 items-center">
          <h1 className="text-primary font-bold text-3xl md:text-4xl tracking-tight leading-tight text-center">
            Shipping Packages
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed tracking-tight text-center">
            Manage shipping packages and prices
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full md:w-11/12 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full md:w-11/12 mt-8">
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                className="bg-primary text-sm py-2 px-5 text-white rounded-full transition-transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Package</span>
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center my-8">
                <p>Loading packages...</p>
              </div>
            )}

            {/* Items Table */}
            {!isLoading && (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("packageType")}
                      >
                        <div className="flex items-center">
                          Package Type
                          {sorting.field === "packageType" && (
                            <span className="ml-1">
                              {sorting.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600 cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center">
                          Amount
                          {sorting.field === "amount" && (
                            <span className="ml-1">
                              {sorting.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
                        Description
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
                        Created At
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b border-gray-100 text-sm">
                          {pkg.packageType}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100 text-sm">
                          {pkg.amount}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100 text-sm">
                          {pkg.description}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100 text-sm">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-100">
                          <div className="flex gap-3">
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteItem(pkg._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPackages.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-4 text-center text-gray-500 text-sm"
                        >
                          No packages found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Package"
        modalRef={modalRef}
      >
        {renderFormFields()}
        <div className="flex justify-end gap-3 mt-4">
          <ActionButton
            variant="secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={handleAddItem}
            disabled={isLoading}
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Package
              </>
            )}
          </ActionButton>
        </div>
      </Modal>
    </div>
  );
};

export default CreateShipmentPkg;
