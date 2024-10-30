import { SectionWrapper } from "../hoc";
import { layout } from '../styles';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { hands, websearch } from '../assets';

const Hands = () => {

    return (
        <section className="w-full md:min-h-[400px] ss:min-h-[500px] 
        min-h-[650px] flex items-center">
            <div className='relative items-center w-full'>
                <motion.div variants={fadeIn('down', 'spring', 0.3)}
                className="flex md:flex-row ss:flex-row flex-col md:gap-3 
                ss:gap-10 gap-10 w-full md:items-center">
                    <motion.div variants={fadeIn('down', 'spring', 0.3)}
                    className={`${layout.sectionInfo} w-full`}>
                        <img src={hands} 
                            alt='handsImage'
                            className='md:h-[400px] ss:h-[300px] w-full
                            rounded-3xl'
                        />
                    </motion.div>

                    <motion.div variants={textVariant()}
                    className={`${layout.sectionInfo} md:gap-6 ss:gap-6 
                    gap-4 rounded-2xl shadow-lg h-[300px] md:p-10 ss:p-10 p-6`}>
                        <h1 className="text-primary font-semibold md:text-[40px]
                        ss:text-[35px] text-[30px] md:leading-[40px] 
                        ss:leading-[45px] leading-[35px] tracking-tight">
                            From our hands to yours
                        </h1>

                        <p className='text-main md:text-[16px] ss:text-[17px] 
                        text-[14px] md:max-w-[700px] ss:max-w-[400px]  
                        md:leading-[23px] ss:leading-[25px] leading-[20px] 
                        font-medium tracking-tight'>
                            We pride ourselves in the satisfaction of the 
                            numerous businesses, families and individuals 
                            that trust us to provide the safest 
                            international and local deliveries.
                        </p>
                        
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
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default SectionWrapper(Hands, '');