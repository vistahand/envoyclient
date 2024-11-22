import { useRef } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc';
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';


const PackageDescribe = ({ onPrev, selectedTab}) => {
    const formRef = useRef();
    const currentTab = selectedTab;
    // const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            packageType: '',
            packageWeight: '',
            packageLength: '',
            packageWidth: '',
            packageHeight: '',
        },

        validationSchema: Yup.object({
            packageType: Yup.string().required("Package type is required"),
            packageWeight: Yup.string().required("Package weight is required"),
            packageLength: Yup.string().required("Package length is required"),
            packageWidth: Yup.string().required("Package width is required"),
            packageHeight: Yup.string().required("Package height is required"),
        }),
        validateOnMount: true,
        onSubmit: (values) => {
           
        },
    });

    const handlePrevious = () => {
        onPrev(currentTab);
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
                ${currentTab === 'international'
                ? 'bg-primary text-white'
                : 'border-main5 border-[1px] text-primary'
                }  rounded-lg md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
                >
                    <InternationalIcon 
                        className={`w-[2.3rem] h-auto object-contain
                            ${currentTab === 'international' 
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

                        <p className={`${currentTab === 'local'
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
                ${currentTab === 'local'
                ? 'bg-primary text-white'
                : 'border-main5 border-[1px] text-primary'
                }  rounded-lg md:w-1/2 ss:w-1/2 w-full 
                gap-2 transition-all duration-300 ease-in-out`}
                >
                    <LocalIcon 
                        className={`w-[2.3rem] h-auto object-contain
                            ${currentTab === 'local' 
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

                        <p className={`${currentTab === 'international'
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

            <div className='md:w-[70%] w-full md:mt-10 ss:mt-10 mt-8'>
                <h1 className='flex text-main2 font-bold md:text-[33px] 
                    ss:text-[25px] text-[22px] tracking-tighter'>
                    Package Details
                </h1>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[70%] w-full md:mt-5 ss:mt-4 mt-3'>
                <div className='flex flex-col w-full items-center gap-4'>
                    <div className='w-full'>
                        <h2 className='text-main2 font-semibold md:text-[22px]
                        ss:text-[20px] text-[17px] tracking-tight'>
                            Package 1
                        </h2>
                    </div>

                    <div className='grid md:grid-cols-3 ss:grid-cols-3
                    grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                        <div className="relative flex flex-col col-span-2">
                            <div className='relative flex items-center'>
                                <select
                                    type="text"
                                    name="packageType"
                                    value={formik.values.packageType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`md:py-3.5 py-3 md:px-3.5
                                    px-3 outline text-main6 md:rounded-lg rounded-md
                                    cursor-pointer md:text-[13px]
                                    ss:text-[14px] text-[12px] focus:outline-primary
                                    bg-transparent w-full custom-select outline-[1px]
                                    ${formik.touched.packageType && formik.errors.packageType ? 'outline-mainRed' : 'outline-main6'}`}
                                >
                                    <option value="" disabled hidden>Select the type of package</option>
                                </select>

                                <div className='absolute md:right-3.5 right-3'>
                                    <TiArrowSortedDown 
                                        className='text-main md:text-[16px]
                                        ss:text-[18px] text-[16px]'
                                    />
                                </div>
                            </div>
                            
                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] mt-1 font-medium">
                                {formik.touched.packageType && formik.errors.packageType}
                            </p>
                        </div>

                        <div className="relative flex flex-col">
                            <div className="relative z-10">
                                <input
                                    type="text"
                                    name="packageWeight"
                                    placeholder=' '
                                    value={formik.values.packageWeight}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                    peer outline-[1px] outline-main6 outline
                                    text-black md:rounded-lg rounded-md md:text-[13px]
                                    ss:text-[14px] text-[12px] focus:outline-primary
                                    bg-transparent w-full
                                    ${formik.touched.packageWeight && formik.errors.packageWeight ? 'outline-mainRed' : 'outline-main6'}`}
                                />

                                <label
                                htmlFor="packageWeight"
                                className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                duration-300 peer-placeholder-shown:translate-y-0 
                                peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                ${formik.values.packageWeight ? 'z-10 px-2' : ''}
                                `}
                                >
                                    Weight of package (kg)
                                </label>
                            </div>
                            
                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] mt-1 font-medium">
                                {formik.touched.packageWeight && formik.errors.packageWeight}
                            </p>
                        </div>
                   
                        <div className="relative flex flex-col">
                            <div className="relative z-10">
                                <input
                                    type="text"
                                    name="packageLength"
                                    placeholder=' '
                                    value={formik.values.packageLength}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                    peer outline-[1px] outline-main6 outline
                                    text-black md:rounded-lg rounded-md md:text-[13px]
                                    ss:text-[14px] text-[12px] focus:outline-primary
                                    bg-transparent w-full
                                    ${formik.touched.packageLength && formik.errors.packageLength ? 'outline-mainRed' : 'outline-main6'}`}
                                />

                                <label
                                htmlFor="packageLength"
                                className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                duration-300 peer-placeholder-shown:translate-y-0 
                                peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                ${formik.values.packageLength ? 'z-10 px-2' : ''}
                                `}
                                >
                                    Package Length (cm)
                                </label>
                            </div>
                            
                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] mt-1 font-medium">
                                {formik.touched.packageLength && formik.errors.packageLength}
                            </p>
                        </div>

                        <div className="relative flex flex-col">
                            <div className="relative z-10">
                                <input
                                    type="text"
                                    name="packageWidth"
                                    placeholder=' '
                                    value={formik.values.packageWidth}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                    peer outline-[1px] outline-main6 outline
                                    text-black md:rounded-lg rounded-md md:text-[13px]
                                    ss:text-[14px] text-[12px] focus:outline-primary
                                    bg-transparent w-full
                                    ${formik.touched.packageWidth && formik.errors.packageWidth ? 'outline-mainRed' : 'outline-main6'}`}
                                />

                                <label
                                htmlFor="packageWidth"
                                className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                duration-300 peer-placeholder-shown:translate-y-0 
                                peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                ${formik.values.packageWidth ? 'z-10 px-2' : ''}
                                `}
                                >
                                    Package Width (cm)
                                </label>
                            </div>
                            
                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] mt-1 font-medium">
                                {formik.touched.packageWidth && formik.errors.packageWidth}
                            </p>
                        </div>

                        <div className="relative flex flex-col">
                            <div className="relative z-10">
                                <input
                                    type="text"
                                    name="packageHeight"
                                    placeholder=' '
                                    value={formik.values.packageHeight}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                    peer outline-[1px] outline-main6 outline
                                    text-black md:rounded-lg rounded-md md:text-[13px]
                                    ss:text-[14px] text-[12px] focus:outline-primary
                                    bg-transparent w-full
                                    ${formik.touched.packageHeight && formik.errors.packageHeight ? 'outline-mainRed' : 'outline-main6'}`}
                                />

                                <label
                                htmlFor="packageHeight"
                                className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                md:text-[13px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                duration-300 peer-placeholder-shown:translate-y-0 
                                peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                ${formik.values.packageHeight ? 'z-10 px-2' : ''}
                                `}
                                >
                                    Package Height (cm)
                                </label>
                            </div>
                            
                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] mt-1 font-medium">
                                {formik.touched.packageHeight && formik.errors.packageHeight}
                            </p>
                        </div>
                    </div>

                    <div className='w-full h-[1px] bg-main7'/>
                    
                    <div className='w-full flex flex-col items-center gap-4'>
                        <div className='w-full'>
                            <p className='text-main4 md:text-[14px] 
                            ss:text-[13px] text-[12px]'>
                                Not sure about the dimensions of your package?
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex w-full items-center 
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
            </form>
        </div>
    </section>
  );
};

export default SectionWrapper(PackageDescribe, '');