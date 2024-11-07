import React from 'react';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { shipmentSteps } from '../constants';

const CardItem = ({ index, title, image, description }) => {

    return (
        <motion.div className='bg-mainalt rounded-3xl hover:shadow-xl
        md:h-[400px] ss:h-[370px] h-[320px] flex navsmooth'
        variants={fadeIn('', 'spring', index * 0.5, 0.75)}>
            <div className='flex flex-col items-center justify-center
            md:gap-8 ss:gap-8 gap-4 md:p-6 ss:p-10 p-8'>
                {React.createElement(image, {
                    className: `w-[6rem] h-auto object-contain 
                    text-primary cardimg`, 
                    strokeWidth: 1.1
                })}

                <div className='flex flex-col md:gap-4 ss:gap-2.5 gap-2.5
                tracking-tight items-center justify-center text-center'>
                    <h1 className='text-primary md:text-[26px] ss:text-[24px] 
                    text-[23px] font-bold md:leading-[2.2rem] tracking-tight
                    ss:leading-[1.9rem] leading-[1.6rem]'>
                        {title}
                    </h1>

                    <p className='text-main font-medium md:leading-[20px]
                    ss:leading-[20px] leading-[19px] md:text-[15px] 
                    ss:text-[15px] text-[14px]'>
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
};

const ShipmentSteps = () => {
  return (
    <section className='relative w-full md:min-h-[500px] ss:min-h-[700px]
    min-h-[1200px] mx-auto flex items-center'>
        <div className='flex flex-col w-full md:gap-12 ss:gap-10 gap-6'>
            <motion.div variants={textVariant()}
            className='flex items-center w-full'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter'>
                    How it works in 4 simple steps
                </h1>
            </motion.div>

            <div className='grid md:grid-cols-4 ss:grid-cols-3 grid-cols-2 
            md:gap-6 ss:gap-6 gap-5 w-full'>
                {shipmentSteps.map((card, index) => (
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

export default SectionWrapper(ShipmentSteps, '');