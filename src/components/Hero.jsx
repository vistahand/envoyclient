import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight } from "react-icons/hi";
import { websearch, heroImages, socialproof } from '../assets';
import { SectionWrapper2 } from '../hoc';


const ImageCard = ({ image }) => {
    return (
        <div className='w-[550px] h-[250px]'>
            <img 
                src={image}
                alt='heroImage'
                className='rounded-2xl w-full'
            />
        </div>
    );
};


const Hero = () => {
    const navigate = useNavigate();
    const carouselRef = useRef(null);
    const itemRef = useRef(null);

  return (
    <section className='relative w-full md:min-h-[700px] ss:min-h-[800px] 
    items-center flex flex-col md:gap-14 ss:gap-10 gap-8 md:mt-32 ss:mt-0 
    mt-10'>
        <div className='relative items-center w-full max-w-[68rem] flex'
        >
            <div className='md:items-center ss:items-center w-full flex 
            flex-col md:gap-8 ss:gap-6 gap-6'>
                <motion.div variants={textVariant(0.3)}
                className='flex flex-col justify-center md:gap-6 ss:gap-6 gap-4
                items-center'
                >
                    <h1 className='text-primary font-[700] md:text-[57px]
                    ss:text-[50px] text-[33px] md:leading-[4.2rem] tracking-tight
                    ss:leading-[65px] leading-[38px] text-center
                    md:max-w-[25ch]'>
                        Secure and seamless deliveries across borders
                    </h1>

                    <p className='text-main font-[500] md:text-[17px] 
                    md:leading-[1.3rem] ss:leading-[1.3rem] leading-[1.3rem] 
                    ss:text-[18px] text-[14px] md:max-w-[80ch] ss:max-w-[620px]
                    max-w-[320px] text-center tracking-tight'>
                        With Envoy Angel, your shipments are in safe hands. 
                        From quick and easy bookings to 24/7 tracking, we're 
                        here to ensure a smooth logistics experience for 
                        every shipment, big or small.
                    </p>
                </motion.div>

                <motion.div variants={textVariant(0.5)}>
                    <div className='flex flex-row md:gap-5 ss:gap-5 gap-3 
                    items-center text-white'>
                        <a href='/'
                        className='bg-primary text-[13px] py-3 px-6 flex
                        text-white rounded-full grow4 cursor-pointer w-1/8
                        items-center gap-3'
                        >
                            <p>
                                Book a Shipment
                            </p>
                            
                            <HiOutlineArrowRight className='text-[14px]'/>
                        </a>
                        
                        <a href='/'
                        className='bg-secondary text-[13px] py-3 px-6 flex
                        text-white rounded-full grow4 cursor-pointer w-1/8
                        items-center gap-3'
                        >
                            <p>
                                Track Shipment
                            </p>
                            
                            <img src={websearch} alt='trackshipment'
                                className='w-5 h-5 wht'
                            />
                        </a>
                    </div>  
                </motion.div> 
            </div>
        </div>

        <div className='flex items-center justify-center w-full relative'>
            <div className='overflow-hidden w-full flex'
                ref={carouselRef}
            >
                <div className='flex gap-6 w-full items-center justify-center'>
                    {heroImages.map((item, index) => (
                        <div key={index}>
                            <ImageCard 
                                image={item}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='absolute top-[50%] w-1/4'>
                <img 
                    src={socialproof} 
                    alt='socialproof'
                    className='w-[100%]'
                />
            </div>
        </div>
    </section>  
  )
};

export default SectionWrapper2(Hero, 'hero');