import { useState, useRef, useEffect } from "react";
import { RegisterProvider } from "../context/RegisterContext";
import {
  RegisterStart,
  RegisterConfirm,
  RegisterFinish,
} from "../dashboard/user";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    setInitialLoad(false);
  };

  return (
    <RegisterProvider>
      <div ref={sectionRef} className="font-manrope">
        {currentStep === 1 && <RegisterStart onNext={handleNext} />}
        {currentStep === 2 && <RegisterConfirm onNext={handleNext} />}
        {currentStep === 3 && <RegisterFinish />}
      </div>
    </RegisterProvider>
  );
};

export default Register;
