import { SectionWrapper3 } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { cta } from '../assets';
import { HiOutlineArrowRight } from "react-icons/hi";

const CTA = () => {

    return (
        <section className="w-full md:min-h-[200px] ss:min-h-[500px] 
        min-h-[650px] flex items-center">
            <motion.div variants={fadeIn('down', 'spring', 0.3)}
            className="flex md:flex-row ss:flex-row flex-col md:gap-16 
            ss:gap-10 gap-10 w-full md:items-center relative md:pb-6
            ss:pb-6 pb-4 justify-between">
                <motion.div variants={textVariant()}
                className='md:gap-6 ss:gap-5 gap-4 flex flex-col 
                items-start'>
                    <h1 className="text-white font-semibold md:text-[40px]
                    ss:text-[35px] text-[30px] md:leading-[3rem] 
                    ss:leading-[1.3rem] leading-[1.3rem] tracking-tight
                    md:max-w-[15ch]">
                        Ready to simplify your logistics?
                    </h1>

                    <p className='text-white md:text-[16px] ss:text-[16px] 
                    text-[14px] md:max-w-[65ch] ss:max-w-[65ch]  
                    md:leading-[1.4rem] ss:leading-[1.3rem] leading-[1.3rem] 
                    tracking-tight'>
                        Join thousands of satisfied customers who trust 
                        us to deliver on time, every time. Get started 
                        today—book your shipment, track in real time, 
                        and experience hassle-free service from pickup 
                        to delivery. Let's get moving.
                    </p>
                    
                    <a href='/'
                    className='bg-white text-[13px] py-3 px-6 flex
                    text-primary rounded-full grow4 cursor-pointer w-1/8
                    items-center gap-3 font-semibold'
                    >
                        <p>
                            Book a shipment
                        </p>
                        
                        <HiOutlineArrowRight className='text-[14px]'/>
                    </a>
                </motion.div>

                <motion.div variants={fadeIn('right', 'spring', 0.3)}
                className="">
                    <img src={cta} 
                        alt='cta'
                        className='md:w-[350px] ss:w-[400px]'
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper3(CTA, '');