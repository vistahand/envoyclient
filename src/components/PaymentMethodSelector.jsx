// Create a new component for payment method selection

import { useState } from "react";

const PaymentMethodSelector = ({ onSelect, defaultMethod = "immediate" }) => {
  const [selectedMethod, setSelectedMethod] = useState(defaultMethod);

  const handleSelection = (method) => {
    setSelectedMethod(method);
    onSelect(method);
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 border border-main7">
      <h3 className="font-semibold text-[16px] mb-4 text-main2">
        Payment Method
      </h3>

      <div className="space-y-3">
        <div
          className={`flex items-center p-3 border rounded-md cursor-pointer ${
            selectedMethod === "immediate"
              ? "border-primary bg-primary1"
              : "border-main7"
          }`}
          onClick={() => handleSelection("immediate")}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedMethod === "immediate" ? "border-primary" : "border-main4"
            }`}
          >
            {selectedMethod === "immediate" && (
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium text-[15px] text-main2">Pay Now</p>
            <p className="text-[13px] text-main4">
              Pay immediately using credit/debit card
            </p>
          </div>
        </div>

        <div
          className={`flex items-center p-3 border rounded-md cursor-pointer ${
            selectedMethod === "cash_on_pickup"
              ? "border-primary bg-primary1"
              : "border-main7"
          }`}
          onClick={() => handleSelection("cash_on_pickup")}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedMethod === "cash_on_pickup"
                ? "border-primary"
                : "border-main4"
            }`}
          >
            {selectedMethod === "cash_on_pickup" && (
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            )}
          </div>
          <div className="ml-3">
            <p className="font-medium text-[15px] text-main2">Pay on Pickup</p>
            <p className="text-[13px] text-main4">
              Pay cash when dropping off your package
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
