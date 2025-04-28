import { useState, useRef } from "react";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { SectionWrapperApp } from "../hoc";
import { login as loginImage } from "../assets";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setLoginError("");
 
        
        const response = await login(values);
        
        if (response.success) {
          // For admin users, always navigate to the verification page
          if (response.data.user.role === "admin") {
            navigate(`/admin-verify?email=${response.data.user.email}`);
          } else {
            // For regular users, navigate to their dashboard
            navigate("/user");
          }
        } else {
          setLoginError(response.error || "Login failed");
        }
      } catch (err) {
        console.log(err.message);
        setLoginError(err.message || "Login failed. Please try again.");
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
      {/* Rest of the component remains the same */}
      <div className="flex flex-row w-full justify-between md:gap-20">
        <div className="md:w-[50%] w-full flex flex-col md:py-10">
          <div
            className="w-full flex flex-col h-full justify-between md:gap-6 ss:gap-6 
          gap-5"
          >
            {/* Back Button */}
            <motion.button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-primary font-medium mb-4 w-fit"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HiOutlineArrowLeft className="text-[18px]" />
              <span className="md:text-[15px] ss:text-[14px] text-[13px]">
                Back to Home
              </span>
            </motion.button>

            <div
              className="w-full flex flex-col h-full md:gap-6 ss:gap-6 
            gap-5"
            >
              <motion.div
                className="flex flex-col gap-1 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1
                  className="text-primary font-semibold md:text-[37px]
                ss:text-[35px] text-[32px] tracking-tight mobline"
                >
                  Let's get you back in!
                </h1>

                <h2
                  className="md:text-[15px] ss:text-[16px] text-[14px]  
                tracking-tight font-medium text-main4 md:leading-[22px]
                ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1"
                >
                  Enter your email and password to get back into your account.
                  Don't have an account?{" "}
                  <br
                    className="hidden
                  ss:flex"
                  />
                  <a
                    href="/register"
                    className="text-primary font-bold 
                  hover:text-secondary navsmooth"
                  >
                    {" "}
                    Create an account here
                  </a>
                </h2>
              </motion.div>

              <div
                className="flex md:justify-between items-center w-full 
              md:gap-5 ss:gap-5 gap-3 mobauth"
              ></div>

              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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
                        Enter your password
                      </label>

                      <p
                        className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium"
                      >
                        {formik.touched.password && formik.errors.password}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end w-full md:w-[80%] ss:w-[80%]">
                    <a
                      href="/forgot-password"
                      className="text-primary md:text-[13px] ss:text-[13px] text-[12px] 
                      font-medium hover:text-secondary navsmooth"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="w-full">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`bg-primary text-[13px] py-3.5 px-14
                      flex text-white rounded-full grow4 cursor-pointer
                      items-center justify-center gap-3 mobbut
                      ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                      whileHover={{ scale: isLoading ? 1 : 1.03 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p>{isLoading ? "Logging in..." : "Login"}</p>

                      {!isLoading && (
                        <HiOutlineArrowRight className="text-[14px]" />
                      )}
                    </motion.button>

                    {loginError && (
                      <p
                        className="text-mainRed text-center md:text-[13px] 
                      ss:text-[13px] text-[12px] mt-4"
                      >
                        {loginError}
                      </p>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>

            <motion.div
              className="flex relative w-full md:mt-12 justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="w-full">
                <p
                  className="md:text-[13px] ss:text-[13px] text-[11px] 
                text-main4 mt-0.5 font-medium"
                >
                  © 2025 Envoy Angel Shipping and Logistics Ltd. All Rights
                  Reserved.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="w-[50%] md:flex hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-full relative rounded-2xl">
            <img
              src={loginImage}
              alt="login"
              className="h-full w-auto object-cover rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapperApp(Login, "");