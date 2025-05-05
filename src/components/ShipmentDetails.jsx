import { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import InternationalIcon from "../assets/int-ship.svg";
import LocalIcon from "../assets/loc-ship.svg";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import { ShippingModal, RecipientModal, PickupModal } from "../components";
import { shipments } from "../services/api";
import { format, parseISO } from "date-fns";

const ShipmentDetails = ({ onNext }) => {
  const params = new URLSearchParams(window.location.search);
  const shipmentId = params.get("shipmentId");
  console.log(shipmentId);
  const [countries, setCountries] = useState([]);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shipment data state
  const [shipmentData, setShipmentData] = useState({
    origin: {},
    destination: {},
    packages: [],
    cost: {},
    sender: {},
    recipient: {},
    pickup: {},
    delivery: {},
    type: "",
    createdAt: "",
  });

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${scrollPosition}px`;
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);
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

  const formatCurrency = (amount, currency) => {
    if (!amount) return "0.00";

    switch (currency) {
      case "eur":
        return `€${parseFloat(amount).toFixed(2)}`;
      case "ngn":
        return `₦${parseFloat(amount).toFixed(2)}`;
      default:
        return `${parseFloat(amount).toFixed(2)}`;
    }
  };

  useEffect(() => {
    const fetchShipmentData = async () => {
      try {
        setLoading(true);
        // Get shipment ID from localStorage

        if (!shipmentId) {
          setError("No shipment ID found");
          setLoading(false);
          return;
        }

        // Fetch shipment data from API
        const response = await shipments.getDraftById(shipmentId);
        console.log(response);

        if (response.success && response.data.shipment) {
          setShipmentData(response.data.shipment);
        } else {
          setError(response.message || "Failed to load shipment data");
        }
      } catch (err) {
        console.error("Error fetching shipment data:", err);
        setError("An error occurred while fetching shipment data");
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

    fetchShipmentData();
    fetchCountries();

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.top = "";
    };
  }, []);

  // Extract details from shipment data
  const {
    origin,
    destination,
    packages = [],
    cost,
    sender,
    recipient,
    pickup,
    delivery,
    type = "international",
    createdAt,
  } = shipmentData;

  const hasCustom = packages.some((pkg) => pkg.isCustom === true)
    ? true
    : false;

  const handleNext = () => {
    onNext({
      shipmentDetails: shipmentData,
      hasCustom: hasCustom,
    });
  };

  if (loading) {
    return (
      <section className="w-full flex justify-center items-center md:min-h-[800px] ss:min-h-[800px] min-h-[800px]">
        <p className="text-main4 text-lg">Loading shipment details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex justify-center items-center md:min-h-[800px] ss:min-h-[800px] min-h-[800px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-mainRed text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex md:min-h-[1320px] ss:min-h-[1500px] min-h-[1800px]">
      <div className="w-full flex md:flex-row flex-col md:gap-14 gap-10 justify-between">
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-primary font-bold md:text-[30px] ss:text-[28px] text-[22px] tracking-tight">
            Your Shipment Details
          </h1>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-[15px] tracking-tight text-main4">
              SHIPPING DETAILS
            </h2>
            <div className="flex items-center text-primary gap-2">
              <img
                src={type === "international" ? InternationalIcon : LocalIcon}
                className="w-[1.8rem] h-auto object-contain stroke-primary"
                alt="Shipping type"
              />
              <h2 className="text-[15px] font-bold tracking-tight">
                {type === "international"
                  ? "International Shipping"
                  : "Local Shipping"}
              </h2>
            </div>
            <div className="w-full flex gap-6 items-center">
              <div className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 ss:py-5 py-4 bg-mainalt flex gap-2">
                <img
                  src={
                    countries.find(
                      (country) => country.cca2 === origin?.country
                    )?.flags?.png
                  }
                  alt="Origin country flag"
                  className="w-10 h-[1.4rem] rounded-[0.2rem]"
                />
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                  {origin?.country === "IE" ? "Ireland" : origin?.country}
                </p>
              </div>
              <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-semibold text-main4">
                to
              </p>
              <div className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 ss:py-5 py-4 bg-mainalt flex gap-2">
                <img
                  src={
                    countries.find(
                      (country) => country.cca2 === destination?.country
                    )?.flags?.png
                  }
                  alt="Destination country flag"
                  className="w-10 h-[1.4rem] rounded-[0.2rem]"
                />
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                  {destination?.country === "NG"
                    ? "Nigeria"
                    : destination?.country}
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-1">
              <p className="text-[14px] tracking-tight font-medium text-main4">
                Shipping Date
              </p>
              <h1 className="md:text-[25px] ss:text-[23px] text-[20px] tracking-tight font-bold text-main2">
                {formatDate(createdAt)}
              </h1>
              <p className="text-main4 text-[12px] font-medium md:leading-[16px] leading-[17px] tracking-tight">
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
              <p className="text-[14px] tracking-tight font-medium text-main4">
                Estimated Delivery Date
              </p>
              <h1 className="md:text-[25px] ss:text-[23px] text-[20px] tracking-tight font-bold text-main2">
                {formatDate(delivery?.estimatedDate)}
              </h1>
              <p className="text-main4 text-[12px] font-medium md:leading-[16px] leading-[17px] tracking-tight">
                Estimated delivery date only valid if you make payment before
                6PM on {formatDate(createdAt)}
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
                <div key={index}>
                  <div className="flex items-center text-primary gap-3">
                    <BsBoxSeam className="w-[1.5rem] h-auto text-primary" />
                    <h2 className="text-[15px] font-bold tracking-tight">
                      {pkg.packageType.charAt(0).toUpperCase() +
                        pkg.packageType.slice(1)}
                    </h2>
                  </div>
                </div>
              ))}
          </div>

          <div className="w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2" />

          <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
            <h2 className="font-bold text-[15px] tracking-tight text-main4">
              CONTACT DETAILS
            </h2>

            <div className="flex md:flex-row ss:flex-row flex-col w-full justify-between md:gap-0 ss:gap-0 gap-5">
              <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                <div className="flex flex-col gap-0.5">
                  <h3 className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2 capitalize">
                    {sender?.name}
                  </h3>
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.email}
                  </p>
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.phone || sender?.businessPhone}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.line1}
                  </p>
                  {sender?.address?.line2 && (
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {sender?.address?.line2}
                    </p>
                  )}
                  {sender?.address?.area && (
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {sender?.address?.area}
                    </p>
                  )}
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.city}, {sender?.address?.state}
                  </p>
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.country === "IE" ? "Ireland" : ""},{" "}
                    <span className="font-bold">
                      {sender?.address?.country}.
                    </span>
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {sender?.address?.postalCode}
                    </p>
                    {sender?.vatId && (
                      <>
                        <div className="h-[70%] w-[1px] bg-main4" />
                        <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                          Tax ID: {sender?.vatId || "Nil"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p
                    className="text-[13px] tracking-tight font-semibold text-primary underline hover:text-secondary cursor-pointer inline-flex navsmooth"
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
                  <h3 className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                    {recipient?.name}
                  </h3>
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.email}
                  </p>
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.phone}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.address?.line1}
                  </p>
                  {recipient?.address?.line2 && (
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {recipient?.address?.line2}
                    </p>
                  )}
                  {recipient?.address?.area && (
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {recipient?.address?.area}
                    </p>
                  )}
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.address?.city}, {recipient?.address?.state}
                  </p>
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.address?.country === "NG" ? "Nigeria" : ""},{" "}
                    <span className="font-bold">
                      {recipient?.address?.country}.
                    </span>
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {recipient?.address?.postalCode}
                    </p>
                    {recipient?.vatId && (
                      <>
                        <div className="h-[70%] w-[1px] bg-main4" />
                        <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                          Tax ID: {recipient?.vatId || "Nil"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p
                    className="text-[13px] tracking-tight font-semibold text-primary underline hover:text-secondary cursor-pointer inline-flex navsmooth"
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
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  {pickup?.address?.street}
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  {pickup?.address?.city}, {pickup?.address?.country}
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  {pickup?.address?.postalCode}
                </p>
              </div>

              <div>
                <p
                  className="text-[13px] tracking-tight font-semibold text-primary underline hover:text-secondary cursor-pointer inline-flex navsmooth"
                  onClick={() => {
                    setIsPickupModalOpen(true);
                    disableScroll();
                  }}
                >
                  Change pickup location
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[55%] ss:w-[60%] md:mb-0 ss:mb-0 mb-8">
          <div className="bg-primary1 md:p-10 ss:p-10 p-5 flex flex-col rounded-2xl md:gap-6 ss:gap-6 gap-5 sticky-cart">
            <h1 className="font-bold text-[16px] tracking-tight text-main2">
              Payment Summary
            </h1>

            {hasCustom ? (
              <div className="italic text-gray-400 text-xs justify-center">
                Custom Packages were selected, hence awaiting admin review.{" "}
                <br /> <br />
                Cost analysis will be sent to the client via email
              </div>
            ) : (
              <>
                <div className="flex flex-col w-full gap-2.5 md:text-[13px] ss:text-[15px] text-[14px] tracking-tight">
                  <div className="flex justify-between items-center w-full text-main2 font-medium">
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

                  <div className="flex justify-between items-center w-full text-main2 font-medium">
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
                    <div className="flex justify-between items-center w-full text-main2 font-medium">
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

                <div className="flex justify-between items-center w-full">
                  <p className="md:text-[13px] ss:text-[15px] text-[14px]">
                    Subtotal:
                  </p>
                  <p className="text-primary md:text-[23px] ss:text-[24px] text-[22px] font-bold">
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
              </>
            )}

            <div className="w-full h-[1px] bg-main5" />

            <p className="text-main4 md:text-[12px] ss:text-[13px] text-[12px] font-medium md:leading-[17px] ss:leading-[18px] leading-[17px]">
              This figure does not include any other extra fees that may be
              incurred via delayed orders, payment gateway fees, etc. For more
              details,{" "}
              <a href="/termsofusage" className="text-primary font-semibold">
                read our terms of usage here.
              </a>
            </p>

            <div
              className="bg-primary py-3 w-full flex text-white rounded-full grow4 cursor-pointer items-center gap-3 justify-center"
              onClick={handleNext}
            >
              <p className="text-[12px]">Proceed to Payment</p>
              <HiOutlineArrowRight className="text-[14px]" />
            </div>
          </div>
        </div>
      </div>

      {isShippingModalOpen && (
        <ShippingModal
          onClose={() => {
            setIsShippingModalOpen(false);
            enableScroll();
          }}
          shipmentData={shipmentData}
          onUpdate={() => {
            // Refresh the shipment data after update
            window.location.reload();
          }}
        />
      )}

      {isRecipientModalOpen && (
        <RecipientModal
          onClose={() => {
            setIsRecipientModalOpen(false);
            enableScroll();
          }}
          shipmentData={shipmentData}
          onUpdate={() => {
            // Refresh the shipment data after update
            window.location.reload();
          }}
        />
      )}

      {isPickupModalOpen && (
        <PickupModal
          onClose={() => {
            setIsPickupModalOpen(false);
            enableScroll();
          }}
          values={shipmentData}
          onUpdate={() => {
            // Refresh the shipment data after update
            window.location.reload();
          }}
        />
      )}
    </section>
  );
};

export default SectionWrapper(ShipmentDetails, "");
