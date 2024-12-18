// import { useFormik } from "formik";
// import * as Yup from 'yup';
import { SectionWrapperApp } from '../../hoc';
import { register } from '../../assets';

const Register = () => {
  // const navigate = useNavigate();

  return (
    <section className='relative w-full flex items-center'>
      <div className='flex md:flex-row ss:flex-row flex-col w-full 
      md:justify-between md:gap-12 ss:gap-0 gap-2'>
        <div className='md:w-[50%] w-full flex flex-col md:gap-8 ss:gap-8 
        gap-2'>
          <div className='w-full flex flex-col h-full justify-between
          gap-12'>
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

            <div className='flex w-full'>
              <div className="flex md:flex-row ss:flex-row flex-col 
              w-full items-center md:gap-6 ss:gap-5 gap-3">
                <a href='/createshipment-payment' 
                className='text-primary md:text-[14px] ss:text-[14px]
                text-[13px] underline cursor-pointer font-semibold 
                hover:text-secondary navsmooth'>
                  I don't remember my tracking ID
                </a>

                <a href='/createshipment-payment'
                className='text-primary md:text-[14px] ss:text-[14px]
                text-[13px] underline cursor-pointer font-semibold 
                hover:text-secondary navsmooth'>
                  Still need help? Contact Us
                </a>
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