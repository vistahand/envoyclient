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
            w-full flex flex-col md:gap-8 ss:gap-6 gap-6'>
                <motion.div variants={textVariant(0.3)}
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
                </motion.div>

                <motion.div variants={textVariant(0.8)}>
                    <div className='flex flex-row md:gap-5 
                    ss:gap-5 gap-3 items-center text-white'>
                        <a href='/about'>
                            <button className='bg-primary grow2 md:text-[13px] 
                            ss:text-[15px] text-[13px] md:py-3.5 ss:py-3 py-2.5 
                            px-8 rounded-full font-medium border-none'>
                                Book a Shipment
                            </button>
                        </a>
                        
                        <a href='/contact'>
                            <button className='bg-secondary grow2 md:text-[13px] 
                            ss:text-[15px] text-[13px] md:py-3.5 ss:py-3 py-2.5 
                            px-8 rounded-full font-medium border-none'>
                                Track Shipment
                            </button>
                        </a>
                    </div>  
                </motion.div> 
            </div>
        </div>
    </section>  
  )
};

export default SectionWrapper2(Hero, 'hero');