import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiArrowLeft, HiOutlineDocumentDownload } from "react-icons/hi";
import { PiWarningOctagon } from "react-icons/pi";
import { payments } from "../../services/api";
import { format } from "date-fns";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const paymentId = searchParams.get("id");

        if (!paymentId) {
          throw new Error("Payment ID is missing");
        }

        const response = await payments.getById(paymentId);

        if (response.success) {
          setPayment(response.data.payment);
        } else {
          throw new Error(
            response.message || "Failed to retrieve payment details"
          );
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError(
          err.message || "An error occurred while fetching payment details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [location.search]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy");
    } catch (e) {
      return dateString || "N/A";
    }
  };

  const formatTime = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return format(date, "hh:mm a");
    } catch (e) {
      return "N/A";
    }
  };

  const formatAmount = (amount, currency) => {
    if (!amount) return "N/A";

    switch (currency?.toLowerCase()) {
      case "eur":
        return `€${parseFloat(amount).toFixed(2)}`;
      case "ngn":
        return `₦${parseFloat(amount).toFixed(2)}`;
      default:
        return `${parseFloat(amount).toFixed(2)}`;
    }
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";

    switch (method) {
      case "stripe":
        return "Online (Stripe)";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      default:
        return (
          method.charAt(0).toUpperCase() + method.slice(1).replace("_", " ")
        );
    }
  };

  if (loading) {
    return (
      <section className="w-full flex mb-6 justify-center items-center py-20">
        <p className="text-main4">Loading payment details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex mb-6 justify-center items-center py-20 flex-col gap-4">
        <p className="text-mainRed">{error}</p>
        <button
          onClick={() => navigate("/user/payments")}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Back to Payments
        </button>
      </section>
    );
  }

  if (!payment) {
    return (
      <section className="w-full flex mb-6 justify-center items-center py-20 flex-col gap-4">
        <p className="text-main4">No payment details found</p>
        <button
          onClick={() => navigate("/user/payments")}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Back to Payments
        </button>
      </section>
    );
  }

  return (
    <section className="w-full flex mb-6">
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex items-center md:gap-0 ss:gap-5 gap-4 mb-3">
          <div className="flex flex-col w-full">
            <h1
              className="text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]"
            >
              Payment Details - {payment.transactionId}
            </h1>

            <h4
              className="text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem]
            leading-[1.2rem]"
            >
              Full details for the payment
            </h4>
          </div>

          <div className="flex items-center md:gap-3 ss:gap-3 gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-mainalt md:text-[14px] ss:text-[15px] text-[13px] font-semibold outline outline-[1px] outline-main7
              md:py-3 ss:py-3 py-2.5 md:px-8 ss:px-3 px-2.5 flex text-main2 md:rounded-xl rounded-lg whitespace-nowrap
              grow4 cursor-pointer items-center justify-center gap-3 md:w-auto"
            >
              <HiArrowLeft className="md:text-[20px] ss:text-[18px] text-[17px]" />

              <p className="hidden md:flex">Go back</p>
            </button>

            <button
              className="bg-main7 md:text-[14px] ss:text-[14px] text-[13px] 
              flex text-main2 md:rounded-xl rounded-lg grow4 cursor-pointer whitespace-nowrap
              items-center justify-center gap-2 md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-3 px-2.5"
              onClick={() => navigate("/user/help")}
            >
              <p className="font-semibold hidden md:flex">Report a problem</p>

              <PiWarningOctagon className="md:text-[16px] ss:text-[18px] text-[17px]" />
            </button>

            <button
              className="bg-primary md:text-[14px] ss:text-[14px] text-[13px]
              flex text-white md:rounded-xl rounded-lg grow4 cursor-pointer whitespace-nowrap
              items-center justify-center gap-2 md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-3 px-2.5"
            >
              <p className="font-semibold hidden md:flex">Download Receipt</p>

              <HiOutlineDocumentDownload className="md:text-[16px] ss:text-[18px] text-[17px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:gap-7 ss:gap-7 gap-6 md:p-8 ss:p-8 p-5 bg-mainalt md:rounded-2xl ss:rounded-2xl rounded-xl">
          <h2
            className="font-bold md:text-[27px] ss:text-[25px] text-[21px] 
          tracking-tight text-primary"
          >
            {formatAmount(
              payment.amount,
              payment.currency || payment.shipmentDetails?.cost?.currency
            )}
          </h2>

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              REFERENCE
            </h2>

            <h2
              className="font-semibold md:text-[17px] ss:text-[17px] text-[15px]  
            tracking-tight text-main2"
            >
              {payment.transactionId}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              STATUS
            </h2>

            <div className="flex md:gap-3 ss:gap-3 gap-2 items-center">
              <div
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  payment.status === "completed"
                    ? "bg-greenSuccess"
                    : "bg-logRed"
                }`}
              />

              <h2
                className="font-semibold md:text-[17px] ss:text-[17px] text-[15px]  
              tracking-tight text-main2"
              >
                {payment.status === "completed" ? "Successful" : "Failed"}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              DATE INITIATED
            </h2>

            <h2
              className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
            tracking-tight text-main2"
            >
              {formatDate(payment.createdAt)} at {formatTime(payment.createdAt)}
            </h2>
          </div>

          {payment.paidAt && (
            <div className="flex flex-col gap-1">
              <h2
                className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
              tracking-tight text-main4"
              >
                DATE COMPLETED
              </h2>

              <h2
                className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
              tracking-tight text-main2"
              >
                {formatDate(payment.paidAt)} at {formatTime(payment.paidAt)}
              </h2>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              PAYMENT PURPOSE
            </h2>

            <h2
              className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
            tracking-tight text-main2"
            >
              {payment.trackingNumber
                ? payment.trackingNumber.startsWith("INT")
                  ? "International"
                  : "Local"
                : payment.shipmentDetails?.type === "international"
                ? "International"
                : "Local"}{" "}
              Shipping
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              SHIPMENT REFERENCE
            </h2>

            <h2
              className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
              tracking-tight text-primary underline cursor-pointer"
              onClick={() =>
                navigate(`/user/shipments/details?id=${payment.shipmentId}`)
              }
            >
              {payment.trackingNumber || "Pending Assignment"}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              BILLED TO
            </h2>

            <h2
              className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
            tracking-tight text-main2"
            >
              {payment.customerDetails?.name || "N/A"}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <h2
              className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
            tracking-tight text-main4"
            >
              PAYMENT METHOD
            </h2>

            <h2
              className="font-semibold md:text-[17px] ss:text-[17px] text-[15px]  
            tracking-tight text-main2"
            >
              {formatPaymentMethod(payment.method)}
            </h2>
          </div>

          {payment.shipmentDetails?.cost &&
            Object.keys(payment.shipmentDetails.cost).length > 0 && (
              <div className="flex flex-col gap-3 mt-2 border-t border-main7 pt-5">
                <h2
                  className="font-bold md:text-[18px] ss:text-[18px] text-[16px] 
              tracking-tight text-primary"
                >
                  Cost Breakdown
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <h3
                      className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
                  tracking-tight text-main4"
                    >
                      Base Amount
                    </h3>
                    <p className="font-semibold md:text-[16px] ss:text-[16px] text-[14px] text-main2">
                      {formatAmount(
                        payment.shipmentDetails.cost.baseAmount,
                        payment.shipmentDetails.cost.currency
                      )}
                    </p>
                  </div>

                  {payment.shipmentDetails.cost.insurance > 0 && (
                    <div className="flex flex-col gap-1">
                      <h3
                        className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
                    tracking-tight text-main4"
                      >
                        Insurance
                      </h3>
                      <p className="font-semibold md:text-[16px] ss:text-[16px] text-[14px] text-main2">
                        {formatAmount(
                          payment.shipmentDetails.cost.insurance,
                          payment.shipmentDetails.cost.currency
                        )}
                      </p>
                    </div>
                  )}

                  {/* <div className="flex flex-col gap-1">
                    <h3
                      className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
                  tracking-tight text-main4"
                    >
                      VAT
                    </h3>
                    <p className="font-semibold md:text-[16px] ss:text-[16px] text-[14px] text-main2">
                      {formatAmount(
                        payment.shipmentDetails.cost.vat,
                        payment.shipmentDetails.cost.currency
                      )}
                    </p>
                  </div> */}

                  {payment.processingFee > 0 && (
                    <div className="flex flex-col gap-1">
                      <h3
                        className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
                    tracking-tight text-main4"
                      >
                        Processing Fee
                      </h3>
                      <p className="font-semibold md:text-[16px] ss:text-[16px] text-[14px] text-main2">
                        {formatAmount(payment.processingFee, payment.currency)}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 col-span-2 border-t border-main7 pt-3 mt-2">
                    <h3
                      className="font-bold md:text-[15px] ss:text-[15px] text-[14px] 
                  tracking-tight text-main4"
                    >
                      TOTAL
                    </h3>
                    <p className="font-bold md:text-[18px] ss:text-[18px] text-[16px] text-primary">
                      {formatAmount(
                        payment.shipmentDetails.cost.total,
                        payment.shipmentDetails.cost.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

          <div className="flex flex-col gap-3 mt-2 border-t border-main7 pt-5">
            <h2
              className="font-bold md:text-[18px] ss:text-[18px] text-[16px] 
            tracking-tight text-primary"
            >
              Shipment Route
            </h2>

            <div className="flex justify-between items-center border border-main7 rounded-lg p-4">
              <div className="flex flex-col gap-1">
                <h3
                  className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
                tracking-tight text-main4"
                >
                  Origin
                </h3>
                <p className="font-semibold md:text-[16px] ss:text-[16px] text-[14px] text-main2">
                  {payment.shipmentDetails?.origin?.country || "N/A"}
                </p>
              </div>

              <div className="flex-1 border-t border-dashed border-main7 mx-4 h-0"></div>

              <div className="flex flex-col gap-1">
                <h3
                  className="font-medium md:text-[14px] ss:text-[14px] text-[13px] 
                tracking-tight text-main4"
                >
                  Destination
                </h3>
                <p className="font-semibold md:text-[16px] ss:text-[16px] text-[14px] text-main2">
                  {payment.shipmentDetails?.destination?.country || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentDetails;
