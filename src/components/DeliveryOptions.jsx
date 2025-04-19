import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiOutlineArrowRight } from "react-icons/hi";
import { SectionWrapper } from "../hoc";
import { wing } from "../assets";
import { useShipment } from "../context/ShipmentContext";
import { useNotifications } from "../context/NotificationContext";
import { deliveryOptions as deliveryOptionsApi } from "../services/api";

// Utility functions for delivery cost calculations
const calculateDeliveryCost = (baseAmount, percentageMarkup) => {
  if (!baseAmount) return 0;
  const markupAmount = (baseAmount * percentageMarkup) / 100;
  return baseAmount + markupAmount;
};

const formatCurrency = (amount, shipmentType) => {
  if (!amount) return "0.00";

  const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (shipmentType === "international") {
    return `€${formattedAmount}`;
  } else {
    // For local (Naira)
    return (
      <>
        <span className="line-through">N</span> {formattedAmount}
      </>
    );
  }
};

const DeliveryCard = ({
  option,
  onNext,
  index,
  totalOptions,
  baseAmount,
  shipmentType,
  date,
  isSelected,
}) => {
  // Calculate estimated delivery date
  const estimatedDate = new Date(date);
  estimatedDate.setDate(estimatedDate.getDate() + option.daysToAdd);

  const formattedDate = estimatedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Calculate total cost with markup
  const totalCost = calculateDeliveryCost(baseAmount, option.percentageMarkup);

  // Standard is usually the last option
  const isStandard = index === totalOptions - 1;

  return (
    <div className="w-full flex md:flex-row ss:flex-row flex-col">
      <div
        className={`${
          isStandard
            ? "w-full md:rounded-2xl ss:rounded-2xl rounded-xl bg-mainalt border border-main5 text-main2"
            : "md:w-[85%] ss:w-[85%] w-full md:rounded-l-2xl ss:rounded-l-2xl mobdel bg-primary text-white"
        }
          flex md:flex-row ss:flex-row flex-col justify-between md:px-7 px-7 md:py-10 py-8 md:items-center ss:items-center
          md:gap-0 ss:gap-0 gap-4 cursor-pointer hover:opacity-95 transition-opacity relative`}
        onClick={() => onNext()}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Selected
          </div>
        )}

        <div className="flex flex-col gap-1">
          <p
            className="md:text-[13px] ss:text-[13px] text-[12px]
            tracking-tight"
          >
            Estimated Delivery Date
          </p>

          <h1
            className="md:text-[20px] ss:text-[20px] text-[18px]
            font-bold tracking-tight md:block ss:block hidden"
          >
            {formattedDate}{" "}
            <span
              className="md:text-[19px] ml-2
              ss:text-[19x] text-[16px] font-normal"
            >
              |{" "}
            </span>
            <span
              className="md:text-[19px] ml-2
              ss:text-[19x] text-[16px] font-medium"
            >
              {option.estimatedDeliveryTime}
            </span>
          </h1>

          <div
            className="flex flex-col tracking-tight 
            ss:hidden md:hidden gap-1"
          >
            <h1 className="text-[20px] font-bold">{formattedDate}</h1>
            <h2 className="text-[15px] font-medium">
              {option.estimatedDeliveryTime}
            </h2>
          </div>

          <p
            className={`md:text-[13px] ss:text-[13px] text-[11px]
            tracking-tight ${isStandard ? "text-main4" : ""}`}
          >
            Book a shipment before noon to schedule a pickup on the same day
          </p>

          {option.percentageMarkup > 0 && (
            <p
              className={`text-[12px] ${
                isStandard ? "text-main4" : "text-white opacity-80"
              } mt-1 italic`}
            >
              {option.percentageMarkup}% added to base shipping cost
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p
            className="md:text-[13px] ss:text-[13px] text-[12px]
            tracking-tight text-right"
          >
            {option.percentageMarkup > 0 ? "Priority Rate" : "Standard Rate"}
          </p>

          <h1
            className={`md:text-[25px] ss:text-[25px] text-[28px] text-right
            font-bold tracking-tight ${isStandard ? "text-primary" : ""}`}
          >
            {shipmentType === "international" ? (
              <>
                €
                {totalCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </>
            ) : (
              <>
                <span className="line-through">N</span>{" "}
                {totalCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </>
            )}
          </h1>

          <div className="flex justify-end">
            <HiOutlineArrowRight
              className={`text-[18px] ${isStandard ? "text-primary" : ""}`}
            />
          </div>
        </div>
      </div>

      {option.isExpress && (
        <div
          className={`${isStandard ? "hidden" : "flex"}
            md:w-[15%] ss:w-[15%] w-full flex-col px-2 md:py-10 ss:py-8 py-3.5 items-center 
            justify-center gap-0.5 bg-secondary md:rounded-r-2xl ss:rounded-r-2xl 
            mobdel2 relative overflow-hidden text-white mobdelheight`}
        >
          <img
            src={wing}
            alt="wing"
            className="absolute bottom-0 mobimg md:w-[10rem] ss:w-[9rem] w-[6.2rem] h-auto]"
          />

          <div className="z-10 flex flex-col items-center">
            <h1
              className="md:text-[20px] ss:text-[19px] text-[16px]
              font-bold tracking-tight"
            >
              {option.name}
            </h1>

            <p
              className="md:text-[13px] ss:text-[13px] text-[12px]
              tracking-tight text-center"
            >
              {option.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const DeliveryOptions = ({
  onPrev,
  onNext,
  selectedTab,
  calculatedCost,
  initialData,
}) => {
  const { addNotification } = useNotifications();
  const Id = new URLSearchParams(window.location.search).get("id");
  const shipmentId = String(Id);
  const [baseShippingCost, setBaseShippingCost] = useState(0);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [isloading, setLoading] = useState(true);
  const [shipmentData, setShipmentData] = useState(null);
  const formRef = useRef();
  const { updateDeliveryOptions, loading, error, loadShipmentDraft } =
    useShipment();

  // Load shipment data
  useEffect(() => {
    const fetchShipmentData = async () => {
      try {
        const data = await loadShipmentDraft(shipmentId);
        console.log("shipmentData from server: ", data);
        setShipmentData(data);
      } catch (err) {
        console.error("Error loading shipment draft:", err);
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load shipment data",
        });
      }
    };

    if (shipmentId) {
      fetchShipmentData();
    }
  }, []);

  // Fetch DeliveryOptions
  useEffect(() => {
    const getDeliveryOptions = async () => {
      setLoading(true);
      try {
        console.log("Starting");
        deliveryOptionsApi.getAll().then((response) => {
          console.log("Delivery Options response:", response);
          if (response && response.data.deliveryOptions) {
            // Transform the data structure to match component expectations
            const transformedOptions = response.data.deliveryOptions.map(
              (item) => ({
                _id: item._id,
                name: item.name,
                description: item.description,
                estimatedDeliveryTime: item.estimatedDeliveryTime,
                percentageMarkup: item.percentageMarkup,
                isExpress: item.isExpress,
                daysToAdd: item.daysToAdd,
                active: item.active,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                __v: item.__v,
              })
            );

            setDeliveryOptions(transformedOptions);
          } else {
            throw new Error("Invalid response format");
          }
        });
      } catch (error) {
        console.error("Error fetching delivery Options:", error);
        addNotification({
          type: "error",
          title: "Error",
          message: "Error fetching delivery options",
        });
      } finally {
        setLoading(false);
      }
    };

    getDeliveryOptions();
  }, []); // Remove locations dependency to prevent infinite loop

  // Determine the base shipping cost from server data or prop
  useEffect(() => {
    // Priority of cost sources:
    // 1. shipmentData.cost.baseAmount from server
    // 2. initialData.options.baseAmount from server
    // 3. calculatedCost from previous page
    // 4. Default to 0

    if (shipmentData?.cost?.baseAmount) {
      setBaseShippingCost(shipmentData.cost.baseAmount);
      console.log("Got my data from the server");
    } else if (initialData?.options?.baseAmount) {
      setBaseShippingCost(initialData.options.baseAmount);
    } else if (calculatedCost) {
      setBaseShippingCost(calculatedCost);
    } else {
      setBaseShippingCost(0);
    }

    // If there's a saved delivery option, preselect it
    if (initialData?.options?.deliveryOption && deliveryOptions.length > 0) {
      const savedOption = deliveryOptions.find(
        (opt) => opt.name === initialData.options.deliveryOption
      );
      if (savedOption) {
        setSelectedDeliveryOption(savedOption);
      }
    }
  }, [shipmentData, initialData, calculatedCost, deliveryOptions]);

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      date: initialData?.actualDate || today,
    },

    validationSchema: Yup.object({
      date: Yup.string().required("Date is required."),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!shipmentData?.id) {
          throw new Error(
            "No shipment ID found. Please try again from step 1."
          );
        }

        // Check if shipmentID is valid - not "drafts" or other invalid values
        if (
          shipmentData.id === "drafts" ||
          typeof shipmentData.id !== "string" ||
          shipmentData.id.length !== 24
        ) {
          throw new Error("Invalid shipment ID. Please restart from step 1.");
        }

        if (!selectedDeliveryOption) {
          throw new Error("Please select a delivery option");
        }

        // Calculate the total cost with the selected delivery option
        const totalCost = calculateDeliveryCost(
          baseShippingCost,
          selectedDeliveryOption.percentageMarkup
        );

        // Calculate estimated delivery date
        const estimatedDate = new Date(values.date);
        estimatedDate.setDate(
          estimatedDate.getDate() + selectedDeliveryOption.daysToAdd
        );

        const deliveryData = {
          estimatedDate: estimatedDate.toISOString(),
          actualDate: values.date,
          options: {
            deliveryOption: selectedDeliveryOption.name,
            deliveryPercentage: selectedDeliveryOption.percentageMarkup,
            baseAmount: baseShippingCost,
            totalCost: totalCost,
            timeWindow: {
              start: `${values.date}T08:00:00.000Z`,
              end: `${values.date}T18:00:00.000Z`,
            },
            specialInstructions: "Leave at the front door",
            requiresSignature: selectedDeliveryOption.isExpress,
          },
        };

        const response = await updateDeliveryOptions(deliveryData);

        if (response?.success) {
          // Prepare the cost data object to pass to the parent component
          const costData = {
            base: baseShippingCost,
            markup: selectedDeliveryOption.percentageMarkup,
            total: totalCost,
          };

          // Pass the cost data to the parent component
          onNext(selectedTab, costData);
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response?.error || "Failed to update delivery options",
          });
        }
      } catch (err) {
        addNotification({
          type: "error",
          title: "Error",
          message: err.message,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePrevious = () => {
    onPrev(selectedTab);
  };

  const handleSelectOption = (option) => {
    setSelectedDeliveryOption(option);

    // Validate the form first
    const errors = formik.validateForm();
    if (Object.keys(errors).length === 0) {
      // Calculate the total cost with the selected delivery option
      const totalCost = calculateDeliveryCost(
        baseShippingCost,
        option.percentageMarkup
      );

      // Submit the form directly here to update delivery options
      formik.submitForm(totalCost);
    } else {
      // If there are validation errors, touch all fields to show errors
      formik.setTouched({ date: true });
    }
  };

  if (isloading && !deliveryOptions.length) {
    return <div className="text-center py-10">Loading delivery options...</div>;
  }

  return (
    <section
      className="w-full flex md:min-h-[900px] ss:min-h-[820px]
    min-h-[1400px]"
    >
      <div className="flex items-center w-full flex-col">
        <div className="w-full flex flex-col gap-1.5 items-center">
          <h1
            className="text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center"
          >
            Check out your delivery options!
          </h1>

          <p
            className="text-main4 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight text-center"
          >
            Select your preferred delivery method from the displayed options
          </p>

          {baseShippingCost > 0 && (
            <div className="mt-4 bg-primary1 px-6 py-3 rounded-lg">
              <p className="text-main2 font-medium">
                Base Shipping Cost:{" "}
                <span className="font-bold text-primary">
                  {formatCurrency(baseShippingCost, selectedTab)}
                </span>
              </p>
            </div>
          )}
        </div>

        <form
          ref={formRef}
          onSubmit={formik.handleSubmit}
          className="md:w-[85%] w-full md:mt-12 ss:mt-10 mt-8"
        >
          <div className="flex flex-col w-full items-center gap-8">
            {/* <div className="w-full">
              <div
                className="inline-flex flex-col relative
                        md:w-[25%] ss:w-[25%] w-[50%]"
              >
                <input
                  type="date"
                  name="date"
                  placeholder=""
                  min={today} // Prevent selecting dates in the past
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                peer outline text-black md:rounded-lg rounded-md 
                                md:text-[15px] ss:text-[14px] text-[13px] outline-[1px]
                                bg-transparent w-full focus:outline-primary cursor-pointer
                                ${
                                  formik.touched.date && formik.errors.date
                                    ? "outline-mainRed"
                                    : "outline-main6"
                                }
                                `}
                />

                <label
                  htmlFor="date"
                  className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                            md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                            md:text-[15px] ss:text-[14px] text-[13px] bg-white peer-focus:px-2
                            duration-300 peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                            ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                            ${formik.values.date ? "z-10 px-2" : ""}
                            `}
                >
                  Shipment Date
                </label>

                <p
                  className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                >
                  {formik.touched.date && formik.errors.date}
                </p>
              </div>
            </div> */}

            <div className="w-full flex flex-col gap-6">
              {deliveryOptions && deliveryOptions.length > 0 ? (
                deliveryOptions.map((option, index) => (
                  <DeliveryCard
                    key={option._id || index}
                    index={index}
                    option={option}
                    onNext={() => handleSelectOption(option)}
                    totalOptions={deliveryOptions.length}
                    baseAmount={baseShippingCost || 0}
                    shipmentType={selectedTab}
                    date={formik.values.date}
                    isSelected={selectedDeliveryOption?._id === option._id}
                  />
                ))
              ) : (
                <div className="text-center py-6">
                  No delivery options available
                </div>
              )}
            </div>

            {loading && (
              <div className="text-center text-primary">
                <p>Processing your selection...</p>
              </div>
            )}

            {error && (
              <div className="text-center text-mainRed">
                <p>{error}</p>
              </div>
            )}

            <div
              className="mt-3 flex w-full items-center 
                    justify-center"
            >
              <button
                type="button"
                className="bg-none text-[13px] py-3.5 px-14
                        text-primary rounded-full grow2 cursor-pointer
                        items-center justify-center border border-primary"
                onClick={handlePrevious}
                disabled={loading}
              >
                <p className="font-semibold">Go back</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SectionWrapper(DeliveryOptions, "");

// import React, { useRef, useState, useEffect } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { HiOutlineArrowRight } from "react-icons/hi";
// import { SectionWrapper } from "../hoc";
// import { wing } from "../assets";
// import { useShipment } from "../context/ShipmentContext";
// import { useNotifications } from "../context/NotificationContext";
// import { deliveryOptions as deliveryOptionsAPI } from "../services/api";

// // Utility functions for delivery cost calculations
// const calculateDeliveryCost = (baseAmount, percentageMarkup) => {
//   if (!baseAmount) return 0;
//   const markupAmount = (baseAmount * percentageMarkup) / 100;
//   return baseAmount + markupAmount;
// };

// const formatCurrency = (amount, shipmentType) => {
//   if (!amount) return "0.00";

//   const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   if (shipmentType === "international") {
//     return `€${formattedAmount}`;
//   } else {
//     // For local (Naira)
//     return (
//       <>
//         <span className="line-through">N</span> {formattedAmount}
//       </>
//     );
//   }
// };

// const DeliveryCard = ({
//   option,
//   onNext,
//   index,
//   totalOptions,
//   baseAmount,
//   shipmentType,
//   date,
//   isSelected,
// }) => {
//   // Calculate estimated delivery date
//   const estimatedDate = new Date(date);
//   estimatedDate.setDate(estimatedDate.getDate() + option.daysToAdd);

//   const formattedDate = estimatedDate.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//   });

//   // Calculate total cost with markup
//   const totalCost = calculateDeliveryCost(baseAmount, option.percentageMarkup);

//   // Standard is usually the last option
//   const isStandard = index === totalOptions - 1;

//   return (
//     <div className="w-full flex md:flex-row ss:flex-row flex-col">
//       <div
//         className={`${
//           isStandard
//             ? "w-full md:rounded-2xl ss:rounded-2xl rounded-xl bg-mainalt border border-main5 text-main2"
//             : "md:w-[85%] ss:w-[85%] w-full md:rounded-l-2xl ss:rounded-l-2xl mobdel bg-primary text-white"
//         }
//           flex md:flex-row ss:flex-row flex-col justify-between md:px-7 px-7 md:py-10 py-8 md:items-center ss:items-center
//           md:gap-0 ss:gap-0 gap-4 cursor-pointer hover:opacity-95 transition-opacity relative`}
//         onClick={() => onNext()}
//       >
//         {isSelected && (
//           <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
//             Selected
//           </div>
//         )}

//         <div className="flex flex-col gap-1">
//           <p
//             className="md:text-[13px] ss:text-[13px] text-[12px]
//             tracking-tight"
//           >
//             Estimated Delivery Date
//           </p>

//           <h1
//             className="md:text-[20px] ss:text-[20px] text-[18px]
//             font-bold tracking-tight md:block ss:block hidden"
//           >
//             {formattedDate}{" "}
//             <span
//               className="md:text-[19px] ml-2
//               ss:text-[19x] text-[16px] font-normal"
//             >
//               |{" "}
//             </span>
//             <span
//               className="md:text-[19px] ml-2
//               ss:text-[19x] text-[16px] font-medium"
//             >
//               {option.estimatedDeliveryTime}
//             </span>
//           </h1>

//           <div
//             className="flex flex-col tracking-tight
//             ss:hidden md:hidden gap-1"
//           >
//             <h1 className="text-[20px] font-bold">{formattedDate}</h1>
//             <h2 className="text-[15px] font-medium">
//               {option.estimatedDeliveryTime}
//             </h2>
//           </div>

//           <p
//             className={`md:text-[13px] ss:text-[13px] text-[11px]
//             tracking-tight ${isStandard ? "text-main4" : ""}`}
//           >
//             Book a shipment before noon to schedule a pickup on the same day
//           </p>

//           {option.percentageMarkup > 0 && (
//             <p
//               className={`text-[12px] ${
//                 isStandard ? "text-main4" : "text-white opacity-80"
//               } mt-1 italic`}
//             >
//               {option.percentageMarkup}% added to base shipping cost
//             </p>
//           )}
//         </div>

//         <div className="flex flex-col gap-1">
//           <p
//             className="md:text-[13px] ss:text-[13px] text-[12px]
//             tracking-tight text-right"
//           >
//             {option.percentageMarkup > 0 ? "Priority Rate" : "Standard Rate"}
//           </p>

//           <h1
//             className={`md:text-[25px] ss:text-[25px] text-[28px] text-right
//             font-bold tracking-tight ${isStandard ? "text-primary" : ""}`}
//           >
//             {shipmentType === "international" ? (
//               <>
//                 €
//                 {totalCost.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </>
//             ) : (
//               <>
//                 <span className="line-through">N</span>{" "}
//                 {totalCost.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </>
//             )}
//           </h1>

//           <div className="flex justify-end">
//             <HiOutlineArrowRight
//               className={`text-[18px] ${isStandard ? "text-primary" : ""}`}
//             />
//           </div>
//         </div>
//       </div>

//       {option.isExpress && (
//         <div
//           className={`${isStandard ? "hidden" : "flex"}
//             md:w-[15%] ss:w-[15%] w-full flex-col px-2 md:py-10 ss:py-8 py-3.5 items-center
//             justify-center gap-0.5 bg-secondary md:rounded-r-2xl ss:rounded-r-2xl
//             mobdel2 relative overflow-hidden text-white mobdelheight`}
//         >
//           <img
//             src={wing}
//             alt="wing"
//             className="absolute bottom-0 mobimg md:w-[10rem] ss:w-[9rem] w-[6.2rem] h-auto]"
//           />

//           <div className="z-10 flex flex-col items-center">
//             <h1
//               className="md:text-[20px] ss:text-[19px] text-[16px]
//               font-bold tracking-tight"
//             >
//               {option.name}
//             </h1>

//             <p
//               className="md:text-[13px] ss:text-[13px] text-[12px]
//               tracking-tight text-center"
//             >
//               {option.description}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const DeliveryOptions = ({
//   onPrev,
//   onNext,
//   selectedTab,
//   calculatedCost,
//   initialData,
// }) => {
//   const formRef = useRef();
//   const { updateDeliveryOptions, loading, error, shipmentData } = useShipment();
//   const { addNotification } = useNotifications();
//   const [baseShippingCost, setBaseShippingCost] = useState(0);
//   const [deliveryOptionsList, setDeliveryOptionsList] = useState([]);
//   const [fetchingOptions, setFetchingOptions] = useState(false);
//   const [fetchError, setFetchError] = useState(null);

//   // Get today's date
//   const today = new Date().toISOString().split("T")[0];

//   // State to track selected delivery option
//   const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);

//   // Fetch delivery options from the API
//   useEffect(() => {
//     const fetchDeliveryOptions = async () => {
//       try {
//         setFetchingOptions(true);
//         setFetchError(null);

//         const response = await deliveryOptionsAPI.getAll();
//         console.log("Delivery options API response:", response);

//         // Handle different possible response formats
//         const options = response.data?.deliveryOptions || response.data || [];

//         if (options && Array.isArray(options) && options.length > 0) {
//           // Add the required ID field if it doesn't exist (_id from MongoDB)
//           const formattedOptions = options.map((option) => ({
//             ...option,
//             id:
//               option._id ||
//               option.id ||
//               Math.random().toString(36).substr(2, 9),
//           }));

//           setDeliveryOptionsList(formattedOptions);

//           // If there's a saved delivery option, preselect it
//           if (
//             initialData?.options?.deliveryOption &&
//             formattedOptions.length > 0
//           ) {
//             const savedOption = formattedOptions.find(
//               (opt) => opt.name === initialData.options.deliveryOption
//             );
//             if (savedOption) {
//               setSelectedDeliveryOption(savedOption);
//             }
//           }
//         } else {
//           setDeliveryOptionsList([
//             {
//               id: 1,
//               name: "QuickWing",
//               description: "Enjoy fast, priority shipping",
//               estimatedDeliveryTime: "2PM at the earliest",
//               percentageMarkup: 20,
//               isExpress: true,
//               daysToAdd: 1,
//             },
//             {
//               id: 2,
//               name: "Standard",
//               description: "Regular shipping option",
//               estimatedDeliveryTime: "Within 3 days",
//               percentageMarkup: 0,
//               isExpress: false,
//               daysToAdd: 3,
//             },
//           ]);
//           setFetchError("No delivery options available");
//           console.log("Delivery options list:", deliveryOptionsList);
//         }
//       } catch (err) {
//         console.error("Error fetching delivery options:", err);
//         setFetchError(
//           "Failed to load delivery options. Please try again later."
//         );
//         // Fallback to default options in case of error
//         setDeliveryOptionsList([
//           {
//             id: 1,
//             name: "QuickWing",
//             description: "Enjoy fast, priority shipping",
//             estimatedDeliveryTime: "2PM at the earliest",
//             percentageMarkup: 20,
//             isExpress: true,
//             daysToAdd: 1,
//           },
//           {
//             id: 2,
//             name: "Standard",
//             description: "Regular shipping option",
//             estimatedDeliveryTime: "Within 3 days",
//             percentageMarkup: 0,
//             isExpress: false,
//             daysToAdd: 3,
//           },
//         ]);

//         addNotification({
//           type: "warning",
//           title: "Using default options",
//           message: "Using default delivery options due to connection issue",
//         });
//       } finally {
//         setFetchingOptions(false);
//       }
//     };

//     fetchDeliveryOptions();
//   }, [initialData]);

//   // Determine the base shipping cost from server data or prop
//   useEffect(() => {
//     // Priority of cost sources:
//     // 1. shipmentData.cost.baseAmount from server
//     // 2. initialData.options.baseAmount from server
//     // 3. calculatedCost from previous page
//     // 4. Default to 0

//     if (shipmentData?.cost?.baseAmount) {
//       setBaseShippingCost(shipmentData.cost.baseAmount);
//     } else if (initialData?.options?.baseAmount) {
//       setBaseShippingCost(initialData.options.baseAmount);
//     } else if (calculatedCost) {
//       setBaseShippingCost(calculatedCost);
//     } else {
//       setBaseShippingCost(0);
//     }

//     // If there's a saved delivery option, preselect it
//     if (initialData?.options?.deliveryOption) {
//       const savedOption = deliveryOptionsList.find(
//         (opt) => opt.name === initialData.options.deliveryOption
//       );
//       if (savedOption) {
//         setSelectedDeliveryOption(savedOption);
//       }
//     }
//   }, [shipmentData, initialData, calculatedCost, deliveryOptionsList]);

//   const formik = useFormik({
//     initialValues: {
//       date: initialData?.actualDate || today,
//     },

//     validationSchema: Yup.object({
//       date: Yup.string().required("Date is required."),
//     }),

//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         if (!shipmentData?.id) {
//           throw new Error(
//             "No shipment ID found. Please try again from step 1."
//           );
//         }

//         // Check if shipmentID is valid - not "drafts" or other invalid values
//         if (
//           shipmentData.id === "drafts" ||
//           typeof shipmentData.id !== "string" ||
//           shipmentData.id.length !== 24
//         ) {
//           throw new Error("Invalid shipment ID. Please restart from step 1.");
//         }

//         if (!selectedDeliveryOption) {
//           throw new Error("Please select a delivery option");
//         }

//         // Calculate the total cost with the selected delivery option
//         const totalCost = calculateDeliveryCost(
//           baseShippingCost,
//           selectedDeliveryOption.percentageMarkup
//         );

//         // Calculate estimated delivery date
//         const estimatedDate = new Date(values.date);
//         estimatedDate.setDate(
//           estimatedDate.getDate() + selectedDeliveryOption.daysToAdd
//         );

//         const deliveryData = {
//           estimatedDate: estimatedDate.toISOString(),
//           actualDate: values.date,
//           options: {
//             deliveryOption: selectedDeliveryOption.name,
//             deliveryOptionId:
//               selectedDeliveryOption._id || selectedDeliveryOption.id, // Support both MongoDB _id and client-side id
//             deliveryPercentage: selectedDeliveryOption.percentageMarkup,
//             baseAmount: baseShippingCost,
//             totalCost: totalCost,
//             timeWindow: {
//               start: `${values.date}T08:00:00.000Z`,
//               end: `${values.date}T18:00:00.000Z`,
//             },
//             specialInstructions:
//               selectedDeliveryOption.specialInstructions ||
//               "Leave at the front door",
//             requiresSignature: selectedDeliveryOption.isExpress,
//           },
//         };

//         const response = await updateDeliveryOptions(deliveryData);

//         if (response?.success) {
//           // Prepare the cost data object to pass to the parent component
//           const costData = {
//             base: baseShippingCost,
//             markup: selectedDeliveryOption.percentageMarkup,
//             total: totalCost,
//           };

//           // Pass the cost data to the parent component
//           onNext(selectedTab, costData);
//         } else {
//           addNotification({
//             type: "error",
//             title: "Error",
//             message: response?.error || "Failed to update delivery options",
//           });
//         }
//       } catch (err) {
//         addNotification({
//           type: "error",
//           title: "Error",
//           message: err.message,
//         });
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   const handlePrevious = () => {
//     onPrev(selectedTab);
//   };

//   const handleSelectOption = (option) => {
//     setSelectedDeliveryOption(option);

//     // Validate the form first
//     const errors = formik.validateForm();
//     if (Object.keys(errors).length === 0) {
//       // Calculate the total cost with the selected delivery option
//       const totalCost = calculateDeliveryCost(
//         baseShippingCost,
//         option.percentageMarkup
//       );

//       // Submit the form directly here to update delivery options
//       formik.submitForm(totalCost);
//     } else {
//       // If there are validation errors, touch all fields to show errors
//       formik.setTouched({ date: true });
//     }
//   };

//   return (
//     <section
//       className="w-full flex md:min-h-[900px] ss:min-h-[820px]
//     min-h-[1400px]"
//     >
//       <div className="flex items-center w-full flex-col">
//         <div className="w-full flex flex-col gap-1.5 items-center">
//           <h1
//             className="text-primary font-bold md:text-[40px]
//                 ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
//                 ss:leading-[3.5rem] leading-[2.5rem] text-center"
//           >
//             Check out your delivery options!
//           </h1>

//           <p
//             className="text-main4 md:text-[17px] ss:text-[16px]
//                 text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem]
//                 leading-[1.3rem] tracking-tight text-center"
//           >
//             Select your preferred delivery method from the displayed options
//           </p>

//           {baseShippingCost > 0 && (
//             <div className="mt-4 bg-primary1 px-6 py-3 rounded-lg">
//               <p className="text-main2 font-medium">
//                 Base Shipping Cost:{" "}
//                 <span className="font-bold text-primary">
//                   {formatCurrency(baseShippingCost, selectedTab)}
//                 </span>
//               </p>
//             </div>
//           )}
//         </div>

//         <form
//           ref={formRef}
//           onSubmit={formik.handleSubmit}
//           className="md:w-[85%] w-full md:mt-12 ss:mt-10 mt-8"
//         >
//           <div className="flex flex-col w-full items-center gap-8">
//             <div className="w-full">
//               <div
//                 className="inline-flex flex-col relative
//                         md:w-[25%] ss:w-[25%] w-[50%]"
//               >
//                 <input
//                   type="date"
//                   name="date"
//                   placeholder=""
//                   min={today} // Prevent selecting dates in the past
//                   value={formik.values.date}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className={`md:py-3.5 py-3 md:px-3.5 px-3
//                                 peer outline text-black md:rounded-lg rounded-md
//                                 md:text-[15px] ss:text-[14px] text-[13px] outline-[1px]
//                                 bg-transparent w-full focus:outline-primary cursor-pointer
//                                 ${
//                                   formik.touched.date && formik.errors.date
//                                     ? "outline-mainRed"
//                                     : "outline-main6"
//                                 }
//                                 `}
//                 />

//                 <label
//                   htmlFor="date"
//                   className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0]
//                             md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6
//                             md:text-[15px] ss:text-[14px] text-[13px] bg-white peer-focus:px-2
//                             duration-300 peer-placeholder-shown:translate-y-0
//                             peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
//                             ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
//                             peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
//                             ${formik.values.date ? "z-10 px-2" : ""}
//                             `}
//                 >
//                   Shipment Date
//                 </label>

//                 <p
//                   className="text-mainRed md:text-[12px] flex justify-end
//                             ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
//                 >
//                   {formik.touched.date && formik.errors.date}
//                 </p>
//               </div>
//             </div>

//             <div className="w-full flex flex-col gap-6">
//               {fetchingOptions ? (
//                 <div className="flex justify-center items-center py-10">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
//                   <p className="ml-3 text-gray-600">
//                     Loading delivery options...
//                   </p>
//                 </div>
//               ) : fetchError ? (
//                 <div className="text-center py-10">
//                   <p className="text-mainRed">{fetchError}</p>
//                   <button
//                     type="button"
//                     onClick={() => window.location.reload()}
//                     className="mt-4 text-primary hover:underline"
//                   >
//                     Refresh page
//                   </button>
//                 </div>
//               ) : (
//                 deliveryOptionsList.map((option, index) => (
//                   <DeliveryCard
//                     key={option.id}
//                     index={index}
//                     option={option}
//                     onNext={() => handleSelectOption(option)}
//                     totalOptions={deliveryOptionsList.length}
//                     baseAmount={baseShippingCost || 0}
//                     shipmentType={selectedTab}
//                     date={formik.values.date}
//                     isSelected={selectedDeliveryOption?.id === option.id}
//                   />
//                 ))
//               )}
//             </div>

//             {loading && (
//               <div className="text-center text-primary">
//                 <p>Processing your selection...</p>
//               </div>
//             )}

//             {error && (
//               <div className="text-center text-mainRed">
//                 <p>{error}</p>
//               </div>
//             )}

//             <div
//               className="mt-3 flex w-full items-center
//                     justify-center"
//             >
//               <button
//                 type="button"
//                 className="bg-none text-[13px] py-3.5 px-14
//                         text-primary rounded-full grow2 cursor-pointer
//                         items-center justify-center border border-primary"
//                 onClick={handlePrevious}
//                 disabled={loading || fetchingOptions}
//               >
//                 <p className="font-semibold">Go back</p>
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default SectionWrapper(DeliveryOptions, "");
