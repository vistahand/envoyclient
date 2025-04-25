import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { SectionWrapperApp } from "../hoc";
import { login } from "../assets"; // You'll need to add this image
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { auth } from "../services/api"; // Import the auth service from your API file

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setResetError("");
        
        // Call the actual API endpoint from the auth service
        const response = await auth.forgotPassword(values.email);
        
        // If successful, show success state
        setResetSent(true);
      } catch (err) {
        console.log(err.message);
        setResetError(err.message || "Failed to send password reset email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <section
    className="relative w-full flex md:items-center md:min-h-auto font-manrope
    ss:min-h-[80vh] min-h-[90vh]"
    >
      <div className="flex flex-row w-full justify-between md:gap-20">
        <div className="md:w-[50%] w-full flex flex-col md:py-10">
          <div
            className="w-full flex flex-col h-full justify-between md:gap-6 ss:gap-6 
          gap-5"
          >
            {/* Go Back Button */}
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 text-primary hover:text-secondary 
              navsmooth self-start mb-2"
            >
              <HiOutlineArrowLeft className="text-[16px]" />
              <span className="text-[14px] font-medium">Go Back</span>
            </button>

            <div
              className="w-full flex flex-col h-full md:gap-6 ss:gap-6 
            gap-5"
            >
              <div className="flex flex-col gap-1 w-full">
                <h1
                  className="text-primary font-semibold md:text-[37px]
                ss:text-[35px] text-[32px] tracking-tight mobline"
                >
                  {resetSent ? "Check your inbox" : "Forgot your password?"}
                </h1>

                <h2
                  className="md:text-[15px] ss:text-[16px] text-[14px]  
                tracking-tight font-medium text-main4 md:leading-[22px]
                ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1"
                >
                  {resetSent 
                    ? "We've sent you an email with instructions to reset your password."
                    : "Don't worry! Enter your email and we'll send you a link to reset your password."
                  }
                  <br className="hidden ss:flex" />
                  {!resetSent && (
                    <>
                      <a
                        href="/login"
                        className="text-primary font-bold 
                      hover:text-secondary navsmooth mt-2 inline-block"
                      >
                        Remember your password? Login here
                      </a>
                    </>
                  )}
                </h2>
              </div>

              {!resetSent ? (
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
                        <div className="relative">
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
                          
                          <div className="absolute right-0 inset-y-0 flex pr-4 items-center">
                            <FiMail className="text-main6 text-[18px]" />
                          </div>
                        </div>

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
                    </div>

                    <div className="w-full">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-primary text-[13px] py-3.5 px-14
                        flex text-white rounded-full grow4 cursor-pointer
                        items-center justify-center gap-3 mobbut
                        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        <p>{isLoading ? "Sending..." : "Reset Password"}</p>

                        {!isLoading && (
                          <HiOutlineArrowRight className="text-[14px]" />
                        )}
                      </button>

                      {resetError && (
                        <p
                          className="text-mainRed text-center md:text-[13px] 
                        ss:text-[13px] text-[12px] mt-4"
                        >
                          {resetError}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="w-full md:w-[80%] ss:w-[80%] flex flex-col items-center justify-center mt-6">
                  <div className="bg-primary bg-opacity-10 rounded-full p-6 mb-6">
                    <BsCheckCircleFill className="text-primary text-5xl" />
                  </div>
                  
                  <p className="text-center text-main4 md:text-[15px] ss:text-[14px] text-[13px] mb-8">
                    If we found an account associated with that email, we've sent a password reset link.
                    Please check your inbox and spam folders.
                  </p>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-primary text-[13px] py-3.5 px-14
                    flex text-white rounded-full grow4 cursor-pointer
                    items-center justify-center gap-3 mobbut"
                  >
                    <p>Back to Login</p>
                    <HiOutlineArrowRight className="text-[14px]" />
                  </button>
                </div>
              )}
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
          <div className="w-full relative rounded-2xl h-full">
            <img
              src={login || "https://via.placeholder.com/600x800"}
              alt="forgot password"
              className="h-full w-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapperApp(ForgotPassword, "");