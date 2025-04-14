import React from "react";
import { useShipment } from "../context/ShipmentContext";

const steps = [
  { id: 1, name: "Shipment Type" },
  { id: 2, name: "Package Details" },
  { id: 3, name: "Delivery Options" },
  { id: 4, name: "Sender Information" },
  { id: 5, name: "Recipient Information" },
  { id: 6, name: "Pickup Location" },
  { id: 7, name: "Insurance" },
];

const ShipmentProgressIndicator = ({ onStepClick }) => {
  const { shipmentData } = useShipment();
  const currentStep = shipmentData?.lastSavedStep || 1;

  // Handle clicking on a step that has already been completed
  // const handleStepClick = (stepId) => {
  //   if (onStepClick && stepId <= currentStep) {
  //     onStepClick(stepId);
  //   }
  // };

  return (
    <div className="w-full py-6 px-4 bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-semibold text-primary mb-4">
        Your Shipment Progress
      </h2>

      {/* Mobile progress indicator - simplified for small screens */}
      <div className="md:hidden mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Step {currentStep} of 7</span>
          <span className="text-sm font-medium">
            {Math.round((currentStep / 7) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm font-medium text-primary">
          Current: {steps.find((step) => step.id === currentStep)?.name}
        </div>
      </div>

      {/* Desktop progress indicator - detailed step visualization */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
            <div
              className="bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex-col items-center cursor-pointer ${
                  step.id <= currentStep ? "text-primary" : "text-gray-400"
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    step.id < currentStep
                      ? "bg-primary border-2 border-primary"
                      : step.id === currentStep
                      ? "bg-white border-2 border-primary"
                      : "bg-white border-2 border-gray-300"
                  }`}
                >
                  {step.id < currentStep ? (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span
                      className={
                        step.id === currentStep
                          ? "text-primary"
                          : "text-gray-400"
                      }
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <div className="text-xs mt-1 text-center hidden lg:block">
                  {step.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {shipmentData?.id && (
        <div className="mt-4 text-xs text-gray-600">
          <p>Draft ID: {shipmentData.id}</p>
          <p className="mt-1">
            You can continue this shipment later using this ID.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShipmentProgressIndicator;
