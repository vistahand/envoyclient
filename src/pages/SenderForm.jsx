import { useState, useRef, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import { PiWarningCircle } from "react-icons/pi";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc';


const SenderForm = ({ onNext, onPrev, selectedTab, senderTab }) => {
    const formRef = useRef();
    const currentTab = selectedTab;
    const [sendTab, setSendTab] = useState(senderTab);
    const [countries, setCountries] = useState([]);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');

                const data = await response.json();
                const sortedCountries = [...data].sort((a, b) => 
                    a.name.common.localeCompare(b.name.common)
                );

                setCountries(sortedCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);


    const individualSchema = Yup.object().shape({
        countryFromInt: Yup.string().required("Sender's country is required"),
        // cityFromInt: Yup.string().required("Sender's city is required"),
        countryTo: Yup.string().required('Recipient country is required'),
        // cityToInt: Yup.string().required('Recipient city is required')
    });

    const businessSchema = Yup.object().shape({
        countryFromLoc: Yup.string().required("Sender's country is required"),
        cityFromLoc: Yup.string().required("Sender's city is required"),
        cityToLoc: Yup.string().required('Recipient city is required')
    });

    const formik = useFormik({
        initialValues: {
            countryFromInt: 'IE',
            countryFromLoc: 'NG',
            cityFromInt: '',
            cityFromLoc: '',
            countryTo: 'NG',
            cityToInt: '',
            cityToLoc: '',
        },
        validationSchema: sendTab === 'individual' ? individualSchema : businessSchema,
        validateOnMount: true,
        onSubmit: (values) => {
           onNext(sendTab);
        },
    });

    const handleTabChange = (tab) => {
        setSendTab(tab);
        formik.resetForm();
    };

    const handlePrevious = () => {
        onPrev(currentTab);
    };


  return (
    <section className='w-full flex md:min-h-[600px] ss:min-h-[550px]
    min-h-[680px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col gap-3 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem]'>
                    Let's get to know a little about you
                </h1>

                <div className='flex items-center gap-2 rounded-full 
                bg-primary1 px-6 py-3 cursor-pointer grow3'>
                    <PiWarningCircle className='md:text-[24px] ss:text-[24px] 
                    text-[32px] text-primary'/>

                    <p className='text-primary md:text-[15px] ss:text-[15px] 
                    text-[13px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                    leading-[1.2rem] tracking-tight font-medium'>
                        If you have an account with Envoy Angel, you can login by clicking here
                    </p>
                </div>
            </div>

            <div className='flex items-center md:gap-3 ss:gap-3 gap-2.5 
            md:w-[85%] w-full md:mt-12 ss:mt-10 mt-8'>
                <div className='flex flex-col w-full gap-3 items-center'>
                    <div className='w-full'>
                        <div className='inline-flex bg-mainalt rounded-lg p-1'>
                            <div className={`py-3.5 px-4 flex items-center mobship
                            ${sendTab === 'individual'
                            ? 'bg-primary text-white'
                            : 'text-primary grow2'
                            }  cursor-pointer mobbut rounded-[4px] mobship2
                            transition-all duration-300 ease-in-out`}
                            onClick={() => handleTabChange('individual')}
                            >
                                <h2 className={`md:text-[15px] ss:text-[15px] 
                                text-[14px] ${sendTab === 'individual'
                                ? 'font-bold'
                                : 'font-medium'}`}
                                >
                                    I am an individual
                                </h2>
                            </div>
                            
                            <div className={`py-3.5 px-4 flex items-center mobship
                            ${sendTab === 'business'
                            ? 'bg-primary text-white'
                            : 'text-primary grow2'
                            }  cursor-pointer mobbut rounded-[4px] mobship2
                            transition-all duration-300 ease-in-out`}
                            onClick={() => handleTabChange('business')}
                            >
                                <h2 className={`md:text-[15px] ss:text-[15px] 
                                text-[14px] ${sendTab === 'business'
                                ? 'font-bold'
                                : 'font-medium'}`}
                                >
                                    I am shipping for my business
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='text-main4 font-medium md:text-[15px]
                        ss:text-[15px] text-[13px]'>
                            {sendTab === 'individual' 
                            ? "The selected option is for individuals/persons shipping personal items"
                            : "The selected option is for businesses/companies shipping commercial items"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className='md:w-[85%] w-full md:mt-10 ss:mt-10 mt-8'>
                <h1 className='flex text-main2 font-bold md:text-[30px] 
                    ss:text-[25px] text-[22px] tracking-tighter'>
                    Sender Information
                </h1>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[85%] w-full md:mt-6 ss:mt-6 mt-4'>
                {sendTab === 'individual' ? (
                    <div className='flex flex-col w-full items-center gap-8'>
                        <div className='flex flex-col w-full items-center gap-4'>
                            <div className='w-full'>
                                <h2 className='text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight'>
                                    Personal Information
                                </h2>
                            </div>

                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="fullNameInd"
                                        placeholder=' '
                                        value={formik.values.fullNameInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.fullNameInd && formik.errors.fullNameInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="fullNameInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.fullNameInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your full name
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.fullNameInd && formik.errors.fullNameInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="number"
                                        name="phoneInd"
                                        placeholder=' '
                                        value={formik.values.phoneInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.phoneInd && formik.errors.phoneInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="phoneInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.phoneInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your phone number
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.phoneInd && formik.errors.phoneInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="mailInd"
                                        placeholder=' '
                                        value={formik.values.mailInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.mailInd && formik.errors.mailInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="mailInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.mailInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your email (we will send notifications here)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.mailInd && formik.errors.mailInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="number"
                                        name="altPhoneInd"
                                        placeholder=' '
                                        value={formik.values.altPhoneInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.altPhoneInd && formik.errors.altPhoneInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="altPhoneInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.altPhoneInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter alternate phone number (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.altPhoneInd && formik.errors.altPhoneInd}
                                    </p>
                                </div>
                            </div>

                            <div className='w-full mt-2'>
                                <h2 className='text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight'>
                                    Location Information
                                </h2>
                            </div>
                            
                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                               <div className="relative flex flex-col col-span-2">
                                    <div className='relative flex items-center'>
                                        {formik.values.countryInd && (
                                            <img
                                                src={
                                                    countries.find(
                                                        (country) => country.cca2 === formik.values.countryInd
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                                            />
                                        )}
                                        <select
                                            type="text"
                                            name="countryInd"
                                            value={formik.values.countryInd}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${formik.touched.countryInd && formik.errors.countryInd ? 'outline-mainRed' : 'outline-main6'}`}
                                        >
                                            <option value="" disabled hidden>Select your country of residence</option>
                                            {countries.map((country) => (
                                                <option key={country.cca2} value={country.cca2}>
                                                    {country.name.common}
                                                </option>
                                            ))}
                                        </select>

                                        <div className='absolute md:right-3.5 right-3'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.countryInd && formik.errors.countryInd}
                                    </p>

                                    <p className='text-main2 font-medium md:text-[12px]
                                    ss:text-[12px] text-[11px] tracking-tight'>
                                        This is your billing country/region
                                    </p>
                                </div>
                            </div>

                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="address1Ind"
                                        placeholder=' '
                                        value={formik.values.address1Ind}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.address1Ind && formik.errors.address1Ind ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="address1Ind"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.address1Ind ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Address Line 1
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.address1Ind && formik.errors.address1Ind}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="address2Ind"
                                        placeholder=' '
                                        value={formik.values.address2Ind}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.address2Ind && formik.errors.address2Ind ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="address2Ind"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.address2Ind ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Address Line 2 (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.address2Ind && formik.errors.address2Ind}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="AreaInd"
                                        placeholder=' '
                                        value={formik.values.AreaInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.AreaInd && formik.errors.AreaInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="AreaInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.AreaInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Area
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.AreaInd && formik.errors.AreaInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="townInd"
                                        placeholder=' '
                                        value={formik.values.townInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.townInd && formik.errors.townInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="townInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.townInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Town/City
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.townInd && formik.errors.townInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="stateInd"
                                        placeholder=' '
                                        value={formik.values.stateInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.stateInd && formik.errors.stateInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="stateInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.stateInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        State of residence
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.stateInd && formik.errors.stateInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="postalInd"
                                        placeholder=' '
                                        value={formik.values.postalInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.postalInd && formik.errors.postalInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="postalInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.postalInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Postal Code
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.postalInd && formik.errors.postalInd}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="vatInd"
                                        placeholder=' '
                                        value={formik.values.vatInd}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.vatInd && formik.errors.vatInd ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="vatInd"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.vatInd ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        VAT/Tax ID (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.vatInd && formik.errors.vatInd}
                                    </p>
                                </div>
                            </div>

                            <div className='w-full mt-2'>
                                <h2 className='text-main4 font-semibold md:text-[15px]
                                ss:text-[15px] text-[13px] tracking-tight'>
                                    NB: This information will be set as both 
                                    your billing and shipping address. 
                                    To change this, you can <a href="/create-account" className='font-bold text-primary hover:text-secondary'>create an account</a> or 
                                    <a href="/login" className='font-bold text-primary hover:text-secondary'> login here</a>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 flex w-full items-center 
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
                                    Next
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
                    </div>
                ) : (
                    <div className='flex flex-col w-full items-center gap-8'>
                        <div className='flex flex-col w-full items-center gap-4'>
                            <div className='w-full'>
                                <h2 className='text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight'>
                                    Business Information
                                </h2>
                            </div>

                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="businessName"
                                        placeholder=' '
                                        value={formik.values.businessName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.businessName && formik.errors.businessName ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="businessName"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.businessName ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter the business/company name
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.businessName && formik.errors.businessName}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="number"
                                        name="phoneBus"
                                        placeholder=' '
                                        value={formik.values.phoneBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.phoneBus && formik.errors.phoneBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="phoneBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.phoneBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter the business/company's contact number
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.phoneBus && formik.errors.phoneBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="mailBus"
                                        placeholder=' '
                                        value={formik.values.mailBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.mailBus && formik.errors.mailBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="mailBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.mailBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter the business/company's contact email
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.mailBus && formik.errors.mailBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="number"
                                        name="altPhoneBus"
                                        placeholder=' '
                                        value={formik.values.altPhoneBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.altPhoneBus && formik.errors.altPhoneBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="altPhoneBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.altPhoneBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter alternate phone number (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.altPhoneBus && formik.errors.altPhoneBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="registrationID"
                                        placeholder=' '
                                        value={formik.values.registrationID}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.registrationID && formik.errors.registrationID ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="registrationID"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.registrationID ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Registration ID (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.registrationID && formik.errors.registrationID}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="vatBus"
                                        placeholder=' '
                                        value={formik.values.vatBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.vatBus && formik.errors.vatBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="vatBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.vatBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        VAT/Tax ID (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.vatBus && formik.errors.vatBus}
                                    </p>
                                </div>
                            </div>

                            <div className='w-full mt-2'>
                                <h2 className='text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight'>
                                    Business Location Information
                                </h2>
                            </div>
                            
                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                               <div className="relative flex flex-col col-span-2">
                                    <div className='relative flex items-center'>
                                        {formik.values.countryBus && (
                                            <img
                                                src={
                                                    countries.find(
                                                        (country) => country.cca2 === formik.values.countryBus
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                                            />
                                        )}
                                        <select
                                            type="text"
                                            name="countryBus"
                                            value={formik.values.countryBus}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${formik.touched.countryBus && formik.errors.countryBus ? 'outline-mainRed' : 'outline-main6'}`}
                                        >
                                            <option value="" disabled hidden>Select your country of residence</option>
                                            {countries.map((country) => (
                                                <option key={country.cca2} value={country.cca2}>
                                                    {country.name.common}
                                                </option>
                                            ))}
                                        </select>

                                        <div className='absolute md:right-3.5 right-3'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.countryBus && formik.errors.countryBus}
                                    </p>

                                    <p className='text-main2 font-medium md:text-[12px]
                                    ss:text-[12px] text-[11px] tracking-tight'>
                                        This is your billing country/region
                                    </p>
                                </div>
                            </div>

                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="address1Bus"
                                        placeholder=' '
                                        value={formik.values.address1Bus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.address1Bus && formik.errors.address1Bus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="address1Bus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.address1Bus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Address Line 1
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.address1Bus && formik.errors.address1Bus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="address2Bus"
                                        placeholder=' '
                                        value={formik.values.address2Bus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.address2Bus && formik.errors.address2Bus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="address2Bus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.address2Bus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Address Line 2 (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.address2Bus && formik.errors.address2Bus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="AreaBus"
                                        placeholder=' '
                                        value={formik.values.AreaBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.AreaBus && formik.errors.AreaBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="AreaBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.AreaBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Area
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.AreaBus && formik.errors.AreaBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="townBus"
                                        placeholder=' '
                                        value={formik.values.townBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.townBus && formik.errors.townBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="townBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.townBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Town/City
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.townBus && formik.errors.townBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="stateBus"
                                        placeholder=' '
                                        value={formik.values.stateBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.stateBus && formik.errors.stateBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="stateBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.stateBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        State of residence
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.stateBus && formik.errors.stateBus}
                                    </p>
                                </div>
                            </div>

                            <div className='w-full mt-2'>
                                <h2 className='text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight'>
                                    Business Representative Information
                                </h2>
                            </div>

                            <div className='grid md:grid-cols-4 ss:grid-cols-4
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="fullNameBus"
                                        placeholder=' '
                                        value={formik.values.fullNameBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.fullNameBus && formik.errors.fullNameBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="fullNameBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.fullNameBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your full name
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.fullNameBus && formik.errors.fullNameBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="number"
                                        name="phoneBus"
                                        placeholder=' '
                                        value={formik.values.phoneBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.phoneBus && formik.errors.phoneBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="phoneBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.phoneBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your phone number
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.phoneBus && formik.errors.phoneBus}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="mailBus"
                                        placeholder=' '
                                        value={formik.values.mailBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.mailBus && formik.errors.mailBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="mailBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.mailBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your email
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.mailBus && formik.errors.mailBus}
                                    </p>
                                </div>
                            </div>

                            <div className='w-full mt-2'>
                                <h2 className='text-main4 font-semibold md:text-[15px]
                                ss:text-[15px] text-[13px] tracking-tight'>
                                    NB: This information will be set as both 
                                    your billing and shipping address. 
                                    To change this, you can <a href="/create-account" className='font-bold text-primary hover:text-secondary'>create an account</a> or 
                                    <a href="/login" className='font-bold text-primary hover:text-secondary'> login here</a>
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 flex w-full items-center 
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
                                    Next
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
                    </div>
                )}
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(SenderForm, '');