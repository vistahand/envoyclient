import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from "yup";
import { SectionWrapper } from "../hoc";
import { packageOptions } from "../constants";
import { localIcon } from "../assets";
import { internationalIcon } from "../assets";
import { addicon } from "../assets";
import { BsBoxSeam } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbSquareForbid, TbTrashX } from "react-icons/tb";
import { GrAppsRounded } from "react-icons/gr";
import { FaPallet } from "react-icons/fa";
import { useGuestShipment } from "../context/GuestShipmentContext";
import { useNotifications } from "../context/NotificationContext";

const PackageCard = ({ index, option, selected, onSelect }) => {
  const handleClick = () => {
    onSelect(index);
  };

  return (
    <div className="cursor-pointer">
      <div
        className={`border-[1px] border-main5 rounded-lg px-4
            py-3 hover:bg-primary hover:text-white navsmooth w-full group
            flex gap-3 items-center
            ${selected ? "bg-primary" : "text-white"}`}
        onClick={handleClick}
      >
        <div>
          {/* Use a safer approach for rendering icons */}
          {typeof option.icon === "function" ? (
            React.createElement(option.icon, {
              className: `w-[1.6rem] h-auto object-contain ${
                selected ? "text-white" : "text-primary"
              } group-hover:text-white`,
            })
          ) : (
            /* Fallback if icon is not a valid component */
            <div className="w-[1.6rem] h-[1.6rem] bg-gray-200 rounded"></div>
          )}
        </div>

        <div className="flex flex-col w-full">
          <h3
            className={`md:text-[14px] ss:text-[13px] text-[12px] 
                        font-bold ${selected ? "text-white" : "text-primary"}
                        group-hover:text-white`}
          >
            {option.name}
          </h3>

          <p
            className={`text-main4 md:text-[12px] ss:text-[12px] 
                        text-[11px] ${selected ? "text-white" : "text-main4"}
                        group-hover:text-white`}
          >
            {option.length} x {option.width} x {option.height} cm
          </p>
        </div>
      </div>
    </div>
  );
};

