import {
  Navbar,
  HeroShipment,
  Footer,
  ShipmentSteps,
  ShipmentProgressIndicator,
} from "../components";

import { GetStarted } from "../pages";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { ShipmentProvider } from "../context/ShipmentContext";

const CreateShipmentPage = () => {
  const [currentStepOverride, setCurrentStepOverride] = useState(null);

  const handleStepClick = (stepId) => {
    setCurrentStepOverride(stepId);
  };

  return (
    <div className="font-manrope">
      <Helmet>
        <title>Create Shipment | Envoy Angel Shipping and Logistics</title>
        <meta
          name="description"
          content="Create a new shipment with Envoy Angel"
        />
      </Helmet>

      <Navbar />

      <div className="heroShipment">
        <HeroShipment />
      </div>

      <div className="container mx-auto px-4 my-8">
        <ShipmentProvider>
          <ShipmentProgressIndicator onStepClick={handleStepClick} />
          <GetStarted
            stepOverride={currentStepOverride}
            onStepChange={() => setCurrentStepOverride(null)}
          />
        </ShipmentProvider>
      </div>

      <ShipmentSteps />

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default CreateShipmentPage;
