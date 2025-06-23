import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { copy } from "../assets";
import { FaDiagramSuccessor } from "react-icons/fa6";
import { getCurrentShipment } from "../utils/shipmentStorage";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [countdown, setCountdown] = useState(5);

  // Get tracking number from localStorage
  useEffect(() => {
    const currentShipment = getCurrentShipment();
    if (currentShipment?.trackingNumber) {
      setTrackingNumber(currentShipment.trackingNumber);
    } else {
      console.warn("No tracking number found in storage");
    }

    // Auto-redirect after countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/createshipment-payment/finish`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(trackingNumber)
      .then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => setCopyButtonText("Copy"), 3000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <section className="w-full flex min-h-[500px]">
      <div className="w-full flex md:flex-row flex-col gap-14 justify-between">
        <div className="md:w-[50%] w-full flex flex-col gap-5">
          <h1 className="text-primary font-bold md:text-[35px] ss:text-[33px] text-[27px] tracking-tight">
            Payment Successful!
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
              Your shipment has been successfully created and finalized. You
              will be redirected to the shipment details page in {countdown}{" "}
              seconds.
            </p>

            <button
              className="bg-primary text-[13px] py-3.5 px-8 mt-4 w-fit
              text-white rounded-full cursor-pointer"
              onClick={() => {
                if (trackingNumber) {
                  navigate(
                    `/createshipment-payment/finish?tracking=${trackingNumber}`
                  );
                } else {
                  // Fallback in case tracking number is missing
                  navigate(`/createshipment-payment/finish`);
                  console.error(
                    "Warning: No tracking number available for navigation"
                  );
                }
              }}
            >
              Continue to Shipment Details
            </button>
          </div>
        </div>

        <div className="md:w-[45%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
          <div className="w-full relative md:rounded-2xl ss:rounded-2xl rounded-xl overflow-hidden">
            {/* <img
              src={success}
              alt="payment successful"
              className="object-cover md:rounded-2xl ss:rounded-2xl rounded-xl"
            /> */}
            <FaDiagramSuccessor className="w-[4rem] h-[4rem] text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(PaymentSuccess, "");