const PackageDescribe = ({ onPrev, onNext, selectedTab }) => {
  const formRef = useRef();
  const currentTab = selectedTab;
  const [selectedOption, setSelectedOption] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState(null);
  const [meetsMinimumPayment, setMeetsMinimumPayment] = useState(false);
  const {
    updatePackageDetails,
    loading,
    error,
    calculateShippingCost,
    shipmentData,
  } = useGuestShipment();
  const { addNotification } = useNotifications();

  const handleCalculateCost = async () => {
    try {
      // Validate form before calculation
      const isValid = await formik.validateForm();
      if (Object.keys(isValid).length > 0) {
        formik.setTouched(
          Object.keys(isValid).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        );
        addNotification({
          type: "error",
          title: "Validation Error",
          message: "Please correct the errors before calculating cost.",
        });
        return;
      }

      setIsCalculating(true);
      setCalculatedCost(null);

      // Prepare data for calculation
      const calculationData = {
        type: currentTab,
        packages: formik.values.packages.map((packageItem) => {
          return {
            packageType: packageItem.packageType,
            weight: packageItem.weight,
            dimensions: {
              length: packageItem.length,
              width: packageItem.width,
              height: packageItem.height,
            },
            isFragile: packageItem.isFragile,
            isPerishable: packageItem.isPerishable,
            isHazardous: packageItem.isHazardous,
          };
        }), // Array of package items
        insurance: {
          type: "none",
        },
      };

      // Call the calculate cost endpoint
      const response = await calculateShippingCost(calculationData);

      // Set the calculated cost
      setCalculatedCost(response.cost.total);

      // Check if it meets minimum payment threshold (0.50 USD in Naira)
      // Assuming exchange rate is defined elsewhere or fetched from an API
      const minimumNairaAmount = 0.5 * getExchangeRate(); // Implement getExchangeRate() or use a fixed value
      setMeetsMinimumPayment(response.cost.total >= minimumNairaAmount);

      addNotification({
        type: "success",
        title: "Cost Calculated",
        message: "Shipping cost has been calculated successfully.",
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Calculation Error",
        message: error.message || "Failed to calculate shipping cost.",
      });
      setMeetsMinimumPayment(false);
    } finally {
      setIsCalculating(false);
    }
  };
  // .....................................................................
  // Helper function to get current exchange rate - implement as needed
  const getExchangeRate = () => {
    // For now using a fixed value - you can replace with API call or config value
    return currentTab == "local" ? 1500 : 1; // Example rate: 1 USD = 1500 Naira
  };

  const handleSelectOption = (pkgIndex, optionIndex) => {
    setSelectedOption((prevSelected) => {
      const updatedSelected = { ...prevSelected };

      // If the same option is clicked again for this package, deselect it
      if (updatedSelected[pkgIndex] === optionIndex) {
        delete updatedSelected[pkgIndex];
        formik.setFieldValue(`packages[${pkgIndex}]`, {
          weight: "",
          length: "",
          width: "",
          height: "",
          isFragile: false,
          isPerishable: false,
          isHazardous: false,
        });
        return updatedSelected;
      } else {
        // Select the new option for this package
        const selectedPackage = packageOptions[optionIndex];
        formik.setFieldValue(`packages[${pkgIndex}]`, {
          weight: selectedPackage.weight,
          length: selectedPackage.length,
          width: selectedPackage.width,
          height: selectedPackage.height,
          isFragile: false,
          isPerishable: false,
          isHazardous: false,
        });
        updatedSelected[pkgIndex] = optionIndex;
      }
      return updatedSelected;
    });
  };

  const formik = useFormik({
    initialValues: {
      packages: [
        {
          packageType: "",
          weight: "",
          length: "",
          width: "",
          height: "",
          isFragile: false,
          isPerishable: false,
          isHazardous: false,
        },
      ],
    },

    validationSchema: Yup.lazy((values) =>
      Yup.object().shape({
        packages: Yup.array().of(
          Yup.object().shape({
            packageType: Yup.string().required("Package type is required"),
            weight: Yup.number()
              .typeError("Package weight must be a number")
              .required("Package weight is required"),
            length: Yup.number()
              .typeError("Package length must be a number")
              .required("Package length is required"),
            width: Yup.number()
              .typeError("Package width must be a number")
              .required("Package width is required"),
            height: Yup.number()
              .typeError("Package height must be a number")
              .required("Package height is required"),
          })
        ),
      })
    ),
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        if (!shipmentData?.id) {
          throw new Error(
            "No shipment ID found. Please try again from step 1."
          );
        }
        const data = {
          packages: values.packages.map((packageItem) => {
            return {
              packageType: packageItem.packageType,
              weight: packageItem.weight,
              dimensions: {
                length: packageItem.length,
                width: packageItem.width,
                height: packageItem.height,
              },
              isFragile: packageItem.isFragile,
              isPerishable: packageItem.isPerishable,
              isHazardous: packageItem.isHazardous,
            };
          }),
        };
        await updatePackageDetails(data);
        onNext(currentTab);
      } catch (err) {
        addNotification({
          type: "error",
          title: "Error",
          message: err.message,
        });
      }
    },
  });

  const addPackage = () => {
    formik.setFieldValue("packages", [
      ...formik.values.packages,
      {
        packageType: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        isFragile: false,
        isPerishable: false,
        isHazardous: false,
      },
    ]);
  };

  const removePackage = (index) => {
    formik.setFieldValue(
      "packages",
      formik.values.packages.filter((_, i) => i !== index)
    );
  };

  const handlePrevious = () => {
    onPrev(currentTab);
  };

  const packageTypeOptions = [
    {
      value: "parcel",
      icon: <BsBoxSeam className="inline-block mr-2.5" />,
      label: "Parcel",
      className: "flex items-center",
    },
    {
      value: "documents",
      icon: <IoNewspaperOutline className="inline-block mr-2.5" />,
      label: "Documents",
      className: "flex items-center",
    },
    {
      value: "pallet",
      icon: <FaPallet className="inline-block mr-2.5" />,
      label: "Pallet",
      className: "flex items-center",
    },
    {
      value: "container",
      icon: <TbSquareForbid className="inline-block mr-2.5" />,
      label: "Container",
      className: "flex items-center",
    },
    {
      value: "other",
      icon: <GrAppsRounded className="inline-block mr-2.5" />,
      label: "Other",
      className: "flex items-center",
    },
  ];

  const CustomSelect = ({
    name,
    value,
    onChange,
    onBlur,
    options,
    placeholder,
    error,
  }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const selectRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setShowOptions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (optionValue) => {
      setSelectedValue(optionValue);
      onChange({ target: { name, value: optionValue } });
      setTimeout(() => onBlur({ target: { name } }), 0);
      setShowOptions(false);
    };

    return (
      <div className="relative" ref={selectRef}>
        <div
          className={`md:py-3.5 py-3 md:px-3.5 px-3 outline 
                md:rounded-lg rounded-md cursor-pointer md:text-[14px] 
                ss:text-[14px] text-[12px] focus:outline-primary
                bg-transparent w-full custom-select outline-[1px] 
                ${error ? "outline-mainRed" : "outline-main6"}
                ${value === "" ? "text-main6" : "text-black"}
                flex items-center justify-between`}
          onClick={() => setShowOptions(!showOptions)}
          tabIndex={0}
        >
          {selectedValue ? (
            <>{options.find((option) => option.value === value).label}</>
          ) : (
            <span className="text-main6">{placeholder}</span>
          )}
        </div>

        {showOptions && (
          <div
            className="absolute z-20 w-full bg-white rounded-md mt-2 
                    shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
          >
            {options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`md:py-3.5 py-3 md:px-3.5 px-3 cursor-pointer 
                            hover:bg-primary flex items-center hover:text-white 
                            md:text-[14px] ss:text-[14px] text-[12px] text-main2 font-medium
                            ${
                              optionIndex === 0
                                ? "rounded-t-md"
                                : optionIndex === options.length - 1
                                ? "rounded-b-md"
                                : ""
                            }
                            `}
                onClick={() => handleChange(option.value)}
              >
                {option.icon} {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className="w-full flex md:min-h-[850px] ss:min-h-[820px]
    min-h-[1080px]"
    >
      <div className="flex items-center w-full flex-col">
        <div className="w-full flex flex-col gap-1.5 items-center">
          <h1
            className="text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center"
          >
            Quickly describe your package
          </h1>

          <p
            className="text-main4 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight text-center"
          >
            From the options below, tell us how big or small your shipment is
          </p>
        </div>

        <div
          className="flex justify-center items-center md:gap-3
            ss:gap-3 gap-2.5 md:w-[43%] ss:w-[70%] w-full md:mt-10
            ss:mt-10 mt-8"
        >
          <div
            className={`py-3.5 px-4 flex items-center mobship
                ${
                  currentTab === "international"
                    ? "bg-primary text-white"
                    : "border-main5 border-[1px] text-primary"
                }  rounded-lg md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
          >
            <img
              src={internationalIcon}
              className={`w-[2.3rem] h-auto object-contain
                            ${
                              currentTab === "international"
                                ? "stroke-white"
                                : "stroke-primary"
                            }
                        `}
            />

            <div className="flex flex-col">
              <h2
                className="md:text-[13px] ss:text-[13px] 
                        text-[12px] font-bold"
              >
                International Shipping
              </h2>

              <p
                className={`${
                  currentTab === "local" ? "text-main4" : "font-light"
                } md:text-[11px] ss:text-[11px] text-[10px]
                        `}
              >
                Ship between countries
              </p>
            </div>
          </div>

          <div
            className={`py-3.5 px-4 flex items-center mobship
                ${
                  currentTab === "local"
                    ? "bg-primary text-white"
                    : "border-main5 border-[1px] text-primary"
                }  rounded-lg md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
          >
            <img
              src={localIcon}
              className={`w-[2.3rem] h-auto object-contain
                            ${
                              currentTab === "local"
                                ? "stroke-white"
                                : "stroke-primary"
                            }
                        `}
            />

            <div className="flex flex-col">
              <h2
                className="md:text-[13px] ss:text-[13px] 
                        text-[12px] font-bold"
              >
                Local Shipping
              </h2>

              <p
                className={`${
                  currentTab === "international" ? "text-main4" : "font-light"
                } md:text-[11px] ss:text-[11px] text-[10px]
                        `}
              >
                Ship within your country
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-[70%] w-full md:mt-10 ss:mt-10 mt-8">
          <h1
            className="flex text-main2 font-bold md:text-[30px] 
                    ss:text-[25px] text-[22px] tracking-tighter"
          >
            Package Details
          </h1>
        </div>

        <form
          ref={formRef}
          onSubmit={formik.handleSubmit}
          className="md:w-[70%] w-full md:mt-5 ss:mt-4 mt-3"
        >
          <div className="flex flex-col w-full items-center gap-8">
            {formik.values.packages.map((pkg, index) => (
              <div
                key={index}
                className="flex flex-col w-full 
                        items-center gap-4"
              >
                <div className="w-full flex justify-between items-center">
                  <h2
                    className="text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight"
                  >
                    Package {index + 1}
                  </h2>

                  {formik.values.packages.length > 1 && (
                    <div
                      className="flex items-center md:gap-2 ss:gap-2 gap-1.5 
                                    cursor-pointer grow6"
                      onClick={() => removePackage(index)}
                    >
                      <TbTrashX
                        className="md:text-[20px] ss:text-[20px] 
                                        text-[17px] text-realRed"
                      />

                      <p
                        className="md:text-[15px] ss:text-[15px] 
                                        text-[12px] font-semibold text-realRed"
                      >
                        Remove Package
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="grid md:grid-cols-3 ss:grid-cols-3
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full"
                >
                  <div className="relative flex flex-col col-span-2">
                    <div className="relative flex items-center">
                      <div className="w-full relative">
                        <CustomSelect
                          name={`packages[${index}].packageType`}
                          value={pkg.packageType}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          options={packageTypeOptions}
                          placeholder="Select the type of package"
                          error={
                            formik.touched.packages &&
                            formik.errors.packages &&
                            formik.touched.packages[index] &&
                            formik.errors.packages[index] &&
                            formik.touched.packages[index].packageType &&
                            formik.errors.packages[index].packageType
                          }
                        />
                      </div>

                      <div className="absolute md:right-3.5 right-3">
                        <TiArrowSortedDown
                          className="text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]"
                        />
                      </div>
                    </div>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium"
                    >
                      {formik.touched.packages &&
                        formik.errors.packages &&
                        formik.touched.packages[index] &&
                        formik.errors.packages[index] &&
                        formik.touched.packages[index].packageType &&
                        formik.errors.packages[index].packageType}
                    </p>
                  </div>

                  <div className="relative flex flex-col">
                    <div className="relative z-10">
                      <input
                        type="text"
                        name={`packages[${index}].weight`}
                        placeholder=" "
                        value={pkg.weight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                              formik.touched.packages &&
                                              formik.errors.packages &&
                                              formik.touched.packages[index] &&
                                              formik.errors.packages[index] &&
                                              formik.touched.packages[index]
                                                .weight &&
                                              formik.errors.packages[index]
                                                .weight
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      />

                      <label
                        htmlFor="weight"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.weight ? "z-10 px-2" : ""}
                                        `}
                      >
                        Weight of package (kg)
                      </label>
                    </div>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium"
                    >
                      {formik.touched.packages &&
                        formik.errors.packages &&
                        formik.touched.packages[index] &&
                        formik.errors.packages[index] &&
                        formik.touched.packages[index].weight &&
                        formik.errors.packages[index].weight}
                    </p>
                  </div>

                  <div className="relative flex flex-col">
                    <div className="relative z-10">
                      <input
                        type="text"
                        name={`packages[${index}].length`}
                        placeholder=" "
                        value={pkg.length}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                              formik.touched.packages &&
                                              formik.errors.packages &&
                                              formik.touched.packages[index] &&
                                              formik.errors.packages[index] &&
                                              formik.touched.packages[index]
                                                .length &&
                                              formik.errors.packages[index]
                                                .length
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      />

                      <label
                        htmlFor="length"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.length ? "z-10 px-2" : ""}
                                        `}
                      >
                        Package Length (cm)
                      </label>
                    </div>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium"
                    >
                      {formik.touched.packages &&
                        formik.errors.packages &&
                        formik.touched.packages[index] &&
                        formik.errors.packages[index] &&
                        formik.touched.packages[index].length &&
                        formik.errors.packages[index].length}
                    </p>
                  </div>

                  <div className="relative flex flex-col">
                    <div className="relative z-10">
                      <input
                        type="text"
                        name={`packages[${index}].width`}
                        placeholder=" "
                        value={pkg.width}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                              formik.touched.packages &&
                                              formik.errors.packages &&
                                              formik.touched.packages[index] &&
                                              formik.errors.packages[index] &&
                                              formik.touched.packages[index]
                                                .width &&
                                              formik.errors.packages[index]
                                                .width
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      />

                      <label
                        htmlFor="width"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.width ? "z-10 px-2" : ""}
                                        `}
                      >
                        Package Width (cm)
                      </label>
                    </div>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium"
                    >
                      {formik.touched.packages &&
                        formik.errors.packages &&
                        formik.touched.packages[index] &&
                        formik.errors.packages[index] &&
                        formik.touched.packages[index].width &&
                        formik.errors.packages[index].width}
                    </p>
                  </div>

                  <div className="relative flex flex-col">
                    <div className="relative z-10">
                      <input
                        type="text"
                        name={`packages[${index}].height`}
                        placeholder=" "
                        value={pkg.height}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                              formik.touched.packages &&
                                              formik.errors.packages &&
                                              formik.touched.packages[index] &&
                                              formik.errors.packages[index] &&
                                              formik.touched.packages[index]
                                                .height &&
                                              formik.errors.packages[index]
                                                .height
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      />

                      <label
                        htmlFor="height"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.height ? "z-10 px-2" : ""}
                                        `}
                      >
                        Package Height (cm)
                      </label>
                    </div>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium"
                    >
                      {formik.touched.packages &&
                        formik.errors.packages &&
                        formik.touched.packages[index] &&
                        formik.errors.packages[index] &&
                        formik.touched.packages[index].height &&
                        formik.errors.packages[index].height}
                    </p>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-main7" />

                <div className="w-full flex flex-col items-center gap-4">
                  <div className="w-full">
                    <p
                      className="text-main4 md:text-[14px] 
                                    ss:text-[13px] text-[12px]"
                    >
                      Not sure about the dimensions of your package?
                    </p>
                  </div>

                  <div
                    className="grid md:grid-cols-4 ss:grid-cols-4 w-full
                                grid-cols-2 gap-2.5"
                  >
                    {packageOptions.map((option, optionIndex) => (
                      <PackageCard
                        key={optionIndex}
                        option={option}
                        index={optionIndex}
                        selected={selectedOption[index] === optionIndex}
                        onSelect={() => handleSelectOption(index, optionIndex)}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-main7" />

                <div className="w-full">
                  <div className="flex gap-5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        name={`packages[${index}].isFragile`}
                        checked={pkg.isFragile}
                        onChange={formik.handleChange}
                      />
                      <p
                        className="text-main2 md:text-[16px]
                                        ss:text-[16px] text-[15px] font-medium"
                      >
                        Fragile
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        name={`packages[${index}].isPerishable`}
                        checked={pkg.isPerishable}
                        onChange={formik.handleChange}
                      />
                      <p
                        className="text-main2 md:text-[16px]
                                        ss:text-[16px] text-[15px] font-medium"
                      >
                        Perishable
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        name={`packages[${index}].isHazardous`}
                        checked={pkg.isHazardous}
                        onChange={formik.handleChange}
                      />
                      <p
                        className="text-main2 md:text-[16px]
                                        ss:text-[16px] text-[15px] font-medium"
                      >
                        Hazardous
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="w-full">
              <div
                className="inline-flex items-center gap-3 
                        grow8 cursor-pointer"
                onClick={addPackage}
              >
                <img
                  src={addicon}
                  alt="addpackage"
                  className="w-[1.8rem] h-auto"
                />

                <h2
                  className="text-main2 font-semibold md:text-[18px]
                            ss:text-[18px] text-[15px] tracking-tight"
                >
                  Add Another Package
                </h2>
              </div>
            </div>

            <div
              className="mt-2 flex w-full items-center 
                    justify-center md:gap-5 ss:gap-5 gap-3 
                    flex-col"
            >
              <button
                className="bg-none text-[13px] py-3.5 px-14
                        text-primary rounded-full grow2 cursor-pointer
                        items-center justify-center border border-primary
                        md:flex ss:flex hidden"
                onClick={handlePrevious}
              >
                <p className="font-semibold">Go back</p>
              </button>

              {/* <button
                type="submit"
                className="bg-primary text-[13px] py-3.5 px-14 flex
                        text-white rounded-full grow4 cursor-pointer
                        items-center justify-center gap-3 mobbut"
                disabled={loading}
              >
                <p>{loading ? "Processing..." : "Next"}</p>

                {!loading && <HiOutlineArrowRight className="text-[14px]" />}
              </button> */}

              {/* Add this section for cost calculation before your submit button */}
              <div className="w-full flex flex-col gap-4 items-center mt-6">
                <button
                  type="button"
                  onClick={handleCalculateCost}
                  disabled={isCalculating}
                  className="bg-primary text-[13px] py-3.5 px-8
                    text-white rounded-full grow4 cursor-pointer
                    flex items-center justify-center"
                >
                  {isCalculating ? "Calculating..." : "Calculate Shipping Cost"}
                </button>

                {calculatedCost !== null && (
                  <div className="w-full md:w-[70%] flex flex-col items-center bg-primary1 p-5 rounded-xl">
                    <h3 className="font-bold text-[18px] text-main2 mb-2">
                      Estimated Shipping Cost
                    </h3>
                    <p className="text-primary md:text-[25px] ss:text-[25px] text-[22px] font-bold">
                      {currentTab === "international" ? "€" : "₦"}{" "}
                      {calculatedCost.toLocaleString()}.00
                    </p>

                    {!meetsMinimumPayment && (
                      <p className="text-mainRed mt-2 text-center md:text-[14px] ss:text-[14px] text-[13px]">
                        This amount is below the minimum payment threshold.
                        Please add more items or adjust your package.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Conditionally render the submit button */}
              <div className="w-full flex justify-center mt-6">
                {!calculatedCost || !meetsMinimumPayment ? (
                  <p className="text-main4 text-center md:text-[14px] ss:text-[14px] text-[13px]">
                    Please calculate shipping cost before proceeding
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-[13px] py-3.5 px-14
                    text-white rounded-full grow4 cursor-pointer
                    flex items-center justify-center gap-3"
                    onClick={formik.handleSubmit}
                  >
                    <p>{loading ? "Processing..." : "Continue"}</p>

                    {!loading && (
                      <HiOutlineArrowRight className="text-[14px]" />
                    )}
                  </button>
                )}
              </div>

              <button
                className="bg-none text-[13px] py-3.5 px-14
                        text-primary rounded-full grow2 cursor-pointer
                        items-center justify-center border border-primary
                        md:hidden ss:hidden flex mobbut"
                onClick={handlePrevious}
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

export default SectionWrapper(PackageDescribe, "");
