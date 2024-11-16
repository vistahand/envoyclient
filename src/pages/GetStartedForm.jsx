import { useState, useRef } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc'
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';


const GetStartedForm = () => {
    const formRef = useRef();
    const [selectedTab, setSelectedTab] = useState('international');
    // const navigate = useNavigate();

    const internationalSchema = Yup.object().shape({
        countryFrom: Yup.string().required("Sender's country is required"),
        cityFrom: Yup.string().required("Sender's city is required"),
        countryTo: Yup.string().required('Recipient country is required'),
        cityTo: Yup.string().required('Recipient city is required')
    });

    const localSchema = Yup.object().shape({
        countryFrom: Yup.string().required("Sender's country is required"),
        cityFrom: Yup.string().required("Sender's city is required"),
        cityTo: Yup.string().required('Recipient city is required')
    });

    const formik = useFormik({
        initialValues: {
            countryFrom: '',
            cityFrom: '',
            countryTo: '',
            cityTo: '',
        },
        validationSchema: selectedTab === 'international' ? internationalSchema : localSchema,
        validateOnMount: true,
        onSubmit: (values) => {
           
        },
    });

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        formik.resetForm();
    };


  return (
    <section className='w-full flex md:min-h-[600px] ss:min-h-[550px]
    min-h-[680px]'>
        <div className='flex items-center w-full flex-col md:gap-8 
        ss:gap-6 gap-5'>
            <div className='w-full flex flex-col gap-1.5 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem]'>
                    Shall we get started?
                </h1>

                <p className='text-main4 md:text-[17px] ss:text-[16px] 
                text-[14px] md:max-w-[700px] ss:max-w-[400px] md:leading-[1.4rem] 
                ss:leading-[1.4rem] leading-[1.3rem] tracking-tight'>
                    Where do you want us to go?
                </p>
            </div>

            <div className='flex justify-center items-center md:gap-3
            ss:gap-3 gap-2.5 md:w-[43%] ss:w-[70%] w-full mt-3'>
                <div className={`py-3.5 px-4 flex items-center mobship
                ${selectedTab === 'international'
                ? 'bg-primary text-white'
                : 'border-main5 border-[1px] text-primary grow4'
                }  rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
                onClick={() => handleTabChange('international')}
                >
                    <InternationalIcon 
                        className={`w-[2.3rem] h-auto object-contain
                            ${selectedTab === 'international' 
                            ? 'stroke-white' 
                            : 'stroke-primary'}
                        `}
                    />

                    <div className='flex flex-col'>
                        <h2 className='md:text-[13px] ss:text-[13px] 
                        text-[12px] font-bold'
                        >
                            International Shipping
                        </h2>

                        <p className={`${selectedTab === 'local'
                            ? 'text-main4'
                            : 'font-light'
                            } md:text-[11px] ss:text-[11px] text-[10px]
                        `}
                        >
                            Ship between countries
                        </p>
                    </div>
                </div>
                
                <div className={`py-3.5 px-4 flex items-center mobship
                ${selectedTab === 'local'
                ? 'bg-primary text-white'
                : 'border-main5 border-[1px] text-primary grow4'
                }  rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
                onClick={() => handleTabChange('local')}
                >
                    <LocalIcon 
                        className={`w-[2.3rem] h-auto object-contain
                            ${selectedTab === 'local' 
                            ? 'stroke-white' 
                            : 'stroke-primary'}
                        `}
                    />

                    <div className='flex flex-col'>
                        <h2 className='md:text-[13px] ss:text-[13px] 
                        text-[12px] font-bold'
                        >
                            Local Shipping
                        </h2>

                        <p className={`${selectedTab === 'international'
                            ? 'text-main4'
                            : 'font-light'
                            } md:text-[11px] ss:text-[11px] text-[10px]
                        `}
                        >
                            Ship within your country
                        </p>
                    </div>
                </div>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[80%] w-full md:mt-0 ss:mt-0 mt-2'>
                {selectedTab === 'international' ? (
                    <div className='flex flex-col w-full items-center gap-3'>
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                I am shipping from
                            </h2>

                            <div className='grid md:grid-cols-2 ss:grid-cols-2
                            gap-3.5 mt-3.5'>
                                <div className="relative flex flex-col">
                                    <div className='relative flex items-center'>
                                        <select
                                            type="text"
                                            name="countryFrom"
                                            value={formik.values.countryFrom}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 ss:py-3 py-3 md:px-3.5 
                                            ss:px-3.5 px-3 border border-main6 
                                            text-main6 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[13px]
                                            ss:text-[14px] text-[12px] focus:outline-none
                                            bg-transparent w-full custom-select
                                            ${formik.touched.countryFrom && formik.errors.countryFrom ? 'border-mainRed' : 'border-main6'}`}
                                        >
                                            <option value="" disabled hidden>Select your country</option>
                                        </select>
                                        <div className='absolute md:right-3.5 
                                        ss:right-3.5 right-3'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.countryFrom && formik.errors.countryFrom}
                                    </p>

                                    <p className='text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden 
                                    ss:hidden flex'>
                                        This is your billing country/region
                                    </p>
                                </div>

                                <div className="relative z-10">
                                    <input
                                        type="text"
                                        name="cityFrom"
                                        placeholder=' '
                                        value={formik.values.cityFrom}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='md:py-3.5 ss:py-3 py-3 md:px-3.5 
                                        peer ss:px-3.5 px-3 border border-main6
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px] focus:ring-0
                                        bg-transparent w-full focus:outline-none'
                                    />

                                    <label
                                    htmlFor="cityFrom"
                                    className={`absolute left-3.5 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[13px] ss:text-[14px] text-[12px] bg-white
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFrom ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town (optional)
                                    </label>
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden 
                            ss:flex md:flex'>
                                This is your billing country/region
                            </p>
                        </div>
                        
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                To
                            </h2>

                            <div className='grid md:grid-cols-2 ss:grid-cols-2
                            gap-3.5 mt-3.5'>
                                <div className="relative flex flex-col">
                                    <div className='relative flex items-center'>
                                        <select
                                            type="text"
                                            name="countryTo"
                                            value={formik.values.countryTo}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 ss:py-3 py-3 md:px-3.5 
                                            ss:px-3.5 px-3 border border-main6 
                                            text-main6 md:rounded-lg rounded-md 
                                            cursor-pointer md:text-[13px]
                                            ss:text-[14px] text-[12px] focus:outline-none
                                            bg-transparent w-full custom-select
                                            ${formik.touched.countryTo && formik.errors.countryTo ? 'border-mainRed' : 'border-main6'}`}
                                        >
                                           <option value="" disabled hidden>Select your country</option>
                                        </select>
                                        <div className='absolute md:right-3.5 
                                        ss:right-3.5 right-3'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.countryTo && formik.errors.countryTo}
                                    </p>

                                    <p className='text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden
                                    ss:hidden flex'>
                                        This is the country/region we'll be shipping to
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cityTo"
                                        placeholder='Enter destination city/town (optional)'
                                        value={formik.values.cityTo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='md:py-3.5 ss:py-3 py-3 md:px-3.5
                                        ss:px-3.5 px-3 border border-main6 
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px] focus:outline-none
                                        bg-transparent w-full placeholder:text-main6'
                                    />
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden
                            ss:flex md:flex'>
                                This is the country/region we'll be shipping to
                            </p>
                        </div>

                        <div className="mt-6 mobnext">
                           <a href='/createshipment'
                            className='bg-primary text-[13px] py-3.5 px-14 flex
                            text-white rounded-full grow4 cursor-pointer
                            items-center justify-center gap-3'
                            >
                                <p>
                                    Next
                                </p>
                                
                                <HiOutlineArrowRight className='text-[14px]'/>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col w-full items-center gap-3'>
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                I am shipping from
                            </h2>

                            <div className='grid md:grid-cols-2 ss:grid-cols-2 
                            gap-3.5 mt-3.5'>
                                <div className="relative flex flex-col">
                                    <div className='relative flex items-center'>
                                        <select
                                            type="text"
                                            name="countryFrom"
                                            value={formik.values.countryFrom}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 ss:py-3 py-3 md:px-3.5 
                                            ss:px-3.5 px-3 border 
                                            text-main6 md:rounded-lg rounded-md 
                                            cursor-pointer md:text-[13px]
                                            ss:text-[14px] text-[12px] focus:outline-none
                                            bg-transparent w-full custom-select
                                            ${formik.touched.countryFrom && formik.errors.countryFrom ? 'border-mainRed' : 'border-main6'}`}
                                        >
                                            <option value="" disabled hidden>Select your country</option>
                                        </select>
                                        <div className='absolute md:right-3.5 
                                        ss:right-3.5 right-3'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.countryFrom && formik.errors.countryFrom}
                                    </p>

                                    <p className='text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden 
                                    ss:hidden flex'>
                                        This is your billing country/region
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cityFrom"
                                        placeholder='Enter your city/town'
                                        value={formik.values.cityFrom}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 ss:py-3 py-3 md:px-3.5 
                                        ss:px-3.5 px-3 border
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px] focus:outline-none
                                        bg-transparent w-full placeholder:text-main6
                                        ${formik.touched.cityFrom && formik.errors.cityFrom ? 'border-mainRed' : 'border-main6'}`}
                                    />
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFrom && formik.errors.cityFrom}
                                    </p>
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden 
                            ss:flex md:flex'>
                                This is your billing country/region
                            </p>
                        </div>
                        
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                To
                            </h2>

                            <div className='grid md:grid-cols-2 ss:grid-cols-2 
                            gap-3.5 mt-3.5'>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="cityTo"
                                        placeholder='Enter destination city/town'
                                        value={formik.values.cityTo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 ss:py-3 py-3 md:px-3.5
                                        ss:px-3.5 px-3 border
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px] focus:outline-none
                                        bg-transparent w-full placeholder:text-main6
                                        ${formik.touched.cityTo && formik.errors.cityTo ? 'border-mainRed' : 'border-main6'}`}
                                    />
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityTo && formik.errors.cityTo}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 mobnext">
                           <a href='/createshipment'
                            className='bg-primary text-[13px] py-3.5 px-14 flex
                            text-white rounded-full grow4 cursor-pointer 
                            items-center justify-center gap-3'
                            >
                                <p>
                                    Next
                                </p>
                                
                                <HiOutlineArrowRight className='text-[14px]'/>
                            </a>
                        </div>
                    </div>
                )}
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(GetStartedForm, '');