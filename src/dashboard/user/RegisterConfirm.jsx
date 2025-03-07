import { useRef, useState, useEffect } from 'react';
import { useRegister } from '../../context/RegisterContext';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { SectionWrapperApp } from '../../hoc';
import { incmail, register } from '../../assets';
import { HiOutlineArrowRight } from 'react-icons/hi';

const RegisterConfirm = ({ onNext }) => {
  const formRef = useRef();
  const { verifyEmail, resendVerificationCode, loading, error: verifyError } = useRegister();
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleResendCode = async () => {
    try {
      await resendVerificationCode();
      setCountdown(30);
      setCanResend(false);
    } catch (err) {
      console.error('Failed to resend code:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      code: '',
    },

    validationSchema: Yup.object().shape({
      code: Yup.string()
      .length(6, 'Code must be 6 characters.')
      .matches(/^[a-zA-Z0-9]+$/, 'Code must contain alphanumeric characters.')
      .required("Code is required."),  
    }),
    
    onSubmit: async (values) => {
      try {
        await verifyEmail(values.code);
        onNext();
      } catch (err) {
        console.error('Verification error:', err);
      }
    },
  });

  return (
    <section className='relative w-full flex md:items-center md:min-h-auto 
    ss:min-h-[80vh] min-h-[90vh]'>
      <div className='flex flex-row w-full justify-between md:gap-20'>
        <div className='md:w-[50%] w-full flex flex-col md:py-10'>
          <div className='w-full flex flex-col h-full justify-between md:gap-6 ss:gap-6 
          gap-5'>
            <div className="w-full flex flex-col h-full md:gap-6 ss:gap-6 
            gap-5">
              <div className="w-full shipmodmob">
                <div className='md:w-[10rem] ss:w-[8rem] w-[6rem] h-auto 
                bg-primary1 rounded-full'>
                  <img
                    src={incmail}
                    alt="incomingmail"
                    className='md:w-[10rem] ss:w-[8rem] w-[6rem] 
                    h-auto md:p-12 ss:p-10 p-6'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1 w-full'>
                <h1 className='text-primary font-semibold md:text-[37px]
                ss:text-[35px] text-[32px] tracking-tight mobline'>
                  We shot you a heads up
                </h1>

                <h2 className="md:text-[15px] ss:text-[16px] text-[14px]  
                tracking-tight font-medium text-main4 md:leading-[22px]
                ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1">
                  Check your email for a confirmation message from us which 
                  contains a 6-digit alphanumeric code
                </h2>
              </div>

              <div className='w-full'>
                <form ref={formRef} onSubmit={formik.handleSubmit}
                className='flex flex-col w-full gap-5'>
                  <div className='flex md:w-[80%] ss:w-[80%] w-full mt-1'>
                    <div className="relative flex flex-col w-full">
                      <input
                        type="text"
                        name="code"
                        placeholder=' '
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                        peer outline text-black md:rounded-lg rounded-md 
                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                        bg-transparent w-full focus:outline-primary
                        ${formik.touched.code && formik.errors.code ? 'outline-mainRed' : 'outline-main6'}
                        `}
                      />

                      <label
                        htmlFor="code"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 text-main6 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.code ? 'z-10 px-2' : ''}
                        `}
                      >
                        Enter the 6-digit code
                      </label>

                      <p className="text-mainRed md:text-[12px] flex justify-end
                      ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                        {formik.touched.code && formik.errors.code}
                      </p>
                    </div>
                  </div>

                  <div className='w-full'>
                    <button 
                      type='submit'
                      disabled={loading}
                      className={`bg-primary text-[13px] py-3.5 px-14
                      flex text-white rounded-full grow4 cursor-pointer
                      items-center justify-center gap-3 mobbut
                      ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <p>
                        {loading ? 'Verifying...' : 'Confirm'}
                      </p>
                      
                      {!loading && <HiOutlineArrowRight className='text-[14px]'/>}
                    </button>

                    {verifyError && (
                      <p className="text-mainRed text-center md:text-[13px] 
                      ss:text-[13px] text-[12px] mt-4">
                        {verifyError}
                      </p>
                    )}
                  </div>

                  <p className="md:text-[15px] ss:text-[16px] text-[14px]  
                  tracking-tight font-medium text-main4 md:leading-[22px]
                  ss:leading-[22px] leading-[20px] md:mt-2 ss:mt-0 mt-1">
                    Make sure to check your spam folder if you do not find 
                    our mail in your inbox. 
                    <br className="flex"/>Didn't get a code? 
                    {canResend ? (
                      <button 
                        onClick={handleResendCode}
                        disabled={loading}
                        className='text-primary font-bold hover:text-secondary'
                      >
                        Send the code again
                      </button>
                    ) : (
                      <span className='text-primary font-bold'>
                        Send the code again in {countdown}s
                      </span>
                    )}
                  </p>
                </form>
              </div>
            </div>

            <div className='flex relative w-full md:mt-12 justify-end'>
              <div className="w-full">
                <p className='md:text-[13px] ss:text-[13px] text-[11px] 
                text-main4 mt-0.5 font-medium'>
                  © 2025 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='w-[50%] md:flex hidden'>
          <div className='w-full relative rounded-2xl'>
            <img
              src={register}
              alt='register'
              className='h-full w-auto object-cover rounded-2xl'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapperApp(RegisterConfirm, '');
