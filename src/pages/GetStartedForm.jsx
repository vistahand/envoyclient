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

    const targetedSearchSchema = Yup.object().shape({
        product: Yup.string().required('Product is required.'),
        category: Yup.string().required('Category is required.'),
        numbermail: Yup.string().required('Phone Number or Email is required.'),
    });

    const messageUsSchema = Yup.object().shape({
        name: Yup.string().required('Name is required.'),
        email: Yup.string().email('Invalid email address.').required('Email is required.'),
        subject: Yup.string().required('Subject is required.'),
        message: Yup.string().required('Message is required.'),
    });

    const formik = useFormik({
        initialValues: {
            product: '',
            category: '',
            price: '',
            numbermail: '',
            name: '',
            email: '',
            subject: '',
            message: '',
        },
        validationSchema: selectedTab === 'targetedSearch' ? targetedSearchSchema : messageUsSchema,
        onSubmit: (values) => {
           
        },
    });

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        formik.resetForm();
    };


  return (
    <section className='w-full flex md:min-h-[600px] ss:min-h-[700px]
    min-h-[700px]'>
        <div className='flex items-center w-full flex-col md:gap-8 
        ss:gap-6 gap-4'>
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
            ss:gap-6 gap-5 w-[42%] mt-3'>
                <div className={`py-3.5 px-4 flex items-center
                ${selectedTab === 'international'
                ? 'bg-primary text-white'
                : 'border-main5 border-[1px] text-primary grow4'
                }  rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-[175px] 
                gap-2`}
                onClick={() => handleTabChange('international')}
                >
                    <InternationalIcon 
                        className={`w-[2.3rem] h-auto object-contain
                            ${selectedTab === 'international' ? 'stroke-white' : 'stroke-primary'}
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
                        } md:text-[11px] ss:text-[11px] text-[10px]`}
                        >
                            Ship between countries
                        </p>
                    </div>
                </div>
                
                <div className={`py-3.5 px-4 flex items-center 
                ${selectedTab === 'local'
                ? 'bg-primary text-white'
                : 'border-main5 border-[1px] text-primary grow4'
                }  rounded-lg cursor-pointer md:w-1/2 ss:w-1/2 w-[175px] 
                gap-2`}
                onClick={() => handleTabChange('local')}
                >
                    <LocalIcon 
                        className={`w-[2.3rem] h-auto object-contain
                            ${selectedTab === 'local' ? 'stroke-white' : 'stroke-primary'}
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
                        } md:text-[11px] ss:text-[11px] text-[10px]`}
                        >
                            Ship within your country
                        </p>
                    </div>
                </div>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='w-[80%]'>
                {selectedTab === 'international' ? (
                    <div className='flex flex-col w-full items-center gap-3'>
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                I am shipping from
                            </h2>

                            <div className='grid grid-cols-2 gap-3.5 mt-3.5'>
                                <div className="relative flex flex-col">
                                    <div className='relative flex items-center'>
                                        <select
                                            type="text"
                                            name="price"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5 
                                            ss:px-3.5 px-2.5 border border-main6 
                                            text-main6 md:rounded-lg rounded-md 
                                            cursor-pointer md:text-[13px]
                                            ss:text-[14px] text-[12px] 
                                            bg-transparent w-full custom-select"
                                        >
                                            <option value="" disabled hidden>Select your country</option>
                                        </select>
                                        <div className='absolute md:right-3.5 
                                        ss:right-3.5 right-2.5'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.product && formik.errors.product}
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="numbermail"
                                        placeholder='Enter your city/town (optional)'
                                        value={formik.values.numbermail}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5 
                                        ss:px-3.5 px-2.5 border border-main6 
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px]
                                        bg-transparent w-full placeholder:text-main6"
                                    />
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.numbermail && formik.errors.numbermail}
                                    </p>
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight'>
                                This is your billing country/region
                            </p>
                        </div>
                        
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                To
                            </h2>

                            <div className='grid grid-cols-2 gap-3.5 mt-3.5'>
                                <div className="relative flex flex-col">
                                    <div className='relative flex items-center'>
                                        <select
                                            type="text"
                                            name="price"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5 
                                            ss:px-3.5 px-2.5 border border-main6 
                                            text-main6 md:rounded-lg rounded-md 
                                            cursor-pointer md:text-[13px]
                                            ss:text-[14px] text-[12px]
                                            bg-transparent w-full custom-select"
                                        >
                                           <option value="" disabled hidden>Select your country</option>
                                        </select>
                                        <div className='absolute md:right-3.5 
                                        ss:right-3.5 right-2.5'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.product && formik.errors.product}
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="numbermail"
                                        placeholder='Enter destination city/town (optional)'
                                        value={formik.values.numbermail}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5
                                        ss:px-3.5 px-2.5 border border-main6 
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px]
                                        bg-transparent w-full placeholder:text-main6"
                                    />
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.numbermail && formik.errors.numbermail}
                                    </p>
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight'>
                                This is the country/region we'll be shipping to
                            </p>
                        </div>

                        <div className="mt-6">
                           <a href='/createshipment'
                            className='bg-primary text-[13px] py-3.5 px-14 flex
                            text-white rounded-full grow4 cursor-pointer 
                            items-center gap-3'
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

                            <div className='grid grid-cols-2 gap-3.5 mt-3.5'>
                                <div className="relative flex flex-col">
                                    <div className='relative flex items-center'>
                                        <select
                                            type="text"
                                            name="price"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5 
                                            ss:px-3.5 px-2.5 border border-main6 
                                            text-main6 md:rounded-lg rounded-md 
                                            cursor-pointer md:text-[13px]
                                            ss:text-[14px] text-[12px] 
                                            bg-transparent w-full custom-select"
                                        >
                                            <option value="" disabled hidden>Select your country</option>
                                        </select>
                                        <div className='absolute md:right-3.5 
                                        ss:right-3.5 right-2.5'>
                                            <TiArrowSortedDown 
                                                className='text-main md:text-[16px]
                                                ss:text-[18px] text-[16px]'
                                            />
                                        </div>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.product && formik.errors.product}
                                    </p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="numbermail"
                                        placeholder='Enter your city/town'
                                        value={formik.values.numbermail}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5 
                                        ss:px-3.5 px-2.5 border border-main6 
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px]
                                        bg-transparent w-full placeholder:text-main6"
                                    />
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.numbermail && formik.errors.numbermail}
                                    </p>
                                </div>
                            </div>

                            <p className='text-main2 font-medium md:text-[11px]
                            ss:text-[11px] text-[10px] tracking-tight'>
                                This is your billing country/region
                            </p>
                        </div>
                        
                        <div className='flex flex-col w-full'>
                            <h2 className='text-main2 font-bold md:text-[17px]
                            ss:text-[17px] text-[15px] tracking-tight'>
                                To
                            </h2>

                            <div className='grid grid-cols-2 gap-3.5 mt-3.5'>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="numbermail"
                                        placeholder='Enter destination city/town'
                                        value={formik.values.numbermail}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="md:py-3.5 ss:py-3 py-2.5 md:px-3.5
                                        ss:px-3.5 px-2.5 border border-main6 
                                        text-black md:rounded-lg rounded-md md:text-[13px]
                                        ss:text-[14px] text-[12px]
                                        bg-transparent w-full placeholder:text-main6"
                                    />
                                    <p className="text-mainRed md:text-[12px] 
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                                        {formik.touched.numbermail && formik.errors.numbermail}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                           <a href='/createshipment'
                            className='bg-primary text-[13px] py-3.5 px-14 flex
                            text-white rounded-full grow4 cursor-pointer 
                            items-center gap-3'
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