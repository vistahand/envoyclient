import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { SectionWrapper2 } from '../hoc';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className='relative w-full md:min-h-[700px] ss:min-h-[800px] 
    items-center flex md:mb-0 ss:mb-52 mb-36'>
        <div className='relative items-center w-full max-w-[72rem] p-6
        md:mt-24 ss:mt-0 mt-10 md:rounded-[30px] flex md:p-10 ss:p-10 '
        >
            <div className='relative md:items-center ss:items-center 
            justify-between w-full flex flex-col md:gap-20 
            ss:gap-6 gap-6'>
                <motion.div variants={textVariant()}
                className='flex justify-center md:gap-6
                ss:gap-6 gap-4 flex-col'
                >
                    <h1 className='text-primary font-[700] md:text-[60px]
                    ss:text-[50px] text-[33px] md:leading-[4.5rem] tracking-tight
                    ss:leading-[65px] leading-[38px] text-center
                    md:max-w-[25ch]'>
                        Secure and seamless deliveries across borders
                    </h1>

                    <p className='text-white md:text-[16px] md:leading-[24px] 
                    ss:leading-[28px] leading-[18px] ss:text-[18px] 
                    text-[14px] md:max-w-[600px] ss:max-w-[620px]
                    max-w-[320px]'>
                        Buy your desired tiles, marble, granite, sanitary
                        wares, doors, wall and flooring materials. We've
                        got you covered with a wide selection of
                        high-quality products to make your dream home a 
                        reality.
                    </p>

                    <div className='flex flex-row bg-main2 w-full
                    rounded-[10px] border-[1px] border-primaryalt py-1.5 
                    px-2 gap-3 justify-between items-center relative'>
                      
                    </div>     
                </motion.div>
            </div>
        </div>
    </section>  
  )
};

export default SectionWrapper2(Hero, 'hero');