import { useState, useRef, useEffect } from "react";
import { ShipmentDetails, ShipmentFinish, ShipmentPay } from "../components";

const ShipmentReview = ({ currentStep, onStepChange }) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const sectionRef = useRef(null);

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

  const handleNextStep = (paymentDetails) => {
    // Store payment details if needed
    if (paymentDetails) {
      console.log("Payment completed:", paymentDetails);
      // Save to state or context if needed
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
        <ShipmentPay onPrev={handlePreviousStep} onNext={handleNextStep} />
      )}
      {currentStep === 3 && <ShipmentFinish />}
    </div>
  );
};

export default ShipmentReview;
