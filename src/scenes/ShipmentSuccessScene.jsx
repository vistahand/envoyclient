import { Navbar, Footer, ShipCTA } from "../components";
import { Helmet } from "react-helmet";
import ShipmentSuccessPage from "../pages/ShipmentSuccessPage";

const ShipmentSuccessScene = () => {
  return (
    <div className="font-manrope">
      <Helmet>
        <title>
          Shipment Created Successfully | Envoy Angel Shipping and Logistics
        </title>
        <meta
          name="description"
          content="Your shipment has been created successfully with cash payment option."
        />
      </Helmet>

      <Navbar />

      <div className="mt-20">
        <ShipmentSuccessPage />
      </div>

      <div className="cta">
        <ShipCTA />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default ShipmentSuccessScene;
