import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { copy } from "../assets";
import { FaCheckCircle } from "react-icons/fa";
import { getCurrentShipment } from "../utils/shipmentStorage";

const ShipmentSuccessPage = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [countdown, setCountdown] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Get tracking number and payment method from localStorage
  useEffect(() => {
    const currentShipment = getCurrentShipment();
    if (currentShipment?.trackingNumber) {
      setTrackingNumber(currentShipment.trackingNumber);
      setPaymentMethod(currentShipment.paymentMethod || "");
    } else {
      console.warn("No tracking number found in storage");
    }

    // Auto-redirect after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/track?tracking=${trackingNumber}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, trackingNumber]);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(trackingNumber)
      .then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => setCopyButtonText("Copy"), 3000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const getMethodText = () => {
    if (paymentMethod === "cash_on_delivery") {
      return "Cash on Delivery";
    } else if (paymentMethod === "cash_on_pickup") {
      return "Cash on Pickup";
    }
    return "Cash payment";
  };

  return (
    <section className="w-full flex min-h-[500px]">
      <div className="w-full flex md:flex-row flex-col gap-14 justify-between">
        <div className="md:w-[50%] w-full flex flex-col gap-5">
          <h1 className="text-primary font-bold md:text-[35px] ss:text-[33px] text-[27px] tracking-tight">
            Shipment Created Successfully!
          </h1>

          <div className="flex flex-col gap-5 w-full">
            <div className="flex items-center justify-between rounded-xl bg-primary1 md:px-5 ss:px-5 px-3 py-3.5 md:w-full ss:w-[70%] w-full">
              <p className="text-primary md:text-[21px] ss:text-[21px] text-[17px] tracking-tight font-medium">
                Tracking ID: <span className="font-bold">{trackingNumber}</span>
              </p>

              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleCopyClick}
              >
                <img
                  src={copy}
                  alt="copy"
                  className="w-[1rem] h-auto text-primary"
                />
                <p className="text-primary md:text-[12px] ss:text-[12px] text-[11px] tracking-tight font-bold">
                  {copyButtonText}
                </p>
              </div>
            </div>

            <p className="md:text-[16px] ss:text-[16px] text-[15px] tracking-tight font-medium text-main2">
              Your shipment has been successfully created with {getMethodText()}{" "}
              payment option.
              {paymentMethod === "cash_on_delivery"
                ? " Payment will be collected when your package is delivered."
                : " Payment will be collected when you drop off your package."}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 text-xl mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    Payment Status: Awaiting Confirmation
                  </h3>
                  <p className="text-green-700 text-sm mt-1">
                    Your shipment is ready to proceed. Remember to bring cash
                    for payment
                    {paymentMethod === "cash_on_pickup"
                      ? " when dropping off your package."
                      : " when your package is delivered."}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-main4 text-[14px] mt-2">
              You will be redirected to the tracking page in {countdown}{" "}
              seconds...
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                className="bg-primary text-[13px] py-3.5 px-8 w-fit
                text-white rounded-full cursor-pointer"
                onClick={() => navigate(`/track?tracking=${trackingNumber}`)}
              >
                Track Your Shipment
              </button>

              <button
                className="border border-primary text-primary text-[13px] py-3.5 px-8 w-fit
                rounded-full cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="md:w-[45%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
          <div className="w-full h-[350px] flex items-center justify-center bg-primary1 md:rounded-2xl ss:rounded-2xl rounded-xl overflow-hidden">
            <FaCheckCircle className="w-[6rem] h-[6rem] text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(ShipmentSuccessPage, "");
