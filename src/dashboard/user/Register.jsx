// import { useFormik } from "formik";
// import * as Yup from 'yup';
import { BiCopyright } from 'react-icons/bi';
import { SectionWrapperApp } from '../../hoc';
import { register } from '../../assets';

const Register = () => {
  // const navigate = useNavigate();

  return (
    <section className='relative w-full flex items-center'>
      <div className='flex md:flex-row ss:flex-row flex-col w-full 
      md:justify-between md:gap-16 ss:gap-8 gap-6'>
        <div className='md:w-[50%] w-full flex flex-col md:gap-8 ss:gap-8 
        gap-2 md:py-10'>
          <div className='w-full flex flex-col h-full gap-12'>
            <div className='flex flex-col gap-1 w-full'>
              <h1 className='text-primary font-semibold md:text-[35px]
              ss:text-[33px] text-[28px] tracking-tight'>
                Your experience begins here!
              </h1>

              <h2 className="md:text-[15px] ss:text-[15px] text-[14px]  
              tracking-tight font-medium text-main4 leading-[20px]">
                Provide a few details about yourself so we can get you 
                started. Already got an account? 
                <a href='/login' className='text-primary font-bold 
                hover:text-secondary navsmooth'> Log in here</a>
              </h2>
            </div>

            <div className="flex justify-between items-center w-full 
            gap-3">
              <div className="flex-grow">
                <div className='bg-main7 w-full h-[1px]' />
              </div>

              <h1 className="md:text-[15px] ss:text-[15px] text-[14px] 
              text-main5">
                or
              </h1>

              <div className="flex-grow">
                <div className='bg-main7 w-full h-[1px]' />
              </div>
            </div>

            <div className='flex w-full'>
              <div className="flex md:flex-row ss:flex-row flex-col 
              w-full items-center md:gap-6 ss:gap-5 gap-3">
                <div className='flex md:items-center ss:items-center'>
                  <BiCopyright className='sm:mr-1 mr-1 md:text-[16px] 
                  ss:text-[18px] text-[15px] mt-1 text-main4' />
  
                  <p className='md:text-[13px] ss:text-[15px] text-[12px] 
                  text-main4 md:mt-1 ss:mt-1 mt-0.5'>
                    2024 Envoy Angel Shipping and Logistics Ltd. All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='w-[50%] h-full md:flex hidden'>
          <div className='w-full h-full relative rounded-2xl p-3'>
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

export default SectionWrapperApp(Register, '');