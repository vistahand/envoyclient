import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsX } from "react-icons/bs";
import { useFormik } from "formik";
import { TiArrowSortedDown } from "react-icons/ti";
import { useShipment } from "../context/ShipmentContext";
import * as Yup from "yup";

const PickupModal = ({ onClose, values, onUpdate }) => {
  const formRef = useRef();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Modified to handle case when context isn't available
  const { updatePickupLocation } = useShipment();

  const formatDateTimeLocal = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return getMinDateTime(); // Handle invalid date

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return getMinDateTime(); // Fallback to current date/time
    }
  };

  // Nigerian States Options
  const stateOptions = [
    { value: "abia", label: "Abia" },
    { value: "adamawa", label: "Adamawa" },
    { value: "akwa-ibom", label: "Akwa Ibom" },
    { value: "anambra", label: "Anambra" },
    { value: "bauchi", label: "Bauchi" },
    { value: "bayelsa", label: "Bayelsa" },
    { value: "benue", label: "Benue" },
    { value: "borno", label: "Borno" },
    { value: "cross-river", label: "Cross River" },
    { value: "delta", label: "Delta" },
    { value: "ebonyi", label: "Ebonyi" },
    { value: "edo", label: "Edo" },
    { value: "ekiti", label: "Ekiti" },
    { value: "enugu", label: "Enugu" },
    { value: "gombe", label: "Gombe" },
    { value: "imo", label: "Imo" },
    { value: "jigawa", label: "Jigawa" },
    { value: "kaduna", label: "Kaduna" },
    { value: "kano", label: "Kano" },
    { value: "katsina", label: "Katsina" },
    { value: "kebbi", label: "Kebbi" },
    { value: "kogi", label: "Kogi" },
    { value: "kwara", label: "Kwara" },
    { value: "lagos", label: "Lagos" },
    { value: "nasarawa", label: "Nasarawa" },
    { value: "niger", label: "Niger" },
    { value: "ogun", label: "Ogun" },
    { value: "ondo", label: "Ondo" },
    { value: "osun", label: "Osun" },
    { value: "oyo", label: "Oyo" },
    { value: "plateau", label: "Plateau" },
    { value: "rivers", label: "Rivers" },
    { value: "sokoto", label: "Sokoto" },
    { value: "taraba", label: "Taraba" },
    { value: "yobe", label: "Yobe" },
    { value: "zamfara", label: "Zamfara" },
    { value: "fct", label: "Federal Capital Territory" },
  ];
  // Custom Select Component
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
    const [filterText, setFilterText] = useState("");
    const [inputValue, setInputValue] = useState(value);

    const handleKeyDown = (event) => {
      if (event.key.length === 1) {
        setInputValue((prev) => prev + event.key); // Update inputValue
      } else if (event.key === "Backspace") {
        setInputValue((prev) => prev.slice(0, -1));
      }
    };

    useEffect(() => {
      // Update filterText when inputValue changes
      setFilterText(inputValue);
    }, [inputValue]);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(filterText.toLowerCase())
    );

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
      <div className="relative" ref={selectRef} onKeyDown={handleKeyDown}>
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
            <>
              {options.find((option) => option.value === value)?.label ||
                placeholder}
            </>
          ) : (
            <span className="text-main6">{inputValue || placeholder}</span>
          )}
        </div>

        {showOptions && (
          <div
            className="absolute z-20 w-full bg-white rounded-md mt-2 
          shadow-[0px_5px_15px_rgba(0,0,0,0.25)] max-h-[16rem] overflow-auto"
          >
            {filteredOptions.map((option, optionIndex) => (
              <div
                key={optionIndex}
                data-option-index={optionIndex}
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
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getStateFieldByCountry = (country) => {
    // Only show dropdown for Nigeria
    if (country === "NG") {
      return (
        <div className="w-full flex flex-col gap-1.5">
          <CustomSelect
            name="statePick"
            value={formik.values.statePick}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={stateOptions}
            placeholder="Select your state"
            error={formik.touched.statePick && formik.errors.statePick}
          />
          {formik.touched.statePick && formik.errors.statePick ? (
            <p className="text-mainRed md:text-[12px] ss:text-[12px] text-[11px]">
              {formik.errors.statePick}
            </p>
          ) : null}
        </div>
      );
    } else {
      // For other countries, use a text input
      return (
        <div className="w-full flex flex-col gap-1.5">
          <input
            type="text"
            name="statePick"
            value={formik.values.statePick}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your state/province/region"
            className={`md:py-3.5 py-3 md:px-3.5 px-3 outline text-main2
                      md:rounded-lg rounded-md outline-[1px]
                      md:text-[14px] ss:text-[14px] text-[12px]
                      focus:outline-primary w-full
                      ${
                        formik.touched.stateInd && formik.errors.stateInd
                          ? "outline-mainRed"
                          : "outline-main6"
                      }`}
          />
          {formik.touched.statePick && formik.errors.statePick ? (
            <p className="text-mainRed md:text-[12px] ss:text-[12px] text-[11px]">
              {formik.errors.statePick}
            </p>
          ) : null}
        </div>
      );
    }
  };

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Import local countries data
        const countriesData = await import('../data/countries.json');
        const data = countriesData.default;
        const sortedCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };

    loadCountries();
  }, []);

  // Helper function to get the minimum datetime for datetime-local input
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const pickup = values.pickup;
  // Formik Configuration
  const formik = useFormik({
    initialValues: {
      countryPick: pickup?.address?.country || "IE",
      statePick: pickup?.address?.state || "",
      townPick: pickup?.address?.city || "",
      streetPick: pickup?.address?.street || "",
      zipCodePick: pickup?.address?.postalCode || "",
      pickupDate: pickup?.date
        ? formatDateTimeLocal(pickup.date)
        : getMinDateTime(), // specialInstructions: pickup?.instructions || "",
    },
    validationSchema: Yup.object().shape({
      countryPick: Yup.string().required("Country is required"),
      statePick: Yup.string().required("State is required"),
      townPick: Yup.string().required("Town/City is required"),
      streetPick: Yup.string().required("Street address is required"),
      pickupDate: Yup.date()
        .required("Pickup date is required")
        .min(new Date(), "Pickup date must be in the future"),
    }),
    onSubmit: async (formValues) => {
      setIsLoading(true);
      try {
        // Structure data to match server schema
        const pickupPayload = {
          id: values._id,
          data: {
            pickup: {
              location: {
                street: formValues.streetPick,
                city: formValues.townPick,
                state: formValues.statePick,
                country: formValues.countryPick,
                postalCode: formValues.zipCodePick,
              },
              instructions: formValues.specialInstructions,
              date: formValues.pickupDate,
            },
          },
        };

        // Make API call
        const response = await updatePickupLocation(pickupPayload);

        // Enhanced response validation
        if (
          response &&
          response.success === true &&
          response.data &&
          response.data.shipment &&
          response.data.shipment._id
        ) {
          onUpdate();
        } else {
          // Handle failed but returned response
          console.error("API returned unsuccessful response:", response);
          const errorMessage =
            response?.message ||
            response?.error ||
            "Unable to update pickup location";
        }
      } catch (error) {
        console.error("Full error object:", error);

        // Improved error handling
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);

          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            "Server rejected the request";
          alert(`Update Failed: ${errorMessage}`);
        } else if (error.request) {
          // Network error - request was made but no response received
          console.error("No response received:", error.request);
          alert(
            "Network Error: No response from server. Please check your connection and try again."
          );
        } else if (error.message === "Invalid response from server") {
          // Our custom thrown error for invalid response format
          alert(
            "Server returned an invalid response format. Please try again or contact support."
          );
        } else {
          // Generic error handling
          console.error("Error details:", error.message || error);
          alert(
            `An error occurred: ${error.message || "Please try again later"}`
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Enable scroll when closing modal
  const enableScroll = () => {
    document.body.style.overflow = "auto";
    document.body.style.top = "0";
  };

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
          className="max-w-[68rem] w-full flex md:justify-center 
        ss:justify-center md:mx-0 ss:mx-16 mx-5 md:max-h-[75%] h-auto"
        >
          <motion.div
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="bg-white md:rounded-3xl ss:rounded-3xl relative
            rounded-2xl shadow-xl flex flex-col md:w-[90%] w-full 
            overflow-auto items-center scrollbar-hidden"
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center w-full
            border-b border-b-main7 md:py-6 md:px-12 ss:py-6 
            ss:px-12 py-4 px-5 bg-white top-0 sticky z-10"
            >
              <h1
                className="md:text-[30px] ss:text-[25px] text-[20px] 
              tracking-tight font-bold text-main2"
              >
                Change Pickup Location
              </h1>

              <BsX
                className="md:w-[3.2rem] ss:w-[3.2rem] w-[2rem] h-auto 
                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full cursor-pointer grow2"
                strokeWidth={0.2}
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
              />
            </div>

            {/* Modal Content */}
            <div
              className="flex items-center w-full flex-col md:px-12 
            ss:px-12 px-5 mb-3 md:gap-5 ss:gap-5 gap-4"
            >
              <form
                ref={formRef}
                onSubmit={formik.handleSubmit}
                className="md:w-[85%] w-full md:mt-6 ss:mt-6 mt-4"
              >
                <div className="flex flex-col w-full items-center gap-8">
                  <div className="flex flex-col w-full items-center gap-4">
                    <div className="grid md:grid-cols-2 ss:grid-cols-2 w-full md:gap-5 ss:gap-5 gap-4">
                      <div className="relative flex flex-col">
                        <div className="relative flex items-center">
                          {formik.values.countryPick && (
                            <img
                              src={
                                countries.find(
                                  (country) =>
                                    country.cca2 === formik.values.countryPick
                                )?.flags?.png
                              }
                              alt="flag"
                              className="absolute md:left-3.5 left-3 w-10
                              h-[1.4rem] rounded-sm"
                            />
                          )}
                          <select
                            type="text"
                            name="countryPick"
                            value={formik.values.countryPick}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                            px-3 outline text-main2 md:rounded-lg rounded-md
                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                            ss:text-[14px] text-[12px] focus:outline-primary
                            bg-transparent w-full custom-select outline-[1px]
                            ${
                              formik.touched.countryPick &&
                              formik.errors.countryPick
                                ? "outline-mainRed"
                                : "outline-main6"
                            }`}
                          >
                            <option value="" disabled hidden>
                              Select recipient's country
                            </option>
                            {countries.map((country) => (
                              <option key={country.cca2} value={country.cca2}>
                                {country.name.common}
                              </option>
                            ))}
                          </select>

                          <div className="absolute md:right-3.5 right-3">
                            <TiArrowSortedDown
                              className="text-main md:text-[16px]
                              ss:text-[18px] text-[16px]"
                            />
                          </div>
                        </div>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.countryPick &&
                            formik.errors.countryPick}
                        </p>

                        <p
                          className="text-main2 font-medium md:text-[12px]
                        ss:text-[12px] text-[11px] tracking-tight"
                        >
                          This is your selected country/region
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 ss:grid-cols-2 w-full md:gap-5 ss:gap-5 gap-4">
                      <div className="relative flex flex-col">
                        {getStateFieldByCountry(formik.values.countryPick)}
                      </div>

                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="townPick"
                          placeholder=" "
                          value={formik.values.townPick}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${
                            formik.touched.townPick && formik.errors.townPick
                              ? "outline-mainRed"
                              : "outline-main6"
                          }
                          `}
                        />

                        <label
                          htmlFor="townPick"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                          md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                          md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                          duration-300 peer-placeholder-shown:translate-y-0 
                          peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                          ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                          peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                          ${formik.values.townPick ? "z-10 px-2" : ""}
                          `}
                        >
                          Enter a town/city
                        </label>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.townPick && formik.errors.townPick}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 ss:grid-cols-2 w-full md:gap-5 ss:gap-5 gap-4">
                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="streetPick"
                          placeholder=" "
                          value={formik.values.streetPick}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${
                            formik.touched.streetPick &&
                            formik.errors.streetPick
                              ? "outline-mainRed"
                              : "outline-main6"
                          }
                          `}
                        />
                        <label
                          htmlFor="streetPick"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                          md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                          md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                          duration-300 peer-placeholder-shown:translate-y-0 
                          peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                          ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                          peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                          ${formik.values.streetPick ? "z-10 px-2" : ""}
                          `}
                        >
                          Street Address
                        </label>
                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.streetPick &&
                            formik.errors.streetPick}
                        </p>
                      </div>

                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="zipCodePick"
                          placeholder=" "
                          value={formik.values.zipCodePick}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${
                            formik.touched.zipCodePick &&
                            formik.errors.zipCodePick
                              ? "outline-mainRed"
                              : "outline-main6"
                          }
                          `}
                        />
                        <label
                          htmlFor="zipCodePick"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                          md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                          md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                          duration-300 peer-placeholder-shown:translate-y-0 
                          peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                          ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                          peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                          ${formik.values.zipCodePick ? "z-10 px-2" : ""}
                          `}
                        >
                          Postal Code
                        </label>
                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.zipCodePick &&
                            formik.errors.zipCodePick}
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-col w-full mt-4">
                      <input
                        type="datetime-local"
                        name="pickupDate"
                        value={formik.values.pickupDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={getMinDateTime()}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                        peer outline text-black md:rounded-lg rounded-md 
                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                        bg-transparent w-full focus:outline-primary
                        ${
                          formik.touched.pickupDate && formik.errors.pickupDate
                            ? "outline-mainRed"
                            : "outline-main6"
                        }
                        `}
                      />
                      <label
                        htmlFor="pickupDate"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none z-10 px-2
                        `}
                      >
                        Pickup Date
                      </label>
                      <p
                        className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                      >
                        {formik.touched.pickupDate && formik.errors.pickupDate}
                      </p>
                    </div>

                    <div className="relative flex flex-col w-full mt-4">
                      <textarea
                        name="specialInstructions"
                        placeholder=" "
                        value={formik.values.specialInstructions}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={3}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                        peer outline text-black md:rounded-lg rounded-md 
                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                        bg-transparent w-full focus:outline-primary
                        ${
                          formik.touched.specialInstructions &&
                          formik.errors.specialInstructions
                            ? "outline-mainRed"
                            : "outline-main6"
                        }
                        `}
                      />
                      <label
                        htmlFor="specialInstructions"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.specialInstructions ? "z-10 px-2" : ""}
                        `}
                      >
                        Special Instructions (Optional)
                      </label>
                      <p
                        className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                      >
                        {formik.touched.specialInstructions &&
                          formik.errors.specialInstructions}
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-4 flex w-full items-center 
                  justify-center md:gap-5 ss:gap-5 gap-3 md:flex-row 
                  ss:flex-row flex-col"
                  >
                    <button
                      type="button"
                      className="bg-none text-[13px] py-3.5 px-14
                      text-primary rounded-full grow2 cursor-pointer
                      items-center justify-center border border-primary
                      md:flex ss:flex hidden"
                      onClick={onClose}
                      disabled={formik.isSubmitting || isLoading}
                    >
                      <p className="font-semibold">Cancel</p>
                    </button>

                    {/* Confirm Button */}
                    <button
                      type="submit"
                      className={`bg-primary text-[13px] py-3.5 w-[50%] flex
                      text-white rounded-full grow4
                      items-center justify-center gap-3 ${
                        isLoading || formik.isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={formik.handleSubmit}
                      disabled={isLoading || formik.isSubmitting}
                    >
                      {isLoading || formik.isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <p>Confirm</p>
                          <HiOutlineArrowRight className="text-[14px]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PickupModal;
