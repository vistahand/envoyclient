import React, { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { shipments } from "../services/api";
import { saveShipment, getShipmentById } from "../utils/shipmentStorage";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorType, setErrorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    setErrorType(error || "payment");
  }, [location]);

  const handleRetry = async () => {
    try {
      setLoading(true);
      const shipmentId = localStorage.getItem("shipmentId");

      if (!shipmentId) {
        throw new Error("Shipment information not found");
      }

      // Get current shipment information
      const currentShipment = getShipmentById(shipmentId);

      const finalizeResponse = await shipments.finalizeShipment(shipmentId);

      if (!finalizeResponse.success) {
        throw new Error(
          finalizeResponse.data?.error || "Failed to finalize shipment"
        );
      }

      const trackingNumber = finalizeResponse.data.shipment.trackingNumber;

      // Update shipment data in localStorage
      saveShipment({
        ...currentShipment,
        trackingNumber: trackingNumber,
        finalizationStatus: "completed",
        status: finalizeResponse.data.shipment.status || "Processing",
        ...finalizeResponse.data.shipment,
      });

      navigate(`/createshipment-payment/success`);
    } catch (error) {
      console.error("Error retrying finalization:", error);
      setErrorMessage(
        error.message ||
          "Failed to complete shipment. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex min-h-[400px] justify-center items-center flex-col gap-6">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-[6rem] h-[6rem] bg-red-500 rounded-full flex justify-center items-center p-6">
          <MdErrorOutline className="w-[4rem] h-[4rem] text-white" />
        </div>

        <h1 className="text-red-600 font-bold text-[30px] tracking-tight text-center">
          {errorType === "finalization"
            ? "Payment Processed, But Shipment Not Finalized"
            : "Payment Failed!"}
        </h1>

        <p className="text-main4 text-[16px] text-center md:w-[60%] w-[90%]">
          {errorType === "finalization"
            ? "Your payment was processed successfully, but we couldn't complete your shipment. You can retry finalizing your shipment without making another payment."
            : "Unfortunately, your payment could not be processed. Please try again or contact support."}
        </p>

        {errorMessage && (
          <p className="text-red-500 text-[14px] text-center md:w-[60%] w-[90%]">
            {errorMessage}
          </p>
        )}
      </div>

      <button
        className={`bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={handleRetry}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : errorType === "finalization"
          ? "Retry Finalizing Shipment"
          : "Retry Payment"}
      </button>
    </section>
  );
};

export default PaymentFailedPage;
