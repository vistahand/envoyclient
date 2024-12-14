// import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsX } from 'react-icons/bs';


const PaystackModal = ({ onClose }) => {
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
        ss:justify-center md:mx-0 ss:mx-16 mx-5 h-[60%]'>
          <motion.div
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white md:rounded-3xl ss:rounded-3xl relative
          rounded-2xl shadow-xl flex flex-col md:w-[60%] w-full 
          overflow-auto items-center scrollbar-hidden">
            <div className='flex justify-between items-center w-full
            border-b border-b-main7 md:py-6 md:px-12 ss:py-6 
            ss:px-12 py-4 px-5 bg-white top-0 sticky z-10'>
              <h1 className="md:text-[30px] ss:text-[25px] text-[20px] 
              tracking-tight font-bold text-main2">
                Paystack Payment Gateway
              </h1>

              <BsX 
                className='md:w-[3.2rem] ss:w-[3.2rem] w-[2rem] h-auto 
                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full cursor-pointer grow2'
                strokeWidth={0.2}
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
              />
            </div>


            <div className='flex justify-center w-full border-t 
            border-t-main7 md:py-6 md:px-12 ss:py-6 ss:px-12 py-4 px-5 
            bg-white bottom-0 sticky'>
              <div className="flex md:w-[75%] ss:w-[75%] w-full items-center 
              md:gap-5 ss:gap-5 gap-3">
                <button
                className='bg-none text-[13px] py-3.5 w-[50%]
                text-primary rounded-full grow2 cursor-pointer
                items-center justify-center border border-primary'
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
                >
                  <p className='font-semibold'>
                    Close
                  </p>
                </button>

                <button
                className='bg-primary text-[13px] py-3.5 w-[50%] flex
                text-white rounded-full grow4 cursor-pointer
                items-center justify-center gap-3'
                >
                  <p>
                    Confirm
                  </p>
                  
                  <HiOutlineArrowRight className='text-[14px]'/>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaystackModal;