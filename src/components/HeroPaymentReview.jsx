import { SectionWrapperAlt } from '../hoc';
import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';

const HeroPaymentReview = () => {
  return (
    <section className='w-full md:mt-32 ss:mt-32 mt-28 items-center
    md:p-0 ss:pl-16 ss:pr-16 pl-6 pr-6'>
      <div className='items-center w-full max-w-[68rem]'>
        <motion.div variants={textVariant()}
        className='flex md:w-[38%] ss:w-[38%] w-full md:gap-6 ss:gap-4 
        gap-3 items-center'>
          <p className='text-white font-bold md:text-[14px] cursor-pointer
          ss:text-[14px] text-[13px] bg-primary py-2 px-6 rounded-full'>
            Review
          </p>
          
          <div className='w-full h-[1px] bg-main6'/>

          <p className='text-main2 font-semibold md:text-[14px] 
          ss:text-[14px] text-[13px]'>
            Pay
          </p>

          <div className='w-full h-[1px] bg-main6'/>

          <p className='text-main2 font-semibold md:text-[14px] 
          ss:text-[14px] text-[13px]'>
            Finish
          </p>
        </motion.div>
      </div>
    </section>
  )
};

export default SectionWrapperAlt(HeroPaymentReview, '');