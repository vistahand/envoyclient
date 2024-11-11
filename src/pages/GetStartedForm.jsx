import { useState, useRef, useEffect } from 'react';
import { useFormik } from "formik";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc'


const GetStartedForm = () => {

    const formRef = useRef();
    const [Loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('international');
    const navigate = useNavigate();

    const handleProductChange = (e) => {
        
    };

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
            setLoading(true);
            // Implement your email sending logic here...
        },
    });

    const handleSearch = () => {
        
    }

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        formik.resetForm();
    };


  return (
    <section className='w-full flex md:min-h-[400px] ss:min-h-[700px]
    min-h-[700px]'>
        <div className='flex items-center w-full flex-col md:gap-8 
        ss:gap-6 gap-4'>
            <div className='w-full flex flex-col gap-2 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem]'>
                    Shall we get started?
                </h1>

                <p className='text-main4 md:text-[18px] ss:text-[16px] 
                text-[14px] md:max-w-[700px] ss:max-w-[400px] md:leading-[1.4rem] 
                ss:leading-[1.4rem] leading-[1.3rem] tracking-tight'>
                    Where do you want us to go?
                </p>
            </div>

            <div className='flex justify-center items-center md:gap-3
            ss:gap-6 gap-5'>
                <div className={`py-3 px-6 flex items-center
                ${selectedTab === 'international'
                ? 'bg-primary text-white'
                : 'border-main4 border-[1px] text-primary'
                }  rounded-md grow4 cursor-pointer md:w-2/8 ss:w-2/8 
                w-[175px] gap-3`}
                onClick={() => handleTabChange('international')}
                >
                    <img 
                        src=''
                        alt='international'
                        className=''
                    />

                    <div className='flex flex-col gap-1.5'>
                        <h2 className='md:text-[14px] ss:text-[14px] 
                        text-[13px] font-bold'
                        >
                            International Shipping
                        </h2>

                        <p className={`${selectedTab === 'local'
                        ? 'text-main4'
                        : ''
                        } md:text-[12px] ss:text-[12px] text-[11px]`}
                        >
                            Ship between countries
                        </p>
                    </div>
                </div>
                
                <div className={`py-3 px-6 flex items-center 
                ${selectedTab === 'local'
                ? 'bg-primary text-white'
                : 'border-main4 border-[1px] text-primary'
                }  rounded-md grow4 cursor-pointer md:w-2/8 ss:w-2/8 
                w-[175px] gap-3`}
                onClick={() => handleTabChange('local')}
                >
                    <img 
                        src=''
                        alt='local'
                        className=''
                    />

                    <div className='flex flex-col gap-1.5'>
                        <h2 className='md:text-[14px] ss:text-[14px] 
                        text-[13px] font-bold'
                        >
                            Local Shipping
                        </h2>

                        <p className={`${selectedTab === 'international'
                        ? 'text-main4'
                        : ''
                        } md:text-[12px] ss:text-[12px] text-[11px]`}
                        >
                            Ship within your country
                        </p>
                    </div>
                </div>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className="flex flex-col md:gap-1.5 ss:gap-2.5 md:mt-3 ss:mt-4
            mt-3 gap-2">
                {selectedTab === 'targetedSearch' ? (
                    <>
                    <div className="relative flex flex-col gap-3">
                        <h2 className='text-main font-bold md:text-[20px]
                        ss:text-[20px] text-[16px]'>
                            I am shipping from
                        </h2>
                        <div className='relative flex items-center'>
                            <select
                                type="text"
                                name="product"
                                value={formik.values}
                                onChange={handleProductChange}
                                onBlur={formik.handleBlur}
                                className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                                ss:px-3 px-2 border-search 
                                text-main3 md:rounded-lg rounded-md 
                                cursor-pointer md:text-[13px]
                                ss:text-[14px] text-[12px] 
                                bg-transparent w-full custom-select"
                            >
                                <option value="" disabled hidden>Select a product</option>
                            </select>
                            <div className='absolute md:right-3 
                            ss:right-3 right-2'>
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
                        <div className='relative flex items-center'>
                            <select
                                type="text"
                                name="category"
                                value={formik.values}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                                ss:px-3 px-2 border-search 
                                text-main3 md:rounded-lg rounded-md 
                                cursor-pointer md:text-[13px]
                                ss:text-[14px] text-[12px] 
                                bg-transparent w-full custom-select"
                            >
                                <option value="" disabled hidden>Select a category</option>
                            </select>
                            <div className='absolute md:right-3 
                            ss:right-3 right-2'>
                                <TiArrowSortedDown 
                                    className='text-main md:text-[16px]
                                    ss:text-[18px] text-[16px]'
                                />
                            </div>
                        </div>

                        <p className="text-mainRed md:text-[12px] 
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                            {formik.touched.category && formik.errors.category}
                        </p>
                    </div>

                    <div className="relative">
                        <div className='relative flex items-center'>
                            <select
                                type="text"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                                ss:px-3 px-2 border-search 
                                text-main3 md:rounded-lg rounded-md 
                                cursor-pointer md:text-[13px]
                                ss:text-[14px] text-[12px] 
                                bg-transparent w-full custom-select"
                            >
                                <option value="" disabled hidden>Select a price range</option>
                                <option value="0-10,000">0-10,000</option>
                                <option value="10,000-20,000">10,000-20,000</option>
                                <option value="20,000-50,000">20,000-50,000</option>
                                <option value="50,000-100,000">50,000-100,000</option>
                                <option value="100,000-500,000">100,000-500,000</option>
                                <option value="500,000-1,000,000">500,000-1,000,000</option>
                                <option value="1,000,000-5,000,000">1,000,000-5,000,000</option>
                            </select>
                            <div className='absolute md:right-3 
                            ss:right-3 right-2'>
                                <TiArrowSortedDown 
                                    className='text-main md:text-[16px]
                                    ss:text-[18px] text-[16px]'
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-1">
                        <input
                            type="text"
                            name="numbermail"
                            placeholder='Enter your phone number or email'
                            value={formik.values.numbermail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                            ss:px-3 px-2 border-search 
                            text-black md:rounded-lg rounded-md md:text-[13px]
                            ss:text-[14px] text-[12px]
                            bg-transparent w-full placeholder:text-main3"
                        />
                        <p className="text-mainRed md:text-[12px] 
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                            {formik.touched.numbermail && formik.errors.numbermail}
                        </p>
                    </div>

                    <div className="w-full mt-1">
                        <button
                        type="button"
                        className="bg-primary grow5 md:text-[13px] w-full
                        ss:text-[16px] text-[12px] md:py-3 ss:py-3 py-2.5 
                        text-white md:rounded-lg rounded-md border-none"
                        onClick={handleSearch}
                        >
                            {Loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    </>
                ) : (
                    <>
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            placeholder='Enter your name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                            ss:px-3 px-2 border-search 
                            text-black md:rounded-lg rounded-md md:text-[13px]
                            ss:text-[14px] text-[12px]
                            bg-transparent w-full placeholder:text-main3"
                        />
                        <p className="text-mainRed md:text-[12px] 
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                            {formik.touched.name && formik.errors.name}
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="email"
                            placeholder='Enter your email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                            ss:px-3 px-2 border-search 
                            text-black md:rounded-lg rounded-md md:text-[13px]
                            ss:text-[14px] text-[12px]
                            bg-transparent w-full placeholder:text-main3"
                        />
                        <p className="text-mainRed md:text-[12px] 
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                            {formik.touched.email && formik.errors.email}
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="subject"
                            placeholder='Enter a subject (e.g. Inquiry for Glass Marble Tile)'
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                            ss:px-3 px-2 border-search 
                            text-black md:rounded-lg rounded-md md:text-[13px]
                            ss:text-[14px] text-[12px]
                            bg-transparent w-full placeholder:text-main3"
                        />
                        <p className="text-mainRed md:text-[12px] 
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                            {formik.touched.subject && formik.errors.subject}
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            rows="5"
                            name="message"
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your message"
                            className="md:py-2.5 ss:py-2 py-1.5 md:px-3 
                            ss:px-3 px-2 border-search 
                            text-black md:rounded-lg rounded-md md:text-[13px]
                            ss:text-[14px] text-[12px]
                            bg-transparent w-full placeholder:text-main3"
                        />
                        <p className="text-mainRed md:text-[12px] 
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1">
                            {formik.touched.message && formik.errors.message}
                        </p>
                    </div>

                    <div className="w-full mt-1">
                        <button
                        type="submit"
                        className="bg-primary grow5 md:text-[13px] w-full
                        ss:text-[14px] text-[11px] md:py-3 ss:py-3 py-2 
                        text-white md:rounded-lg rounded-md border-none"
                        >
                            {Loading ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                    </>
                )}
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(GetStartedForm, '');