import React, { useRef } from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { HiOutlineArrowRight } from "react-icons/hi";
import { delOptions } from '../constants';
import { SectionWrapper } from '../hoc';
import { wing } from '../assets';
import { useGuestShipment } from '../context/GuestShipmentContext';
import { useNotifications } from '../context/NotificationContext';

const DeliveryCard = ({option, onNext, index, totalOptions}) => {

    return (
        <div className='w-full flex md:flex-row ss:flex-row flex-col'>
            <div className={`${index === totalOptions - 1
            ? 'w-full md:rounded-2xl ss:rounded-2xl rounded-xl bg-mainalt border border-main5 text-main2' 
            : 'md:w-[85%] ss:w-[85%] w-full md:rounded-l-2xl ss:rounded-l-2xl mobdel bg-primary text-white'} 
            flex md:flex-row ss:flex-row flex-col justify-between md:px-7 px-7 md:py-10 py-8 md:items-center ss:items-center
            md:gap-0 ss:gap-0 gap-4`}
            >
                <div className='flex flex-col gap-1'>
                    <p className='md:text-[13px] ss:text-[13px] text-[12px]
                    tracking-tight'>
                        Estimated Delivery Date
                    </p>

                    <h1 className='md:text-[20px] ss:text-[20px] text-[18px]
                    font-bold tracking-tight md:block ss:block hidden'>
                        {option.date} <span className='md:text-[19px] ml-2
                        ss:text-[19x] text-[16px] font-normal'>
                        | </span>
                        <span className='md:text-[19px] ml-2
                        ss:text-[19x] text-[16px] font-medium'>
                            2PM at the earliest
                        </span>
                    </h1>

                    <div className='flex flex-col tracking-tight 
                    ss:hidden md:hidden gap-1'>
                        <h1 className='text-[20px] font-bold'>
                            {option.date}
                        </h1>

                        <h2 className='text-[15px] font-medium'>
                            2PM at the earliest
                        </h2>
                    </div>

                    <p className={`md:text-[13px] ss:text-[13px] text-[11px]
                    tracking-tight ${index === totalOptions - 1
                    ? 'text-main4'
                    : ''}`
                    }>
                        Book a shipment before noon to schedule a pickup on the same day
                    </p>
                </div>

                <div className='flex flex-col gap-1'>
                    <p className='md:text-[13px] ss:text-[13px] text-[12px]
                    tracking-tight text-right'>
                        Excluding VAT
                    </p>

                    <h1 className={`md:text-[25px] ss:text-[25px] text-[28px] text-right
                    font-bold tracking-tight ${index === totalOptions - 1
                    ? 'text-primary'
                    : ''}`
                    }>
                        <span className='line-through'>N</span> {option.price}.00
                    </h1>

                    <div className='flex justify-end'>
                        <div className={`inline-flex items-center gap-2.5
                        cursor-pointer ${index === totalOptions - 1
                        ? 'text-primary grow7'
                        : 'grow6'}`
                        }
                        onClick={onNext}
                        >
                            <p className='md:text-[15px] ss:text-[15px] text-[14px]
                            tracking-tight font-medium'>
                                Book Now
                            </p>

                            <HiOutlineArrowRight className='text-[13px] font-medium'/>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${index === totalOptions - 1 
            ? 'hidden' 
            : 'flex' }
            md:w-[15%] ss:w-[15%] w-full flex-col px-2 md:py-10 ss:py-8 py-3.5 items-center 
            justify-center gap-0.5 bg-secondary md:rounded-r-2xl ss:rounded-r-2xl 
            mobdel2 relative overflow-hidden text-white mobdelheight`}>
                <img
                    src={wing}
                    alt='wing'
                    className='absolute bottom-0 mobimg md:w-[10rem] ss:w-[9rem] w-[6.2rem] h-auto]'
                />
                
                <div className='z-10 flex flex-col items-center'>
                    <h1 className='md:text-[20px] ss:text-[19px] text-[16px]
                    font-bold tracking-tight'>
                        QuickWing
                    </h1>

                    <p className='md:text-[13px] ss:text-[13px] text-[12px]
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
    const { updateDeliveryOptions, loading, error, shipmentData } = useGuestShipment();
    const { addNotification } = useNotifications();

    const today = new Date().toISOString().split("T")[0];

    const formik = useFormik({
        initialValues: {
           date: today,
        },

        validationSchema: Yup.object({
            date: Yup.string().required('Date is required.')
        }),

        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (!shipmentData?.id) {
                    throw new Error('No shipment ID found. Please try again from step 1.');
                }
                
                const option = delOptions[0]; // First option is QuickWing
                const deliveryData = {
                    date: values.date,
                    service: 'QuickWing',
                    estimatedDeliveryDate: option.date,
                    estimatedDeliveryTime: '14:00', // 2PM
                    price: parseFloat(option.price.replace(',', '')),
                };

                await updateDeliveryOptions(deliveryData);
                onNext(currentTab);
            } catch (err) {
                addNotification({
                    type: 'error',
                    title: 'Error',
                    message: err.message
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

   
    const handlePrevious = () => {
        onPrev(currentTab);
    };


  return (
    <section className='w-full flex md:min-h-[900px] ss:min-h-[820px]
    min-h-[1400px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col gap-1.5 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center'>
                    Check out your delivery options!
                </h1>

                <p className='text-main4 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight text-center'>
                    Select your preferred delivery method from the displayed options
                </p>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[85%] w-full md:mt-12 ss:mt-10 mt-8'>
                <div className='flex flex-col w-full items-center gap-8'>
                    <div className='w-full'>
                        <div className="inline-flex flex-col relative
                        md:w-[25%] ss:w-[25%] w-[50%]">
                            <input
                                type="date"
                                name="date"
                                placeholder=''
                                value={formik.values.date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                peer outline text-black md:rounded-lg rounded-md 
                                md:text-[15px] ss:text-[14px] text-[13px] outline-[1px]
                                bg-transparent w-full focus:outline-primary cursor-pointer
                                ${formik.touched.date && formik.errors.date ? 'outline-mainRed' : 'outline-main6'}
                                `}
                            />

                            <label
                            htmlFor="date"
                            className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                            md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                            md:text-[15px] ss:text-[14px] text-[13px] bg-white peer-focus:px-2
                            duration-300 peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                            ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                            ${formik.values.date ? 'z-10 px-2' : ''}
                            `}
                            >
                                Shipment Date
                            </label>

                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                {formik.touched.date && formik.errors.date}
                            </p>
                        </div>
                    </div>

                    <div className='w-full flex flex-col gap-6'>
                        {delOptions.map((option, index) => (
                            <DeliveryCard
                                key={index}
                                index={index}
                                option={option}
                                onNext={async () => {
                                    if (formik.isValid) {
                                        await formik.submitForm();
                                    } else {
                                        addNotification({
                                            type: 'error',
                                            title: 'Error',
                                            message: 'Please select a valid shipment date'
                                        });
                                    }
                                }}
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
