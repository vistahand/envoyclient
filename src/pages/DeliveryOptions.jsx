import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
// import { useNavigate } from 'react-router-dom';
import { delOptions } from '../constants';
import { SectionWrapper } from '../hoc';

const DeliveryCard = ({price, date, onNext, index}) => {

    return (
        <div className='w-full flex text-white'>
            <div className='w-[85%] flex justify-between px-7 py-10 items-center
            bg-primary rounded-l-2xl'>
                <div className='flex flex-col gap-1'>
                    <p className='md:text-[12px] ss:text-[12px] text-[11px]
                    tracking-tight'>
                        Estimated Delivery Date
                    </p>

                    <h1 className='md:text-[20px] ss:text-[20px] text-[18px]
                    font-bold tracking-tight'>
                        {date} <span className='md:text-[17px] ml-2
                        ss:text-[17x] text-[15px] font-normal'>
                        | </span>
                        <span className='md:text-[17px] ml-2
                        ss:text-[17x] text-[15px] font-normal'>
                            2PM at the earliest
                        </span>
                    </h1>

                    <p className='md:text-[12px] ss:text-[12px] text-[11px]
                    tracking-tight'>
                        Book a shipment before noon to schedule a pickup on the same day
                    </p>
                </div>

                <div className='flex flex-col gap-1'>
                    <p className='md:text-[12px] ss:text-[12px] text-[11px]
                    tracking-tight'>
                        Excluding VAT
                    </p>

                    <h1 className='md:text-[25px] ss:text-[24px] text-[20px]
                    font-bold tracking-tight'>
                        <span className='line-through'>N</span> {price}.00
                    </h1>

                    <div className='flex items-center gap-2 grow4 cursor-pointer'
                    onClick={onNext}
                    >
                        <p className='md:text-[14px] ss:text-[14px] text-[12px]
                        tracking-tight'>
                            Book Now
                        </p>

                        <HiOutlineArrowRight className='text-[12px]'/>
                    </div>
                </div>
            </div>

            <div className='w-[15%] flex flex-col px-2 py-10 items-center 
            justify-center gap-0.5 bg-secondary rounded-r-2xl'>
                <h1 className='md:text-[20px] ss:text-[19px] text-[16px]
                font-bold tracking-tight'>
                    QuickWing
                </h1>

                <p className='md:text-[12px] ss:text-[12px] text-[11px]
                tracking-tight text-center'>
                    Enjoy fast, priority shipping
                </p>
            </div>
        </div>
    );
};

const DeliveryOptions = ({ onPrev, onNext, selectedTab}) => {
    const formRef = useRef();
    const currentTab = selectedTab;
    // const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
           
        },
        validateOnMount: true,
        onSubmit: (values) => {
            onNext(currentTab)
        },
    });

   
    const handlePrevious = () => {
        onPrev(currentTab);
    };


  return (
    <section className='w-full flex md:min-h-[850px] ss:min-h-[820px]
    min-h-[1080px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col md:gap-1.5 gap-1 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem]'>
                    Check out your delivery options!
                </h1>

                <p className='text-main4 md:text-[17px] ss:text-[16px] 
                text-[14px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight'>
                    Select your preferred delivery method from the displayed options
                </p>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[85%] w-full md:mt-12 ss:mt-10 mt-8'>
                <div className='flex flex-col w-full items-center gap-8'>
                    <div className='w-full flex flex-col gap-6'>
                        {delOptions.map((option, index) => (
                            <DeliveryCard
                                key={index}
                                {...option}
                                onNext={() => onNext(currentTab)}
                            />
                        ))}
                    </div>

                    <div className="mt-3 flex w-full items-center 
                    justify-center">
                        <button
                        className='bg-none text-[13px] py-3.5 px-14
                        text-primary rounded-full grow2 cursor-pointer
                        items-center justify-center border border-primary'
                        onClick={handlePrevious}
                        >
                            <p className='font-semibold'>
                                Go back
                            </p>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(DeliveryOptions, '');