import { motion, AnimatePresence } from 'framer-motion';
import { BsX } from 'react-icons/bs';
// import { useFormik } from "formik";
// import * as Yup from 'yup';
import { tracking, websearch } from '../assets';
import { GrLocation } from "react-icons/gr";

const TrackModal = ({ onClose }) => {
  // const navigate = useNavigate();

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.top = '0';
  };

  return (
    <AnimatePresence>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center
      bg-black bg-opacity-40 z-50">
        <div className='max-w-[68rem] w-full flex md:justify-center 
        ss:justify-center md:mx-0 ss:mx-16 mx-5 md:h-[550px] ss:h-[450px] 
        h-auto'>
          <motion.div
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white md:rounded-3xl ss:rounded-3xl relative
          rounded-2xl shadow-xl flex flex-col md:w-[93%] w-full 
          items-center">
            <div className='flex justify-end items-center w-full
            md:py-10 md:px-10 ss:py-10 ss:px-10 py-6 px-6 top-0 absolute 
            z-10'>
              <BsX 
                className='md:w-[3.2rem] ss:w-[3.2rem] w-[2.3rem] h-auto 
                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full 
                cursor-pointer grow2'
                strokeWidth={0.2}
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
              />
            </div>

            <div className='flex md:flex-row ss:flex-row flex-col w-full 
            md:justify-between md:gap-0 ss:gap-0 gap-2 h-full'>
              <div className='w-full md:hidden ss:hidden flex'>
                <div className='w-full relative rounded-xl p-2'>
                  <img
                    src={tracking}
                    alt='trackshipment'
                    className='object-cover rounded-xl'
                  />
                </div>
              </div>

              <div className='md:w-[50%] ss:w-[50%] w-full flex flex-col 
              md:gap-8 ss:gap-8 gap-2 md:py-6 md:px-10 ss:py-6 ss:px-8 
              py-4 px-5 shipmodmob'>
                <div className='md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto md:mt-24
                bg-primary1 rounded-full items-center justify-center'>
                  <GrLocation 
                    className='md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto
                    text-primary md:p-4 ss:p-3 p-4'
                  />
                </div>
                
                <div className='w-full flex flex-col h-full justify-between
                md:py-0 ss:py-3 py-4 md:gap-0 ss:gap-0 gap-12'>
                  <div className='flex flex-col md:gap-3 ss:gap-3 gap-2 
                  w-full'>
                    <h1 className='text-primary font-bold md:text-[35px]
                    ss:text-[33px] text-[28px] tracking-tight trackmodmob'>
                      Track a Shipment
                    </h1>

                    <h2 className="md:text-[17px] ss:text-[17px] text-[14px]  
                    tracking-tight font-medium text-main2 md:leading-[22px]
                    ss:leading-[22px] leading-[20px] trackmodmob">
                      Enter your shipment tracking ID to see where your
                      package is and where it's been in real time.
                    </h2>

                    <div className='text-[13px] rounded-full py-3.5 px-5 
                    items-center flex border border-secondary relative w-full
                    mt-3'
                    >
                      <input
                        type="text"
                        placeholder="Enter Tracking Number"
                        className="flex-grow text-main focus:outline-none 
                        text-[14px] placeholder:text-main4"
                      />
                        
                      <div className='bg-secondary cursor-pointer p-2 
                      pr-3 rounded-full flex gap-1.5 items-center 
                      absolute right-1.5'
                      >
                        <img src={websearch} alt='trackshipment'
                          className='wht w-5 h-5'
                        />

                        <p className='text-white text-[12.5px]'>
                          Track
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex md:justify-end ss:justify-end w-full
                  md:mb-5 ss:mb-0 mb-1'>
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

              <div className='w-[50%] h-full md:flex ss:flex hidden'>
                <div className='w-full h-full relative rounded-2xl p-3'>
                  <img
                    src={tracking}
                    alt='trackshipment'
                    className='h-full w-auto object-cover rounded-2xl'
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrackModal;