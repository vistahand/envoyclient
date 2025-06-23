import { useState, useRef, useEffect } from "react";
import { ShipmentDetails, ShipmentPay } from "../components";

const ShipmentReview = ({ currentStep, onStepChange }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const sectionRef = useRef(null);
  const [shipment, setShipment] = useState(null); // Initialize shipment state
  const [hasCustom, setHasCustom] = useState(false); // Initialize hasCustom state

  useEffect(() => {
    if (!initialLoad && sectionRef.current) {
      const offset = -180;
      const y =
        sectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentStep, initialLoad]);

  const handleNextStep = ({ shipmentDetails, hasCustom }) => {
    // Store payment details if needed
    if (shipmentDetails) {
      setShipment(shipmentDetails);
    }

    if (hasCustom) {
      setHasCustom(hasCustom);
    }

    onStepChange(currentStep + 1);
    setInitialLoad(false);
  };

  const handlePreviousStep = () => {
    onStepChange(currentStep - 1);
    setInitialLoad(false);
  };

  return (
    <div ref={sectionRef} className="font-manrope">
      {currentStep === 1 && <ShipmentDetails onNext={handleNextStep} />}
      {currentStep === 2 && (
        <ShipmentPay
          onPrev={handlePreviousStep}
          shipment={shipment}
          hasCustom={hasCustom}
        />
      )}
    </div>
  );
};

export default ShipmentReview;
