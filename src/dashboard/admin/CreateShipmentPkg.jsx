import React, { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Tv, Car, Package } from "lucide-react";

// Reusable components
const Modal = ({ isOpen, onClose, title, children, modalRef }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-semibold text-lg">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
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
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const InputField = ({ label, type, name, value, onChange, disabled, className }) => (
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

const SelectField = ({ label, name, value, onChange, options }) => (
  <FormField label={label}>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FormField>
);

const CheckboxField = ({ id, name, checked, onChange, label }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label htmlFor={id} className="ml-2 text-sm text-gray-700">
      {label}
    </label>
  </div>
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
    name: "",
    price: "",
    currency: "Euro",
    requiresSize: false,
    requiresDetails: false,
    isCustom: false,
    isQuotable: false,
    tvSize: "32",
    carMake: "",
    carModel: ""
  });
  
  // Available TV sizes and currency options
  const tvSizes = ["32", "40", "43", "50", "55", "65", "75"];
  const currencyOptions = [
    { value: "Euro", label: "Euro" },
    { value: "NGN", label: "NGN" }
  ];
  
  const [items, setItems] = useState([
    { id: 1, name: "Ghana must go", price: 100, currency: "Euro" },
    { id: 2, name: "Fridge freezer", price: 250, currency: "Euro" },
    { id: 3, name: "Box freezer", price: 120, currency: "Euro" },
    { id: 4, name: "Washing machine", price: 120, currency: "Euro" },
    { id: 5, name: "Drum", price: 160, currency: "Euro" },
    { id: 6, name: "TV", price: 0, currency: "Euro", requiresSize: true, tvSize: "32", isCustom: true },
    { id: 7, name: "TV", price: 0, currency: "Euro", requiresSize: true, tvSize: "43", isCustom: true },
    { id: 8, name: "TV", price: 0, currency: "Euro", requiresSize: true, tvSize: "55", isCustom: true },
    { id: 9, name: "Car", price: 0, currency: "Euro", requiresDetails: true, isQuotable: true, carMake: "Toyota", carModel: "Camry" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState({ field: "name", direction: "asc" });
  const modalRef = useRef(null);

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
      setFormData(prev => ({
        ...prev,
        name: "TV",
        requiresSize: true,
        isCustom: true,
        price: 0,
        tvSize: "32"
      }));
    } else if (itemType === "Car") {
      setFormData(prev => ({
        ...prev,
        name: "Car",
        requiresDetails: true,
        isQuotable: true,
        price: 0,
        carMake: "",
        carModel: ""
      }));
    } else {
      // Standard item
      setFormData(prev => ({
        ...prev,
        name: "",
        requiresSize: false,
        requiresDetails: false,
        isCustom: false,
        isQuotable: false,
        price: ""
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for item type selection
    if (name === "name") {
      let updates = { [name]: value };
      
      if (value === "TV") {
        updates = {
          ...updates,
          requiresSize: true,
          isCustom: true,
          price: 0
        };
      } else if (value === "Car") {
        updates = {
          ...updates,
          requiresDetails: true,
          isQuotable: true,
          price: 0
        };
      }
      
      setFormData(prev => ({ ...prev, ...updates }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    // If isQuotable or isCustom is checked, set price to 0
    if ((name === "isQuotable" || name === "isCustom") && checked) {
      setFormData(prev => ({ ...prev, price: 0 }));
    }
  };

  const validateForm = (formData) => {
    if (!formData.name) {
      alert("Please enter item name");
      return false;
    }

    // For TV items, check if the size already exists
    if (formData.name === "TV") {
      const sizeExists = items.some(
        item => item.name === "TV" && 
        item.tvSize === formData.tvSize && 
        (editingItem ? item.id !== editingItem.id : true)
      );
      
      if (sizeExists) {
        alert(`A TV with ${formData.tvSize}" size already exists`);
        return false;
      }
    }

    // Validate price if not quotable or custom
    if (!formData.isQuotable && !formData.isCustom && formData.price === "") {
      alert("Please enter a price for this item");
      return false;
    }

    return true;
  };

  const prepareFormData = () => {
    const newFormData = { ...formData };
    
    // Handle special item types
    if (newFormData.name === "TV" || newFormData.isCustom || newFormData.isQuotable) {
      newFormData.price = 0;
    }
    
    return newFormData;
  };

  const handleAddItem = () => {
    const newFormData = prepareFormData();
    
    if (!validateForm(newFormData)) return;

    const newItem = {
      id: items.length > 0 ? Math.max(...items.map(p => p.id)) + 1 : 1,
      ...newFormData
    };

    setItems([...items, newItem]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    const newFormData = prepareFormData();
    
    if (!validateForm(newFormData)) return;

    const updatedItems = items.map(item => 
      item.id === editingItem.id ? { ...newFormData, id: item.id } : item
    );

    setItems(updatedItems);
    resetForm();
    setShowEditModal(false);
  };

  const startEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      currency: item.currency,
      requiresSize: item.requiresSize || false,
      requiresDetails: item.requiresDetails || false, 
      isCustom: item.isCustom || false,
      isQuotable: item.isQuotable || false,
      tvSize: item.tvSize || "32",
      carMake: item.carMake || "",
      carModel: item.carModel || ""
    });
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this shipping item?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      currency: "Euro",
      requiresSize: false,
      requiresDetails: false,
      isCustom: false,
      isQuotable: false,
      tvSize: "32",
      carMake: "",
      carModel: ""
    });
    setEditingItem(null);
  };

  const handleSort = (field) => {
    const direction = sorting.field === field && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ field, direction });
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sorting.field === "name") {
      return sorting.direction === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sorting.field === "price") {
      return sorting.direction === "asc" 
        ? a.price - b.price 
        : b.price - a.price;
    }
    return 0;
  });

  const filteredItems = sortedItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceDisplay = (item) => {
    if (item.isQuotable) {
      return "Quote based";
    } else if (item.isCustom) {
      return "Custom package";
    } else {
      return `${item.price}`;
    }
  };

  const getItemName = (item) => {
    if (item.name === "TV" && item.tvSize) {
      return `${item.name} (${item.tvSize}")`;
    }
    if (item.name === "Car" && item.carMake && item.carModel) {
      return `${item.name} (${item.carMake} ${item.carModel})`;
    }
    return item.name;
  };

  const getItemDetails = (item) => {
    const details = [];
    if (item.requiresSize && item.name !== "TV") details.push("Requires size");
    if (item.requiresDetails && item.name !== "Car") details.push("Requires details");
    if (item.isCustom) details.push("Custom item");
    return details.join(", ");
  };

  const renderItemTypeSelector = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Select Item Type</h3>
      <div className="grid grid-cols-3 gap-2">
        <ItemTypeButton 
          icon={<Package className="w-5 h-5" />}
          label="Standard Item"
          selected={formData.name !== "TV" && formData.name !== "Car"}
          onClick={() => handleSelectItemType("Standard")}
        />
        <ItemTypeButton 
          icon={<Tv className="w-5 h-5" />}
          label="TV"
          selected={formData.name === "TV"}
          onClick={() => handleSelectItemType("TV")}
        />
        <ItemTypeButton 
          icon={<Car className="w-5 h-5" />}
          label="Car"
          selected={formData.name === "Car"}
          onClick={() => handleSelectItemType("Car")}
        />
      </div>
    </div>
  );

  const renderFormFields = () => (
    <div className="flex flex-col gap-4">
      {renderItemTypeSelector()}
      
      <FormField label="Item Name">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      {/* TV Size dropdown - only show when TV is selected */}
      {formData.name === "TV" && (
        <SelectField
          label="TV Size (inches)"
          name="tvSize"
          value={formData.tvSize}
          onChange={handleInputChange}
          options={tvSizes.map(size => ({ value: size, label: `${size}"` }))}
        />
      )}

      {/* Car details - only show when Car is selected */}
      {formData.name === "Car" && (
        <>
          <InputField
            label="Car Make"
            name="carMake"
            value={formData.carMake}
            onChange={handleInputChange}
          />
          <InputField
            label="Car Model"
            name="carModel"
            value={formData.carModel}
            onChange={handleInputChange}
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          disabled={formData.isQuotable || formData.isCustom || formData.name === "TV" || formData.name === "Car"}
        />

        <SelectField
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          options={currencyOptions}
        />
      </div>

      {/* Hide additional options when TV or Car is selected */}
      {formData.name !== "TV" && formData.name !== "Car" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-requiresSize`}
              name="requiresSize"
              checked={formData.requiresSize}
              onChange={handleInputChange}
              label="Requires Size"
            />
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-requiresDetails`}
              name="requiresDetails"
              checked={formData.requiresDetails}
              onChange={handleInputChange}
              label="Requires Details"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-isCustom`}
              name="isCustom"
              checked={formData.isCustom}
              onChange={handleInputChange}
              label="Custom Package"
            />
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-isQuotable`}
              name="isQuotable"
              checked={formData.isQuotable}
              onChange={handleInputChange}
              label="Requires Quote"
            />
          </div>
        </>
      )}

      {/* Conditionally show info messages without duplication */}
      {formData.name === "Car" && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>Car items will require a quote. Team will contact the customer. Price will be set to 0.</p>
        </div>
      )}
      
      {formData.name === "TV" && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>TV items will be treated as custom packages. Price will be set to 0.</p>
        </div>
      )}
      
      {formData.name !== "Car" && formData.name !== "TV" && formData.isQuotable && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>This item will show "Team will contact you" to the customer. Price will be set to 0.</p>
        </div>
      )}

      {formData.name !== "Car" && formData.name !== "TV" && formData.isCustom && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>This item will be treated as a custom package. Price will be set to 0.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="flex items-center w-full flex-col">
        <div className="w-full flex flex-col gap-2 items-center">
          <h1 className="text-primary font-bold text-3xl md:text-4xl tracking-tight leading-tight text-center">
            Shipping Items Quote
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed tracking-tight text-center">
            Manage shipping items and prices
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-11/12 mt-8">
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
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
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th 
                      className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Item Name
                        {sorting.field === "name" && (
                          <span className="ml-1">{sorting.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600 cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        {sorting.field === "price" && (
                          <span className="ml-1">{sorting.direction === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
                      Currency
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
                      Details
                    </th>
                    <th className="py-3 px-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b border-gray-100 text-sm">
                        {getItemName(item)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-100 text-sm">
                        {getPriceDisplay(item)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-100 text-sm">
                        {item.currency}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-100 text-sm">
                        {getItemDetails(item)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-100">
                        <div className="flex gap-3">
                          <button
                            className="text-primary hover:text-blue-800"
                            onClick={() => startEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500 text-sm">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Shipping Item"
        modalRef={modalRef}
      >
        {renderFormFields()}
        <div className="flex justify-end gap-3 mt-4">
          <ActionButton variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </ActionButton>
          <ActionButton variant="primary" onClick={handleAddItem}>
            <Save className="w-4 h-4" />
            Save Item
          </ActionButton>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Shipping Item"
        modalRef={modalRef}
      >
        {renderFormFields()}
        <div className="flex justify-end gap-3 mt-4">
          <ActionButton variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </ActionButton>
          <ActionButton variant="primary" onClick={handleEditItem}>
            <Save className="w-4 h-4" />
            Save Changes
          </ActionButton>
        </div>
      </Modal>
    </div>
  );
};

export default CreateShipmentPkg;