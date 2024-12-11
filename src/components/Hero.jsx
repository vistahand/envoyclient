import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { textVariant } from '../utils/motion';
import { HiOutlineArrowRight } from "react-icons/hi";
import { websearch, heroImages, socialproof, curve, socialproofMob } from '../assets';
import { SectionWrapper2 } from '../hoc';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ImageCard = ({ image }) => {
    return (
        <div className='ss:w-[500px] w-[330px] ss:h-[210px] h-[170px]'>
            <img 
                src={image}
                alt='heroImage'
                className='rounded-2xl w-full'
            />
        </div>
    );
};


const Hero = () => {
    const trackContainerRef = useRef(null);
    const inputRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [imagesToShow, setImagesToShow] = useState(5);
    const [collapsedWidth, setCollapsedWidth] = useState('175px');
    const [expandedWidth, setExpandedWidth] = useState('340px')
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);


    const settings = {
        dots: false,
        autoplay: true,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1060,
                settings: {
                    infinite: true,
                    speed: 3000,
                    slidesToShow: 1.9,
                    slidesToScroll: 1,
                    initialSlide: 0,
                }
            },
            {
                breakpoint: 820,
                settings: {
                    infinite: true,
                    speed: 3000,
                    slidesToShow: 1.5,
                    slidesToScroll: 1,
                    initialSlide: 0,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    infinite: true,
                    speed: 3000,
                    slidesToShow: 1.3,
                    slidesToScroll: 1,
                    initialSlide: 0,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    infinite: true,
                    speed: 3000,
                    slidesToShow: 1.22,
                    slidesToScroll: 1,
                    initialSlide: 0,
                }
            },
            {
                breakpoint: 400,
                settings: {
                    infinite: true,
                    speed: 3000,
                    slidesToShow: 1.15,
                    slidesToScroll: 1,
                    initialSlide: 0,
                }
            },
            {
                breakpoint: 360,
                settings: {
                    infinite: true,
                    speed: 3000,
                    slidesToShow: 1.05,
                    slidesToScroll: 1,
                    initialSlide: 0,
                }
            }
        ]
    };

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const updateImagesToShow = () => {
        if (window.innerWidth <= 1440) {
            setImagesToShow(3);
        } else {
            setImagesToShow(heroImages.length);
        }
    };

    useEffect(() => {
        updateImagesToShow();

        window.addEventListener('resize', updateImagesToShow);
        return () => window.removeEventListener('resize', updateImagesToShow);
    }, []);

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

    useEffect(() => {
        const updateCollapsedWidth = () => {
            const screenWidth = window.innerWidth;
            const width = Math.min(screenWidth - 48);
            if (screenWidth >= 480) {
                setCollapsedWidth('173px');
                setExpandedWidth('360px');
            } else {
                setCollapsedWidth('175px');
                setExpandedWidth(`${width}px`);
            }
        };

        updateCollapsedWidth();
        window.addEventListener('resize', updateCollapsedWidth);

        return () => window.removeEventListener('resize', updateCollapsedWidth);
    }, []);

  return (
    <section className='relative w-full md:min-h-[500px] ss:min-h-[500px] 
    items-center flex flex-col md:gap-14 ss:gap-10 gap-8 md:mt-44 ss:mt-44 
    mt-28'>
        <div className='relative items-center w-full max-w-[68rem] flex'>
            <div className='md:items-center ss:items-center w-full flex 
            flex-col md:gap-8 ss:gap-6 gap-6'>
                <motion.div variants={textVariant(0.3)}
                className='flex flex-col md:justify-center ss:justify-center 
                md:gap-6 ss:gap-6 gap-4 md:items-center ss:items-center 
                md:pl-0 md:pr-0 ss:pr-0 ss:pl-0 pr-5 pl-5'
                >
                    <h1 className='text-primary font-[700] md:text-[57px]
                    ss:text-[43px] text-[35px] md:leading-[4.2rem] tracking-tighter
                    ss:leading-[3.5rem] leading-[2.5rem] md:text-center relative
                    ss:text-center md:max-w-[25ch] ss:max-w-[25ch] max-w-[14ch]'>
                       Yoyinnnnnnnnnn
                    </h1>

                    <p className='text-main font-[500] md:text-[17px] 
                    md:leading-[1.3rem] ss:leading-[1.3rem] leading-[1.2rem] 
                    ss:text-[17px] text-[14px] md:max-w-[80ch] ss:max-w-[55ch]
                    max-w-[60ch] md:text-center ss:text-center tracking-tight'>
                        With Envoy Angel, your shipments are in safe hands. 
                        From quick and easy bookings to 24/7 tracking, we're 
                        here to ensure a smooth logistics experience for 
                        every shipment, big or small.
                    </p>
                </motion.div>

                <motion.div variants={textVariant(0.5)}>
                    <div className='flex md:flex-row ss:flex-row flex-col 
                    md:gap-5 ss:gap-5 gap-3 md:items-center ss:items-center 
                    text-white md:pl-0 md:pr-0 ss:pr-0 ss:pl-0 pr-5 pl-5'>
                        <a href='/createshipment'
                        className='bg-primary text-[13px] py-3 px-6 flex
                        text-white rounded-full grow4 cursor-pointer md:w-1/8
                        ss:w-1/8 w-[175px] items-center gap-3'
                        >
                            <p>
                                Book a Shipment
                            </p>
                            
                            <HiOutlineArrowRight className='text-[14px]'/>
                        </a>
                        
                        <motion.div 
                            ref={trackContainerRef}
                            className={`text-[13px] rounded-full py-3 px-6 flex
                            items-center
                            ${isExpanded 
                            ? 'border border-secondary relative' 
                            : 'bg-secondary text-white grow4 cursor-pointer gap-3'}`}
                            animate={{ width: isExpanded ? expandedWidth : collapsedWidth }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            style={{ overflow: 'hidden' }}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsExpanded(true);
                            }}
                        >
                            {isExpanded ? (
                                <input
                                    ref={inputRef}
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
                            <div className={`${isExpanded 
                                ? 'bg-secondary cursor-pointer p-1.5 pr-2 rounded-full flex gap-1.5 items-center absolute right-1.5'
                                : ''}`}
                            >
                                <img src={websearch} alt='trackshipment'
                                className='wht w-5 h-5'
                                />

                                {isExpanded && 
                                    <p className='text-white text-[12.5px]'>
                                        Track
                                    </p>
                                }
                            </div>
                        </motion.div>
                    </div>  
                </motion.div> 
            </div>
        </div>

        <motion.div variants={textVariant(0.7)} 
        className='flex items-center justify-center w-full relative'>
            <div className='overflow-hidden w-full hidden md:flex'>
                <div className='flex gap-6 w-full items-center justify-center'>
                    {heroImages.slice(0, imagesToShow).map((item, index) => (
                        <div key={index}>
                            <ImageCard 
                                image={item}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='overflow-hidden w-full md:hidden flex'>
                <Slider {...settings} className='flex w-full items-center 
                justify-center'>
                    {heroImages.map((item, index) => (
                        <div key={index}>
                            <ImageCard 
                                image={item}
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className='absolute md:top-[55%] ss:top-[55%] top-[45%] 
            md:w-1/4 ss:w-2/4 w-2/3'>
                <div className='absolute inset-0 bg-gray-100 bg-opacity-50 
                rounded-full backdrop-filter backdrop-blur-sm'/>
                <img 
                    src={isMobile ? socialproofMob : socialproof}
                    alt='socialproof'
                    className='w-[100%] relative z-10'
                />
            </div>
        </motion.div>
    </section>  
  )
};

export default SectionWrapper2(Hero, 'hero');