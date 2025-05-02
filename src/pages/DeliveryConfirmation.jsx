import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionWrapper } from "../hoc";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";

const DeliveryConfirmation = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get shipment details
    setTimeout(() => {
      setShipmentDetails({
        trackingNumber: trackingId || "TRX-123456789",
        deliveryDate: new Date().toLocaleDateString(),
        deliveryTime: new Date().toLocaleTimeString(),
        recipientName: "Annabella Isiagu Johnbosco",
        deliveryAddress: "15 Barracks Road, Biogbolo, Yenagoa, Bayelsa, NG",
      });
      setLoading(false);
    }, 1000);
  }, [trackingId]);

  if (loading) {
    return (
      <section className="w-full flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-primary font-bold text-[20px]">
            Loading delivery details...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex min-h-[500px]">
      <div className="w-full flex flex-col gap-10">
        <div className="flex flex-col gap-5 items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary1 flex items-center justify-center">
            <BsFillCheckCircleFill className="text-primary text-[50px]" />
          </div>

          <h1 className="text-primary font-bold md:text-[35px] ss:text-[33px] text-[27px] tracking-tight">
            Package Delivered!
          </h1>

          <p className="md:text-[16px] ss:text-[16px] text-[15px] tracking-tight font-medium text-main2 max-w-[700px]">
            Your package has been successfully delivered to the recipient.
          </p>
        </div>

        <div className="bg-primary1 rounded-xl p-8">
          <h2 className="text-main2 font-bold text-[22px] mb-4">
            Delivery Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-main4 text-[14px] mb-1">Tracking Number</p>
              <p className="text-main2 text-[16px] font-medium">
                {shipmentDetails.trackingNumber}
              </p>
            </div>

            <div>
              <p className="text-main4 text-[14px] mb-1">Delivery Date</p>
              <p className="text-main2 text-[16px] font-medium">
                {shipmentDetails.deliveryDate}
              </p>
            </div>

            <div>
              <p className="text-main4 text-[14px] mb-1">Delivery Time</p>
              <p className="text-main2 text-[16px] font-medium">
                {shipmentDetails.deliveryTime}
              </p>
            </div>

            <div>
              <p className="text-main4 text-[14px] mb-1">Recipient</p>
              <p className="text-main2 text-[16px] font-medium">
                {shipmentDetails.recipientName}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-main4 text-[14px] mb-1">Delivery Address</p>
              <p className="text-main2 text-[16px] font-medium">
                {shipmentDetails.deliveryAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-4">
          <button
            className="bg-none text-[13px] py-3.5 px-8 border border-primary
            text-primary rounded-full cursor-pointer flex items-center gap-2"
            onClick={() => navigate(`/track/${shipmentDetails.trackingNumber}`)}
          >
            View Tracking History
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`bg-primary text-[13px] py-3.5 px-8
            text-white rounded-full cursor-pointer flex items-center gap-2
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() =>
              navigate(`/review/${shipmentDetails.trackingNumber}`)
            }
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                <MdOutlineRateReview className="text-[16px]" />
                Rate Your Experience
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(DeliveryConfirmation, "");
