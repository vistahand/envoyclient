import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
// import { useNavigate } from 'react-router-dom';
import { delOptions } from '../constants';
import { SectionWrapper } from '../hoc';
import { wing } from '../assets';

const DeliveryCard = ({option, onNext, index, totalOptions}) => {

    return (
        <div className='w-full flex'>
            <div className={`${index === totalOptions - 1
            ? 'w-full rounded-2xl bg-mainalt border border-main5 text-main2' 
            : 'w-[85%] rounded-l-2xl bg-primary text-white'} 
            flex justify-between px-7 py-10 items-center`}
            >
                <div className='flex flex-col gap-1'>
                    <p className='md:text-[12px] ss:text-[12px] text-[11px]
                    tracking-tight'>
                        Estimated Delivery Date
                    </p>

                    <h1 className='md:text-[20px] ss:text-[20px] text-[18px]
                    font-bold tracking-tight'>
                        {option.date} <span className='md:text-[19px] ml-2
                        ss:text-[19x] text-[16px] font-normal'>
                        | </span>
                        <span className='md:text-[19px] ml-2
                        ss:text-[19x] text-[16px] font-medium'>
                            2PM at the earliest
                        </span>
                    </h1>

                    <p className={`md:text-[12px] ss:text-[12px] text-[11px]
                    tracking-tight ${index === totalOptions - 1
                    ? 'text-main4'
                    : ''}`
                    }>
                        Book a shipment before noon to schedule a pickup on the same day
                    </p>
                </div>

                <div className='flex flex-col gap-1'>
                    <p className='md:text-[12px] ss:text-[12px] text-[11px]
                    tracking-tight text-right'>
                        Excluding VAT
                    </p>

                    <h1 className={`md:text-[25px] ss:text-[24px] text-[20px]
                    font-bold tracking-tight ${index === totalOptions - 1
                    ? 'text-primary'
                    : ''}`
                    }>
                        <span className='line-through'>N</span> {option.price}.00
                    </h1>

                    <div className={`flex items-center gap-2.5 grow6 justify-end
                    cursor-pointer ${index === totalOptions - 1
                    ? 'text-primary'
                    : ''}`
                    }
                    onClick={onNext}
                    >
                        <p className='md:text-[14px] ss:text-[14px] text-[12px]
                        tracking-tight font-medium'>
                            Book Now
                        </p>

                        <HiOutlineArrowRight className='text-[13px] font-medium'/>
                    </div>
                </div>
            </div>

            <div className={`${index === totalOptions - 1 
            ? 'hidden' 
            : 'flex' }
            w-[15%] flex-col px-2 py-10 items-center 
            justify-center gap-0.5 bg-secondary rounded-r-2xl relative
            overflow-hidden text-white`}>
                <img
                    src={wing}
                    alt='wing'
                    className='absolute bottom-0 w-[10rem] h-auto]'
                />
                
                <div className='z-10 flex flex-col items-center'>
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
                                index={index}
                                option={option}
                                onNext={() => onNext(currentTab)}
                                totalOptions={delOptions.length}
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