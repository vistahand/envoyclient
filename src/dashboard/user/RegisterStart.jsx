import { useState, useRef } from "react";
import { useRegister } from "../../context/RegisterContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SectionWrapperApp } from "../../hoc";
import { apple, facebook, google, register } from "../../assets";
import { HiOutlineArrowRight } from "react-icons/hi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const RegisterStart = ({ onNext }) => {
  const formRef = useRef();
  const { startRegistration, loading, error: registerError } = useRegister();
  const [showChoosePass, setShowChoosePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const toggleChoosePassVisibility = () => {
    setShowChoosePass(!showChoosePass);
  };

  const toggleConfirmPassVisibility = () => {
    setShowConfirmPass(!showConfirmPass);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      choosePass: "",
      confirmPass: "",
    },

    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
      choosePass: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/,
          "Password must contain alphanumeric characters and at least one special character."
        )
        .required("Password is required"),
      confirmPass: Yup.string()
        .oneOf([Yup.ref("choosePass"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      try {
        await startRegistration(values.email, values.choosePass);
        const newUrl = `${window.location.pathname}?email=${values.email}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        onNext();
      } catch (err) {
        // Error is handled by the context and displayed below
        console.error("Registration error:", err);
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
              <div className="flex flex-col gap-1 w-full">
                <h1
                  className="text-primary font-semibold md:text-[37px]
                ss:text-[35px] text-[32px] tracking-tight mobline"
                >
                  Your experience begins here!
                </h1>

                <h2
                  className="md:text-[15px] ss:text-[16px] text-[14px]  
                tracking-tight font-medium text-main4 md:leading-[22px]
                ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1"
                >
                  Provide a few details about yourself so we can get you
                  started. Already got an account?{" "}
                  <br
                    className="hidden
                  ss:flex"
                  />
                  <a
                    href="/login"
                    className="text-primary font-bold 
                  hover:text-secondary navsmooth"
                  >
                    {" "}
                    Log in here
                  </a>
                </h2>
              </div>

              <div
                className="flex md:justify-between items-center w-full 
              md:gap-5 ss:gap-5 gap-3 mobauth"
              >
                <div
                  className="flex items-center gap-2 md:p-3.5 ss:p-3.5 p-3 
                rounded-full border border-main7 cursor-pointer grow4"
                >
                  <img
                    src={google}
                    alt="Google"
                    className="w-[1.2rem] h-auto"
                  />

                  <h4
                    className="md:text-[12px] ss:text-[13px] text-[12px]  
                  tracking-tight font-semibold text-main2"
                  >
                    Continue with Google
                  </h4>
                </div>

                <div
                  className="flex items-center gap-2 md:p-3.5 ss:p-3.5 p-3 
                rounded-full border border-main7 cursor-pointer grow4"
                >
                  <img src={apple} alt="Apple" className="w-[1.2rem] h-auto" />

                  <h4
                    className="md:text-[12px] ss:text-[13px] text-[12px]  
                  tracking-tight font-semibold text-main2"
                  >
                    Continue with Apple
                  </h4>
                </div>

                <div
                  className="flex items-center gap-2 md:p-3.5 ss:p-3.5 p-3 
                rounded-full border border-main7 cursor-pointer grow4"
                >
                  <img
                    src={facebook}
                    alt="Facebook"
                    className="w-[1.2rem] h-auto"
                  />

                  <h4
                    className="md:text-[12px] ss:text-[13px] text-[12px]  
                  tracking-tight font-semibold text-main2"
                  >
                    Continue with Facebook
                  </h4>
                </div>
              </div>

              <div
                className="flex justify-between items-center w-full 
              gap-4"
              >
                <div className="flex-grow">
                  <div className="bg-main7 w-full h-[1px]" />
                </div>

                <h1
                  className="md:text-[15px] ss:text-[15px] text-[14px] 
                text-main5"
                >
                  or
                </h1>

                <div className="flex-grow">
                  <div className="bg-main7 w-full h-[1px]" />
                </div>
              </div>

              <div className="w-full">
                <form
                  ref={formRef}
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col w-full gap-5"
                >
                  <div
                    className="flex flex-col md:w-[80%] ss:w-[80%] w-full 
                  md:gap-4 ss:gap-4 gap-4 mt-1"
                  >
                    <div className="relative flex flex-col">
                      <input
                        type="text"
                        name="email"
                        placeholder=" "
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                        peer outline text-black md:rounded-lg rounded-md 
                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                        bg-transparent w-full focus:outline-primary
                        ${
                          formik.touched.email && formik.errors.email
                            ? "outline-mainRed"
                            : "outline-main6"
                        }
                        `}
                      />

                      <label
                        htmlFor="email"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                      md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform
                      md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                      duration-300 peer-placeholder-shown:translate-y-0 text-main6
                      peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                      ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                      peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                      ${formik.values.email ? "z-10 px-2" : ""}
                      `}
                      >
                        Enter your email
                      </label>

                      <p
                        className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                      >
                        {formik.touched.email && formik.errors.email}
                      </p>
                    </div>

                    <div className="relative flex flex-col">
                      <div className="relative">
                        <input
                          type={showChoosePass ? "text" : "password"}
                          name="choosePass"
                          placeholder=" "
                          value={formik.values.choosePass}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${
                            formik.touched.choosePass &&
                            formik.errors.choosePass
                              ? "outline-mainRed"
                              : "outline-main6"
                          }
                          `}
                        />

                        <div
                          className="absolute right-0 inset-y-0 flex pr-4
                        items-center"
                        >
                          {showChoosePass ? (
                            <AiOutlineEyeInvisible
                              className="text-main6 text-[18px] cursor-pointer"
                              onClick={toggleChoosePassVisibility}
                            />
                          ) : (
                            <AiOutlineEye
                              className="text-main6 text-[18px] cursor-pointer"
                              onClick={toggleChoosePassVisibility}
                            />
                          )}
                        </div>
                      </div>

                      <label
                        htmlFor="choosePass"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                      ${
                        formik.values.choosePass
                          ? "md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75"
                          : ""
                      } transform 
                      md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                      duration-300 peer-placeholder-shown:translate-y-0 text-main6 
                      peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                      ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                      peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                      ${formik.values.choosePass ? "z-10 px-2" : ""}
                      `}
                      >
                        Choose a password
                      </label>

                      <p
                        className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                      >
                        {formik.touched.choosePass && formik.errors.choosePass}
                      </p>
                    </div>

                    <div className="relative flex flex-col">
                      <div className="relative">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          name="confirmPass"
                          placeholder=" "
                          value={formik.values.confirmPass}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${
                            formik.touched.confirmPass &&
                            formik.errors.confirmPass
                              ? "outline-mainRed"
                              : "outline-main6"
                          }
                          `}
                        />

                        <div
                          className="absolute right-0 inset-y-0 flex pr-4
                        items-center"
                        >
                          {showConfirmPass ? (
                            <AiOutlineEyeInvisible
                              className="text-main6 text-[18px] cursor-pointer"
                              onClick={toggleConfirmPassVisibility}
                            />
                          ) : (
                            <AiOutlineEye
                              className="text-main6 text-[18px] cursor-pointer"
                              onClick={toggleConfirmPassVisibility}
                            />
                          )}
                        </div>
                      </div>

                      <label
                        htmlFor="confirmPass"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                      ${
                        formik.values.confirmPass
                          ? "md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75"
                          : ""
                      } transform   
                      md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                      duration-300 peer-placeholder-shown:translate-y-0 text-main6
                      peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                      ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                      peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                      ${formik.values.confirmPass ? "z-10 px-2" : ""}
                      `}
                      >
                        Confirm your password
                      </label>

                      <p
                        className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                      >
                        {formik.touched.confirmPass &&
                          formik.errors.confirmPass}
                      </p>
                    </div>
                  </div>

                  <p
                    className="md:text-[13px] ss:text-[14px] text-[12px]  
                  tracking-tight font-medium text-main4 md:leading-[18px]
                  ss:leading-[19px] leading-[18px] mt-1"
                  >
                    By clicking on Register, you agree to Envoy Angel's Terms of
                    Service and Privacy Policy. You consent to the collection,
                    storage, and use of your information as outlined in our
                    Privacy Policy, which includes account setup, service
                    updates, and communications.
                  </p>

                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-primary text-[13px] py-3.5 px-14
                      flex text-white rounded-full grow4 cursor-pointer
                      items-center justify-center gap-3 mobbut
                      ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      <p>{loading ? "Registering..." : "Register"}</p>

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

export default SectionWrapperApp(RegisterStart, "");
