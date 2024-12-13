import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsX } from 'react-icons/bs';

const ShippingModal = ({ onClose }) => {

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
          ss:justify-center'>
            <motion.div
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="bg-white padphone md:rounded-2xl ss:rounded-2xl
            rounded-xl shadow-xl flex flex-col gap-5
            md:h-auto ss:h-auto h-[100%] overflow-auto items-center 
            relative md:w-[85%] w-[85%] md:py-6 md:px-12 ss:py-6 ss:px-12 py-4
            px-5">
              <div className='flex justify-between items-center w-full'>
                <h1 className="md:text-[30px] ss:text-[25px] 
                text-[22px] tracking-tight font-bold text-main2">
                  Edit Sender Information
                </h1>

                <BsX 
                  className='w-[3.5rem] h-auto text-redClose bg-redCircle
                  p-3 rounded-full cursor-pointer grow2'
                  strokeWidth={0.2}
                />
              </div>

              <div className='flex md:justify-end ss:justify-end w-full'>
                <div className="flex md:w-[45%] ss:w-[45%] w-full items-center 
                phone4 md:gap-5 ss:gap-5 gap-3">
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
                      Cancel
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

  export default ShippingModal;