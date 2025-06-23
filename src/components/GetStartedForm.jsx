/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from "yup";
import { SectionWrapper } from "../hoc";
import { localIcon } from "../assets";
import { internationalIcon } from "../assets";
import { useShipment } from "../context/ShipmentContext";
import { useNotifications } from "../context/NotificationContext";

const GetStartedForm = ({ onNext, initialData }) => {
  const formRef = useRef();
  const [currentTab, setCurrentTab] = useState("international");
  const [countries, setCountries] = useState([]);
  const { initializeShipment, loading } = useShipment();
  const { addNotification } = useNotifications();
  const [submitting, setSubmitting] = useState(false);

  // Set initial values based on any existing data
  useEffect(() => {
    if (initialData) {
      const isInternational = initialData.shipmentType === "international";
      setCurrentTab(initialData.shipmentType || "international");

      if (isInternational) {
        formik.setValues({
          ...formik.values,
          // countryFromInt: initialData.origin?.country || "IE",
          countryFromInt: "IE",
          cityFromInt: initialData.origin?.city || "",
          // countryTo: initialData.destination?.country || "NG",
          countryTo: "NG",
          cityToInt: initialData.destination?.city || "",
        });
      } else {
        formik.setValues({
          ...formik.values,
          // countryFromLoc: initialData.origin?.country || "NG",
          countryFromLoc: "NG",
          cityFromLoc: initialData.origin?.city || "",
          cityToLoc: initialData.destination?.city || "",
        });
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Import local countries data
        const countriesData = await import("../data/countries.json");
        const data = countriesData.default;
        const sortedCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error loading countries:", error);
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load countries. Please refresh the page.",
        });
      }
    };

    fetchCountries();
  }, [addNotification]);

  const internationalSchema = Yup.object().shape({
    countryFromInt: Yup.string().required("Sender's country is required"),
    cityFromInt: Yup.string().required("Sender's city is required"),
    countryTo: Yup.string().required("Recipient country is required"),
    cityToInt: Yup.string().required("Recipient city is required"),
  });

  const localSchema = Yup.object().shape({
    countryFromLoc: Yup.string().required("Sender's country is required"),
    cityFromLoc: Yup.string().required("Sender's city is required"),
    cityToLoc: Yup.string().required("Recipient city is required"),
  });

  const formik = useFormik({
    initialValues: {
      countryFromInt: "IE",
      countryFromLoc: "NG",
      cityFromInt: "",
      cityFromLoc: "",
      countryTo: "NG",
      cityToInt: "",
      cityToLoc: "",
    },
    validationSchema:
      currentTab === "international" ? internationalSchema : localSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        // Validate international/local shipment type against countries
        if (currentTab === "international") {
          if (values.countryFromInt === values.countryTo) {
            addNotification({
              type: "error",
              title: "Validation Error",
              message:
                "International shipments must be between different countries. Please select different countries for sender and recipient.",
            });
            setSubmitting(false);
            return;
          }
        }

        if (currentTab === "local") {
          // For local shipments, ensure origin and destination are in the same country
          if (values.countryFromLoc !== values.countryFromLoc) {
            addNotification({
              type: "error",
              title: "Validation Error",
              message:
                "Local shipments must be within the same country. Please select local shipping options.",
            });
            setSubmitting(false);
            return;
          }
        }

        const initialData = {
          shipmentType: currentTab,
          origin: {
            country:
              currentTab === "international"
                ? values.countryFromInt
                : values.countryFromLoc,
            city:
              currentTab === "international"
                ? values.cityFromInt
                : values.cityFromLoc,
          },
          destination: {
            country:
              currentTab === "international"
                ? values.countryTo
                : values.countryFromLoc,
            city:
              currentTab === "international"
                ? values.cityToInt
                : values.cityToLoc,
          },
        };

        const response = await initializeShipment(initialData);

        // Call onNext with the tab type and move to next step
        if (response && response.shipment) {
          // Update URL with the shipment ID
          const shipmentId = response.shipment._id;
          const newUrl = `${window.location.pathname}?shipmentId=${shipmentId}&type=${currentTab}`;
          window.history.pushState({ path: newUrl }, "", newUrl);
          onNext(currentTab);
        }
      } catch (err) {
        console.error("Error initializing shipment:", err);
        addNotification({
          type: "error",
          title: "Error",
          message:
            err.message || "Failed to initialize shipment. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // const handleTabChange = (tab) => {
  //   if (tab === "international") {
  //     setCurrentTab(tab);
  //     formik.resetForm();
  //   }
  // };

  return (
    <section
      className="w-full flex md:min-h-[600px] ss:min-h-[550px]
    min-h-[680px]"
    >
      <div
        className="flex items-center w-full flex-col md:gap-8 
        ss:gap-6 gap-5"
      >
        <div className="w-full flex flex-col gap-1.5 items-center">
          <h1
            className="text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center"
          >
            Shall we get started?
          </h1>

          <p
            className="text-main4 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight text-center"
          >
            Where do you want us to go?
          </p>
        </div>

        <div
          className="flex justify-center items-center md:gap-3
            ss:gap-3 gap-2.5 md:w-[43%] ss:w-[70%] w-full mt-3"
        >
          <div
            // className={`py-3.5 px-4 flex items-center mobship
            //     ${
            //       currentTab === "international"
            //         ? "bg-primary text-white"
            //         : "border-main5 border-[1px] text-primary grow4"
            //     }  rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-full
            //     gap-2 transition-all duration-300 ease-in-out`}
            // onClick={() => handleTabChange("international")}

            className="py-3.5 px-4 flex items-center mobship bg-primary text-white rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-full gap-2"
          >
            {/* <img
              src={internationalIcon}
              className={`w-[2.3rem] h-auto object-contain
                            ${
                              currentTab === "international"
                                ? "stroke-white"
                                : "stroke-primary"
                            }
                        `}
              alt="International Shipping"
            /> */}
            <img
              src={internationalIcon}
              className="w-[2.3rem] h-auto object-contain stroke-white"
              alt="International Shipping"
            />

            <div className="flex flex-col">
              <h2
                className="md:text-[13px] ss:text-[13px] 
                        text-[12px] font-bold"
              >
                International Shipping
              </h2>

              {/* <p
                className={`${
                  currentTab === "local" ? "text-main4" : "font-light"
                } md:text-[11px] ss:text-[11px] text-[10px]
                        `}
              > */}
              <p className="font-light md:text-[11px] ss:text-[11px] text-[10px]">
                Ship between countries
              </p>
            </div>
          </div>

          {/* <div
            className={`py-3.5 px-4 flex items-center mobship
                ${
                  currentTab === "local"
                    ? "bg-primary text-white"
                    : "border-main5 border-[1px] text-primary grow4"
                }  rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
            onClick={() => handleTabChange("local")}
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
          </div> */}
          <div className="py-3.5 px-4 flex items-center mobship border-main5 border-[1px] text-gray-400 rounded-lg md:w-1/2 ss:w-1/2 w-full gap-2 opacity-50 cursor-not-allowed">
            <img
              src={localIcon}
              className="w-[2.3rem] h-auto object-contain stroke-gray-400"
              alt="Local Shipping"
            />
            <div className="flex flex-col">
              <h2 className="md:text-[13px] ss:text-[13px] text-[12px] font-bold">
                Local Shipping
              </h2>
              <p className="md:text-[11px] ss:text-[11px] text-[10px]">
                Coming Soon
              </p>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={formik.handleSubmit}
          className="md:w-[80%] w-full md:mt-0 ss:mt-0 mt-2"
        >
          {currentTab === "international" ? (
            <div className="flex flex-col w-full items-center gap-3">
              <div className="flex flex-col w-full">
                <h2
                  className="text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight"
                >
                  I am shipping from
                </h2>

                <div
                  className="grid md:grid-cols-2 ss:grid-cols-2
                            gap-3.5 mt-3.5"
                >
                  {/* <div className="relative flex flex-col">
                    <div className="relative flex items-center">
                      {formik.values.countryFromInt && (
                        <img
                          src={
                            countries.find(
                              (country) =>
                                country.cca2 === formik.values.countryFromInt
                            )?.flags?.png
                          }
                          alt="flag"
                          className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                        />
                      )}
                      <select
                        type="text"
                        name="countryFromInt"
                        value={formik.values.countryFromInt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${
                                              formik.touched.countryFromInt &&
                                              formik.errors.countryFromInt
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      >
                        <option value="" disabled hidden>
                          Select your country
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
                      {formik.touched.countryFromInt &&
                        formik.errors.countryFromInt}
                    </p>

                    <p
                      className="text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden 
                                    ss:hidden flex"
                    >
                      This is your billing country/region
                    </p>
                  </div> */}
                  <div className="relative flex flex-col">
                    <div className="relative flex items-center">
                      <img
                        src={
                          countries.find((country) => country.cca2 === "IE")
                            ?.flags?.png
                        }
                        alt="Ireland flag"
                        className="absolute md:left-3.5 left-3 w-10 h-[1.4rem] rounded-sm"
                      />
                      <input
                        type="text"
                        value="Ireland"
                        disabled
                        className="md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem] px-3 outline text-main2 md:rounded-lg rounded-md md:text-[14px] font-bold pl-[3.6rem] ss:text-[14px] text-[12px] bg-transparent w-full outline-[1px] outline-main6 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <input
                      type="text"
                      name="cityFromInt"
                      placeholder=" "
                      value={formik.values.cityFromInt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline-[1px] outline-main6 outline
                                        text-black md:rounded-lg rounded-md md:text-[14px]
                                        ss:text-[14px] text-[12px] focus:outline-primary
                                        bg-transparent w-full "
                    />

                    <label
                      htmlFor="cityFromInt"
                      className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${
                                      formik.values.cityFromInt
                                        ? "z-10 px-2"
                                        : ""
                                    }
                                    `}
                    >
                      Enter your city/town
                    </label>
                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                    >
                      {formik.touched.cityFromInt && formik.errors.cityFromInt}
                    </p>
                  </div>
                </div>

                <p
                  className="text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden 
                            ss:flex md:flex"
                >
                  This is your billing country/region
                </p>
              </div>

              <div className="flex flex-col w-full">
                <h2
                  className="text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight"
                >
                  To
                </h2>

                <div
                  className="grid md:grid-cols-2 ss:grid-cols-2
                            gap-3.5 mt-3.5"
                >
                  {/* <div className="relative flex flex-col">
                    <div className="relative flex items-center">
                      {formik.values.countryTo && (
                        <img
                          src={
                            countries.find(
                              (country) =>
                                country.cca2 === formik.values.countryTo
                            )?.flags?.png
                          }
                          alt="flag"
                          className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                        />
                      )}
                      <select
                        type="text"
                        name="countryTo"
                        value={formik.values.countryTo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${
                                              formik.touched.countryTo &&
                                              formik.errors.countryTo
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      >
                        <option value="" disabled hidden>
                          Select your country
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
                      {formik.touched.countryTo && formik.errors.countryTo}
                    </p>

                    <p
                      className="text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden
                                    ss:hidden flex"
                    >
                      This is the country/region we'll be shipping to
                    </p>
                  </div> */}
                  <div className="relative flex flex-col">
                    <div className="relative flex items-center">
                      <img
                        src={
                          countries.find((country) => country.cca2 === "NG")
                            ?.flags?.png
                        }
                        alt="Nigeria flag"
                        className="absolute md:left-3.5 left-3 w-10 h-[1.4rem] rounded-sm"
                      />
                      <input
                        type="text"
                        value="Nigeria"
                        disabled
                        className="md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem] px-3 outline text-main2 md:rounded-lg rounded-md md:text-[14px] font-bold pl-[3.6rem] ss:text-[14px] text-[12px] bg-transparent w-full outline-[1px] outline-main6 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <input
                      type="text"
                      name="cityToInt"
                      placeholder=" "
                      value={formik.values.cityToInt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline outline-main6 outline-[1px]
                                        text-black md:rounded-lg rounded-md md:text-[14px]
                                        ss:text-[14px] text-[12px]
                                        bg-transparent w-full focus:outline-primary"
                    />

                    <label
                      htmlFor="cityToInt"
                      className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${
                                      formik.values.cityToInt ? "z-10 px-2" : ""
                                    }
                                    `}
                    >
                      Enter destination city/town
                    </label>
                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                    >
                      {formik.touched.cityToInt && formik.errors.cityToInt}
                    </p>
                  </div>
                </div>

                <p
                  className="text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden
                            ss:flex md:flex"
                >
                  This is the country/region we&apos;ll be shipping to
                </p>
              </div>

              <div className="mt-6 mobnext">
                <button
                  type="submit"
                  className="bg-primary text-[13px] py-3.5 px-14 flex
                            text-white rounded-full grow4 cursor-pointer
                            items-center justify-center gap-3 mobbut"
                  disabled={loading}
                >
                  <p>{loading ? "Processing..." : "Next"}</p>

                  {!loading && <HiOutlineArrowRight className="text-[14px]" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full items-center gap-3">
              <div className="flex flex-col w-full">
                <h2
                  className="text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight"
                >
                  I am shipping from
                </h2>

                <div
                  className="grid md:grid-cols-2 ss:grid-cols-2 
                            gap-3.5 mt-3.5"
                >
                  <div className="relative flex flex-col">
                    <div className="relative flex items-center">
                      {formik.values.countryFromLoc && (
                        <img
                          src={
                            countries.find(
                              (country) =>
                                country.cca2 === formik.values.countryFromLoc
                            )?.flags?.png
                          }
                          alt="flag"
                          className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                        />
                      )}
                      <select
                        type="text"
                        name="countryFromLoc"
                        value={formik.values.countryFromLoc}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${
                                              formik.touched.countryFromLoc &&
                                              formik.errors.countryFromLoc
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                      >
                        <option value="" disabled hidden>
                          Select your country
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
                      {formik.touched.countryFromLoc &&
                        formik.errors.countryFromLoc}
                    </p>

                    <p
                      className="text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden 
                                    ss:hidden flex"
                    >
                      This is your billing country/region
                    </p>
                  </div>

                  <div className="relative z-10">
                    <input
                      type="text"
                      name="cityFromLoc"
                      placeholder=" "
                      value={formik.values.cityFromLoc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${
                                          formik.touched.cityFromLoc &&
                                          formik.errors.cityFromLoc
                                            ? "outline-mainRed"
                                            : "outline-main6"
                                        }
                                        `}
                    />

                    <label
                      htmlFor="cityFromLoc"
                      className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${
                                      formik.values.cityFromLoc
                                        ? "z-10 px-2"
                                        : ""
                                    }
                                    `}
                    >
                      Enter your city/town
                    </label>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                    >
                      {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                    </p>
                  </div>
                </div>

                <p
                  className="text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden 
                            ss:flex md:flex"
                >
                  This is your billing country/region
                </p>
              </div>

              <div className="flex flex-col w-full">
                <h2
                  className="text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight"
                >
                  To
                </h2>

                <div
                  className="grid md:grid-cols-2 ss:grid-cols-2 
                            gap-3.5 mt-3.5"
                >
                  <div className="relative z-10">
                    <input
                      type="text"
                      name="cityToLoc"
                      placeholder=" "
                      value={formik.values.cityToLoc}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px]
                                        bg-transparent w-full focus:outline-primary outline-[1px]
                                        ${
                                          formik.touched.cityToLoc &&
                                          formik.errors.cityToLoc
                                            ? "outline-mainRed"
                                            : "outline-main6"
                                        }
                                        `}
                    />

                    <label
                      htmlFor="cityToLoc"
                      className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${
                                      formik.values.cityToLoc ? "z-10 px-2" : ""
                                    }
                                    `}
                    >
                      Enter destination city/town
                    </label>

                    <p
                      className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                    >
                      {formik.touched.cityToLoc && formik.errors.cityToLoc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 mobnext">
                <button
                  type="submit"
                  className="bg-primary text-[13px] py-3.5 px-14 flex
                            text-white rounded-full grow4 cursor-pointer 
                            items-center justify-center gap-3 mobbut"
                  disabled={loading}
                >
                  <p>{loading ? "Processing..." : "Next"}</p>

                  {!loading && <HiOutlineArrowRight className="text-[14px]" />}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default SectionWrapper(GetStartedForm, "");
