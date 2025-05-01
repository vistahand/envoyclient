import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TbTrashX } from "react-icons/tb";
import { SectionWrapper } from "../hoc";
import { localIcon, internationalIcon, addicon } from "../assets";
import { useShipment } from "../context/ShipmentContext";
import { useNotifications } from "../context/NotificationContext";
import { admin } from "../services/api";

// Reusable components
const FormField = ({ label, children, error }) => (
  <div className="relative flex flex-col">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="text-mainRed md:text-[12px] flex justify-end ss:text-[12px] text-[11px] mt-1 font-medium">
        {error}
      </p>
    )}
  </div>
);

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = " ",
  error,
  className = "",
  hint,
}) => (
  <FormField error={error}>
    <div className="relative z-10">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        min={type === "number" ? "1" : undefined}
        className={`md:py-3.5 py-3 md:px-3.5 px-3 
          peer outline-[1px] outline-main6 outline
          text-black md:rounded-lg rounded-md md:text-[14px]
          ss:text-[14px] text-[12px] focus:outline-primary
          bg-transparent w-full ${disabled ? "bg-gray-50" : ""} ${className}`}
      />
      {label && (
        <label
          htmlFor={name}
          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
            md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
            md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
            duration-300 peer-placeholder-shown:translate-y-0 
            peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
            ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
            ${value ? "z-10 px-2" : ""}`}
        >
          {label}
        </label>
      )}
    </div>
    {hint && (
      <p className="text-main4 md:text-[12px] ss:text-[12px] text-[11px] mt-1">
        {hint}
      </p>
    )}
  </FormField>
);

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
  const selectRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setTimeout(() => onBlur?.({ target: { name } }), 0);
    setShowOptions(false);
  };

  return (
    <FormField error={error}>
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
          {value ? (
            <div className="capitalize">{value}</div>
          ) : (
            <span className="text-main6 capitalize">{placeholder}</span>
          )}
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {showOptions && (
          <div className="absolute z-20 w-full bg-white rounded-md mt-2 shadow-[0px_5px_15px_rgba(0,0,0,0.25)]">
            {options.map((option, index) => (
              <div
                key={index}
                className={`md:py-3.5 py-3 md:px-3.5 px-3 cursor-pointer 
                  hover:bg-primary flex items-center justify-between hover:text-white 
                  md:text-[14px] ss:text-[14px] text-[12px] text-main2 capitalize font-medium
                  ${
                    index === 0
                      ? "rounded-t-md"
                      : index === options.length - 1
                      ? "rounded-b-md"
                      : ""
                  }`}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.value}</span>
                {option.price !== undefined && (
                  <span className="text-main4">
                    {option.currency} {option.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
};

const Button = ({
  variant = "primary",
  onClick,
  children,
  type = "button",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "rounded-full px-14 py-3.5 text-[13px] flex items-center justify-center gap-3";

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-white grow4"
      : "border border-primary text-primary grow2";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Main component
const PackageDetails = ({ onPrev, onNext, selectedTab }) => {
  const currentTab = selectedTab;
  const { updatePackageDetails, loading, shipmentData } = useShipment();
  const { addNotification } = useNotifications();

  // Shipping items from admin panel
  const [packageItems, setPackageItems] = useState([
    { id: 10, packageType: "Other", amount: 0, isCustom: true },
  ]);

  useEffect(() => {
    // Fetch package items from the server or context
    const fetchPackageItems = async () => {
      try {
        const response = await admin.packages.getAll();
        if (response?.success) {
          console.log("response, ", response);
          setPackageItems(response?.data?.packages || []);
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response?.error || "Failed to fetch package items",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: error.message || "Failed to fetch package items",
        });
      }
    };

    fetchPackageItems();
  }, []);

  // Extract TV sizes for dropdown
  const tvSizes = packageItems
    .filter((item) => item.packageType === "TV")
    .reduce((sizes, tv) => {
      if (tv.otherOptions?.tv?.size && Array.isArray(tv.otherOptions.tv.size)) {
        return [...new Set([...sizes, ...tv.otherOptions.tv.size])];
      }
      return sizes;
    }, [])
    .sort((a, b) => a - b); // Sort sizes numerically

  // Form validation
  const validationSchema = Yup.object({
    packages: Yup.array().of(
      Yup.object().shape({
        packageType: Yup.string().required("Package type is required"),
        customPackageType: Yup.string().when("packageType", {
          is: "Other",
          then: () => Yup.string().required("Please specify the package type"),
          otherwise: () => Yup.string(),
        }),
        tvSize: Yup.string().when("packageType", {
          is: "TV",
          then: () => Yup.string().required("TV size is required"),
          otherwise: () => Yup.string(),
        }),
        carMake: Yup.string().when("packageType", {
          is: "Car",
          then: () => Yup.string().required("Car make is required"),
          otherwise: () => Yup.string(),
        }),
        carModel: Yup.string().when("packageType", {
          is: "Car",
          then: () => Yup.string().required("Car model is required"),
          otherwise: () => Yup.string(),
        }),
        carYear: Yup.string().when("packageType", {
          is: "Car",
          then: () => Yup.string().required("Car year is required"),
          otherwise: () => Yup.string(),
        }),
      })
    ),
  });

  // Ensure the `updatePackageDetails` function is properly awaited and the response is logged for debugging
  const formik = useFormik({
    initialValues: {
      packages: [
        {
          packageType: "",
          customPackageType: "",
          tvSize: "",
          carMake: "",
          carModel: "",
          carYear: "",
        },
      ],
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        if (!shipmentData?.id) {
          throw new Error(
            "No shipment ID found. Please try again from step 1."
          );
        }

        // Calculate baseAmount from package amounts
        const baseAmount = values.packages.reduce((total, packageItem) => {
          const packageData = packageItems.find(
            (item) => item.packageType === packageItem.packageType
          );
          return total + (Number(packageData?.amount) || 0);
        }, 0);

        // Determine currency based on shipment type
        const currency =
          shipmentData.shipmentType === "international" ? "eur" : "ngn";

        const data = {
          packages: values.packages.map((packageItem) => {
            // Base package data
            const packageData = {
              packageType:
                packageItem.packageType === "Other" &&
                packageItem.customPackageType
                  ? packageItem.customPackageType
                  : packageItem.packageType,
              description: packageItem.customPackageType || "",
            };

            // Add otherOptions based on package type
            if (packageItem.packageType === "TV") {
              packageData.otherOptions = {
                size: packageItem.tvSize,
              };
            } else if (packageItem.packageType === "Car") {
              packageData.otherOptions = {
                make: packageItem.carMake,
                model: packageItem.carModel,
                year: packageItem.carYear,
              };
            }

            return packageData;
          }),
          cost: { baseAmount: baseAmount, currency }, // Include calculated cost in the payload
        };

        console.log("Submitting data:", data); // Debugging log

        const response = await updatePackageDetails(data); // Ensure this function is awaited

        console.log("Response received:", response); // Debugging log

        if (response?.success) {
          onNext(currentTab);
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response?.error || "Failed to update package details",
          });
        }
      } catch (err) {
        console.error("Error during submission:", err); // Debugging log
        addNotification({
          type: "error",
          title: "Error",
          message: err.message,
        });
      }
    },
  });

  const handleAddPackage = () => {
    formik.setFieldValue("packages", [
      ...formik.values.packages,
      {
        packageType: "",
        customPackageType: "",
        tvSize: "",
        carMake: "",
        carModel: "",
        carYear: "",
      },
    ]);
  };

  const handleRemovePackage = (index) => {
    formik.setFieldValue(
      "packages",
      formik.values.packages.filter((_, i) => i !== index)
    );
  };

  const getPackagePrice = (packageType, tvSize = null) => {
    // For TV items, get price based on size
    if (packageType === "TV" && tvSize) {
      const tvItem = packageItems.find(
        (item) =>
          item.packageType === "TV" && item.otherOptions.tv.size === tvSize
      );
      return tvItem ? `€ ${tvItem.amount}` : "Price will be provided";
    }

    // For other items
    const package1 = packageItems.find(
      (item) => item.packageType === packageType
    );
    if (!package1) return "";

    if (package1.isQuotable) {
      return "Quote based";
    } else if (package1.isCustom) {
      return "Custom package";
    } else {
      return `€ ${package1.amount}`;
    }
  };

  // Get item options excluding duplicate TV entries and always include "Other" option
  const getItemOptions = () => {
    const uniqueItems = packageItems.reduce((acc, item) => {
      // For TV, only add it once
      if (
        item.packageType === "TV" &&
        acc.find((i) => i.packageType === "TV")
      ) {
        return acc;
      }
      return [...acc, item];
    }, []);

    // Map items and ensure "Other" is always included
    const options = uniqueItems
      .filter((item) => item.packageType !== "Other") // Remove any existing "Other" to avoid duplicates
      .map((item) => ({
        value: item.packageType,
        currency: item.currency,
        amount:
          item.amount !== 0 && !item.isCustom && !item.isQuotable
            ? item.amount
            : undefined,
      }));

    // Add the "Other" option at the end
    options.push({
      value: "Other",
      currency: null,
      amount: undefined,
    });

    return options;
  };

  // Helper to get form error at specific path
  const getFormError = (index, field) => {
    return (
      formik.touched.packages?.[index]?.[field] &&
      formik.errors.packages?.[index]?.[field]
    );
  };

  // Render the fields for each package type
  const renderPackageTypeFields = (pkg, index) => {
    switch (pkg.packageType) {
      case "TV":
        return (
          <FormField>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <CustomSelect
                    name={`packages[${index}].tvSize`}
                    value={pkg.tvSize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { value: "", label: "Select TV size" },
                      { value: "custom", label: "Enter custom size" },
                      ...tvSizes.map((size) => ({
                        value: size.toString(),
                        label: `${size} inches`,
                      })),
                    ]}
                    placeholder="Select TV size"
                    error={getFormError(index, "tvSize")}
                  />
                </div>
                {pkg.tvSize === "custom" && (
                  <div className="col-span-1">
                    <InputField
                      label="Custom TV Size (inches)"
                      type="number"
                      name={`packages[${index}].tvSize`}
                      value={pkg.tvSize === "custom" ? "" : pkg.tvSize}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={getFormError(index, "tvSize")}
                    />
                  </div>
                )}
              </div>
              <p className="text-main4 md:text-[12px] ss:text-[12px] text-[11px]">
                Our team will contact you with pricing based on the TV size
              </p>
            </div>
          </FormField>
        );

      case "Car":
        return (
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Car Make"
              name={`packages[${index}].carMake`}
              value={pkg.carMake}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFormError(index, "carMake")}
            />

            <InputField
              label="Car Model"
              name={`packages[${index}].carModel`}
              value={pkg.carModel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFormError(index, "carModel")}
            />

            <InputField
              label="Car Year"
              name={`packages[${index}].carYear`}
              value={pkg.carYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFormError(index, "carYear")}
            />

            <div className="col-span-3">
              <p className="text-main4 md:text-[12px] ss:text-[12px] text-[11px]">
                Our team will contact you with pricing based on the Car details
              </p>
            </div>
          </div>
        );

      case "Other":
        return (
          <InputField
            label="Specify Package Type"
            name={`packages[${index}].customPackageType`}
            value={pkg.customPackageType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={getFormError(index, "customPackageType")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="w-full flex md:min-h-[850px] ss:min-h-[820px] min-h-[1080px]">
      <div className="flex items-center w-full flex-col">
        {/* Header */}
        <div className="w-full flex flex-col gap-1.5 items-center">
          <h1 className="text-primary font-bold md:text-[40px] ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem] ss:leading-[3.5rem] leading-[2.5rem] text-center">
            Describe your package
          </h1>
          <p className="text-main4 md:text-[17px] ss:text-[16px] text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] leading-[1.3rem] tracking-tight text-center">
            Select the items you wish to ship and provide any additional details
          </p>
        </div>

        {/* Shipping Type Tabs */}
        <div className="flex justify-center items-center md:gap-3 ss:gap-3 gap-2.5 md:w-[43%] ss:w-[70%] w-full md:mt-10 ss:mt-10 mt-8">
          {/* International Tab */}
          <div
            className={`py-3.5 px-4 flex items-center mobship
              ${
                currentTab === "international"
                  ? "bg-primary text-white"
                  : "border-main5 border-[1px] text-primary"
              }  
              rounded-lg md:w-1/2 ss:w-1/2 w-full gap-2 transition-all duration-300 ease-in-out`}
          >
            <img
              src={internationalIcon}
              className={`w-[2.3rem] h-auto object-contain ${
                currentTab === "international"
                  ? "stroke-white"
                  : "stroke-primary"
              }`}
              alt="International shipping"
            />
            <div className="flex flex-col">
              <h2 className="md:text-[13px] ss:text-[13px] text-[12px] font-bold">
                International Shipping
              </h2>
              <p
                className={`${
                  currentTab === "local" ? "text-main4" : "font-light"
                } md:text-[11px] ss:text-[11px] text-[10px]`}
              >
                Ship between countries
              </p>
            </div>
          </div>

          {/* Local Tab */}
          <div
            className={`py-3.5 px-4 flex items-center mobship
              ${
                currentTab === "local"
                  ? "bg-primary text-white"
                  : "border-main5 border-[1px] text-primary"
              }  
              rounded-lg md:w-1/2 ss:w-1/2 w-full gap-2 transition-all duration-300 ease-in-out`}
          >
            <img
              src={localIcon}
              className={`w-[2.3rem] h-auto object-contain ${
                currentTab === "local" ? "stroke-white" : "stroke-primary"
              }`}
              alt="Local shipping"
            />
            <div className="flex flex-col">
              <h2 className="md:text-[13px] ss:text-[13px] text-[12px] font-bold">
                Local Shipping
              </h2>
              <p
                className={`${
                  currentTab === "international" ? "text-main4" : "font-light"
                } md:text-[11px] ss:text-[11px] text-[10px]`}
              >
                Ship within your country
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-[70%] w-full md:mt-10 ss:mt-10 mt-8">
          <h1 className="flex text-main2 font-bold md:text-[30px] ss:text-[25px] text-[22px] tracking-tighter">
            Package Details
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="md:w-[70%] w-full md:mt-5 ss:mt-4 mt-3"
        >
          <div className="flex flex-col w-full items-center gap-8">
            {/* Package Items */}
            {formik.values.packages.map((pkg, index) => (
              <div
                key={index}
                className="flex flex-col w-full items-center gap-4"
              >
                <div className="w-full flex justify-between items-center">
                  <h2 className="text-main2 font-semibold md:text-[20px] ss:text-[20px] text-[17px] tracking-tight">
                    Item {index + 1}
                  </h2>

                  {formik.values.packages.length > 1 && (
                    <div
                      className="flex items-center md:gap-2 ss:gap-2 gap-1.5 cursor-pointer grow6"
                      onClick={() => handleRemovePackage(index)}
                    >
                      <TbTrashX className="md:text-[20px] ss:text-[20px] text-[17px] text-realRed" />
                      <p className="md:text-[15px] ss:text-[15px] text-[12px] font-semibold text-realRed">
                        Remove Item
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 md:gap-5 ss:gap-5 gap-4 w-full">
                  {/* Package Type Selection */}
                  <div className="col-span-2">
                    <CustomSelect
                      name={`packages[${index}].packageType`}
                      value={pkg.packageType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      options={getItemOptions()}
                      placeholder="Select the type of package"
                      error={getFormError(index, "packageType")}
                    />
                  </div>

                  {/* Price Display */}
                  <div className="col-span-1">
                    <InputField
                      label="Price"
                      value={
                        pkg.packageType
                          ? getPackagePrice(pkg.packageType, pkg.tvSize)
                          : ""
                      }
                      disabled={true}
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Conditional fields based on package type */}
                  {pkg.packageType && (
                    <div className="col-span-3">
                      {renderPackageTypeFields(pkg, index)}
                    </div>
                  )}
                </div>

                <div className="w-full h-[1px] bg-main7" />
              </div>
            ))}

            {/* Add Another Item Button */}
            <div className="w-full">
              <div
                className="inline-flex items-center gap-3 grow8 cursor-pointer"
                onClick={handleAddPackage}
              >
                <img
                  src={addicon}
                  alt="addpackage"
                  className="w-[1.8rem] h-auto"
                />
                <h2 className="text-main2 font-semibold md:text-[18px] ss:text-[18px] text-[15px] tracking-tight">
                  Add Another Item
                </h2>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-2 flex w-full items-center justify-center md:gap-5 ss:gap-5 gap-3 flex-col">
              <Button
                variant="secondary"
                onClick={() => onPrev(currentTab)}
                className="md:flex ss:flex hidden"
              >
                <p className="font-semibold">Go back</p>
              </Button>

              <div className="w-full flex justify-center mt-6">
                <Button type="submit" disabled={loading}>
                  <p>{loading ? "Processing..." : "Continue"}</p>
                  {!loading && <HiOutlineArrowRight className="text-[14px]" />}
                </Button>
              </div>

              <Button
                variant="secondary"
                onClick={() => onPrev(currentTab)}
                className="md:hidden ss:hidden flex mobbut"
              >
                <p className="font-semibold">Go back</p>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SectionWrapper(PackageDetails, "");
