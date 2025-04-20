import React, { useState, useEffect, useCallback } from "react";
import { SectionWrapper } from "../hoc";
import { useNavigate, useLocation } from "react-router-dom";
import { TbCircleCheckFilled } from "react-icons/tb";
import { copy, track } from "../assets";
import { shipments } from "../services/api";
import {
  getCurrentShipment,
  getShipmentByTracking,
} from "../utils/shipmentStorage";
import { format, parseISO } from "date-fns";

// Helper function to determine valid status transitions based on current status and payment method
function getValidStatusTransitions(currentStatus, paymentMethod) {
  // Common transitions that apply to both payment methods
  const commonTransitions = {
    awaiting_processing: ["processed", "cancelled"],
    processed: ["awaiting_pickup", "cancelled"],
    awaiting_pickup: ["picked_up", "cancelled"],
    picked_up: ["in_transit", "cancelled"],
    in_transit: ["out_for_delivery", "cancelled"],
    out_for_delivery: ["delivered", "in_transit", "cancelled"],
    delivered: [],
    cancelled: [],
  };

  // Stripe-specific transitions
  if (paymentMethod === "stripe") {
    return (
      {
        pending: ["payment_confirmed", "payment_failed", "cancelled"],
        payment_confirmed: ["awaiting_processing", "cancelled"],
        payment_failed: ["pending", "cancelled"],
        ...commonTransitions,
      }[currentStatus] || []
    );
  }
  // Cash on pickup specific transitions
  else if (paymentMethod === "cash_on_pickup") {
    return (
      {
        pending: ["awaiting_processing", "cancelled"],
        ...commonTransitions,
      }[currentStatus] || []
    );
  }

  // Default transitions if payment method is not specified
  return commonTransitions[currentStatus] || [];
}

