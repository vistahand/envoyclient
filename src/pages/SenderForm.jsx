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
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
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
                                        {formik.values.countryFromInt && (
                                            <img
                                                src={
                                                    countries.find(
                                                        (country) => country.cca2 === formik.values.countryFromInt
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                                            />
                                        )}
                                        <select
                                            type="text"
                                            name="countryFromInt"
                                            value={formik.values.countryFromInt}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${formik.touched.countryFromInt && formik.errors.countryFromInt ? 'outline-mainRed' : 'outline-main6'}`}
                                        >
                                            <option value="" disabled hidden>Select your country</option>
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
                                        {formik.touched.countryFromInt && formik.errors.countryFromInt}
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
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <input
                                        type="text"
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
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
                                        {formik.values.countryFromLoc && (
                                            <img
                                                src={
                                                    countries.find(
                                                        (country) => country.cca2 === formik.values.countryFromLoc
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                                            />
                                        )}
                                        <select
                                            type="text"
                                            name="countryFromLoc"
                                            value={formik.values.countryFromLoc}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${formik.touched.countryFromLoc && formik.errors.countryFromLoc ? 'outline-mainRed' : 'outline-main6'}`}
                                        >
                                            <option value="" disabled hidden>Select your country</option>
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
                                        {formik.touched.countryFromLoc && formik.errors.countryFromLoc}
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
                                        name="cityFromLoc"
                                        placeholder=' '
                                        value={formik.values.cityFromLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter your city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityFromLoc && formik.errors.cityFromLoc}
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
                                <div className="relative z-10">
                                    <input
                                        type="text"
                                        name="cityToLoc"
                                        placeholder=' '
                                        value={formik.values.cityToLoc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px]
                                        bg-transparent w-full focus:outline-primary outline-[1px]
                                        ${formik.touched.cityToLoc && formik.errors.cityToLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityToLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityToLoc ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter destination city/town
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.cityToLoc && formik.errors.cityToLoc}
                                    </p>
                                </div>
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