import { useFormik } from "formik";
import * as Yup from 'yup';
import { BiCopyright } from 'react-icons/bi';
import { SectionWrapperApp } from '../../hoc';
import { register } from '../../assets';
import { HiOutlineArrowRight } from 'react-icons/hi';

const RegisterConfirm = ({ onNext }) => {
  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      code: '',
    },

    validationSchema: Yup.object().shape({
      code: Yup.string()
      .min(6, 'Code must be 6 characters.')
      .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/, 'Code must contain alphanumeric characters.')
      .required("Code is required"),  
    }),
    
    onSubmit: (values) => {
      onNext();
    },
  });

  return (
    <section className='relative w-full flex items-center'>
      <div className='flex md:flex-row ss:flex-row flex-col w-full 
      md:justify-between md:gap-20 ss:gap-8 gap-6 h-full'>
        <div className='md:w-[50%] w-full flex flex-col md:py-10'>
          <div className='w-full flex flex-col h-full md:gap-6 ss:gap-6 
          gap-5'>
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
              <form className='flex flex-col w-full gap-5'>
                <div className='flex md:w-[80%] ss:w-[80%] w-full mt-1'>
                    <div className="relative flex flex-col">
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
                  <button type="submit"
                  className='bg-primary text-[13px] py-3.5 px-12
                  flex text-white rounded-full grow4 cursor-pointer
                  items-center justify-center gap-3'>
                    <p>
                      Confirm
                    </p>
                    
                    <HiOutlineArrowRight className='text-[14px]'/>
                  </button>
                </div>

                <p className="md:text-[15px] ss:text-[16px] text-[14px]  
                tracking-tight font-medium text-main4 md:leading-[22px]
                ss:leading-[22px] leading-[20px] md:mt-0 ss:mt-0 mt-1">
                    Make sure to check your spam folder if you do not find 
                    our mail in your inbox. Didn't get a code? <br className="hidden
                    ss:flex"/>
                    <span href='/login' className='text-primary font-bold'> 
                    Send the code again in 27s</span>
                </p>
              </form>
            </div>

            <div className='flex w-full md:mt-12 ss:mt-10 mt-8'>
              <div className="flex md:flex-row ss:flex-row flex-col 
              w-full items-center md:gap-6 ss:gap-5 gap-3">
                <div className='flex md:items-center ss:items-center'>
                  <BiCopyright className='sm:mr-1 mr-1 md:text-[16px] 
                  ss:text-[18px] text-[15px] mt-1 text-main4' />
  
                  <p className='md:text-[13px] ss:text-[13px] text-[11px] 
                  text-main4 md:mt-1 ss:mt-1 mt-0.5 font-medium'>
                    2024 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
                  </p>
                </div>
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