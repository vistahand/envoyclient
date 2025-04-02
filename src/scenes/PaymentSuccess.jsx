import { Navbar, Footer, ShipmentFinish, ShipCTA } from "../components";

import { Helmet } from "react-helmet";

import PaymentSuccessPage from "../pages/PaymentSuccessPage";

const PaymentSuccessScene = () => {
  return (
    <div className="font-manrope">
      <Helmet>
        <title>Payment Successful | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <Navbar />

      <div className="mt-20">
        <PaymentSuccessPage />
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

export default PaymentSuccessScene;
