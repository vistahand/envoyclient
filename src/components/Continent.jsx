import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { globe } from '../assets';
import { HiOutlineArrowRight } from "react-icons/hi";

const Continent = () => {

    return (
        <section className="w-full md:min-h-[600px] ss:min-h-[500px] 
        min-h-[650px] flex items-center">
            <motion.div variants={fadeIn('down', 'spring', 0.3)}
            className="flex md:flex-row ss:flex-row flex-col md:gap-16 
            ss:gap-10 gap-10 w-full md:items-center relative md:pb-6
            ss:pb-6 pb-4 justify-between">
                <motion.div variants={fadeIn('right', 'spring', 0.3)}
                className="w-1/2">
                    <img src={globe} 
                        alt='globe'
                        className='md:w-[550px] ss:w-[400px]'
                    />
                </motion.div>

                <motion.div variants={textVariant()}
                className='md:gap-5 ss:gap-5 gap-4 flex flex-col 
                items-start w-1/2'>
                    <h1 className="text-white font-semibold md:text-[40px]
                    ss:text-[35px] text-[30px] md:leading-[3rem] 
                    ss:leading-[1.3rem] leading-[1.3rem] tracking-tight
                    md:max-w-[15ch]">
                        Cross-continent logistics has never been easier
                    </h1>

                    <p className='text-white md:text-[16px] ss:text-[16px] 
                    text-[14px] md:max-w-[700px] ss:max-w-[400px]  
                    md:leading-[1.4rem] ss:leading-[1.3rem] leading-[1.3rem] 
                    tracking-tight'>
                        We've built a system to eliminate the stress and 
                        hassle involved in sending and picking up packages 
                        safely and quickly in and between Ireland and 
                        Nigeria! 
                    </p>

                    <div className="w-full flex flex-col gap-3 md:pb-1">
                        <div className="w-full bg-gradient-to-r p-3
                        from-primaryalt to-primary2">
                            <p className="text-white md:text-[16px]
                            ss:text-[16px] text-[14px] font-semibold">
                                Easy parcel creation system
                            </p>
                        </div>

                        <div className="w-full bg-gradient-to-r p-3
                        from-primaryalt to-primary2">
                            <p className="text-white md:text-[16px]
                            ss:text-[16px] text-[14px] font-semibold">
                                Real-time package tracking
                            </p>
                        </div>

                        <div className="w-full bg-gradient-to-r p-3
                        from-primaryalt to-primary2">
                            <p className="text-white md:text-[16px]
                            ss:text-[16px] text-[14px] font-semibold">
                                Safe and secure packaging and handling
                            </p>
                        </div>
                    </div>
                    
                    <a href='/'
                    className='bg-white text-[13px] py-3 px-6 flex
                    text-primary rounded-full grow4 cursor-pointer w-1/8
                    items-center gap-3 font-semibold'
                    >
                        <p>
                            Learn More
                        </p>
                        
                        <HiOutlineArrowRight className='text-[14px]'/>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(Continent, '');