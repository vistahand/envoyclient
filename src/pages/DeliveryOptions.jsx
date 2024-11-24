import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
// import { useNavigate } from 'react-router-dom';
import { delOptions } from '../constants';
import { SectionWrapper } from '../hoc';

const DeliveryCard = () => {
    return (
        <div>
            Delivery
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
            onNext(currentTab);
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
            className='md:w-[70%] w-full md:mt-5 ss:mt-4 mt-3'>
                <div className='flex flex-col w-full items-center gap-8'>
                    <div className='w-full flex flex-col gap-5'>
                        {delOptions.map((option, index) => (
                            <DeliveryCard
                                key={index}
                                {...option}
                            />
                        ))}
                    </div>

                    <div className="mt-2 flex w-full items-center 
                    justify-center md:gap-5 ss:gap-5 gap-3 md:flex-row 
                    ss:flex-row flex-col">
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

                        <button type='submit'
                        className='bg-primary text-[13px] py-3.5 px-14 flex
                        text-white rounded-full grow4 cursor-pointer
                        items-center justify-center gap-3 mobbut'
                        >
                            <p>
                                Next
                            </p>
                            
                            <HiOutlineArrowRight className='text-[14px]'/>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(DeliveryOptions, '');