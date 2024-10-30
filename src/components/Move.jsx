import React from 'react';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/motion';
import { moveCards } from '../constants';

const MoveCard = ({ index, title, image, description }) => {

    return (
        <motion.div className='bg-mainalt rounded-3xl hover:shadow-xl
        md:basis-1/3 ss:basis-1/2 basis-full h-[400px] flex navsmooth'
        variants={fadeIn('', 'spring', index * 0.5, 0.75)}>
            <div className='flex flex-col items-center justify-center
            md:gap-10 ss:gap-8 gap-6 md:p-6 ss:p-10 p-8'>
                <img
                  src={image}
                  alt='moveCard'
                />

                <div className='flex flex-col md:gap-4 ss:gap-2.5
                gap-2 tracking-tight items-center justify-center text-center'>
                    <h1 className='text-primary md:text-[26px] ss:text-[20px] 
                    text-[15px] font-bold md:leading-[2.2rem]
                    ss:leading-[2.3rem] leading-[2.3rem]'>
                        {title}
                    </h1>

                    <p className='text-main font-medium md:leading-[20px]
                    ss:leading-[20px] leading-[18px] md:text-[15px] 
                    ss:text-[15px] text-[13px]'>
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
};

const Move = () => {
  return (
    <section className='relative w-full min-h-[500px] mx-auto flex
    items-center'>
        <div className='flex w-full'>
            <div className='flex md:gap-12 ss:gap-10 gap-8 w-full'>
                {moveCards.map((card, index) => (
                    <MoveCard
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

export default SectionWrapper(Move, '');