import { useState, useRef, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc';
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';


const PackageDescribe = ({ onNext, onPrev}) => {
    const formRef = useRef();
    const [selectedTab, setSelectedTab] = useState('international');
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


    const internationalSchema = Yup.object().shape({
        countryFromInt: Yup.string().required("Sender's country is required"),
        // cityFromInt: Yup.string().required("Sender's city is required"),
        countryTo: Yup.string().required('Recipient country is required'),
        // cityToInt: Yup.string().required('Recipient city is required')
    });

    const localSchema = Yup.object().shape({
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
        validationSchema: selectedTab === 'international' ? internationalSchema : localSchema,
        validateOnMount: true,
        onSubmit: (values) => {
           onNext();
        },
    });

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        formik.resetForm();
    };

    const handlePrevious = () => {
        onPrev();
    };


  return (
    <section className='w-full flex md:min-h-[600px] ss:min-h-[550px]
    min-h-[800px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col md:gap-1.5 gap-1 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem]'>
                    Quickly describe your package
                </h1>

                <p className='text-main4 md:text-[17px] ss:text-[16px] 
                text-[14px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight'>
                    From the options below, tell us how big or small your shipment is
                </p>
            </div>

            <div className='flex justify-center items-center md:gap-3
            ss:gap-3 gap-2.5 md:w-[43%] ss:w-[70%] w-full md:mt-10
            ss:mt-10 mt-8'>
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

            <div className='md:w-[80%] w-full md:mt-10 ss:mt-10 mt-8'>
                <h1 className='flex text-main2 font-bold md:text-[33px] 
                    ss:text-[25px] text-[22px] tracking-tighter'>
                    Package Details
                </h1>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[80%] w-full md:mt-5 mt-4'>
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
                                            cursor-pointer md:text-[13px] font-bold pl-[3.6rem]
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

                                    <p className='text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden 
                                    ss:hidden flex'>
                                        This is your billing country/region
                                    </p>
                                </div>

                                <div className="relative z-10">
                                    <input
                                        type="text"
                                        name="cityFromInt"
                                        placeholder=' '
                                        value={formik.values.cityFromInt}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline-[1px] outline-main6 outline
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px] focus:outline-primary
                                        bg-transparent w-full '
                                    />

                                    <label
                                    htmlFor="cityFromInt"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityFromInt ? 'z-10 px-2' : ''}
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
                                        {formik.values.countryTo && (
                                            <img
                                                src={
                                                    countries.find(
                                                        (country) => country.cca2 === formik.values.countryTo
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="absolute md:left-3.5 left-3 w-10
                                                h-[1.4rem] rounded-sm"
                                            />
                                        )}
                                        <select
                                            type="text"
                                            name="countryTo"
                                            value={formik.values.countryTo}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                            px-3 outline text-main2 md:rounded-lg rounded-md
                                            cursor-pointer md:text-[13px] font-bold pl-[3.6rem]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full custom-select outline-[1px]
                                            ${formik.touched.countryTo && formik.errors.countryTo ? 'outline-mainRed' : 'outline-main6'}`}
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
                                        {formik.touched.countryTo && formik.errors.countryTo}
                                    </p>

                                    <p className='text-main2 font-medium md:text-[11px]
                                    ss:text-[11px] text-[10px] tracking-tight md:hidden
                                    ss:hidden flex'>
                                        This is the country/region we'll be shipping to
                                    </p>
                                </div>

                                <div className="relative z-10">
                                    <input
                                        type="text"
                                        name="cityToInt"
                                        placeholder=' '
                                        value={formik.values.cityToInt}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className='md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline outline-main6 outline-[1px]
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px]
                                        bg-transparent w-full focus:outline-primary'
                                    />

                                    <label
                                    htmlFor="cityToInt"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.cityToInt ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter destination city/town (optional)
                                    </label>
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight hidden
                            ss:flex md:flex'>
                                This is the country/region we'll be shipping to
                            </p>
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
                                            cursor-pointer md:text-[13px] font-bold pl-[3.6rem]
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
                                        md:text-[13px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.cityFromLoc && formik.errors.cityFromLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityFromLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
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
                                        md:text-[13px] ss:text-[14px] text-[12px]
                                        bg-transparent w-full focus:outline-primary outline-[1px]
                                        ${formik.touched.cityToLoc && formik.errors.cityToLoc ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="cityToLoc"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
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

export default SectionWrapper(PackageDescribe, '');