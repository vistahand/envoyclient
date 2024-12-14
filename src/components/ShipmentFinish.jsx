import { useState } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PiWarningCircle } from "react-icons/pi";
import { TrackModal } from '../components';
import { paystack } from '../assets';

const ShipmentFinish = () => {
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const disableScroll = () => {
        setScrollPosition(window.pageYOffset);
        document.body.style.overflow = 'hidden';
        document.body.style.top = `-${scrollPosition}px`;
    };

    return (
        <section className='w-full flex md:min-h-[600px] ss:min-h-[800px]
        min-h-[800px]'>
            <div className="w-full flex md:flex-row flex-col gap-14 
            justify-between">
                <div className="w-full flex flex-col gap-6">
                    <h1 className='text-primary font-bold md:text-[30px] 
                    ss:text-[28px] text-[22px] tracking-tight'>
                        Your shipment has been confirmed!
                    </h1>

                    <div className="flex flex-col gap-4 w-full">
                        <div className='flex items-center gap-2 rounded-xl 
                        bg-primary1 px-5 py-3.5 cursor-pointer w-full'>
                            <PiWarningCircle 
                                className='md:w-[1.8rem] ss:w-[1.8rem] w-[3.2rem] 
                                h-auto text-primary'
                            />

                            <p className='text-primary md:text-[14px] ss:text-[14px] 
                            text-[12px] tracking-tight font-medium'>
                                Tracking ID: <span className='font-bold'>
                                001F5TG8XR4U
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main4 leading-[18px]">
                                No. 5 Friday Anazodo Street
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-bold text-main4 leading-[18px]">
                                Rufus Benson Antagony
                            </p>
                        </div>
                    </div>
                    
                    <div className='w-full'>
                        <button
                        className='bg-primary text-[13px] py-3.5 px-14 
                        flex text-white rounded-full grow4 cursor-pointer
                        items-center justify-center gap-3'
                        onClick={() => {
                            setIsTrackModalOpen(true);
                            disableScroll();
                        }}
                        >
                            <p>
                                Track Shipment
                            </p>
                            
                            <HiOutlineArrowRight className='text-[14px]'/>
                        </button>
                    </div>
                </div>

                <div className="md:w-[50%] ss:w-[50%] md:mb-0 ss:mb-0 mb-8">
                   
                </div>
            </div>

            {isTrackModalOpen && (
                <TrackModal 
                    onClose={() => setIsTrackModalOpen(false)}
                />
            )}
        </section>
    );
};

export default SectionWrapper(ShipmentFinish, '');