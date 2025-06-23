import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  DeliveryOptions,
  GetStartedForm,
  InsuranceForm,
  PackageDescribe,
  PickupLocation,
  RecipientForm,
  SenderForm,
} from "../components";
import { useShipment } from "../context/ShipmentContext";

const GetStarted = ({ stepOverride, onStepChange }) => {
  const { shipmentData, loading, loadShipmentDraft } = useShipment();
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedTab, setSelectedTab] = useState("international");
  const [senderTab, setSenderTab] = useState("individual");
  const [cost, setCost] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const sectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // If using route params

  // Extract shipment ID from URL query parameters if not using route params
  const queryParams = new URLSearchParams(location.search);
  const queryShipmentId = queryParams.get("id");
  const shipmentId = id || queryShipmentId;

  // Initialize currentStep from sessionStorage if available, otherwise default to 1
  const [currentStep, setCurrentStep] = useState(() => {
    if (shipmentId) {
      const savedStep = sessionStorage.getItem(`shipment_step_${shipmentId}`);
      return savedStep ? parseInt(savedStep, 10) : 1;
    }
    return 1;
  });

  // Update sessionStorage whenever currentStep changes
  useEffect(() => {
    if (shipmentId && currentStep > 1) {
      sessionStorage.setItem(
        `shipment_step_${shipmentId}`,
        currentStep.toString()
      );
    }
  }, [currentStep, shipmentId]);

  // Load draft data on initial mount if shipment ID is provided in URL
  useEffect(() => {
    const fetchDraftData = async () => {
      if (shipmentId && initialLoad) {
        try {
          // Validate shipment ID format
          if (
            !shipmentId ||
            typeof shipmentId !== "string" ||
            shipmentId.length !== 24
          ) {
            throw new Error("Invalid shipment ID format in URL");
          }

          const loadedData = await loadShipmentDraft(shipmentId);

          // Set currentStep from either sessionStorage (if available) or the lastSavedStep from server
          const savedStep = sessionStorage.getItem(
            `shipment_step_${shipmentId}`
          );
          if (savedStep) {
            setCurrentStep(parseInt(savedStep, 10));
          } else if (loadedData && loadedData.lastSavedStep) {
            setCurrentStep(loadedData.lastSavedStep);
            // Save to sessionStorage
            sessionStorage.setItem(
              `shipment_step_${shipmentId}`,
              loadedData.lastSavedStep.toString()
            );
          }

          // Update UI based on loaded data
          if (loadedData.shipmentType) {
            setSelectedTab(loadedData.shipmentType);
          }

          if (loadedData.sender?.type) {
            setSenderTab(loadedData.sender.type);
          }

          setInitialLoad(false);
        } catch (err) {
          console.error("Error loading draft shipment:", err);
          setLoadError(err.message || "Failed to load draft shipment");
        }
      }
    };

    fetchDraftData();
  }, [shipmentId, loadShipmentDraft, initialLoad]);

  // Effect to handle step override from parent component
  useEffect(() => {
    if (stepOverride && stepOverride > 0 && stepOverride <= 7) {
      setCurrentStep(stepOverride);
      // Save to sessionStorage when overridden
      if (shipmentId) {
        sessionStorage.setItem(
          `shipment_step_${shipmentId}`,
          stepOverride.toString()
        );
      }
      if (onStepChange) {
        onStepChange(stepOverride);
      }
    }
  }, [stepOverride, onStepChange, shipmentId]);

  // Effect to sync currentStep with shipmentData.lastSavedStep from server
  useEffect(() => {
    if (
      shipmentData?.lastSavedStep &&
      shipmentData.lastSavedStep > 0 &&
      !stepOverride &&
      initialLoad
    ) {
      // Check if we have a saved step in sessionStorage that's more recent
      const savedStep = shipmentId
        ? sessionStorage.getItem(`shipment_step_${shipmentId}`)
        : null;

      // Use savedStep if available, otherwise use server's lastSavedStep
      const stepToUse = savedStep
        ? Math.max(parseInt(savedStep, 10), shipmentData.lastSavedStep)
        : shipmentData.lastSavedStep;

      setCurrentStep(stepToUse);

      // Save to sessionStorage
      if (shipmentId) {
        sessionStorage.setItem(
          `shipment_step_${shipmentId}`,
          stepToUse.toString()
        );
      }

      // Set appropriate tabs based on saved data
      if (shipmentData.shipmentType) {
        setSelectedTab(shipmentData.shipmentType);
      }

      if (shipmentData.sender?.type) {
        setSenderTab(shipmentData.sender.type);
      }

      if (shipmentData.cost) {
        setCost(shipmentData.cost);
      }

      setInitialLoad(false);
    }
  }, [shipmentData, stepOverride, initialLoad, shipmentId]);

  useEffect(() => {
    if (!initialLoad && sectionRef.current) {
      const offset = -80;
      const y =
        sectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentStep, initialLoad]);

  // This handles moving to the next step
  const handleNextStep = (tab, costData, nextTab) => {
    // Ensure we're actually moving to the next step
    const nextStep = currentStep + 1;
    console.log(`Moving from step ${currentStep} to step ${nextStep}`);

    // Update state
    setCurrentStep(nextStep);
    setInitialLoad(false);
    setSelectedTab(tab);

    if (nextTab) {
      setSenderTab(nextTab);
    }

    if (costData) {
      setCost(costData);
    }

    // Save current step to sessionStorage
    if (shipmentId) {
      sessionStorage.setItem(
        `shipment_step_${shipmentId}`,
        nextStep.toString()
      );
    }

    // Update URL with current shipment ID without reloading
    if (shipmentData?.id && shipmentId !== shipmentData.id) {
      navigate(`?id=${shipmentData.id}`, { replace: true });
    }

    // Call the onStepChange callback if provided
    if (onStepChange) {
      onStepChange(nextStep);
    }
  };

  // This handles moving to the previous step
  const handlePreviousStep = (tab, prevTab) => {
    // Ensure we're actually moving to the previous step
    const prevStep = Math.max(currentStep - 1, 1);
    console.log(`Moving from step ${currentStep} to step ${prevStep}`);

    // Update state
    setCurrentStep(prevStep);
    setInitialLoad(false);
    setSelectedTab(tab);

    if (prevTab) {
      setSenderTab(prevTab);
    }

    // Save current step to sessionStorage
    if (shipmentId) {
      sessionStorage.setItem(
        `shipment_step_${shipmentId}`,
        prevStep.toString()
      );
    }

    // Call the onStepChange callback if provided
    if (onStepChange) {
      onStepChange(prevStep);
    }
  };

  if (loading && initialLoad) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px]">
        <p className="text-red-500 mb-4">{loadError}</p>
        <button
          onClick={() => navigate("/user/shipments/createshipment")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Start New Shipment
        </button>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="font-manrope mt-6">
      {currentStep === 1 && (
        <GetStartedForm
          onNext={handleNextStep}
          selectedTab={selectedTab}
          initialData={
            shipmentData.id
              ? {
                  origin: shipmentData.origin,
                  destination: shipmentData.destination,
                  shipmentType: shipmentData.shipmentType,
                }
              : null
          }
        />
      )}
      {currentStep === 2 && (
        <PackageDescribe
          onPrev={handlePreviousStep}
          onNext={handleNextStep}
          selectedTab={selectedTab}
          initialData={shipmentData.package}
        />
      )}
      {currentStep === 3 && (
        <DeliveryOptions
          calculatedCost={cost}
          onNext={(tab, costData) => handleNextStep(tab, costData)}
          onPrev={handlePreviousStep}
          selectedTab={selectedTab}
          initialData={shipmentData.delivery}
        />
      )}
      {currentStep === 4 && (
        <SenderForm
          onNext={(tab) => handleNextStep(tab, null, senderTab)}
          onPrev={handlePreviousStep}
          selectedTab={selectedTab}
          senderTab={senderTab}
          setSenderTab={setSenderTab}
          initialData={shipmentData.sender}
        />
      )}
      {currentStep === 5 && (
        <RecipientForm
          onNext={(tab) => handleNextStep(tab, null, senderTab)}
          onPrev={() => handlePreviousStep(selectedTab, senderTab)}
          selectedTab={selectedTab}
          senderTab={senderTab}
          initialData={shipmentData.recipient}
        />
      )}
      {currentStep === 6 && (
        <PickupLocation
          onNext={(tab) => handleNextStep(tab, null, senderTab)}
          onPrev={() => handlePreviousStep(selectedTab, senderTab)}
          selectedTab={selectedTab}
          senderTab={senderTab}
          initialData={shipmentData.pickup}
        />
      )}
      {currentStep === 7 && (
        <InsuranceForm
          onPrev={() => handlePreviousStep(selectedTab, senderTab)}
          selectedTab={selectedTab}
          senderTab={senderTab}
          setCurrentStep={setCurrentStep}
          initialData={shipmentData.insurance}
        />
      )}
    </div>
  );
};

export default GetStarted;
