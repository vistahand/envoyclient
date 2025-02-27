import { useState } from 'react';
import { SectionWrapper } from "../hoc";
import { useNavigate } from 'react-router-dom';
// import { motion } from "framer-motion";
import { TbCircleCheckFilled } from "react-icons/tb";
import { copy, track } from '../assets';

const TrackShipment = () => {
    const [copyButtonText, setCopyButtonText] = useState('Copy');
    const navigate = useNavigate();

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

                        <div className="w-full">
                            <p className="md:text-[16px] ss:text-[16px] text-[15px]  
                            tracking-tight font-medium text-main2 leading-[23px]">
                                The package left the <span className='font-extrabold'>
                                Dublin Dispatch Station</span> on <span className='font-extrabold'>
                                Wednesday 30th October, 2024 </span>
                                and is currently on its way to <span className='font-extrabold'>
                                Lagos Sorting Hub.</span>
                            </p>
                        </div>

                        <div>
                            <p className="md:text-[14px] ss:text-[14px] text-[13px] tracking-tight font-semibold 
                            text-primary underline hover:text-secondary cursor-pointer 
                            inline-flex navsmooth"
                            onClick={() => {
                                navigate('/user/shipments/details');
                            }}
                            > 
                                See full package details
                            </p>
                        </div>
                    </div>
                    
                    <div className='w-full md:mt-6 ss:mt-6 mt-4 gap-5
                    rounded-xl p-5 border-main7 border flex flex-col'>
                        <h2 className="font-bold md:text-[17px] ss:text-[18px] 
                        text-[16px] tracking-tight text-main4">
                            SHIPMENT TRAIL
                        </h2>

                        <div className='flex flex-col gap-4 w-full'>
                            <div className='flex gap-4 items-center'>
                                <div className='md:w-[4.5rem] w-[4rem] 
                                h-auto bg-primary1 rounded-full'>
                                    <TbCircleCheckFilled 
                                        className='md:w-[4.5rem] w-[4rem] 
                                        h-auto text-primary md:p-4 p-3'
                                    />
                                </div>

                                <div className='flex flex-col gap-0.5'>
                                    <h3 className="md:text-[17px] ss:text-[17px] 
                                    text-[15px] tracking-tight font-bold 
                                    text-main2 leading-[20px]">
                                        Shipment Confirmed
                                    </h3>

                                    <div className='flex items-center gap-3.5'>
                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] text-[13px] tracking-tight 
                                        text-main4">
                                            Monday 28th October, 2024<span className='md:hidden ss:hidden'>, 11:25AM</span>
                                        </p>

                                        <div className='h-[3px] w-[3px] bg-main4
                                        hidden md:flex ss:flex rounded-full'/>

                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] tracking-tight 
                                        text-main4 hidden md:flex ss:flex">
                                            11:25AM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='md:h-[3rem] ss:h-[3rem] h-[2rem]
                                w-[2px] bg-primary md:ml-[2.2rem] ss:ml-[2rem]
                                ml-[1.95rem]'
                            />

                            <div className='flex gap-4 items-center'>
                                <div className='md:w-[4.5rem] w-[4rem] 
                                h-auto bg-primary1 rounded-full'>
                                    <TbCircleCheckFilled 
                                        className='md:w-[4.5rem] w-[4rem] 
                                        h-auto text-primary md:p-4 p-3'
                                    />
                                </div>

                                <div className='flex flex-col gap-0.5'>
                                    <h3 className="md:text-[17px] ss:text-[17px] 
                                    text-[15px] tracking-tight font-bold 
                                    text-main2 leading-[20px]">
                                        Package Dropped off at Pickup Location
                                    </h3>

                                    <div className='flex items-center gap-3.5'>
                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] text-[13px] tracking-tight 
                                        text-main4">
                                            Tuesday 29th October, 2024<span className='md:hidden ss:hidden'>, 11:03AM</span>
                                        </p>

                                        <div className='h-[3px] w-[3px] bg-main4 hidden
                                        md:flex ss:flex'/>

                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] tracking-tight 
                                        text-main4 hidden md:flex ss:flex">
                                            11:25AM
                                        </p>
                                    </div>

                                    <p className="font-medium md:text-[14px] 
                                    ss:text-[14px] text-[13px] tracking-tight 
                                    text-main4">
                                        Package dropped at the Dublin 248 
                                        Metropolis Pickup Station
                                    </p>
                                </div>
                            </div>

                            <div className='md:h-[3rem] ss:h-[3rem] h-[2rem]
                                w-[2px] bg-primary md:ml-[2.2rem] ss:ml-[2rem]
                                ml-[1.95rem]'
                            />

                            <div className='flex gap-4 items-center'>
                                <div className='md:w-[4.5rem] w-[4rem] 
                                h-auto bg-primary1 rounded-full'>
                                    <TbCircleCheckFilled 
                                        className='md:w-[4.5rem] w-[4rem] 
                                        h-auto text-primary md:p-4 p-3'
                                    />
                                </div>

                                <div className='flex flex-col gap-0.5'>
                                    <h3 className="md:text-[17px] ss:text-[17px] 
                                    text-[15px] tracking-tight font-bold 
                                    text-main2 leading-[20px]">
                                        Package Shipped
                                    </h3>

                                    <div className='flex items-center gap-3.5'>
                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] text-[13px] tracking-tight 
                                        text-main4">
                                            Wednesday 30th October, 2024<span className='md:hidden ss:hidden'>, 04:48PM</span>
                                        </p>

                                        <div className='h-[3px] w-[3px] bg-main4 hidden 
                                        md:flex ss:flex'/>

                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] tracking-tight 
                                        text-main4 hidden md:flex ss:flex">
                                            04:48PM
                                        </p>
                                    </div>

                                    <p className="font-medium md:text-[14px] 
                                    ss:text-[14px] text-[13px] tracking-tight 
                                    text-main4">
                                        Shipment leaves Dublin Dispatch Station, 
                                        Ireland for Lagos, Nigeria
                                    </p>
                                </div>
                            </div>

                            <div className='md:h-[3rem] ss:h-[3rem] h-[2rem]
                                w-[2px] bg-primary md:ml-[2.2rem] ss:ml-[2rem]
                                ml-[1.95rem]'
                            />

                            <div className='flex gap-4 items-center'>
                                <div className='md:w-[4.5rem] w-[4rem] 
                                md:h-[4.5rem] h-[4rem] bg-mainalt rounded-full 
                                items-center justify-center flex'>
                                <div 
                                    className='md:w-[2.2rem] w-[2rem] 
                                    md:h-[2.2rem] h-[2rem] bg-main7 
                                    md:p-4 p-3 rounded-full'
                                />
                                </div>

                                <div className='flex flex-col gap-0.5'>
                                    <h3 className="md:text-[17px] ss:text-[17px] 
                                    text-[15px] tracking-tight font-bold 
                                    text-main2 leading-[20px]">
                                        Shipment Arrival
                                    </h3>

                                    <div className='flex'>
                                        <p className="font-medium md:text-[14px] 
                                        ss:text-[14px] text-[13px] tracking-tight 
                                        text-main4">
                                            Est.: Saturday 2nd November, 2024
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-[45%] ss:w-[70%] md:mb-0 ss:mb-0 mb-8">
                    <div className='w-full relative md:rounded-2xl
                    ss:rounded-2xl rounded-xl overflow-hidden'>
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