const TrackShipment = () => {
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const navigate = useNavigate();
  const location = useLocation();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [nextPossibleStatuses, setNextPossibleStatuses] = useState([]);

  // Add refresh interval in milliseconds (e.g., every 60 seconds)
  const REFRESH_INTERVAL = 60000;

  // Helper function to format dates
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = parseISO(dateString);
      return format(date, "EEEE do MMMM, yyyy");
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  // Helper function to format time
  const formatTime = (dateString) => {
    try {
      if (!dateString) return "";
      const date = parseISO(dateString);
      return format(date, "hh:mma");
    } catch (e) {
      console.error("Time formatting error:", e);
      return "";
    }
  };

  // Extract the fetch function so it can be reused
  const fetchTrackingData = useCallback(async (trackingId) => {
    try {
      if (!trackingId) return false;

      const response = await shipments.track(trackingId);

      if (response.success) {
        // Get existing stored data
        const storedShipment = getShipmentByTracking(trackingId);

        // Use the trackingNumber from the response instead of the parameter
        const responseTrackingNumber =
          response.data.shipment.trackingNumber || trackingId;

        // Get payment method
        const paymentMethod =
          response.data.shipment.payment?.method || "stripe";

        // Update the shipment data, combining stored and fresh data
        const updatedShipmentData = {
          ...storedShipment,
          ...response.data.shipment,
          trackingNumber: responseTrackingNumber,
          // Add origin and destination data if not included in the response
          origin: response.data.shipment.sender?.address?.country
            ? { country: response.data.shipment.sender.address.country }
            : storedShipment?.origin,
          destination: response.data.shipment.recipient?.address?.country
            ? { country: response.data.shipment.recipient.address.country }
            : storedShipment?.destination,
        };

        setShipmentData(updatedShipmentData);

        // Update next possible statuses based on current status and payment method
        setNextPossibleStatuses(
          getValidStatusTransitions(updatedShipmentData.status, paymentMethod)
        );

        // If tracking number has changed, update in the UI
        if (responseTrackingNumber !== trackingId) {
          setTrackingNumber(responseTrackingNumber);
        }

        // Update last refresh time
        setLastRefresh(Date.now());
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error refreshing shipment data:", err);
      return false;
    }
  }, []);

  // Add this function to dynamically determine which timeline steps are completed
  const getTimelineSteps = () => {
    if (!shipmentData) return [];

    // Get the timeline events sorted by timestamp (newest first)
    const sortedTimeline = shipmentData.timeline
      ? [...shipmentData.timeline].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      : [];

    // Find the most recent event for each status type
    const latestStatusEvents = {};
    sortedTimeline.forEach((event) => {
      if (
        !latestStatusEvents[event.status] ||
        new Date(event.timestamp) >
          new Date(latestStatusEvents[event.status].timestamp)
      ) {
        latestStatusEvents[event.status] = event;
      }
    });

    // Get payment method
    const paymentMethod = shipmentData.payment?.method;
    const paymentStatus = shipmentData.payment?.status;
    const isPaid = paymentStatus === "completed";
    const isCashOnPickup = paymentMethod === "cash_on_pickup";

    // Default steps with base data
    let steps = [
      {
        title: "Shipment Created",
        date:
          shipmentData.createdAt ||
          sortedTimeline[sortedTimeline.length - 1]?.timestamp,
        isCompleted: true,
        details: null,
      },
    ];

    // Handle different payment methods with different timeline steps
    if (isCashOnPickup) {
      // For Cash on Pickup method
      steps = [
        ...steps,
        {
          title: "Payment at Pickup",
          date: isPaid ? shipmentData.payment?.paidAt : getAwaitingPickupDate(),
          isCompleted: isPaid,
          details: isPaid
            ? "Payment has been collected and confirmed"
            : "Payment to be made during package drop-off",
          isEstimated: !isPaid,
        },
        {
          title: "Awaiting Pickup",
          date: latestStatusEvents["awaiting_pickup"]?.timestamp,
          isCompleted: !!latestStatusEvents["awaiting_pickup"],
          details: `Pickup scheduled at: ${
            shipmentData.pickup?.address?.street || ""
          }, ${shipmentData.pickup?.address?.city || ""}`,
        },
        {
          title: "Package Pickup",
          date: latestStatusEvents["picked_up"]?.timestamp,
          isCompleted: !!latestStatusEvents["picked_up"],
          details: null,
          isEstimated: !latestStatusEvents["picked_up"],
        },
        {
          title: "Package Shipping",
          date: latestStatusEvents["in_transit"]?.timestamp,
          isCompleted: !!latestStatusEvents["in_transit"] && isPaid,
          details: null,
          isEstimated: !latestStatusEvents["in_transit"],
        },
        {
          title: "Out for Delivery",
          date: latestStatusEvents["out_for_delivery"]?.timestamp,
          isCompleted: !!latestStatusEvents["out_for_delivery"],
          details: null,
          isEstimated: !latestStatusEvents["out_for_delivery"],
        },
        {
          title: "Shipment Arrival",
          date:
            shipmentData.delivery?.actualDate ||
            shipmentData.delivery?.estimatedDate,
          isCompleted: !!latestStatusEvents["delivered"],
          details: null,
          isEstimated: !latestStatusEvents["delivered"],
        },
      ];
    } else {
      // For immediate (Stripe) payment method
      steps = [
        ...steps,
        {
          title: "Payment Completed",
          date: shipmentData.payment?.paidAt,
          isCompleted: isPaid,
          details: null,
        },
        {
          title: "Shipment Processed",
          date: latestStatusEvents["processed"]?.timestamp,
          isCompleted: !!latestStatusEvents["processed"],
          details: null,
        },
        {
          title: "Awaiting Pickup",
          date: latestStatusEvents["awaiting_pickup"]?.timestamp,
          isCompleted: !!latestStatusEvents["awaiting_pickup"],
          details: shipmentData.pickup?.address
            ? `Pickup scheduled at: ${
                shipmentData.pickup.address.street || ""
              }, ${shipmentData.pickup.address.city || ""}`
            : null,
        },
        {
          title: "Package Pickup",
          date: latestStatusEvents["picked_up"]?.timestamp,
          isCompleted: !!latestStatusEvents["picked_up"],
          details: null,
        },
        {
          title: "Package Shipping",
          date: latestStatusEvents["in_transit"]?.timestamp,
          isCompleted: !!latestStatusEvents["in_transit"],
          details: null,
          isEstimated: !latestStatusEvents["in_transit"],
        },
        {
          title: "Out for Delivery",
          date: latestStatusEvents["out_for_delivery"]?.timestamp,
          isCompleted: !!latestStatusEvents["out_for_delivery"],
          details: null,
          isEstimated: !latestStatusEvents["out_for_delivery"],
        },
        {
          title: "Shipment Arrival",
          date:
            shipmentData.delivery?.actualDate ||
            shipmentData.delivery?.estimatedDate,
          isCompleted: !!latestStatusEvents["delivered"],
          details: null,
          isEstimated: !latestStatusEvents["delivered"],
        },
      ];
    }

    return steps;
  };

  // Helper to get the awaiting pickup date from timeline
  const getAwaitingPickupDate = () => {
    if (!shipmentData?.timeline) return null;

    // Find the most recent awaiting_pickup event
    const pickupEvents = shipmentData.timeline
      .filter((event) => event.status === "awaiting_pickup")
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return pickupEvents.length > 0 ? pickupEvents[0].timestamp : null;
  };

  // Monitor for timeline changes
  useEffect(() => {
    if (shipmentData && shipmentData.timeline) {
      const paymentMethod = shipmentData.payment?.method || "stripe";

      // Update next possible statuses whenever shipment data changes
      setNextPossibleStatuses(
        getValidStatusTransitions(shipmentData.status, paymentMethod)
      );

      setLoading(false);
    }
  }, [shipmentData]);

  // Initial data load
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const trackingParam = query.get("tracking");
    setLoading(true);

    if (trackingParam) {
      setTrackingNumber(trackingParam);
      fetchTrackingData(trackingParam).finally(() => setLoading(false));
    } else {
      // Get from local storage if no URL parameter
      const currentShipment = getCurrentShipment();
      if (currentShipment?.trackingNumber) {
        setTrackingNumber(currentShipment.trackingNumber);
        fetchTrackingData(currentShipment.trackingNumber).finally(() =>
          setLoading(false)
        );
      } else {
        setLoading(false);
      }
    }

    setLastRefresh(Date.now());
  }, [location.search, fetchTrackingData]);

  // Set up polling for updates
  useEffect(() => {
    if (!trackingNumber) return;

    // Create interval to refresh data
    const intervalId = setInterval(() => {
      fetchTrackingData(trackingNumber);
    }, REFRESH_INTERVAL);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [trackingNumber, fetchTrackingData, REFRESH_INTERVAL]);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(trackingNumber || "")
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

  const handleRefresh = async () => {
    if (trackingNumber) {
      setLoading(true);
      await fetchTrackingData(trackingNumber);
      setLoading(false);

      // Update URL if needed without page reload
      const query = new URLSearchParams(location.search);
      if (!query.get("tracking")) {
        navigate(`/trackshipment?tracking=${trackingNumber}`, {
          replace: true,
        });
      }
    }
  };

  // Get status text based on current shipment status
  const getStatusHeading = () => {
    if (!shipmentData) return "Tracking your shipment";

    const paymentMethod = shipmentData.payment?.method;
    const paymentStatus = shipmentData.payment?.status;
    const isPaid = paymentStatus === "completed";

    switch (shipmentData.status) {
      case "pending":
        return "Your shipment is pending";
      case "awaiting_processing":
        return "Your shipment is being processed";
      case "processed":
        return "Your shipment has been processed";
      case "awaiting_pickup":
        if (paymentMethod === "cash_on_pickup" && !isPaid) {
          return "Your shipment is awaiting pickup & payment";
        }
        return "Your shipment is awaiting pickup";
      case "picked_up":
        if (paymentMethod === "cash_on_pickup" && !isPaid) {
          return "Your package has been picked up - payment pending";
        }
        return "Your package has been picked up";
      case "in_transit":
        if (paymentMethod === "cash_on_pickup" && !isPaid) {
          return "Your package is on its way - payment due on delivery";
        }
        return "Your package is on its way!";
      case "out_for_delivery":
        return "Your package is out for delivery";
      case "delivered":
        return "Your package has been delivered";
      default:
        return "Tracking your shipment";
    }
  };

  // Generate location text
  const getLocationText = () => {
    const origin =
      shipmentData?.origin?.country === "IE"
        ? "Ireland"
        : shipmentData?.origin?.country;
    const destination =
      shipmentData?.destination?.country === "NG"
        ? "Nigeria"
        : shipmentData?.destination?.country;

    const paymentMethod = shipmentData?.payment?.method;
    const paymentStatus = shipmentData?.payment?.status;
    const isPaid = paymentStatus === "completed";

    let paymentInfo = "";

    if (paymentMethod === "cash_on_pickup" && !isPaid) {
      paymentInfo = " Payment will be collected during package drop-off.";
    }

    if (
      shipmentData?.status === "pending" ||
      shipmentData?.status === "awaiting_processing" ||
      shipmentData?.status === "processed" ||
      shipmentData?.status === "awaiting_pickup"
    ) {
      return `Your shipment will travel from ${origin} to ${destination} once picked up.${paymentInfo}`;
    } else if (
      shipmentData?.status === "picked_up" ||
      shipmentData?.status === "in_transit" ||
      shipmentData?.status === "out_for_delivery"
    ) {
      return `The package is on its way from ${origin} to ${destination}.${paymentInfo}`;
    }

    return `This shipment is from ${origin} to ${destination}.${paymentInfo}`;
  };

  // Debug function to show current status and next possible transitions
  const getStatusInfo = () => {
    if (!shipmentData) return null;

    return (
      <div className="mt-2 text-sm text-main4">
        <p>Current status: {shipmentData.status}</p>
        <p>Payment method: {shipmentData.payment?.method || "Not specified"}</p>
        <p>
          Next possible statuses: {nextPossibleStatuses.join(", ") || "None"}
        </p>
      </div>
    );
  };

  return (
    <section className="w-full flex min-h-[400px] mt-20">
      <div className="w-full flex md:flex-row flex-col gap-14 md:justify-between">
        <div className="md:w-[50%] w-full flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="text-primary font-bold md:text-[35px] ss:text-[33px] text-[27px] tracking-tight md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]">
              {getStatusHeading()}
            </h1>

            {/* Add refresh button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="text-primary hover:text-secondary transition-colors"
            >
              <span className="md:text-[14px] ss:text-[14px] text-[12px] font-medium">
                {loading ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Show last updated time */}
          <p className="text-main4 text-[12px] mb-2">
            Last updated: {new Date(lastRefresh).toLocaleTimeString()}
          </p>

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

            <div className="w-full">
              <p className="md:text-[16px] ss:text-[16px] text-[15px] tracking-tight font-medium text-main2 leading-[23px]">
                {getLocationText()}{" "}
                <span className="font-extrabold">
                  {shipmentData?.status === "awaiting_pickup"
                    ? "The shipment is ready for pickup."
                    : shipmentData?.status === "pending" ||
                      shipmentData?.status === "awaiting_processing"
                    ? "Payment has been confirmed and your shipment is being processed."
                    : ""}
                </span>
              </p>
            </div>

            {/* Uncomment this if you want to show debug info */}
            {getStatusInfo()}
          </div>

          {/* Shipment trail section */}
          <div className="w-full md:mt-6 ss:mt-6 mt-4 gap-5 rounded-xl p-5 border-main7 border flex flex-col">
            <h2 className="font-bold md:text-[17px] ss:text-[18px] text-[16px] tracking-tight text-main4">
              SHIPMENT TRAIL
            </h2>

            {/* Use dynamic timeline rendering */}
            <div className="flex flex-col gap-4 w-full">
              {getTimelineSteps().map((step, index) => (
                <React.Fragment key={step.title}>
                  {/* Timeline step */}
                  <div
                    className={`flex gap-4 items-center ${
                      !step.isCompleted ? "opacity-60" : ""
                    }`}
                  >
                    <div
                      className={`md:w-[4.5rem] w-[4rem] ${
                        step.isCompleted
                          ? "h-auto bg-primary1"
                          : "md:h-[4.5rem] h-[4rem] bg-mainalt items-center justify-center flex"
                      } rounded-full`}
                    >
                      {step.isCompleted ? (
                        <TbCircleCheckFilled className="md:w-[4.5rem] w-[4rem] h-auto text-primary md:p-4 p-3" />
                      ) : (
                        <div className="md:w-[2.2rem] w-[2rem] md:h-[2.2rem] h-[2rem] bg-main7 md:p-4 p-3 rounded-full" />
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <h3 className="md:text-[17px] ss:text-[17px] text-[15px] tracking-tight font-bold text-main2 leading-[20px]">
                        {step.title}
                      </h3>

                      <div className="flex items-center gap-3.5">
                        <p className="font-medium md:text-[14px] ss:text-[14px] text-[13px] tracking-tight text-main4">
                          {step.isEstimated ? "Est.: " : ""}
                          {formatDate(step.date) || "Monday 31st March, 2025"}
                          {!step.isEstimated && (
                            <span className="md:hidden ss:hidden">
                              , {formatTime(step.date)}
                            </span>
                          )}
                        </p>

                        {!step.isEstimated && (
                          <>
                            <div className="h-[3px] w-[3px] bg-main4 hidden md:flex ss:flex rounded-full" />
                            <p className="font-medium md:text-[14px] ss:text-[14px] tracking-tight text-main4 hidden md:flex ss:flex">
                              {formatTime(step.date)}
                            </p>
                          </>
                        )}
                      </div>

                      {step.details && (
                        <p className="font-medium md:text-[14px] ss:text-[14px] text-[13px] tracking-tight text-main4">
                          {step.details}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Connector line (if not the last item) */}
                  {index < getTimelineSteps().length - 1 && (
                    <div
                      className={`md:h-[3rem] ss:h-[3rem] h-[2rem] w-[2px] ${
                        step.isCompleted &&
                        getTimelineSteps()[index + 1].isCompleted
                          ? "bg-primary"
                          : "bg-main5"
                      } md:ml-[2.2rem] ss:ml-[2rem] ml-[1.95rem]`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-[45%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
          <div className="w-full relative md:rounded-2xl ss:rounded-2xl rounded-xl overflow-hidden">
            <img
              src={track}
              alt="shipmentconfirmed"
              className="object-cover md:rounded-2xl ss:rounded-2xl rounded-xl"
            />

            <div className="h-[15px] w-full absolute bottom-0 bg-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(TrackShipment, "");
