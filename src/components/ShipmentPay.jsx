import { useState } from "react";
import { SectionWrapper } from "../hoc";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PiWarningCircle } from "react-icons/pi";
import { ShippingModal, BankTransferModal } from "../components";
// import { paystack } from '../assets';

const ShipmentPay = ({ onPrev, shipment }) => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isBankTransferModalOpen, setIsBankTransferModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  console.log("Shipment Details:", shipment);

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

  const handlePay = () => {
    setIsBankTransferModalOpen(true);
    disableScroll();
  };

  const handlePrevious = () => {
    onPrev();
  };

  // Format currency based on currency type
  const formatCurrency = (amount, currency = "ngn") => {
    if (!amount) return "0.00";

    const formattedAmount = parseFloat(amount).toFixed(2);
    if (currency.toLowerCase() === "eur") {
      return `€${formattedAmount}`;
    } else {
      return (
        <>
          <span className="line-through">N</span>
          {formattedAmount}
        </>
      );
    }
  };

  // Calculate VAT percentage
  const calculateVatPercentage = () => {
    if (shipment?.cost?.vat && shipment?.cost?.baseAmount) {
      return ((shipment.cost.vat / shipment.cost.baseAmount) * 100).toFixed(1);
    }
    return "7.5";
  };

  return (
    <section
      className="w-full flex md:min-h-[600px] ss:min-h-[800px]
        min-h-[800px]"
    >
      <div
        className="w-full flex md:flex-row flex-col gap-14 
            justify-between"
      >
        <div className="w-full flex flex-col gap-6">
          <h1
            className="text-primary font-bold md:text-[30px] 
                    ss:text-[28px] text-[22px] tracking-tight"
          >
            You're about to pay{" "}
            {formatCurrency(shipment?.cost?.total, shipment?.cost?.currency)}
          </h1>

          <div className="flex flex-col gap-4 w-full">
            <h2
              className="font-bold md:text-[18px] ss:text-[18px] 
                        text-[15px] tracking-tight text-main4 mt-2"
            >
              BILLING DETAILS
            </h2>

            <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
              <div className="flex flex-col gap-0.5">
                <h3
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                                tracking-tight font-bold text-main2"
                >
                  {shipment?.sender?.name ||
                    shipment?.sender?.businessName ||
                    ""}
                </h3>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                                tracking-tight font-medium text-main2"
                >
                  {shipment?.sender?.email || ""}
                </p>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                                tracking-tight font-medium text-main2"
                >
                  {shipment?.sender?.phone || ""}
                </p>
              </div>

              <div className="flex flex-col gap-0.5">
                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                                tracking-tight font-medium text-main2"
                >
                  {shipment?.sender?.address?.line1 || ""}
                </p>

                {shipment?.sender?.address?.line2 && (
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px] 
                                tracking-tight font-medium text-main2"
                  >
                    {shipment.sender.address.line2}
                  </p>
                )}

                {shipment?.sender?.address?.area && (
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                                tracking-tight font-medium text-main2"
                  >
                    {shipment.sender.address.area}
                  </p>
                )}

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                                tracking-tight font-medium text-main2"
                >
                  {shipment?.sender?.address?.city || ""},{" "}
                  {shipment?.sender?.address?.state || ""}
                </p>

                <p
                  className="md:text-[15px] ss:text-[15px] text-[14px]  
                                tracking-tight font-medium text-main2"
                >
                  {shipment?.origin?.country === "IE" ? "Leinster" : ""},{" "}
                  <span className="font-bold">
                    {shipment?.sender?.address?.country || ""}.
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <p
                    className="md:text-[15px] ss:text-[15px] text-[14px]  
                                    tracking-tight font-medium text-main2"
                  >
                    {shipment?.sender?.address?.postalCode || ""}
                  </p>

                  {shipment?.sender?.vatId && (
                    <>
                      <div className="h-[70%] w-[1px] bg-main4" />
                      <p
                        className="md:text-[15px] ss:text-[15px] text-[14px] 
                                    tracking-tight font-medium text-main2"
                      >
                        Tax ID: {shipment.sender.vatId}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p
                  className="text-[13px] navsmooth underline
                                tracking-tight font-semibold text-primary 
                                hover:text-secondary cursor-pointer inline-flex "
                  onClick={() => {
                    setIsShippingModalOpen(true);
                    disableScroll();
                  }}
                >
                  Change shipping address
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-main5 mt-2" />

          <div className="w-full mt-2 flex flex-col gap-5">
            <p
              className="text-main4 text-[12px] font-medium 
                        leading-[18px]"
            >
              By clicking on the Pay Now button, you agree to Envoy Angel's
              Terms of Service and Privacy Policy. Please review the policy and
              terms carefully to understand your rights and obligations.
            </p>

            <div className="w-full">
              <div
                className="flex items-center md:w-[55%] ss:w-[55%]
                            md:gap-5 ss:gap-5 gap-3"
              >
                <button
                  className="bg-none text-[13px] py-3.5 w-[50%]
                                text-primary rounded-full grow2 cursor-pointer
                                items-center justify-center border border-primary"
                  onClick={handlePrevious}
                >
                  <p className="font-semibold">Go back</p>
                </button>

                <button
                  className="bg-primary text-[13px] py-3.5 w-[50%] 
                                flex text-white rounded-full grow4 cursor-pointer
                                items-center justify-center gap-3"
                  onClick={handlePay}
                >
                  <p>Pay Now</p>

                  <HiOutlineArrowRight className="text-[14px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[55%] ss:w-[60%] md:mb-0 ss:mb-0 mb-8">
          <div
            className="bg-primary1 md:p-10 ss:p-10 p-5 flex flex-col 
                    rounded-2xl md:gap-6 ss:gap-6 gap-5 sticky-cart"
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
                  {formatCurrency(
                    shipment?.cost?.baseAmount,
                    shipment?.cost?.currency
                  )}
                </p>
              </div>

              <div
                className="flex justify-between items-center w-full
                            text-main2 font-medium"
              >
                <p>VAT ({calculateVatPercentage()}%)</p>

                <p>
                  {formatCurrency(
                    shipment?.cost?.vat,
                    shipment?.cost?.currency
                  )}
                </p>
              </div>

              {shipment?.cost?.insurance > 0 && (
                <div
                  className="flex justify-between items-center w-full
                              text-main2 font-medium"
                >
                  <p>
                    Insurance Coverage ({shipment.insurance?.type || "Basic"})
                  </p>

                  <p>
                    {formatCurrency(
                      shipment?.cost?.insurance,
                      shipment?.cost?.currency
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center w-full">
              <p className="md:text-[13px] ss:text-[15px] text-[14px]">
                Subtotal:
              </p>

              <p
                className="text-primary md:text-[23px] ss:text-[24px] 
                            text-[22px] font-bold"
              >
                {formatCurrency(
                  shipment?.cost?.total,
                  shipment?.cost?.currency
                )}
              </p>
            </div>

            <div className="w-full h-[1px] bg-main5" />

            <p
              className="text-main4 md:text-[12px] ss:text-[13px]
                        text-[12px] font-medium md:leading-[17px] ss:leading-[18px]
                        leading-[17px]"
            >
              This figure does not include any other extra fees that may be
              incurred via delayed orders, payment gateway fees, etc. For more
              details,{" "}
              <a href="/termsofusage" className="text-primary font-semibold">
                read our terms of usage here.
              </a>
            </p>
          </div>
        </div>
      </div>

      {isShippingModalOpen && (
        <ShippingModal
          onClose={() => {
            setIsShippingModalOpen(false);
            enableScroll();
          }}
          shipment={shipment}
        />
      )}

      {isBankTransferModalOpen && (
        <BankTransferModal
          onClose={() => {
            setIsBankTransferModalOpen(false);
            enableScroll();
          }}
          shipment={shipment}
        />
      )}
    </section>
  );
};

export default SectionWrapper(ShipmentPay, "");
