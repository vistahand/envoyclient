import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { hands, websearch } from '../assets';

const Hands = () => {

    return (
        <section className="w-full md:min-h-[300px] ss:min-h-[500px] 
        min-h-[650px] flex items-center">
            <motion.div variants={fadeIn('down', 'spring', 0.3)}
            className="flex md:flex-row ss:flex-row flex-col md:gap-3 
            ss:gap-10 gap-10 w-full md:items-center relative md:pb-6
            ss:pb-6 pb-4">
                <motion.div variants={fadeIn('right', 'spring', 0.3)}>
                    <img src={hands} 
                        alt='handsImage'
                        className='md:h-[420px] ss:h-[300px]
                        rounded-3xl object-cover'
                    />
                </motion.div>

                <motion.div variants={textVariant()}
                className={`absolute right-0 -translate-x-1/2 bg-white
                w-[50%] md:gap-5 ss:gap-5 gap-4 rounded-2xl shadow-lg 
                md:px-10 ss:px-10 px-6 md:py-12 ss:py-10 py-6 flex 
                flex-col z-10 items-start shadow-[0px_0px_15px_rgba(0,0,0,0.15)]`}>
                    <h1 className="text-primary font-semibold md:text-[40px]
                    ss:text-[35px] text-[30px] md:leading-[2.8rem] 
                    ss:leading-[1.3rem] leading-[1.3rem] tracking-tight
                    md:max-w-[15ch]">
                        From our hands to yours
                    </h1>

                    <p className='text-main md:text-[16px] ss:text-[16px] 
                    text-[14px] md:max-w-[700px] ss:max-w-[400px]  
                    md:leading-[1.3rem] ss:leading-[1.3rem] leading-[1.3rem] 
                    font-medium tracking-tight'>
                        We pride ourselves in the satisfaction of the 
                        numerous businesses, families and individuals 
                        that trust us to provide the safest 
                        international and local deliveries.
                    </p>
                    
                    <a href='/'
                    className='bg-secondary text-[13px] py-3 px-6 flex
                    text-white rounded-full grow4 cursor-pointer
                    items-center gap-3'
                    >
                        <p>
                            Track Shipment
                        </p>
                        
                        <img src={websearch} alt='trackshipment'
                            className='w-5 h-5 wht'
                        />
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(Hands, '');