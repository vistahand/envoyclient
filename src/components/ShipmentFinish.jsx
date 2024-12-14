import { useState } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PiWarningCircle } from "react-icons/pi";
import { TrackModal } from '../components';
import { shipconfirm } from '../assets';

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
                <div className="md:w-[50%] ss:w-[50%] w-full flex flex-col 
                gap-4">
                    <h1 className='text-primary font-bold md:text-[35px] 
                    ss:text-[33px] text-[25px] tracking-tight 
                    md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.3rem]'>
                        Your shipment has been confirmed!
                    </h1>

                    <div className="flex flex-col gap-5 w-full">
                        <div className='flex items-center justify-between rounded-xl 
                        bg-primary1 px-5 py-3.5 w-full'>
                            <p className='text-primary md:text-[21px] ss:text-[21px] 
                            text-[18px] tracking-tight font-medium'>
                                Tracking ID: <span className='font-bold'>
                                001F5TG8XR4U
                                </span>
                            </p>

                            <PiWarningCircle 
                                className='md:w-[1.8rem] ss:w-[1.8rem] w-[3.2rem] 
                                h-auto text-primary cursor-pointer'
                            />
                        </div>

                        <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                We've successfully processed your payment 
                                and assigned a tracking ID, which you'll 
                                use to monitor your shipment's progress 
                                once it's received at our pickup location 
                                and ready to ship.
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-bold text-main2 leading-[20px]">
                                Endeavour to send your package(s) to your 
                                selected pickup station on or before 29th 
                                of October, 2024.
                            </p>
                        </div>
                    </div>
                    
                    <div className='w-full mt-5'>
                        <button
                        className='bg-primary text-[13px] py-3.5 px-8
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
                    <div className='w-full relative md:rounded-2xl
                    ss:rounded-2xl rounded-xl relative overflow-hidden'>
                        <img
                            src={shipconfirm}
                            alt='shipmentconfirmed'
                            className='object-cover md:rounded-2xl
                            ss:rounded-2xl rounded-xl'
                        />

                        <div 
                            className='h-[15px] w-full absolute bottom-0 
                            bg-secondary'
                        />
                    </div>
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