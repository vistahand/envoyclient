import { useState } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
import { copy, track, } from '../assets';

const TrackShipment = () => {
    const [copyButtonText, setCopyButtonText] = useState('Copy'); 

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
        <section className='w-full flex min-h-[400px] mt-20'>
            <div className="w-full flex md:flex-row flex-col gap-14 
            md:justify-between">
                <div className="md:w-[50%] w-full flex flex-col gap-3">
                    <h1 className='text-primary font-bold md:text-[35px] 
                    ss:text-[33px] text-[27px] tracking-tight 
                    md:leading-[2.8rem] ss:leading-[2.6rem] leading-[2.1rem]'>
                        Your package is on its way!
                    </h1>

                    <div className="flex flex-col gap-5 w-full">
                        <div className='flex items-center justify-between rounded-xl 
                        bg-primary1 px-5 py-3.5 md:w-full ss:w-[70%]
                        w-full'>
                            <p className='text-primary md:text-[21px] ss:text-[21px] 
                            text-[17px] tracking-tight font-medium'>
                                Tracking ID: <span className='font-bold'>
                                001F5TG8XR4U
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

                        <div className="w-full">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2 leading-[20px]">
                                The package left the <span className='font-bold'>
                                Dublin Dispatch Station</span> on <span className='font-bold'>
                                Wednesday 30th October, 2024 </span>
                                and is currently on its way to <span className='font-bold'>
                                Lagos Sorting Hub.</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className='w-full md:mt-6 ss:mt-6 mt-4 gap-5
                    rounded-xl p-5 border-main7 border flex flex-col'>
                        <h2 className="font-bold md:text-[17px] ss:text-[18px] 
                        text-[15px] tracking-tight text-main4">
                            SHIPMENT TRAIL
                        </h2>
                    </div>
                </div>

                <div className="md:w-[50%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
                    <div className='w-full relative md:rounded-2xl
                    ss:rounded-2xl rounded-xl relative overflow-hidden'>
                        <img
                            src={track}
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
        </section>
    );
};

export default SectionWrapper(TrackShipment, '');