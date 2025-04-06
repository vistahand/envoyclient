import { useState, useEffect } from "react";
import InternationalIcon from "../../assets/int-ship.svg";
import LocalIcon from "../../assets/loc-ship.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { BsBoxSeam } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";
import { TbCircleCheckFilled, TbTrashX } from "react-icons/tb";
import { PiWarningOctagon } from "react-icons/pi";
import { ShippingModal, RecipientModal, PickupModal } from "../../components";
import { shipments } from "../../services/api";
import { format, parseISO } from "date-fns";

const ShipmentDetails = () => {
  const [shipmentData, setShipmentData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${scrollPosition}px`;
  };

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

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        setLoading(true);

        // Extract shipment ID from query params
        const params = new URLSearchParams(location.search);
        const shipmentId = params.get("id");

        if (!shipmentId) {
          throw new Error("No shipment ID provided");
        }

        // Fetch shipment details
        const response = await shipments.getById(shipmentId);

        if (response.success) {
          setShipmentData(response.data.shipment);
        } else {
          throw new Error(
            response.message || "Failed to fetch shipment details"
          );
        }
      } catch (err) {
        console.error("Error fetching shipment details:", err);
        setError(err.message || "Error loading shipment details");
      } finally {
        setLoading(false);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchShipmentDetails();
    fetchCountries();

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    };
  }, [location.search]);

  if (loading) {
    return (
      <section className="w-full flex mb-6 justify-center items-center min-h-[400px]">
        <p className="text-main4 text-lg">Loading shipment details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex mb-6 justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-mainRed text-lg">{error}</p>
          <button
            onClick={() => navigate("/user/shipments")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Return to Shipments
          </button>
        </div>
      </section>
    );
  }

  if (!shipmentData) {
    return (
      <section className="w-full flex mb-6 justify-center items-center min-h-[400px]">
        <p className="text-main4 text-lg">No shipment data found</p>
      </section>
    );
  }

  // Extract data from shipment for easier access
  const {
    _id,
    trackingNumber,
    type,
    status,
    origin,
    destination,
    sender,
    recipient,
    pickup,
    delivery,
    packages,
    createdAt,
    cost,
    timeline,
  } = shipmentData;

  // Get the latest timeline event
  const getLatestEvent = () => {
    if (!timeline || !timeline.length) return null;

    return timeline.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )[0];
  };

  const latestEvent = getLatestEvent();

  return (
    <section className="w-full flex mb-6">
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex items-center md:gap-0 ss:gap-5 gap-4 mb-3">
          <div className="flex flex-col w-full">
            <h1
              className="text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]"
            >
              Shipment Details - {trackingNumber}
            </h1>

            <h4
              className="text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem]
            leading-[1.2rem]"
            >
              Full details of your shipment
            </h4>
          </div>

          <div className="flex items-center md:gap-3 ss:gap-3 gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-mainalt md:text-[14px] ss:text-[15px] text-[13px] font-semibold outline outline-[1px] outline-main7
              md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-6 px-2.5 flex text-main2 md:rounded-xl ss:rounded-xl
              rounded-lg grow4 cursor-pointer whitespace-nowrap items-center justify-center gap-2"
            >
              <HiArrowLeft className="md:text-[16px] ss:text-[18px] text-[17px]" />

              <p className="font-semibold hidden md:flex">Go back</p>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/trackshipment?tracking=${trackingNumber}`)
              }
              className="bg-primary1 md:text-[14px] ss:text-[14px] text-[13px]
              flex text-primary md:rounded-xl rounded-lg grow4 cursor-pointer whitespace-nowrap
              items-center justify-center gap-2 md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-3 px-2.5"
            >
              <p className="font-semibold hidden md:flex">Report an Issue</p>

              <PiWarningOctagon className="md:text-[16px] ss:text-[18px] text-[17px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:mb-5 ss:mb-5 mb-4">
          <h2 className="font-bold text-[15px] tracking-tight text-main4">
            SHIPMENT STATUS
          </h2>

          <div className="flex gap-4 items-center">
            <div
              className={`md:w-[4.5rem] w-[4rem] 
            ${
              status === "delivered"
                ? "h-auto bg-primary1"
                : "md:h-[4.5rem] h-[4rem] bg-mainalt items-center justify-center flex"
            } 
            rounded-full`}
            >
              {status === "delivered" ? (
                <TbCircleCheckFilled className="md:w-[4.5rem] w-[4rem] h-auto text-primary md:p-4 p-3" />
              ) : (
                <div className="md:w-[2.2rem] w-[2rem] md:h-[2.2rem] h-[2rem] bg-main7 md:p-4 p-3 rounded-full" />
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <h3
                className="md:text-[17px] ss:text-[17px] text-[15px] 
              tracking-tight font-extrabold text-main2 leading-[20px]"
              >
                {status === "pending"
                  ? "Payment Confirmed"
                  : status === "awaiting_pickup"
                  ? "Awaiting Pickup"
                  : status === "in_transit"
                  ? "Package Shipping"
                  : status === "delivered"
                  ? "Package Delivered"
                  : "Processing"}
              </h3>

              <div className="flex items-center gap-3.5">
                <p
                  className="font-medium md:text-[14px] ss:text-[14px] 
                text-[13px] tracking-tight text-main4"
                >
                  {latestEvent
                    ? formatDate(latestEvent.timestamp)
                    : formatDate(createdAt)}
                  <span className="md:hidden ss:hidden">
                    {latestEvent
                      ? format(new Date(latestEvent.timestamp), ", h:mma")
                      : ""}
                  </span>
                </p>

                {latestEvent && (
                  <>
                    <div className="h-[3px] w-[3px] bg-main4 hidden md:flex ss:flex rounded-full" />

                    <p
                      className="font-medium md:text-[14px] ss:text-[14px] 
                    tracking-tight text-main4 hidden md:flex ss:flex"
                    >
                      {format(new Date(latestEvent.timestamp), "h:mma")}
                    </p>
                  </>
                )}
              </div>

              <p
                className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
              tracking-tight text-main4"
              >
                {latestEvent?.description ||
                  (status === "pending"
                    ? "Payment has been confirmed and your shipment is being processed."
                    : status === "awaiting_pickup"
                    ? "Your shipment is ready for pickup."
                    : status === "in_transit"
                    ? `Shipment is on its way from ${origin?.country} to ${destination?.country}.`
                    : status === "delivered"
                    ? "Your package has been delivered successfully."
                    : "Processing your shipment.")}
              </p>
            </div>
          </div>

          <div>
            <p
              className="md:text-[14px] ss:text-[14px] text-[13px] tracking-tight font-semibold 
            text-primary underline hover:text-secondary cursor-pointer 
            inline-flex navsmooth"
              onClick={() =>
                navigate(`/trackshipment?tracking=${trackingNumber}`)
              }
            >
              See full tracking details
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-[15px] tracking-tight text-main4">
            SHIPPING DETAILS
          </h2>

          <div className="flex items-center text-primary gap-2">
            <img
              src={type === "international" ? InternationalIcon : LocalIcon}
              className="w-[1.8rem] h-auto object-contain stroke-primary"
            />

            <h2 className="text-[15px] font-bold tracking-tight">
              {type === "international"
                ? "International Shipping"
                : "Local Shipping"}
            </h2>
          </div>

          <div className="w-full flex gap-6 items-center">
            <div
              className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 
            ss:py-5 py-4 bg-mainalt flex gap-2"
            >
              <img
                src={
                  countries.find((country) => country.cca2 === origin?.country)
                    ?.flags?.png
                }
                alt="flag"
                className="w-10 h-[1.4rem] rounded-[0.2rem]"
              />

              <p
                className="md:text-[15px] ss:text-[15px] 
              text-[14px] tracking-tight font-bold text-main2"
              >
                {origin?.country === "IE" ? "Ireland" : origin?.country}
              </p>
            </div>

            <p
              className="md:text-[15px] ss:text-[15px] 
            text-[14px] tracking-tight font-semibold text-main4"
            >
              to
            </p>

            <div
              className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 
            ss:py-5 py-4 bg-mainalt flex gap-2"
            >
              <img
                src={
                  countries.find(
                    (country) => country.cca2 === destination?.country
                  )?.flags?.png
                }
                alt="flag"
                className="w-10 h-[1.4rem] rounded-[0.2rem]"
              />

              <p
                className="md:text-[15px] ss:text-[15px] 
              text-[14px] tracking-tight font-bold text-main2"
              >
                {destination?.country === "NG"
                  ? "Nigeria"
                  : destination?.country}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full gap-1">
            <p
              className="text-[14px] tracking-tight font-medium 
            text-main4"
            >
              Shipping Date
            </p>

            <h1
              className="md:text-[25px] ss:text-[23px] 
            text-[20px] tracking-tight font-bold text-main2"
            >
              {formatDate(createdAt)}
            </h1>

            <p
              className="text-main4 text-[12px] font-medium 
            md:leading-[16px] leading-[17px] tracking-tight"
            >
              Shipments may not always be shipped on the date of payment.{" "}
              <a
                target="blank"
                href="/termsofusage"
                className="text-primary font-semibold"
              >
                Read our terms for more details.
              </a>
            </p>
          </div>

          <div className="flex flex-col w-full gap-1 mt-3">
            <p
              className="text-[14px] tracking-tight font-medium 
            text-main4"
            >
              Estimated Delivery Date
            </p>

            <h1
              className="md:text-[25px] ss:text-[23px] 
            text-[20px] tracking-tight font-bold text-main2"
            >
              {formatDate(delivery?.estimatedDate)}
            </h1>

            <p
              className="text-main4 text-[12px] font-medium 
            md:leading-[16px] leading-[17px] tracking-tight"
            >
              Estimated delivery date only valid if you make payment before 6PM
              on {format(new Date(createdAt), "do MMMM, yyyy")}
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2" />

        <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
          <h2 className="font-bold text-[15px] tracking-tight text-main4">
            PACKAGE DETAILS
          </h2>

          {packages &&
            packages.map((pkg, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center text-primary gap-3">
                  <BsBoxSeam className="w-[1.5rem] h-auto text-primary" />
                  <h2 className="text-[15px] font-bold tracking-tight">
                    {pkg.packageType.charAt(0).toUpperCase() +
                      pkg.packageType.slice(1)}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-5 items-center mt-3">
                  <div className="flex items-center gap-1">
                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px] 
                  tracking-tight font-medium text-main2"
                    >
                      Weight
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px] 
                  font-medium text-main2"
                    >
                      -
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-bold text-main2"
                    >
                      {pkg.weight}kg
                    </p>
                  </div>

                  <div className="md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4" />

                  <div className="flex items-center gap-1">
                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                    >
                      Length
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  font-medium text-main2"
                    >
                      -
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-bold text-main2"
                    >
                      {pkg.dimensions.length}cm
                    </p>
                  </div>

                  <div className="md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4" />

                  <div className="flex items-center gap-1">
                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                    >
                      Width
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  font-medium text-main2"
                    >
                      -
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-bold text-main2"
                    >
                      {pkg.dimensions.width}cm
                    </p>
                  </div>

                  <div className="md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4" />

                  <div className="flex items-center gap-1">
                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                    >
                      Height
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px]  
                  font-medium text-main2"
                    >
                      -
                    </p>

                    <p
                      className="md:text-[15px] ss:text-[15px] text-[14px] 
                  tracking-tight font-bold text-main2"
                    >
                      {pkg.dimensions.height}cm
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 items-center mt-3">
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                  >
                    {pkg.isFragile ? "Fragile" : "Not Fragile"}
                  </p>

                  <div className="h-[80%] w-[1px] bg-main4" />

                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                  >
                    {pkg.isPerishable ? "Perishable" : "Not Perishable"}
                  </p>

                  <div className="h-[80%] w-[1px] bg-main4" />

                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                  >
                    {pkg.isHazardous ? "Hazardous" : "Not Hazardous"}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2" />

        <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
          <h2 className="font-bold text-[15px] tracking-tight text-main4">
            CONTACT DETAILS
          </h2>

          <div className="flex md:flex-row ss:flex-row flex-col w-full md:gap-16 ss:gap-0 gap-5">
            <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
              <div className="flex flex-col gap-0.5">
                <h3
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                tracking-tight font-bold text-main2"
                >
                  {sender?.name}
                </h3>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                tracking-tight font-medium text-main2"
                >
                  {sender?.email}
                </p>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {sender?.phone}
                </p>
              </div>

              <div className="flex flex-col gap-0.5">
                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {sender?.address?.line1}
                </p>

                {sender?.address?.line2 && (
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px] 
                  tracking-tight font-medium text-main2"
                  >
                    {sender?.address?.line2}
                  </p>
                )}

                {sender?.address?.area && (
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                  >
                    {sender?.address?.area}
                  </p>
                )}

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {sender?.address?.city}, {sender?.address?.state}
                </p>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {sender?.address?.country === "IE" ? "Leinster" : ""},{" "}
                  <span className="font-bold">{sender?.address?.country}.</span>
                </p>

                <div className="flex items-center gap-3">
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                  >
                    {sender?.address?.postalCode}
                  </p>

                  {sender?.vatId && (
                    <>
                      <div className="h-[70%] w-[1px] bg-main4" />
                      <p
                        className="md:text-[15px] ss:text-[15px] text-[14px] 
                      tracking-tight font-medium text-main2"
                      >
                        Tax ID: {sender?.vatId}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p
                  className="text-[13px] tracking-tight font-semibold 
                text-primary underline hover:text-secondary cursor-pointer 
                inline-flex navsmooth"
                  onClick={() => {
                    setIsShippingModalOpen(true);
                    disableScroll();
                  }}
                >
                  Change shipping address
                </p>
              </div>
            </div>

            <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
              <div className="flex flex-col gap-0.5">
                <h3
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                tracking-tight font-bold text-main2"
                >
                  {recipient?.name}
                </h3>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                tracking-tight font-medium text-main2"
                >
                  {recipient?.email}
                </p>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {recipient?.phone}
                </p>
              </div>

              <div className="flex flex-col gap-0.5">
                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {recipient?.address?.line1}
                </p>

                {recipient?.address?.line2 && (
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px] 
                  tracking-tight font-medium text-main2"
                  >
                    {recipient?.address?.line2}
                  </p>
                )}

                {recipient?.address?.area && (
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                  >
                    {recipient?.address?.area}
                  </p>
                )}

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {recipient?.address?.city}, {recipient?.address?.state}
                </p>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                tracking-tight font-medium text-main2"
                >
                  {recipient?.address?.country === "NG" ? "Nigeria" : ""},{" "}
                  <span className="font-bold">
                    {recipient?.address?.country}.
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                  tracking-tight font-medium text-main2"
                  >
                    {recipient?.address?.postalCode}
                  </p>

                  {recipient?.vatId && (
                    <>
                      <div className="h-[70%] w-[1px] bg-main4" />
                      <p
                        className="md:text-[15px] ss:text-[15px] text-[14px] 
                      tracking-tight font-medium text-main2"
                      >
                        Tax ID: {recipient?.vatId}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p
                  className="text-[13px] tracking-tight font-semibold 
                text-primary underline hover:text-secondary cursor-pointer 
                inline-flex navsmooth"
                  onClick={() => {
                    setIsRecipientModalOpen(true);
                    disableScroll();
                  }}
                >
                  Change recipient address
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2" />

        <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
          <h2 className="font-bold text-[15px] tracking-tight text-main4">
            PICKUP LOCATION
          </h2>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-0.5">
              <p
                className="md:text-[15px] ss:text-[15px] text-[14px]  
              tracking-tight font-medium text-main2"
              >
                {pickup?.location?.street}
              </p>

              <p
                className="md:text-[15px] ss:text-[15px] text-[14px]  
              tracking-tight font-medium text-main2"
              >
                {pickup?.location?.city}, {pickup?.location?.country}
              </p>

              <p
                className="md:text-[15px] ss:text-[15px] text-[14px]  
              tracking-tight font-medium text-main2"
              >
                {pickup?.location?.postalCode}
              </p>
            </div>

            <div>
              <p
                className="text-[13px] tracking-tight font-semibold 
              text-primary underline hover:text-secondary cursor-pointer 
              inline-flex navsmooth"
                onClick={() => {
                  setIsPickupModalOpen(true);
                  disableScroll();
                }}
              >
                Change pickup location
              </p>
            </div>
          </div>

          {/* Payment Summary Section */}
          {cost && (
            <div
              className="bg-primary1 md:p-6 ss:p-6 p-4 flex flex-col 
            rounded-2xl md:gap-4 ss:gap-4 gap-3 mt-5"
            >
              <h1 className="font-bold text-[16px] tracking-tight text-main2">
                Payment Summary
              </h1>

              <div
                className="flex flex-col w-full gap-2.5 md:text-[13px] 
              ss:text-[15px] text-[14px] tracking-tight"
              >
                <div
                  className="flex justify-between items-center w-full
                text-main2 font-medium"
                >
                  <p>Shipment Cost</p>
                  <p>
                    {cost?.currency === "eur" ? (
                      <span>€{cost?.baseAmount?.toFixed(2)}</span>
                    ) : (
                      <>
                        <span className="line-through">N</span>
                        {cost?.baseAmount?.toFixed(2)}
                      </>
                    )}
                  </p>
                </div>

                <div
                  className="flex justify-between items-center w-full
                text-main2 font-medium"
                >
                  <p>
                    VAT ({((cost?.vat / cost?.baseAmount) * 100).toFixed(1)}%)
                  </p>
                  <p>
                    {cost?.currency === "eur" ? (
                      <span>€{cost?.vat?.toFixed(2)}</span>
                    ) : (
                      <>
                        <span className="line-through">N</span>
                        {cost?.vat?.toFixed(2)}
                      </>
                    )}
                  </p>
                </div>

                {cost?.insurance > 0 && (
                  <div
                    className="flex justify-between items-center w-full
                  text-main2 font-medium"
                  >
                    <p>Insurance Coverage</p>
                    <p>
                      {cost?.currency === "eur" ? (
                        <span>€{cost?.insurance?.toFixed(2)}</span>
                      ) : (
                        <>
                          <span className="line-through">N</span>
                          {cost?.insurance?.toFixed(2)}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full h-[1px] bg-main5" />

              <div className="flex justify-between items-center w-full">
                <p className="md:text-[13px] ss:text-[15px] text-[14px]">
                  Total:
                </p>
                <p
                  className="text-primary md:text-[23px] ss:text-[24px] 
                text-[22px] font-bold"
                >
                  {cost?.currency === "eur" ? (
                    <span>€{cost?.total?.toFixed(2)}</span>
                  ) : (
                    <>
                      <span className="line-through">N</span>
                      {cost?.total?.toFixed(2)}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isShippingModalOpen && (
        <ShippingModal onClose={() => setIsShippingModalOpen(false)} />
      )}

      {isRecipientModalOpen && (
        <RecipientModal onClose={() => setIsRecipientModalOpen(false)} />
      )}

      {isPickupModalOpen && (
        <PickupModal onClose={() => setIsPickupModalOpen(false)} />
      )}
    </section>
  );
};

export default ShipmentDetails;
