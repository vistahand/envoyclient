import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';

const HeroPaymentReviewUser = ({ currentStep, onNavigate }) => {
  return (
    <section className='w-full md:p-0 ss:p-0 pl-6 pr-6'>
      <div className='w-full'>
        <motion.div variants={textVariant()}
        className='flex md:w-[38%] ss:w-[60%] w-[90%] md:gap-6 ss:gap-5 
        gap-4 items-center'>
          <p className={`${currentStep === 1 
          ? 'text-white font-bold bg-primary py-2 px-6 rounded-full'
          : currentStep === 2 ? 'cursor-pointer'
          : 'text-main2 font-semibold'} md:text-[14px] ss:text-[14px] text-[13px] navsmooth2`}
          onClick={() => currentStep === 2 && onNavigate(1)}
          >
            Review
          </p>
          
          <div className='w-full h-[1px] bg-main6'/>

          <p className={`${currentStep === 2 
          ? 'text-white font-bold bg-primary py-2 px-6 rounded-full'
          : 'text-main2 font-semibold'} md:text-[14px] ss:text-[14px] text-[13px] navsmooth2`}
          >
            Pay
          </p>

          <div className='w-full h-[1px] bg-main6'/>

          <p className={`${currentStep === 3 
          ? 'text-white font-bold bg-primary py-2 px-6 rounded-full'
          : 'text-main2 font-semibold'} md:text-[14px] ss:text-[14px] text-[13px] navsmooth2`}
          >
            Finish
          </p>
        </motion.div>
      </div>
    </section>
  )
};

export default HeroPaymentReviewUser;