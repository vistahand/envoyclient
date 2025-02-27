import { useState, useEffect } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
// import { HiOutlineArrowRight } from "react-icons/hi";
// import { TrackModal } from '../components';
import { copy, shipconfirm } from '../assets';

const ShipmentFinish = () => {
    // const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    // const [scrollPosition, setScrollPosition] = useState(0);
    const [copyButtonText, setCopyButtonText] = useState('Copy'); 

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [])

    // const disableScroll = () => {
    //     setScrollPosition(window.pageYOffset);
    //     document.body.style.overflow = 'hidden';
    //     document.body.style.top = `-${scrollPosition}px`;
    // };

    const handleCopyClick = () => {
        navigator.clipboard.writeText('001F5TG8XR4U')
        .then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => {
                setCopyButtonText('Copy');
            }, 3000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    return (
        <section className='w-full flex min-h-[400px]'>
            <div className="w-full flex md:flex-row flex-col gap-14 
            md:justify-between">
                <div className="md:w-[50%] w-full flex flex-col gap-3">
                    <h1 className='text-primary font-bold md:text-[35px] 
                    ss:text-[33px] text-[27px] tracking-tight 
                    md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]'>
                        Your payment is being processed
                    </h1>

                    <div className="flex flex-col gap-5 w-full">
                        <div className='flex items-center justify-between rounded-xl 
                        bg-primary1 md:px-5 ss:px-5 px-3 py-3.5 md:w-full ss:w-[70%]
                        w-full'>
                            <p className='text-primary md:text-[21px] ss:text-[21px] 
                            text-[17px] tracking-tight font-medium'>
                                Transaction ID: <span className='font-bold'>
                                TRX-18084578123
                                </span>
                            </p>

                            <div className='flex items-center gap-2 cursor-pointer'
                            onClick={handleCopyClick}
                            >
                                <img
                                    src={copy}
                                    alt='copy'
                                    className='w-[1rem] h-auto text-primary'
                                />

                                <p className='text-primary md:text-[12px] ss:text-[12px] 
                                text-[11px] tracking-tight font-bold'>
                                    {copyButtonText}
                                </p>
                            </div>
                            
                        </div>

                        <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                Our team will verify your payment and confirm it shortly. 
                                <span className='font-bold'> You will receive an email notification once your payment is confirmed and your shipment is processed.</span>
                            </p>

                            {/* <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-bold text-main2 leading-[20px]">
                                Endeavour to send your package(s) to your 
                                selected pickup station on or before 29th 
                                of October, 2024.
                            </p> */}
                        </div>
                    </div>
                    
                    {/* <div className='w-full md:mt-5 ss:mt-5 mt-3'>
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
                    </div> */}
                </div>

                <div className="md:w-[50%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
                    <div className='w-full relative md:rounded-2xl
                    ss:rounded-2xl rounded-xl overflow-hidden'>
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

            {/* {isTrackModalOpen && (
                <TrackModal 
                    onClose={() => setIsTrackModalOpen(false)}
                />
            )} */}
        </section>
    );
};

export default SectionWrapper(ShipmentFinish, '');