import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsX } from "react-icons/bs";
import { PiBank } from "react-icons/pi";
import { payments } from "../services/api";
import StripePaymentForm from "./StripePaymentForm";

const BankTransferModal = ({ onClose, handleNext }) => {
  const formRef = useRef();
  const [shipment, setShipment] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState("summary");
  const [paymentDetails, setPaymentDetails] = useState({
    clientSecret: null,
    publishableKey: null,
    shipment: null,
  });

  useEffect(() => {
    const shipmentParams = new URLSearchParams(window.location.search);
    const shipmentParam = shipmentParams.get("shipmentId");
    if (shipmentParam) {
      setShipment(shipmentParam);
    }
  }, []);

  const initializePayment = async () => {
    setLoading(true);
    const storedShipmentId = localStorage.getItem("shipmentId");
    const paymentData = {
      shipmentId: String(storedShipmentId),
    };
    console.log("Initializing payment for shipment:", paymentData);

    try {
      const response = await payments.create(paymentData);

      if (!response.success) {
        throw new Error(
          response.data?.error || "Server returned unsuccessful response"
        );
      }

      setPaymentDetails({
        clientSecret: response.data.clientSecret,
        publishableKey: response.data.publishableKey,
        shipment: response.data.shipment,
      });

      setPaymentStep("payment");
      setLoading(false);
    } catch (error) {
      console.error("Error initializing payment:", error);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment successful:", paymentIntent);
    localStorage.removeItem("shipmentId");

    handleNext({
      paymentId: paymentIntent.id,
      shipmentId: paymentDetails.shipment?._id,
      status: "completed",
    });

    onClose();
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
    document.body.style.top = "0";
  };

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center
            bg-black bg-opacity-40 z-50"
      >
        <div
          className={` ${
            paymentStep === "payment" ? "w-[68rem] " : "max-w-[68rem]"
          } flex md:justify-center mx-5 lg:mx-0 ss:justify-center md:mx-0 ss:mx-16 h-auto`}
        >
          <motion.div
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`bg-white md:rounded-2xl rounded-xl relative
                    shadow-xl flex flex-col w-full items-center max-h-[90vh]`}
          >
            {/* Header */}
            <div
              className="flex justify-between items-center w-full
              md:rounded-2xl rounded-xl 
                        border-b border-b-main7 md:py-6 md:px-10 ss:py-6 
                        ss:px-10 py-5 px-5 top-0 sticky z-10 bg-white"
            >
              <h1
                className="md:text-[30px] ss:text-[25px] text-[20px] 
                            tracking-tight font-bold text-main2"
              >
                {paymentStep === "summary" ? "Bank Transfer" : "Payment"}
              </h1>

              <BsX
                className="md:w-[3.1rem] ss:w-[3.1rem] w-[2rem] h-auto 
                                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full cursor-pointer grow2"
                strokeWidth={0.2}
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
              />
            </div>

            {/* Scrollable Content Area */}
            <div className="w-full overflow-y-auto flex-grow">
              {paymentStep === "summary" && (
                <>
                  <div
                    className="w-full flex md:flex-row ss:flex-row flex-col 
                                  md:gap-8 ss:gap-7 gap-6 items-center justify-center md:px-10 ss:px-10 px-5
                                  md:py-12 ss:py-10 py-6 md:justify-between ss:justify-between"
                  >
                    {/* Nigeria Currency Section */}
                    <div className="w-full flex items-start gap-3">
                      <div className="flex md:gap-3 gap-5 w-full items-center">
                        <div
                          className="md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto 
                                              bg-primary1 rounded-full"
                        >
                          <PiBank
                            className="md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto
                                                  text-primary md:p-4 ss:p-3 p-4"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-3">
                        <div className="flex gap-2 items-center">
                          <img
                            src={
                              countries.find((country) => country.cca2 === "NG")
                                ?.flags?.png
                            }
                            alt="flag"
                            className="w-8 h-[1.2rem] rounded-[0.2rem]"
                          />

                          <p
                            className="md:text-[14px] ss:text-[14px] 
                                                  text-[13px] tracking-tight font-bold text-main2"
                          >
                            Nigeria
                          </p>
                        </div>

                        <h1
                          className="md:text-[25px] ss:text-[23px] text-[20px] 
                                              tracking-tight font-bold text-primary"
                        >
                          ₦412,375.00
                        </h1>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-full bg-main7 md:flex ss:flex hidden" />
                    <div className="w-full h-[1px] bg-main7 md:hidden ss:hidden flex" />

                    {/* Ireland Currency Section */}
                    <div className="w-full flex items-start gap-3">
                      <div className="flex md:gap-3 gap-5 w-full items-center">
                        <div
                          className="md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto 
                                              bg-primary1 rounded-full"
                        >
                          <PiBank
                            className="md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto
                                                  text-primary md:p-4 ss:p-3 p-4"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-3">
                        <div className="flex gap-2 items-center">
                          <img
                            src={
                              countries.find((country) => country.cca2 === "IE")
                                ?.flags?.png
                            }
                            alt="flag"
                            className="w-8 h-[1.2rem] rounded-[0.2rem]"
                          />

                          <p
                            className="md:text-[14px] ss:text-[14px] 
                                              text-[13px] tracking-tight font-bold text-main2"
                          >
                            Ireland
                          </p>
                        </div>

                        <h1
                          className="md:text-[25px] ss:text-[23px] text-[20px] 
                                          tracking-tight font-bold text-primary"
                        >
                          €262.44
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-center w-full md:max-w-[40rem]
                                    ss:max-w-[35rem] md:pb-8 ss:pb-8 pb-5 md:px-10 ss:px-10 px-5"
                  >
                    <p
                      className="text-main4 md:text-[13px] ss:text-[13px] text-[12px] trackng-tight
                                      md:leading-[1.2rem] ss:leading-[1.1rem] leading-[1.1rem] md:text-center ss:text-center"
                    >
                      Proceed to make payment using Stripe's secure payment
                      system. Multiple payment methods available.
                    </p>
                  </div>
                </>
              )}

              {paymentStep === "payment" && (
                <div className="w-full p-6 md:p-10">
                  <StripePaymentForm
                    clientSecret={paymentDetails.clientSecret}
                    publishableKey={paymentDetails.publishableKey}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            {paymentStep === "summary" && (
              <div
                className="flex justify-center w-full border-t md:rounded-2xl rounded-xl border-t-main7 md:py-6 md:px-10 
                ss:py-6 ss:px-10 py-5 px-5 bottom-0 sticky bg-white"
              >
                <button
                  type="button"
                  disabled={loading}
                  className={`bg-primary text-[13px] py-3.5 px-14
                                      text-white rounded-full grow4 cursor-pointer
                                      items-center justify-center mobbut ${
                                        loading ? "opacity-70" : ""
                                      }`}
                  onClick={initializePayment}
                >
                  <p>{loading ? "Initializing..." : "Proceed to Payment"}</p>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BankTransferModal;
