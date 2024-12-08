import { useState, useRef, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc';


const InsuranceForm = ({ onNext, onPrev, selectedTab, senderTab, setCurrentStep }) => {
    const formRef = useRef();
    const currentTab = selectedTab;
    // const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            insurance: '',
            assistance: false,
        },
        validationSchema: Yup.object().shape({
            insurance: Yup.string(),
            assistance: Yup.bool().optional(),
        }),
        
        onSubmit: (values) => {
           onNext(currentTab, senderTab );
        },
    });

    const handlePrevious = () => {
        onPrev(currentTab, senderTab);
    };

    const handleCancelShipment = () => {
        setCurrentStep(1); 
    };

    const insuranceOptions = [
        { 
            value: "lorem", 
            label: "Lorem Ipsum" ,
        },
        { 
            value: "lorem", 
            label: "Lorem Ipsum",
        },
    ];

    const CustomSelect = ({ name, value, onChange, onBlur, options, placeholder, error }) => {
        const [showOptions, setShowOptions] = useState(false);
        const [selectedValue, setSelectedValue] = useState(value);
        const selectRef = useRef(null)

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (selectRef.current && !selectRef.current.contains(event.target)) {
                    setShowOptions(false);
                }
            };
        
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown",   
         handleClickOutside);
        
        }, []);

        const handleChange = (optionValue) => {
            setSelectedValue(optionValue);
            onChange({ target: { name, value: optionValue } });
            setTimeout(() => onBlur({ target: { name } }), 0); 
            setShowOptions(false);
        };
      
        return (
            <div className="relative" ref={selectRef}>
                <div className={`md:py-3.5 py-3 md:px-3.5 px-3 outline 
                md:rounded-lg rounded-md cursor-pointer md:text-[14px] 
                ss:text-[14px] text-[12px] focus:outline-primary
                bg-transparent w-full custom-select outline-[1px] 
                ${error ? "outline-mainRed" : "outline-main6"}
                ${value === "" ? "text-main6" : "text-black"}
                flex items-center justify-between`}
                onClick={() => setShowOptions(!showOptions)}
                tabIndex={0}
                >
                    {selectedValue ? (
                        <>
                            {options.find((option) => option.value === value).label}
                        </>
                    ) : (
                        <span className="text-main6">{placeholder}</span>
                    )}
                </div>

                {showOptions && (
                    <div className="absolute z-20 w-full bg-white rounded-md mt-2 
                    shadow-[0px_5px_15px_rgba(0,0,0,0.25)]">
                        {options.map((option, optionIndex) => (
                            <div key={optionIndex}
                            className={`md:py-3.5 py-3 md:px-3.5 px-3 cursor-pointer 
                            hover:bg-primary flex items-center hover:text-white 
                            md:text-[14px] ss:text-[14px] text-[12px] text-main2 font-medium
                            ${optionIndex === 0 ? 'rounded-t-md' : optionIndex === options.length - 1 ? 'rounded-b-md' : ''}
                            `}
                            onClick={() => handleChange(option.value)}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

  return (
    <section className='w-full flex md:min-h-[500px] ss:min-h-[450px]
    min-h-[550px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col gap-1.5 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center'>
                    Almost there...
                </h1>

                <p className='text-main6 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.2rem] tracking-tight font-medium text-center'>
                    Select some add-ons you might want for your shipment
                </p>
            </div>

            <div className='md:w-[50%] ss:w-[70%] w-full md:mt-10 ss:mt-10 mt-8'>
                <h1 className='flex text-main2 font-bold md:text-[30px] 
                ss:text-[25px] text-[22px] tracking-tighter'>
                    Insurance Services
                </h1>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[50%] ss:w-[70%] w-full md:mt-6 ss:mt-6 mt-4'>
                <div className='flex flex-col w-full items-center gap-8'>
                    <div className='flex flex-col w-full items-center gap-4'>
                        <div className='w-full flex flex-col gap-4'>
                            <div className="relative flex flex-col">
                                <div className='relative flex items-center'>
                                    <div className='w-full'>
                                        <CustomSelect 
                                            name="insurance"
                                            value={formik.values.insurance}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            options={insuranceOptions}
                                            placeholder="Select an insurance covering (optional)"
                                            error={
                                                formik.touched.insurance && formik.errors.insurance
                                            }
                                        />
                                    </div>

                                    <div className='absolute md:right-3.5 right-3'>
                                        <TiArrowSortedDown 
                                            className='text-main md:text-[16px]
                                            ss:text-[18px] text-[16px]'
                                        />
                                    </div>
                                </div>

                                <p className="text-mainRed md:text-[12px] flex justify-end
                                ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                    {formik.touched.insurance && formik.errors.insurance}
                                </p>
                            </div>

                            <div className='flex gap-3 md:w-[80%] ss:w-[80%] items-center'>
                                <input
                                    type='checkbox'
                                    className='cursor-pointer checkbox'
                                    name='assistance'
                                    checked={formik.values.assistance}
                                    onChange={formik.handleChange}
                                />
                                
                                <p className='text-main2 md:text-[16px]
                                ss:text-[16px] text-[15px] font-medium'>
                                    Require assistance with customs documents
                                    (International Shipments only)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex w-full items-center 
                    justify-center md:gap-5 ss:gap-5 gap-3 md:flex-row 
                    ss:flex-row flex-col">
                        <button
                        className='bg-none text-[13px] py-3.5 px-14
                        text-primary rounded-full grow2 cursor-pointer
                        items-center justify-center border border-primary
                        md:flex ss:flex hidden'
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
                                Pay now
                            </p>
                            
                            <HiOutlineArrowRight className='text-[14px]'/>
                        </button>

                        <button
                        className='bg-none text-[13px] py-3.5 px-14
                        text-primary rounded-full grow2 cursor-pointer
                        items-center justify-center border border-primary
                        md:hidden ss:hidden flex mobbut'
                        onClick={handlePrevious}
                        >
                            <p className='font-semibold'>
                                Go back
                            </p>
                        </button>
                    </div>

                    <p className='text-realRed md:text-[16px] ss:text-[16px] 
                    text-[15px] font-semibold cursor-pointer grow2'
                    onClick={handleCancelShipment}>
                        Cancel Shipment
                    </p>
                </div>
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(InsuranceForm, '');