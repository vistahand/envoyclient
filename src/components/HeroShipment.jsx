import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';
import { SectionWrapper2 } from '../hoc';


const HeroShipment = () => {

  return (
    <section className='relative w-full md:min-h-[250px] ss:min-h-[500px] 
    items-center flex flex-col md:mt-28 ss:mt-44 mt-28'>
        <div className='items-center w-full max-w-[68rem] flex flex-col 
        md:gap-5 ss:gap-5 gap-4 justify-center'>
            <motion.div variants={textVariant(0.3)}
            className='flex justify-center w-full'
            >
                <h1 className='text-white font-[700] md:text-[50px]
                ss:text-[40px] text-[30px] md:leading-[3.6rem] 
                tracking-tighter ss:leading-[3.2rem] leading-[2.5rem] 
                text-center md:max-w-[25ch] ss:max-w-[25ch] max-w-[14ch]'>
                    Create a shipment ready to move in simple steps!
                </h1>
            </motion.div>

            <motion.div variants={textVariant(0.5)}>
                <p className='text-white font-medium md:text-[17px] 
                md:leading-[1.4rem] ss:leading-[1.3rem] leading-[1.2rem] 
                ss:text-[17px] text-[14px] md:max-w-[75ch] ss:max-w-[55ch]
                max-w-[60ch] text-center tracking-tight'>
                    Take the hassle out of shipping; follow the simple 
                    steps below to get your shipment on its way. Whether 
                    you're sending across Ireland, Nigeria, or locally, 
                    we've got you covered from pickup to delivery.
                </p> 
            </motion.div> 
        </div>
    </section>  
  )
};

export default SectionWrapper2(HeroShipment, '');