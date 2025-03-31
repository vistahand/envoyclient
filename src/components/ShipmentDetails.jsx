import React, { useState, useEffect } from "react";
import { SectionWrapper } from "../hoc";
import InternationalIcon from "../assets/int-ship.svg";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import { ShippingModal, RecipientModal, PickupModal } from "../components";
import { format } from 'date-fns';
import api from '../services/api'; // Import the axios instance

const ShipmentDetails = ({ onNext }) => {
  const [countries, setCountries] = useState([]);
  const [shipmentData, setShipmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const shipmentId = localStorage.getItem('shipmentId')

  console.log(shipmentId)

   // Fetch shipment data 
   useEffect(() => {
    const fetchShipmentData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/shipments/draft/${shipmentId}`);
        setShipmentData(response.data.data);
      } catch (error) {
        console.error("Error fetching shipment data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
      // Only fetch if shipmentId is provided
      if (shipmentId) {
        fetchShipmentData();
      }
    }, [shipmentId]);

  // Destructure shipment data
  const { 
    pickup, 
    delivery, 
    sender, 
    recipient, 
    packages, 
    cost 
  } = shipmentData?.shipment || {};

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    document.body.style.top = `-${scrollPosition}px`;
  };

  const handleNext = () => {
    onNext();
  };

  // Fetch countries
  useEffect(() => {
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

    fetchCountries();
  }, []);

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle null or undefined values

  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date"; // Handle invalid dates

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[500px]">
        <p>Loading shipment details...</p>
      </div>
    );
  }

    // Error state
    if (error) {
      return (
        <div className="w-full flex justify-center items-center min-h-[500px] text-red-500">
          <p>Error loading shipment details. Please try again later.</p>
        </div>
      );
    }


  return (
    <section className="w-full flex md:min-h-[1320px] ss:min-h-[1500px] min-h-[1800px]">
      <div className="w-full flex md:flex-row flex-col md:gap-14 gap-10 justify-between" >
        <div className="w-full flex flex-col gap-6">
          <h1 className="text-primary font-bold md:text-[30px] ss:text-[28px] text-[22px] tracking-tight">Your Shipment Details</h1>
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-[15px] tracking-tight text-main4">SHIPPING DETAILS</h2>
            <div className="flex items-center text-primary gap-2">
              <img src={InternationalIcon} className="w-[1.8rem] h-auto object-contain stroke-primary"/>
              <h2 className="text-[15px] font-bold tracking-tight">International Shipping</h2>
            </div>
            <div className="w-full flex gap-6 items-center">
              <div className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 ss:py-5 py-4 bg-mainalt flex gap-2">
                <img 
                  src={countries.find((country) => country.cca2 === "IE")?.flags?.png} 
                  alt="Ireland flag" 
                  className="w-10 h-[1.4rem] rounded-[0.2rem]" 
                />
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">Ireland</p>
              </div>
              <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-semibold text-main4">to</p>
              <div className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 ss:py-5 py-4 bg-mainalt flex gap-2">
                <img 
                  src={countries.find((country) => country.cca2 === "NG")?.flags?.png} 
                  alt="Nigeria flag" 
                  className="w-10 h-[1.4rem] rounded-[0.2rem]" 
                />
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">Nigeria</p>
              </div>
            </div>
    {/* Shipping Date */}
    <div className="flex flex-col w-full gap-1">
      <p className="text-[14px] tracking-tight font-medium text-main4">Shipping Date</p>
      <h1 className="md:text-[25px] ss:text-[23px] text-[20px] tracking-tight font-bold text-main2">
        {formatDate(pickup?.date)}
      </h1>
      <p className="text-main4 text-[12px] font-medium md:leading-[16px] leading-[17px] tracking-tight">
        Shipments may not always be shipped on the date of payment.{" "}
        <a target="blank" href="/termsofusage" className="text-primary font-semibold">
          Read our terms for more details.
        </a>
      </p>
    </div>

    {/* Estimated Delivery Date */}
    <div className="flex flex-col w-full gap-1 mt-3">
      <p className="text-[14px] tracking-tight font-medium text-main4">
        Estimated Delivery Date
      </p>
      <h1 className="md:text-[25px] ss:text-[23px] text-[20px] tracking-tight font-bold text-main2">
        {formatDate(delivery?.estimatedDate)}
      </h1>
      <p className="text-main4 text-[12px] font-medium md:leading-[16px] leading-[17px] tracking-tight">
        Estimated delivery date only valid if you make payment before 6PM on the day of shipment
      </p>
    </div>
  </div>

          <div className="w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2" />

          <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
            <h2 className="font-bold text-[15px] tracking-tight text-main4">
              PACKAGE DETAILS
            </h2>
{packages.map((packageDeets) => (
<>
<div className="flex items-center text-primary gap-3">
              <BsBoxSeam className="w-[1.5rem] h-auto text-primary" />
              <h2 className="text-[15px] font-bold tracking-tight capitalize">{packageDeets?.packageType}</h2>
            </div>

            <div className="flex flex-wrap gap-5 items-center">
              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  Weight
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] font-medium text-main2">
                  -
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                  {packageDeets?.weight || 0}kg
                </p>
              </div>

              <div className="md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4" />

              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  Length
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] font-medium text-main2">
                  -
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                  {packageDeets?.dimensions?.length || 0}cm
                </p>
              </div>

              <div className="md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4" />

              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  Width
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] font-medium text-main2">
                  -
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                  {packageDeets?.dimensions?.width || 0}cm
                </p>
              </div>

              <div className="md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4" />

              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  Height
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] font-medium text-main2">
                  -
                </p>
                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                  {packageDeets?.dimensions?.height || 0}cm
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 items-center">
              <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                Fragile: {packageDeets?.isFragile ? 'Yes' : 'No'}
              </p>

              <div className="h-[80%] w-[1px] bg-main4" />

              <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                Perishable: {packageDeets?.isPerishable ? 'Yes' : 'No'}
              </p>
            </div>
</>

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
                  <h3 className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-bold text-main2">
                    {sender?.name}
                  </h3>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.email}
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.phone}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.line1}
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.line2}
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.city}
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {sender?.address?.state}, <span className="font-bold">{sender?.address?.country}</span>
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {sender?.address?.postalCode}
                    </p>

                    <div className="h-[70%] w-[1px] bg-main4" />

                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      Tax ID: {sender?.registrationId || 'N/A'}
                    </p>
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

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.address?.line2}
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.address?.city}
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                    {recipient?.address?.state}, <span className="font-bold">{recipient?.address?.country}</span>
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      {recipient?.address?.postalCode}
                    </p>

                    <div className="h-[70%] w-[1px] bg-main4" />

                    <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                      Tax ID: {recipient?.vatId || 'N/A'}
                    </p>
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
                  {pickup?.location?.street}
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  {pickup?.location?.city}
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  {pickup?.location?.country}
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[14px] tracking-tight font-medium text-main2">
                  {pickup?.location?.postalCode}
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

            <div className="flex flex-col w-full gap-2.5 md:text-[13px] ss:text-[15px] text-[14px] tracking-tight">
              <div className="flex justify-between items-center w-full text-main2 font-medium">
                <p>Shipment Cost</p>
                <p>
                  <span className="line-through">N</span>
                  {cost?.baseAmount?.toLocaleString() || '0.00'}
                </p>
              </div>

              <div className="flex justify-between items-center w-full text-main2 font-medium">
                <p>VAT ({cost?.currency === 'eur' ? '7.5' : '0'}%)</p>
                <p>
                  <span className="line-through">N</span>
                  {cost?.vat?.toLocaleString() || '0.00'}
                </p>
              </div>

              <div className="flex justify-between items-center w-full text-main2 font-medium">
                <p>Insurance Coverage</p>
                <p>
                  <span className="line-through">N</span>
                  {cost?.insurance?.toLocaleString() || '0.00'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <p className="md:text-[13px] ss:text-[15px] text-[14px]">
                Subtotal:
              </p>

              <p className="text-primary md:text-[23px] ss:text-[24px] text-[22px] font-bold">
                <span className="line-through">N</span>
                {cost?.total?.toLocaleString() || '0.00'}
              </p>
            </div>

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

export default SectionWrapper(ShipmentDetails, "");