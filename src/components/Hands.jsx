import { useRef, useState, useEffect } from 'react';
import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { hands, websearch } from '../assets';

const Hands = () => {
    const trackContainerRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (trackContainerRef.current && !trackContainerRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [trackContainerRef]);

    return (
        <section className="w-full md:min-h-[300px] ss:min-h-[300px] 
        min-h-[350px] flex items-center md:mb-0 ss:mb-0 mb-52">
            <motion.div variants={fadeIn('down', 'spring', 0.3)}
            className="flex md:flex-row ss:flex-row flex-col md:gap-3 
            ss:gap-10 gap-10 w-full md:items-center ss:items-center 
            relative md:pb-6 ss:pb-6 pb-4">
                <motion.div variants={fadeIn('right', 'spring', 0.3)}>
                    <img src={hands} 
                        alt='handsImage'
                        className='md:h-[420px] ss:h-[350px] h-[350px]
                        rounded-3xl object-cover'
                    />
                </motion.div>

                <motion.div variants={textVariant()}
                className={`absolute right-0 md:-translate-x-1/2 ss:-translate-x-1/2 
                bg-white md:px-10 ss:px-10 px-6 md:py-12 ss:py-10 py-6 flex
                w-[50%] md:gap-5 ss:gap-5 gap-4 rounded-2xl shadow-lg mobileWidth
                flex-col z-10 items-start shadow-[0px_0px_15px_rgba(0,0,0,0.15)]`}>
                    <h1 className="text-primary font-semibold md:text-[40px]
                    ss:text-[35px] text-[33px] md:leading-[2.8rem] 
                    ss:leading-[2.4rem] leading-[2.3rem] tracking-tighter
                    md:max-w-[15ch]">
                        From our hands to yours
                    </h1>

                    <p className='text-main md:text-[16px] ss:text-[15px] 
                    text-[14px] md:max-w-[700px] ss:max-w-[400px]  
                    md:leading-[1.3rem] ss:leading-[1.2rem] leading-[1.2rem] 
                    font-medium tracking-tight'>
                        We pride ourselves in the satisfaction of the 
                        numerous businesses, families and individuals 
                        that trust us to provide the safest 
                        international and local deliveries.
                    </p>
                    
                    <motion.div ref={trackContainerRef} 
                        className={`text-[13px] rounded-full py-3 px-6 
                        items-center hidden md:flex
                        ${isExpanded 
                        ? 'border border-secondary' 
                        : 'bg-secondary text-white grow4 cursor-pointer gap-3'}`}
                        animate={{ width: isExpanded ? '310px' : '173px' }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ overflow: 'hidden' }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsExpanded(true);
                        }}
                    >
                        {isExpanded ? (
                            <input
                                type="text"
                                placeholder="Enter Tracking Number"
                                className="flex-grow text-main
                                focus:outline-none text-[13px]"
                                onBlur={() => setIsExpanded(false)}
                            />
                        ) : (
                            <p>
                                Track Shipment
                            </p>
                        )}
                        <img src={websearch} alt='trackshipment'
                        className={`w-5 h-5 ${isExpanded 
                            ? 'wht2 cursor-pointer'
                            : 'wht'}`}
                        />
                    </motion.div>

                    <div ref={trackContainerRef}
                        className={`text-[13px] rounded-full py-3 px-6 
                        items-center md:hidden flex w-full
                        ${isExpanded 
                        ? 'border border-secondary justify-between' 
                        : 'bg-secondary text-white cursor-pointer gap-3 justify-center'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsExpanded(true);
                        }}
                    >
                        {isExpanded ? (
                            <input
                                type="text"
                                placeholder="Enter Tracking Number"
                                className="flex-grow text-main
                                focus:outline-none text-[13px]"
                                onBlur={() => setIsExpanded(false)}
                            />
                        ) : (
                            <p>
                                Track Shipment
                            </p>
                        )}
                        <img src={websearch} alt='trackshipment'
                        className={`w-5 h-5 ${isExpanded 
                            ? 'wht2 cursor-pointer'
                            : 'wht'}`}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(Hands, '');