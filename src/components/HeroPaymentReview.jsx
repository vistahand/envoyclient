import { SectionWrapperAlt } from '../hoc';
import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';

const HeroPaymentReview = ({ currentStep, onNavigate }) => {
  return (
    <section className='w-full md:mt-32 ss:mt-32 mt-28 items-center
    md:p-0 ss:pl-16 ss:pr-16 pl-6 pr-6'>
      <div className='items-center w-full max-w-[68rem]'>
        <motion.div variants={textVariant()}
        className='flex md:w-[38%] ss:w-[60%] w-[90%] md:gap-6 ss:gap-5 
        gap-4 items-center'>
          <p className={`${currentStep === 1 
          ? 'text-white font-bold bg-primary py-2 px-6 rounded-full'
          : currentStep === 2 ? 'cursor-pointer'
          : 'text-main2 font-semibold'} md:text-[14px] ss:text-[14px] text-[13px] navsmooth`}
          onClick={() => currentStep === 2 && onNavigate(1)}
          >
            Review
          </p>
          
          <div className='w-full h-[1px] bg-main6'/>

          <p className={`${currentStep === 2 
          ? 'text-white font-bold bg-primary py-2 px-6 rounded-full'
          : 'text-main2 font-semibold'} md:text-[14px] ss:text-[14px] text-[13px] navsmooth`}
          >
            Pay
          </p>

          <div className='w-full h-[1px] bg-main6'/>

          <p className={`${currentStep === 3 
          ? 'text-white font-bold bg-primary py-2 px-6 rounded-full'
          : 'text-main2 font-semibold'} md:text-[14px] ss:text-[14px] text-[13px]`}
          >
            Finish
          </p>
        </motion.div>
      </div>
    </section>
  )
};

export default SectionWrapperAlt(HeroPaymentReview, '');