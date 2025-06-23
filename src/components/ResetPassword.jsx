import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { SectionWrapperApp } from "../hoc";
import { login } from "../assets";
import { HiOutlineArrowRight } from "react-icons/hi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import { auth } from "../services/api"; // Import auth service

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search); // Add useParams hook
  const formRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenValue, setTokenValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  // Extract token from URL path parameter
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Try to get token from path parameter (the part after /reset-password/)
        const pathEmail = String(params.get("email"));
        const pathToken = String(params.get("token"));

        if (pathToken === "force-reset") {
          // This is a forced password reset after login
          setTokenValue("force-reset");
          setEmailValue(pathEmail);
          setTokenValidated(true);
        } else if (pathToken) {
          setTokenValue(pathToken);
          setEmailValue(pathEmail);
          setTokenValidated(true);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setTokenValidated(false);
      }
    };

    validateToken();
  }, [location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).*$/,
          "Password must contain both letters and numbers."
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setResetError("");

        // Call the API to reset the password
        await auth.resetPassword(tokenValue, values.password, emailValue);

        // If successful, show success state
        setResetComplete(true);
      } catch (err) {
        console.error("Password reset error:", err);
        setResetError(
          err.message || "Failed to reset password. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Check if token is missing
  if (!tokenValidated && !resetComplete) {
    return (
      <section className="relative w-full flex md:items-center md:min-h-auto font-manrope ss:min-h-[80vh] min-h-[90vh]">
        <div className="flex flex-col items-center justify-center w-full px-6">
          <div className="bg-mainRed bg-opacity-10 rounded-full p-6 mb-6">
            <AiOutlineEye className="text-mainRed text-5xl" />
          </div>
          <h1 className="text-primary font-semibold md:text-[32px] ss:text-[28px] text-[24px] mb-4 text-center">
            Invalid or Missing Reset Link
          </h1>
          <p className="text-main4 md:text-[15px] ss:text-[14px] text-[13px] mb-8 text-center max-w-md">
            The password reset link is invalid or has expired. Please request a
            new password reset link.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-primary text-[13px] py-3.5 px-14
            flex text-white rounded-full grow4 cursor-pointer
            items-center justify-center gap-3 mobbut"
          >
            <p>Request New Link</p>
            <HiOutlineArrowRight className="text-[14px]" />
          </button>
        </div>
      </section>
    );
  }

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
            <div
              className="w-full flex flex-col h-full md:gap-6 ss:gap-6 
            gap-5"
            >
              <div className="flex flex-col gap-1 w-full">
                <h1
                  className="text-primary font-semibold md:text-[37px]
                ss:text-[35px] text-[32px] tracking-tight mobline"
                >
                  {resetComplete
                    ? "Password Reset Complete"
                    : "Create New Password"}
                </h1>

                <h2
                  className="md:text-[15px] ss:text-[16px] text-[14px]  
                tracking-tight font-medium text-main4 md:leading-[22px]
                ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1"
                >
                  {resetComplete
                    ? "Your password has been successfully reset. You can now log in with your new password."
                    : "Please create a new password for your account. Make sure it's secure and easy to remember."}
                </h2>
              </div>

              {!resetComplete ? (
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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder=" "
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`md:py-3.5 py-3 md:px-3.5 px-3 
                            peer outline text-black md:rounded-lg rounded-md 
                            md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                            bg-transparent w-full focus:outline-primary
                            ${
                              formik.touched.password && formik.errors.password
                                ? "outline-mainRed"
                                : "outline-main6"
                            }
                            `}
                          />

                          <div
                            className="absolute right-0 inset-y-0 flex pr-4
                          items-center"
                          >
                            {showPassword ? (
                              <AiOutlineEyeInvisible
                                className="text-main6 text-[18px] cursor-pointer"
                                onClick={togglePasswordVisibility}
                              />
                            ) : (
                              <AiOutlineEye
                                className="text-main6 text-[18px] cursor-pointer"
                                onClick={togglePasswordVisibility}
                              />
                            )}
                          </div>
                        </div>

                        <label
                          htmlFor="password"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        ${
                          formik.values.password
                            ? "md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75"
                            : ""
                        } transform 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 text-main6 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.password ? "z-10 px-2" : ""}
                        `}
                        >
                          New password
                        </label>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.password && formik.errors.password}
                        </p>
                      </div>

                      <div className="relative flex flex-col">
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder=" "
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`md:py-3.5 py-3 md:px-3.5 px-3 
                            peer outline text-black md:rounded-lg rounded-md 
                            md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                            bg-transparent w-full focus:outline-primary
                            ${
                              formik.touched.confirmPassword &&
                              formik.errors.confirmPassword
                                ? "outline-mainRed"
                                : "outline-main6"
                            }
                            `}
                          />

                          <div
                            className="absolute right-0 inset-y-0 flex pr-4
                          items-center"
                          >
                            {showConfirmPassword ? (
                              <AiOutlineEyeInvisible
                                className="text-main6 text-[18px] cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                              />
                            ) : (
                              <AiOutlineEye
                                className="text-main6 text-[18px] cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                              />
                            )}
                          </div>
                        </div>

                        <label
                          htmlFor="confirmPassword"
                          className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        ${
                          formik.values.confirmPassword
                            ? "md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75"
                            : ""
                        } transform 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 text-main6 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.confirmPassword ? "z-10 px-2" : ""}
                        `}
                        >
                          Confirm new password
                        </label>

                        <p
                          className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                        >
                          {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword}
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
                        <p>{isLoading ? "Resetting..." : "Reset Password"}</p>

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
                    Your password has been updated successfully. You can now log
                    in to your account with your new password.
                  </p>

                  <button
                    onClick={() => navigate("/login")}
                    className="bg-primary text-[13px] py-3.5 px-14
                    flex text-white rounded-full grow4 cursor-pointer
                    items-center justify-center gap-3 mobbut"
                  >
                    <p>Login Now</p>
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
          <div className="w-full relative rounded-2xl">
            <img
              src={login}
              alt="reset password"
              className="h-full w-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapperApp(ResetPassword, "");
