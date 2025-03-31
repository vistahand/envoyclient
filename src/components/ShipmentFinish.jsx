import { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TrackModal } from "../components";
import { copy, shipconfirm } from "../assets";
import { useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";
import { shipments } from "../services/api";
import { getCurrentShipment } from "../utils/shipmentStorage";

const ShipmentFinish = () => {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const navigate = useNavigate();
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingDetails = async () => {
      try {
        setLoading(true);

        // Get shipment data from localStorage
        const currentShipment = getCurrentShipment();

        if (currentShipment?.trackingNumber) {
          console.log(
            "Using tracking number from localStorage:",
            currentShipment.trackingNumber
          );

          const shipmentDetails = await shipments.getByTrackingId(
            currentShipment.trackingNumber
          );

          setTrackingDetails({
            id: currentShipment.trackingNumber,
            status:
              shipmentDetails.data?.shipment?.status ||
              currentShipment.status ||
              "Processing",
            estimatedDelivery:
              shipmentDetails.data?.shipment?.delivery?.estimatedDate ||
              currentShipment.delivery?.estimatedDate ||
              "Friday 1st November, 2024",
          });
        } else {
          console.warn("No tracking information found in storage");
          setError("No tracking information available");
        }
      } catch (error) {
        console.error("Error fetching tracking details:", error);
        setError("Could not load shipment details");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingDetails();
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${scrollPosition}px`;
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(trackingDetails?.id)
      .then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => {
          setCopyButtonText("Copy");
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const navigateToShipments = () => {
    navigate("/user/shipments");
  };

  return (
    <section className="w-full flex min-h-[400px]">
      <div
        className="w-full flex md:flex-row flex-col gap-14 
            md:justify-between"
      >
        <div className="md:w-[50%] w-full flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-full">
              <MdCheck className="text-green-600 text-xl" />
            </div>
            <h1 className="text-green-600 font-bold md:text-[35px] ss:text-[33px] text-[27px] tracking-tight md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]">
              Payment Successful
            </h1>
          </div>

          <div className="flex flex-col gap-5 w-full">
            <div
              className="flex items-center justify-between rounded-xl 
                      bg-primary1 md:px-5 ss:px-5 px-3 py-3.5 md:w-full ss:w-[70%]
                      w-full"
            >
              <p
                className="text-primary md:text-[21px] ss:text-[21px] 
                          text-[17px] tracking-tight font-medium"
              >
                Tracking ID:{" "}
                <span className="font-bold">{trackingDetails?.id}</span>
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

                <p
                  className="text-primary md:text-[12px] ss:text-[12px] 
                              text-[11px] tracking-tight font-bold"
                >
                  {copyButtonText}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
              <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2 leading-[20px]">
                Your shipment has been successfully processed and is now on its
                way!
                <span className="font-bold">
                  {" "}
                  You can track your shipment's status at any time using the
                  tracking ID above.
                </span>
              </p>

              <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2 leading-[20px]">
                Estimated delivery date: {trackingDetails?.estimatedDelivery}
              </p>
            </div>
          </div>

          <div className="w-full md:mt-5 ss:mt-5 mt-3 flex gap-4 flex-wrap">
            <button
              className="bg-primary text-[13px] py-3.5 px-8 flex text-white rounded-full grow4 cursor-pointer items-center justify-center gap-3"
              onClick={() => {
                setIsTrackModalOpen(true);
                disableScroll();
              }}
            >
              <p>Track Shipment</p>
              <HiOutlineArrowRight className="text-[14px]" />
            </button>

            <button
              className="border-2 border-primary text-primary text-[13px] py-3.5 px-8 flex rounded-full grow4 cursor-pointer items-center justify-center gap-3"
              onClick={navigateToShipments}
            >
              <p>View All Shipments</p>
              <HiOutlineArrowRight className="text-[14px]" />
            </button>
          </div>
        </div>

        <div className="md:w-[50%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
          <div
            className="w-full relative md:rounded-2xl
                  ss:rounded-2xl rounded-xl overflow-hidden"
          >
            <img
              src={shipconfirm}
              alt="shipmentconfirmed"
              className="object-cover md:rounded-2xl
                          ss:rounded-2xl rounded-xl"
            />

            <div
              className="h-[15px] w-full absolute bottom-0 
                          bg-secondary"
            />
          </div>
        </div>
      </div>

      {isTrackModalOpen && (
        <TrackModal
          onClose={() => setIsTrackModalOpen(false)}
          initialTrackingId={trackingDetails?.id}
        />
      )}
    </section>
  );
};

export default SectionWrapper(ShipmentFinish, "");
