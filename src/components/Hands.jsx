import { useRef, useState, useEffect } from 'react';
import { SectionWrapper } from "../hoc";
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../utils/motion';
import { hands, websearch } from '../assets';

const Hands = () => {
    const trackContainerRef = useRef(null);
    const desktopTrackContainerRef = useRef(null);
    const inputRef = useRef(null);
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const [desktopTrackingNumber, setDesktopTrackingNumber] = useState('');
    const [mobileTrackingNumber, setMobileTrackingNumber] = useState('');


    useEffect(() => {
        function handleClickOutside(event) {
            if (desktopTrackContainerRef.current && !desktopTrackContainerRef.current.contains(event.target)) {
                setIsDesktopExpanded(false);
                setDesktopTrackingNumber(''); // Clear desktop tracking number when clicking outside
            }
        
            if (trackContainerRef.current && !trackContainerRef.current.contains(event.target)) {
                setIsMobileExpanded(false);
                setMobileTrackingNumber(''); // Clear mobile tracking number when clicking outside
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [desktopTrackContainerRef, trackContainerRef]);

    useEffect(() => {
        if (isDesktopExpanded && inputRef.current) {
            inputRef.current.focus();
        }

        if (isMobileExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isDesktopExpanded, isMobileExpanded]);
    

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
                bg-white md:px-10 ss:px-10 px-5 md:py-12 ss:py-10 py-6 flex
                w-[50%] md:gap-5 ss:gap-5 gap-4 rounded-2xl mobileWidth
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
                        that trust us to provide the safest international 
                        and local deliveries.
                    </p>

                    {/* Desktop Track Shipment */}
                    <motion.div ref={desktopTrackContainerRef}
                        className={`text-[13px] rounded-full py-3 px-6 
                        items-center hidden md:flex
                        ${isDesktopExpanded
                            ? 'border border-secondary relative'
                            : 'bg-secondary text-white grow4 cursor-pointer gap-3'}`}
                        animate={{ width: isDesktopExpanded ? '360px' : '173px' }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsDesktopExpanded(true);
                        }}
                    >
                        {isDesktopExpanded ? (
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Enter Tracking Number"
                                value={desktopTrackingNumber}
                                onChange={(e) => setDesktopTrackingNumber(e.target.value)}
                                onBlur={(e) => {
                                    if (!e.relatedTarget?.closest('.track-button-desktop')) {
                                        setIsDesktopExpanded(false);
                                    }
                                }}
                                className="flex-grow text-main flex 
                                pr-16 focus:outline-none text-[13px]"
                            />
                        ) : (
                            <p>
                                Track Shipment
                            </p>
                        )}
                        <a href='/trackshipment'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (desktopTrackingNumber.trim()) {
                                    setDesktopTrackingNumber(''); // Clear desktop tracking number after clicking track
                                    window.location.href = '/trackshipment';
                                }
                            }}
                            className={`track-button-desktop ${isDesktopExpanded
                                ? 'bg-secondary cursor-pointer p-1.5 pr-2 rounded-full flex gap-1.5 items-center absolute right-1.5'
                                : ''}`}
                        >
                            <img src={websearch} alt='trackshipment'
                                className='wht w-5 h-5'
                            />

                            {isDesktopExpanded &&
                                <p className='text-white text-[12.5px]'>
                                    Track
                                </p>
                            }
                        </a>
                    </motion.div>

                    {/* Mobile Track Shipment */}
                    <motion.div ref={trackContainerRef}
                        className={`text-[13px] rounded-full py-3 px-6 
                        items-center md:hidden flex w-full
                        ${isMobileExpanded
                            ? 'border border-secondary justify-between relative'
                            : 'bg-secondary text-white cursor-pointer gap-3 justify-center'}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileExpanded(true);
                            }} 
                    >
                        {isMobileExpanded ? (
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Enter Tracking Number"
                                value={mobileTrackingNumber}
                                onChange={(e) => setMobileTrackingNumber(e.target.value)}
                                onBlur={(e) => {
                                    if (!e.relatedTarget?.closest('.track-button-mobile')) {
                                        setIsMobileExpanded(false);
                                    }
                                }}
                                className="flex-grow text-main flex
                                focus:outline-none text-[13px] pr-16"
                            />
                        ) : (
                            <p>
                                Track Shipment
                            </p>
                        )}
                        <a href='/trackshipment'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (mobileTrackingNumber.trim()) {
                                    setMobileTrackingNumber(''); // Clear mobile tracking number after clicking track
                                    window.location.href = '/trackshipment';
                                }
                            }}
                            className={`track-button-mobile ${isMobileExpanded
                                ? 'bg-secondary cursor-pointer p-1.5 pr-2 rounded-full flex gap-1.5 items-center absolute right-1.5'
                                : ''}`}
                        >
                            <img src={websearch} alt='trackshipment'
                                className='wht w-5 h-5'
                            />

                            {isMobileExpanded &&
                                <p className='text-white text-[12.5px]'>
                                    Track
                                </p>
                            }
                        </a>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default SectionWrapper(Hands, '');
