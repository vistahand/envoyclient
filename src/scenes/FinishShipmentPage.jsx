import { Navbar, Footer, ShipmentFinish, ShipCTA } from "../components";

import { Helmet } from "react-helmet";

const FinishShipmentPage = () => {
  return (
    <div className="font-manrope">
      <Helmet>
        <title>Shipment Complete | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <Navbar />

      <div className="mt-20">
        <ShipmentFinish />
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

export default FinishShipmentPage;
