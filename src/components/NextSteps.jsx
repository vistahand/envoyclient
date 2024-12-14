import React from 'react';
import { SectionWrapperAlt } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { nextSteps } from '../constants';

const CardItem = ({ index, title, link, description, route }) => {

    return (
        <motion.div className='bg-mainalt rounded-xl hover:shadow-xl 
        h-auto flex navsmooth md:py-5 ss:py-5 py-8 px-3'
        variants={fadeIn('', 'spring', index * 0.5, 0.75)}>
            <div className='flex flex-col md:gap-8 ss:gap-8 
            gap-5 md:p-3 ss:p-5 p-2'>
                <div className='flex flex-col md:gap-3 ss:gap-3 gap-2.5
                tracking-tight'>
                    <h1 className='text-main2 md:text-[18px] ss:text-[22px] 
                    text-[17px] font-bold md:leading-[2rem] tracking-tight
                    ss:leading-[1.9rem] leading-[1.6rem]'>
                        {title}
                    </h1>

                    <p className='text-main2 font-medium md:leading-[20px]
                    ss:leading-[20px] leading-[19px] md:text-[14px] 
                    ss:text-[15px] text-[13px]'>
                        {description}
                    </p>
                </div>

                <a href={route} target='blank'
                className='text-primary font-semibold md:leading-[18px]
                ss:leading-[20px] leading-[19px] md:text-[14px] 
                ss:text-[15px] text-[13px] underline cursor-pointer
                hover:text-secondary'>
                    {link}
                </a>
            </div>
        </motion.div>
    )
};

const NextSteps = () => {
  return (
    <section className='relative w-full md:min-h-[400px] ss:min-h-[700px]
    min-h-[700px] mx-auto flex items-center md:px-0 ss:px-16 px-5 py-6
    mb-8'>
        <div className='flex flex-col w-full md:gap-8 ss:gap-8 gap-5'>
            <motion.div variants={textVariant()}
            className='flex items-center w-full'>
                <h1 className='text-primary font-bold md:text-[35px] 
                ss:text-[33px] text-[28px] tracking-tight md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem]'>
                    Next Steps
                </h1>
            </motion.div>

            <div className='grid md:grid-cols-4 ss:grid-cols-2 md:gap-6 
            ss:gap-8 gap-5 w-full'>
                {nextSteps.map((card, index) => (
                    <CardItem
                        key={index} 
                        index={index} 
                        {...card}
                    />
                ))}
            </div>
        </div>
    </section>
  )
};

export default SectionWrapperAlt(NextSteps, '');