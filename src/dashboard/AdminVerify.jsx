import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SectionWrapperApp } from "../hoc";
import { login as loginImage } from "../assets";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { motion } from "framer-motion";

const AdminVerify = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const email = new URLSearchParams(window.location.search).get("email");
  // References for code input
  const inputRefs = Array(6).fill(0).map(() => useRef(null));
  const [code, setCode] = useState(Array(6).fill(""));

 
  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input if current input is filled
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Navigate between inputs with arrow keys
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1].current.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === "Backspace" && index > 0 && code[index] === "") {
      // Move to previous input on backspace if current is empty
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      
      // Focus the last input after paste
      inputRefs[5].current.focus();
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all fields are filled
    if (code.some(digit => digit === "")) {
      setVerifyError("Please enter all digits of the verification code.");
      return;
    }

    try {
      setIsLoading(true);
      setVerifyError("");
      
      const verificationCode = code.join("");
      const response = await adminLogin({ 
        email: String(email), 
        token: verificationCode 
      });
      
      if (response.success) {
        // Navigate to admin dashboard - handled by adminLogin function
        navigate("/admin");
      } else {
        setVerifyError(response.error || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      setVerifyError(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full flex md:items-center md:min-h-auto font-manrope ss:min-h-[80vh] min-h-[90vh]">
      <div className="flex flex-row w-full justify-between md:gap-20">
        <div className="md:w-[50%] w-full flex flex-col md:py-10">
          <div className="w-full flex flex-col h-full justify-between md:gap-6 ss:gap-6 gap-5">
            {/* Back Button */}
            <motion.button
              onClick={handleBackToLogin}
              className="flex items-center gap-2 text-primary font-medium mb-4 w-fit"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HiOutlineArrowLeft className="text-[18px]" />
              <span className="md:text-[15px] ss:text-[14px] text-[13px]">
                Back to Login
              </span>
            </motion.button>

            <div className="w-full flex flex-col h-full md:gap-6 ss:gap-6 gap-5">
              <motion.div
                className="flex flex-col gap-1 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-primary font-semibold md:text-[37px] ss:text-[35px] text-[32px] tracking-tight mobline">
                  Admin Verification
                </h1>

                <h2 className="md:text-[15px] ss:text-[16px] text-[14px] tracking-tight font-medium text-main4 md:leading-[22px] ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1">
                  We've sent a 6-digit verification code to {email}. <br className="hidden ss:flex" />
                  Please enter the code below to access your admin dashboard.
                </h2>
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
                  {/* Verification Code Input */}
                  <div className="flex flex-col w-full gap-3 mt-2">
                    <label className="md:text-[14px] ss:text-[14px] text-[13px] text-main4 font-medium">
                      Verification Code
                    </label>
                    
                    <div className="flex gap-2 md:gap-3 w-full justify-center md:justify-start">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          ref={inputRefs[index]}
                          type="text"
                          maxLength={1}
                          value={code[index]}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-12 h-14 text-center text-black text-xl font-semibold rounded-md 
                          outline outline-[1px] outline-main6 focus:outline-primary"
                        />
                      ))}
                    </div>

             

                    {/* Error Message */}
                    {verifyError && (
                      <p className="text-mainRed text-center md:text-[13px] ss:text-[13px] text-[12px] mt-2">
                        {verifyError}
                      </p>
                    )}

                
                  </div>

                  <div className="w-full flex md:justify-start justify-center mt-4">
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
                      <p>{isLoading ? "Verifying..." : "Verify & Continue"}</p>

                      {!isLoading && (
                        <HiOutlineArrowRight className="text-[14px]" />
                      )}
                    </motion.button>
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
                <p className="md:text-[13px] ss:text-[13px] text-[11px] text-main4 mt-0.5 font-medium">
                  © 2025 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
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
              alt="admin verification"
              className="h-full w-auto object-cover rounded-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionWrapperApp(AdminVerify, "");