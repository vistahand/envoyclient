import React from 'react';
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { moveCards } from '../constants';

const MoveCard = ({ index, title, image, description }) => {

  return (
    <motion.div className='rounded-2xl relative h-[500px] flex navsmooth 
    cursor-pointer hover:shadow-xl'
      variants={fadeIn('', 'spring', index * 0.5, 0.75)}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-3/4
        bg-gradient-to-b from-transparent to-primaryalt rounded-xl"
      />
      <div className="absolute bottom-0 left-0 right-0 h-2/3
        bg-gradient-to-b from-transparent to-primaryalt rounded-xl"
      />

      <div className='flex flex-col md:gap-4 ss:gap-2.5 absolute
      gap-2 md:p-8 ss:p-6 p-6 bottom-0'>
        <h1 className='text-white md:text-[30px] ss:text-[28px] 
        text-[28px] font-bold md:leading-[2.2rem] md:max-w-[10ch]
        ss:leading-[2.2rem] leading-[2rem]'>
          {title}
        </h1>

        <p className='text-white md:leading-[20px] tracking-tight
        ss:leading-[20px] leading-[18px] md:text-[14px] 
        ss:text-[14px] text-[13px]'>
          {description}
        </p>
      </div>
    </motion.div>
  )
};

const Move = () => {
  return (
    <section className='relative w-full md:min-h-[700px] ss:min-h-[1250px] 
    min-h-[1800px] flex items-center'>
      <div className='flex flex-col w-full md:gap-12 ss:gap-10 gap-8'>
        <motion.div variants={textVariant()}
        className='flex md:flex-row ss:flex-row flex-col 
        md:justify-between ss:justify-between md:items-center
        ss:items-center w-full md:gap-24 ss:gap-10 gap-6'>
          <h1 className='text-white font-semibold md:text-[40px] 
          ss:text-[35px] text-[33px] tracking-tight md:w-1/2 ss:w-1/2
          md:leading-[3.3rem] ss:leading-[2.8rem] leading-[2.6rem]'>
            It's pretty easy to get your package moving
          </h1>

          <p className='text-white md:text-[17px] md:leading-[1.5rem] 
          ss:leading-[1.3rem] leading-[1.3rem] ss:text-[16px] text-[14px] 
          md:w-1/2 ss:w-1/2'>
            As a business owner, mover or company of any sort, nothing 
            beats the ease in sending out packages whether locally or 
            internationally, quickly and without hassle.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-3 ss:grid-cols-2 md:gap-8 
        ss:gap-8 gap-6 w-full'>
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