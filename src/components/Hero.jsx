import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { SectionWrapper2 } from '../hoc';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className='relative w-full md:min-h-[700px] ss:min-h-[800px] 
    items-center flex'>
        <div className='relative items-center w-full max-w-[72rem]
        md:mt-24 ss:mt-0 mt-10 flex'
        >
            <div className='relative md:items-center ss:items-center 
            w-full flex flex-col md:gap-20 ss:gap-6 gap-6'>
                <motion.div variants={textVariant()}
                className='flex flex-col justify-center md:gap-6 ss:gap-6 gap-4'
                >
                    <h1 className='text-primary font-[700] md:text-[60px]
                    ss:text-[50px] text-[33px] md:leading-[4.5rem] tracking-tight
                    ss:leading-[65px] leading-[38px] text-center
                    md:max-w-[25ch]'>
                        Secure and seamless deliveries across borders
                    </h1>

                    <p className='text-main font-[500] md:text-[16px] 
                    md:leading-[1.3rem] ss:leading-[1.3rem] leading-[1.3rem] 
                    ss:text-[18px] text-[14px] md:max-w-[90ch] ss:max-w-[620px]
                    max-w-[320px] text-center tracking-tight'>
                        With Envoy Angel, your shipments are in safe hands. 
                        From quick and easy bookings to 24/7 tracking, we're 
                        here to ensure a smooth logistics experience for 
                        every shipment, big or small.
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