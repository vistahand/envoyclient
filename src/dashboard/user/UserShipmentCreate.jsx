import React, { useEffect, useState } from "react";
import { GetStarted } from "../../pages";
import { ShipmentProgressIndicator } from "../../components";
import { useLocation } from "react-router-dom";
import { useShipment } from "../../context/ShipmentContext";

const UserShipmentCreate = () => {
  const [currentStepOverride, setCurrentStepOverride] = useState(null);
  const location = useLocation();
  const { loadShipmentDraft } = useShipment();

  // Extract shipment ID from URL query parameters if present
  const queryParams = new URLSearchParams(location.search);
  const shipmentId = queryParams.get("id");

  // Load draft data from query parameter if present and set initial step
  useEffect(() => {
    if (shipmentId) {
     


      // Check if we have a saved step in sessionStorage
      const savedStep = sessionStorage.getItem(`shipment_step_${shipmentId}`);
      if (savedStep) {
        // Convert to number and set as override if valid
        const stepNumber = parseInt(savedStep, 10);
        if (stepNumber >= 1 && stepNumber <= 7) {
          console.log(
            `Restoring to saved step ${stepNumber} from sessionStorage`
          );
          setCurrentStepOverride(stepNumber);
        }
      }

      // The actual draft loading will be handled by the GetStarted component
    }
  }, [shipmentId]);

  const handleStepClick = (stepId) => {
    setCurrentStepOverride(stepId);

    // Save selected step to sessionStorage when manually navigating
    if (shipmentId) {
      sessionStorage.setItem(`shipment_step_${shipmentId}`, stepId.toString());
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col">
        <h1 className="text-primary tracking-tight font-bold md:text-[30px] ss:text-[30px] text-[23px]">
          Create Shipment
        </h1>

        <h4 className="text-main2 tracking-tight font-medium md:text-[16px] ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] leading-[1.2rem]">
          Fill out the form below to create a new shipment. You can save your
          progress and continue later.
        </h4>
      </div>

      <ShipmentProgressIndicator onStepClick={handleStepClick} />

      <GetStarted
        stepOverride={currentStepOverride}
        onStepChange={() => setCurrentStepOverride(null)}
      />
    </div>
  );
};

export default UserShipmentCreate;
