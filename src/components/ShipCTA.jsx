import { SectionWrapper5 } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { chat, cta } from '../assets';
import { HiOutlineArrowRight } from "react-icons/hi";

const ShipCTA = () => {

    return (
        <section className="w-full md:min-h-[300px] ss:min-h-[200px] 
        min-h-[380px] flex items-center md:max-w-[68rem] ss:max-w-[68rem]
        md:mx-auto ss:mx-auto md:pt-8 md:pb-6 ss:pt-8 ss:pb-8 pt-10 pb-6
        md:pl-0 md:pr-0 ss:pl-16 ss:pr-16 pl-6 pr-6 flex-col overflow-hidden">
            <div className="w-full flex flex-col relative">
                <motion.div variants={fadeIn('down', 'spring', 0.3)}
                className="flex md:flex-row ss:flex-row flex-col md:gap-16 
                ss:gap-10 gap-10 w-full md:items-center ss:items-center 
                relative md:pb-6 ss:pb-6 pb-0 justify-between z-10">
                    <motion.div variants={textVariant()}
                    className='md:gap-3 ss:gap-3 gap-4 flex flex-col 
                    items-start md:mt-4 ss:mt-3 mt-7'>
                        <h1 className="text-white font-bold md:text-[40px]
                        ss:text-[35px] text-[33px] md:leading-[3rem] 
                        ss:leading-[2.8rem] leading-[2.6rem] tracking-tight
                        md:max-w-[18ch]">
                            Experiencing an issue? We're here to help!
                        </h1>

                        <p className='text-white md:text-[16px] ss:text-[16px] 
                        text-[14px] md:max-w-[65ch] ss:max-w-[65ch]
                        md:leading-[1.4rem] ss:leading-[1.3rem] leading-[1.3rem] 
                        tracking-tight'>
                            Whether you're looking for guidance or need 
                            quick support, we're just a message away. 
                            Get in touch, and we'll make sure you get 
                            the help you need.
                        </p>
                        
                        <a href='/createshipment'
                        className='bg-white text-[13px] py-3 px-6 flex
                        text-primary rounded-full grow4 cursor-pointer w-1/8
                        items-center gap-3 font-semibold md:mt-4 ss:mt-3'
                        >
                            <p>
                                Report a problem
                            </p>
                            
                            <HiOutlineArrowRight className='text-[14px] text-primaryalt'/>
                        </a>
                    </motion.div>

                    <motion.div variants={fadeIn('left', 'spring', 0.3)}
                    className="md:flex ss:flex hidden">
                        <img src={chat} 
                            alt='chat'
                            className='md:w-[420px] ss:w-[430px]
                            md:translate-y-[20%] ss:translate-y-[70%]'
                        />
                    </motion.div>
                </motion.div>

                <motion.div variants={fadeIn('left', 'spring', 0.3)}
                className="md:hidden ss:hidden flex absolute -bottom-32">
                    <img src={chat} 
                        alt='chat'
                        className=''
                        style={{
                            width: '70%', 
                            height: 'auto', 
                            maxWidth: 'none', 
                            position: 'relative',
                            left: '60%'
                        }}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default SectionWrapper5(ShipCTA, '');