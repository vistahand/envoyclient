import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';
import { SectionWrapper2 } from '../hoc';


const HeroTerms = () => {

  return (
    <section className='relative w-full md:min-h-[220px] ss:min-h-[220px] 
    min-h-[220px] items-center flex flex-col md:mt-28 ss:mt-32 mt-28'>
        <div className='items-center w-full max-w-[68rem] flex flex-col 
        md:gap-5 ss:gap-5 gap-4 justify-center'>
            <motion.div variants={textVariant(0.3)}
            className='flex justify-center w-full'
            >
                <h1 className='text-white font-[700] md:text-[50px]
                ss:text-[40px] text-[30px] md:leading-[3.6rem] 
                tracking-tight ss:leading-[3.2rem] leading-[2.2rem] 
                text-center md:max-w-[25ch] ss:max-w-[25ch] max-w-[14ch]'>
                    Terms of Usage
                </h1>
            </motion.div>

            <motion.div variants={textVariant(0.5)}>
                <p className='text-white font-medium md:text-[17px] 
                md:leading-[1.4rem] ss:leading-[1.3rem] leading-[1.2rem] 
                ss:text-[16px] text-[14px] md:max-w-[75ch] ss:max-w-[55ch]
                max-w-[35ch] text-center tracking-tight'>
                    By using Envoy Angel's services, you agree to our terms and conditions. These outline your rights, responsibilities, and the guidelines that ensure a smooth and secure shipping experience for all users.
                </p> 
            </motion.div> 
        </div>
    </section>  
  )
};

export default SectionWrapper2(HeroTerms, '');