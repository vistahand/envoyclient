import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../context/RegisterContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SectionWrapperApp } from "../../hoc";
import { register, useradd } from "../../assets";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiOutlineArrowRight } from "react-icons/hi";

const RegisterFinish = () => {
  const [countries, setCountries] = useState([]);
  const formRef = useRef();
  const navigate = useNavigate();
  const { completeRegistration, loading, error: registerError } = useRegister();

  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

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

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      country: "IE",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      phone: Yup.number().required("Phone number is required"),
      country: Yup.string().required("Country is required"),
    }),

    onSubmit: async (values) => {
      const data = { email: email, ...values };
      try {
        const response = await completeRegistration(data);
        if (response.success) {
          navigate("/user");
        }
      } catch (err) {
        console.error("Registration completion error:", err);
      }
    },
  });

  return (
    <section
      className="relative w-full flex md:items-center md:min-h-auto 
    ss:min-h-[80vh] min-h-[90vh]"
    >
      <div className="flex flex-row w-full justify-between md:gap-20">
        <div className="md:w-[50%] w-full flex flex-col md:py-10">
          <div
            className="w-full flex flex-col h-full justify-between md:gap-6 ss:gap-6 
            gap-5"
          >
            <div
              className="w-full flex flex-col h-full md:gap-6 ss:gap-6 
                gap-5"
            >
              <div className="w-full shipmodmob">
                <div
                  className="md:w-[10rem] ss:w-[8rem] w-[6rem] h-auto 
                        bg-primary1 rounded-full"
                >
                  <img
                    src={useradd}
                    alt="useradd"
                    className="md:w-[10rem] ss:w-[8rem] w-[6rem] 
                                h-auto md:p-12 ss:p-10 p-6"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <h1
                  className="text-primary font-semibold md:text-[35px]
                        ss:text-[33px] text-[30px] tracking-tight mobline"
                >
                  Tell us a little bit about you
                </h1>

                <h2
                  className="md:text-[15px] ss:text-[16px] text-[14px]  
                        tracking-tight font-medium text-main4 md:leading-[22px]
                        ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1"
                >
                  Enter your personal information to enable us serve you better
                  by saving this as your default shipping info
                </h2>
              </div>

              <div className="w-full">
                <form
                  ref={formRef}
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col w-full gap-5"
                >
                  <div className="flex md:w-[80%] ss:w-[80%] w-full mt-1">
                    <div
                      className="grid md:grid-cols-4 ss:grid-cols-4 
                                md:gap-4 ss:gap-4 gap-3 w-full"
                    >
                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="text"
                          name="firstName"
                          placeholder=" "
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline text-black md:rounded-lg rounded-md 
                                            md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                            bg-transparent w-full focus:outline-primary
                                            ${
                                              formik.touched.firstName &&
                                              formik.errors.firstName
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }
                                            `}
                        />

                        <label
                          htmlFor="firstName"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${
                                          formik.values.firstName
                                            ? "z-10 px-2"
                                            : ""
                                        }
                                        `}
                        >
                          Enter your first name
                        </label>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.firstName && formik.errors.firstName}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="text"
                          name="lastName"
                          placeholder=" "
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline text-black md:rounded-lg rounded-md 
                                            md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                            bg-transparent w-full focus:outline-primary
                                            ${
                                              formik.touched.lastName &&
                                              formik.errors.lastName
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }
                                            `}
                        />

                        <label
                          htmlFor="lastName"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${
                                          formik.values.lastName
                                            ? "z-10 px-2"
                                            : ""
                                        }
                                        `}
                        >
                          Enter your last name
                        </label>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.lastName && formik.errors.lastName}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-4">
                        <input
                          type="number"
                          name="phone"
                          placeholder=" "
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline text-black md:rounded-lg rounded-md 
                                            md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                            bg-transparent w-full focus:outline-primary
                                            ${
                                              formik.touched.phone &&
                                              formik.errors.phone
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }
                                            `}
                        />

                        <label
                          htmlFor="phone"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${
                                          formik.values.phone ? "z-10 px-2" : ""
                                        }
                                        `}
                        >
                          Enter your phone number
                        </label>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.phone && formik.errors.phone}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-4">
                        <div className="relative flex items-center">
                          {formik.values.country && (
                            <img
                              src={
                                countries.find(
                                  (country) =>
                                    country.cca2 === formik.values.country
                                )?.flags?.png
                              }
                              alt="flag"
                              className="absolute md:left-3.5 left-3 w-10
                                                    h-[1.4rem] rounded-sm"
                            />
                          )}
                          <select
                            type="text"
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                                px-3 outline text-main2 md:rounded-lg rounded-md
                                                cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                                ss:text-[14px] text-[12px] focus:outline-primary
                                                bg-transparent w-full custom-select outline-[1px]
                                                ${
                                                  formik.touched.country &&
                                                  formik.errors.country
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
                          {formik.touched.country && formik.errors.country}
                        </p>

                        <p
                          className="text-main2 font-medium md:text-[12px]
                                        ss:text-[12px] text-[11px] tracking-tight"
                        >
                          This will be set as your default billing
                          country/region
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-primary text-[13px] py-3.5 px-14
                                flex text-white rounded-full grow4 cursor-pointer
                                items-center justify-center gap-3 mobbut
                                ${
                                  loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                    >
                      <p>{loading ? "Completing..." : "Finish"}</p>

                      {!loading && (
                        <HiOutlineArrowRight className="text-[14px]" />
                      )}
                    </button>

                    {registerError && (
                      <p
                        className="text-mainRed text-center md:text-[13px] 
                                ss:text-[13px] text-[12px] mt-4"
                      >
                        {registerError}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="flex relative w-full md:mt-12 justify-end">
              <div className="w-full">
                <p
                  className="md:text-[13px] ss:text-[13px] text-[11px] 
                        text-main4 mt-0.5 font-medium"
                >
                  © 2025 Envoy Angel Shipping and Logistics Ltd. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[50%] md:flex hidden">
          <div className="w-full relative rounded-2xl">
            <img
              src={register}
              alt="register"
              className="h-full w-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapperApp(RegisterFinish, "");
