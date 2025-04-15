import React, { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineSave } from "react-icons/ai";

const QuoteMgt = ({ onBack }) => {
  const [formData, setFormData] = useState({
    vatRate: 0.075, // 7.5%
    baseRateInternational: 20, // per kg
    baseRateLocal: 10, // per kg
    insuranceRateBasic: 0.01, // 1% of base amount
    insuranceRatePremium: 0.02, // 2% of base amount
    deliveryOptions: [
      { name: "Standard", percentage: 0, isDefault: true },
      { name: "QuickWing", percentage: 0.15, isDefault: false },
      { name: "Express", percentage: 0.25, isDefault: false }
    ]
  });

  const [newOption, setNewOption] = useState({
    name: "",
    percentage: 0,
    isDefault: false
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleDeliveryOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.deliveryOptions];
    
    if (field === "isDefault" && value === true) {
      // Unset other defaults
      updatedOptions.forEach((option, i) => {
        updatedOptions[i].isDefault = i === index;
      });
    } else {
      updatedOptions[index][field] = field === "percentage" ? parseFloat(value) : value;
    }

    setFormData((prev) => ({ ...prev, deliveryOptions: updatedOptions }));
  };

  const handleNewOptionChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    setNewOption((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const addDeliveryOption = () => {
    if (!newOption.name.trim()) {
      alert("Option name cannot be empty");
      return;
    }

    let updatedOptions = [...formData.deliveryOptions];
    
    // Handle default setting
    if (newOption.isDefault) {
      updatedOptions = updatedOptions.map(option => ({ ...option, isDefault: false }));
    }
    
    updatedOptions.push({
      name: newOption.name,
      percentage: parseFloat(newOption.percentage) || 0,
      isDefault: newOption.isDefault
    });

    setFormData(prev => ({ ...prev, deliveryOptions: updatedOptions }));
    setNewOption({ name: "", percentage: 0, isDefault: false });
  };

  const removeDeliveryOption = (index) => {
    // Prevent removing if it's the default option
    if (formData.deliveryOptions[index].isDefault) {
      alert("Cannot remove the default delivery option.");
      return;
    }

    // Prevent removing if it's Standard
    if (formData.deliveryOptions[index].name === "Standard") {
      alert("Cannot remove the Standard delivery option.");
      return;
    }

    const updatedOptions = formData.deliveryOptions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, deliveryOptions: updatedOptions }));
  };

  const saveConfiguration = () => {
    // Here you would typically send this data to your API
    console.log("Saving configuration:", formData);
    alert("Configuration saved successfully!");
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + "%";
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-primary">Quote Management</h2>
        {onBack && (
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <AiOutlineArrowLeft className="mr-2 text-lg" /> Go back
          </button>
        )}
      </div>
      <p className="text-sm md:text-base text-gray-600">
        Configure shipping rates, VAT, insurance rates, and delivery options for quotes.
      </p>

      {/* Basic Rates Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Rate Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate</label>
            <div className="flex items-center">
              <input
                type="number"
                name="vatRate"
                value={formData.vatRate}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="1"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">{formatPercentage(formData.vatRate)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (International) per kg</label>
            <input
              type="number"
              name="baseRateInternational"
              value={formData.baseRateInternational}
              onChange={handleChange}
              min="0"
              className="w-full border p-3 rounded-lg text-sm md:text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (Local) per kg</label>
            <input
              type="number"
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
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Insurance Rate Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Basic Insurance Rate</label>
            <div className="flex items-center">
              <input
                type="number"
                name="insuranceRateBasic"
                value={formData.insuranceRateBasic}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="1"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">{formatPercentage(formData.insuranceRateBasic)}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Premium Insurance Rate</label>
            <div className="flex items-center">
              <input
                type="number"
                name="insuranceRatePremium"
                value={formData.insuranceRatePremium}
                onChange={handleChange}
                step="0.001"
                min="0"
                max="1"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">{formatPercentage(formData.insuranceRatePremium)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Delivery Options</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Option Name</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Additional Percentage</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Default</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.deliveryOptions.map((option, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => handleDeliveryOptionChange(index, "name", e.target.value)}
                      className="w-full border p-2 rounded text-sm md:text-base"
                      readOnly={option.name === "Standard"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={option.percentage}
                        onChange={(e) => handleDeliveryOptionChange(index, "percentage", e.target.value)}
                        step="0.01"
                        min="0"
                        max="1"
                        className="w-24 border p-2 rounded text-sm md:text-base"
                        readOnly={option.name === "Standard"}
                      />
                      <span className="ml-2 text-gray-700">
                        {formatPercentage(option.percentage)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="radio"
                      name="defaultOption"
                      checked={option.isDefault}
                      onChange={() => handleDeliveryOptionChange(index, "isDefault", true)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {(option.name !== "Standard") && (
                      <button
                        onClick={() => removeDeliveryOption(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Option */}
        <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg">
          <h4 className="text-md font-medium text-gray-700 mb-3">Add New Delivery Option</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={newOption.name}
              onChange={handleNewOptionChange}
              placeholder="Option Name"
              className="w-full border p-3 rounded-lg text-sm md:text-base"
            />
            <div className="flex items-center">
              <input
                type="number"
                name="percentage"
                value={newOption.percentage}
                onChange={handleNewOptionChange}
                step="0.01"
                min="0"
                max="1"
                placeholder="Additional %"
                className="w-full border p-3 rounded-lg text-sm md:text-base"
              />
              <span className="ml-2 text-gray-700">
                {formatPercentage(newOption.percentage)}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newOption.isDefault}
                  onChange={(e) => setNewOption(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="mr-2 w-4 h-4"
                />
                Set as Default
              </label>
              <button
                onClick={addDeliveryOption}
                className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        className="mt-6 flex items-center justify-center w-full md:w-[30%] bg-primary text-white p-3 rounded-lg text-lg"
        onClick={saveConfiguration}
      >
        <AiOutlineSave className="mr-2" /> Save Configuration
      </button>
    </div>
  );
};

export default QuoteMgt;