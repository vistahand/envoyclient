import React from 'react';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { testimonials } from '../constants';

const TestCard = ({ index, title, image, description, name, profession }) => {

  return (
    <motion.div className='rounded-2xl relative w-full h-[400px] flex 
    navsmooth'
    variants={fadeIn('', 'spring', index * 0.5, 0.75)}
    >
        <div className='flex flex-col md:gap-5 ss:gap-5 gap-2 md:p-6 
        ss:p-6 p-4 justify-center items-start'>
            <h1 className='text-white md:text-[30px] ss:text-[25px] 
            text-[18px] font-bold md:leading-[2.2rem] md:max-w-[20ch]
            ss:leading-[2.3rem] leading-[2.3rem]'>
                "{title}"
            </h1>

            <p className='text-main3 md:leading-[20px]
            ss:leading-[20px] leading-[18px] md:text-[14px] 
            ss:text-[14px] text-[13px]'>
                {description}
            </p>

            <h2 className='text-white md:leading-[20px]
            ss:leading-[20px] leading-[18px] md:text-[13px] 
            ss:text-[14px] text-[13px]'>
                {name}
            </h2>

            <p className='text-main3 md:leading-[20px]
            ss:leading-[20px] leading-[18px] md:text-[12px] 
            ss:text-[12px] text-[11px]'>
                {profession}
            </p>
        </div>

        <div>

        </div>
    </motion.div>
  )
};

const Testimonial = () => {
  return (
    <section className='relative w-full min-h-[700px] flex items-center'>
        <div className='flex flex-col w-full md:gap-12 ss:gap-10 gap-6'>
            <motion.div variants={textVariant()}
            className='flex flex-col justify-center items-center w-full md:gap-10
            ss:gap-8 gap-6'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[25px] text-[20px] tracking-tight md:leading-[0rem]
                ss:leading-[1.3rem] leading-[1.3rem]'>
                    What our clients are saying
                </h1>

                <p className='text-main2 md:text-[15px] md:leading-[1.3rem] 
                ss:leading-[1.3rem] leading-[1.3rem] ss:text-[16px] text-[13px] 
                text-center font-semibold md:max-w-[75ch]'>
                    Our commitment to exceptional service, seamless booking, 
                    and reliable deliveries keeps our clients coming back 
                    every time.
                </p>
            </motion.div>

            <div className='flex md:gap-8 ss:gap-8 gap-6 w-full'>
            {testimonials.map((test, index) => (
                <TestCard
                    key={index} 
                    index={index} 
                    {...test}
                />
            ))}
            </div>
        </div>
    </section>
  )
};

export default SectionWrapper(Testimonial, '');