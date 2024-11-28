import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc';
import { packageOptions } from '../constants';
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';
import { addicon } from '../assets';
import { BsBoxSeam } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { TbSquareForbid, TbTrashX } from "react-icons/tb";
import { GrAppsRounded } from "react-icons/gr";

import { FaPallet } from 'react-icons/fa';

const PackageCard = ({ index, option, selected, onSelect}) => {
    const handleClick = () => {
        onSelect(index);
    };

    return (
        <div className='cursor-pointer'>
            <div className={`border-[1px] border-main5 rounded-lg px-4
            py-3 hover:bg-primary hover:text-white navsmooth w-full group
            flex gap-3 items-center
            ${selected ? 'bg-primary' : 'text-white'}`}
            onClick={handleClick}
            >
                <div>
                    {React.createElement(option.icon, {
                        className: `w-[1.6rem] h-auto object-contain ${
                            selected ? 'text-white' : 'text-primary'
                        } group-hover:text-white`,
                    })}
                </div>

                <div className="flex flex-col w-full">
                    <h3
                        className={`md:text-[14px] ss:text-[13px] text-[12px] 
                        font-bold ${selected ? 'text-white' : 'text-primary'}
                        group-hover:text-white`}
                    >
                        {option.name}
                    </h3>

                    <p
                        className={`text-main4 md:text-[12px] ss:text-[12px] 
                        text-[11px] ${selected ? 'text-white' : 'text-main4'}
                        group-hover:text-white`}
                    >
                        {option.length} x {option.width} x {option.height} cm
                    </p>
                </div>
            </div>
        </div>
    );
};

const PackageDescribe = ({ onPrev, onNext, selectedTab}) => {
    const formRef = useRef();
    const currentTab = selectedTab;
    const [selectedOption, setSelectedOption] = useState({})
    // const navigate = useNavigate();

    const handleSelectOption = (pkgIndex, optionIndex) => {
        setSelectedOption((prevSelected) => {
            const updatedSelected = { ...prevSelected };

            // If the same option is clicked again for this package, deselect it
            if (updatedSelected[pkgIndex] === optionIndex) { 
                delete updatedSelected[pkgIndex];
                formik.setFieldValue(`packages[${pkgIndex}]`, {
                    packageWeight: "",
                    packageLength: "",
                    packageWidth: "",
                    packageHeight: "",
                    isFragile: false,
                    isPerishable: false,
                    isHazardous: false,
                });
                return updatedSelected;
            } else {
                // Select the new option for this package
                const selectedPackage = packageOptions[optionIndex];
                formik.setFieldValue(`packages[${pkgIndex}]`, {
                    packageWeight: selectedPackage.weight,
                    packageLength: selectedPackage.length,
                    packageWidth: selectedPackage.width,
                    packageHeight: selectedPackage.height,
                    isFragile: false,
                    isPerishable: false,
                    isHazardous: false,
                });
                updatedSelected[pkgIndex] = optionIndex;
            }
            return updatedSelected;
        });
    };

    const formik = useFormik({
        initialValues: {
            packages: [{
                packageType: '',
                packageWeight: '',
                packageLength: '',
                packageWidth: '',
                packageHeight: '',
                isFragile: false,
                isPerishable: false,
                isHazardous: false,
            }],
        },

        validationSchema: Yup.lazy((values) =>
            Yup.object().shape({
                packages: Yup.array().of(
                    Yup.object().shape({
                    packageType: Yup.string().required("Package type is required"),
                    packageWeight: Yup.number()
                        .typeError("Package weight must be a number")
                        .required("Package weight is required"),
                    packageLength: Yup.number()
                        .typeError("Package length must be a number")
                        .required("Package length is required"),
                    packageWidth: Yup.number()
                        .typeError("Package width must be a number")
                        .required("Package width is required"),
                    packageHeight: Yup.number()
                        .typeError("Package height must be a number")
                        .required("Package height is required"),
                    }),
                ),
            }),
        ),
        validateOnMount: true,
        onSubmit: (values) => {
            onNext(currentTab);
        },
    });

    const addPackage = () => {
        formik.setFieldValue("packages", [
            ...formik.values.packages,
            {
                packageType: "",
                packageWeight: "",
                packageLength: "",
                packageWidth: "",
                packageHeight: "",
                isFragile: false,
                isPerishable: false,
                isHazardous: false,
            },
        ]);
    };

    const handlePrevious = () => {
        onPrev(currentTab);
    };

    const packageTypeOptions = [
        { 
            value: "parcel", 
            icon: <BsBoxSeam className="inline-block mr-2.5" />, 
            label: "Parcel" ,
            className: "flex items-center"
        },
        { 
            value: "documents", 
            icon: <IoNewspaperOutline className="inline-block mr-2.5" />, 
            label: "Documents",
            className: "flex items-center" 
        },
        { 
            value: "pallet", 
            icon: <FaPallet className="inline-block mr-2.5" />, 
            label: "Pallet" ,
            className: "flex items-center" 
        },
        { 
            value: "container", 
            icon: <TbSquareForbid className="inline-block mr-2.5" />, 
            label: "Container",
            className: "flex items-center" 
        },
        { 
            value: "other", 
            icon: <GrAppsRounded className="inline-block mr-2.5" />, 
            label: "Other",
            className: "flex items-center" 
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
                                {option.icon} {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };


  return (
    <section className='w-full flex md:min-h-[850px] ss:min-h-[820px]
    min-h-[1080px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col gap-1.5 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center'>
                    Quickly describe your package
                </h1>

                <p className='text-main4 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.3rem] tracking-tight text-center'>
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
                <h1 className='flex text-main2 font-bold md:text-[30px] 
                    ss:text-[25px] text-[22px] tracking-tighter'>
                    Package Details
                </h1>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[70%] w-full md:mt-5 ss:mt-4 mt-3'>
                <div className='flex flex-col w-full items-center gap-8'>
                    {formik.values.packages.map((pkg, index) => (
                        <div key={index} className='flex flex-col w-full 
                        items-center gap-4'>
                            <div className='w-full flex justify-between items-center'>
                                <h2 className='text-main2 font-semibold md:text-[20px]
                                ss:text-[20px] text-[17px] tracking-tight'>
                                    Package {index + 1}
                                </h2>

                                <div className='flex items-center md:gap-2 ss:gap-2 gap-1.5 
                                cursor-pointer grow6'>
                                    <TbTrashX className='md:text-[20px] ss:text-[20px] 
                                    text-[17px] text-realRed'/>

                                    <p className='md:text-[15px] ss:text-[15px] 
                                    text-[12px] font-semibold text-realRed'>
                                        Remove Package
                                    </p>
                                </div>
                            </div>

                            <div className='grid md:grid-cols-3 ss:grid-cols-3
                            grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
                                <div className="relative flex flex-col col-span-2">
                                    <div className='relative flex items-center'>
                                        <div className='w-full relative'>
                                            <CustomSelect 
                                                name={`packages[${index}].packageType`}
                                                value={pkg.packageType}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                options={packageTypeOptions}
                                                placeholder="Select the type of package"
                                                error={
                                                    formik.touched.packages &&
                                                    formik.errors.packages &&
                                                    formik.touched.packages[index] &&
                                                    formik.errors.packages[index] &&
                                                    formik.touched.packages[index].packageType &&
                                                    formik.errors.packages[index].packageType
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
                                    ss:text-[12px] text-[11px] mt-1 font-medium">
                                        {formik.touched.packages &&
                                        formik.errors.packages &&
                                        formik.touched.packages[index] &&
                                        formik.errors.packages[index] &&
                                        formik.touched.packages[index].packageType &&
                                        formik.errors.packages[index].packageType}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <div className="relative z-10">
                                        <input
                                            type="text"
                                            name={`packages[${index}].packageWeight`}
                                            placeholder=' '
                                            value={pkg.packageWeight}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                            formik.touched.packages &&
                                            formik.errors.packages &&
                                            formik.touched.packages[index] &&
                                            formik.errors.packages[index] &&
                                            formik.touched.packages[index].packageWeight &&
                                            formik.errors.packages[index].packageWeight
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                                        />

                                        <label
                                        htmlFor="packageWeight"
                                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.packageWeight ? 'z-10 px-2' : ''}
                                        `}
                                        >
                                            Weight of package (kg)
                                        </label>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium">
                                        {formik.touched.packages &&
                                        formik.errors.packages &&
                                        formik.touched.packages[index] &&
                                        formik.errors.packages[index] &&
                                        formik.touched.packages[index].packageWeight &&
                                        formik.errors.packages[index].packageWeight}
                                    </p>
                                </div>
                        
                                <div className="relative flex flex-col">
                                    <div className="relative z-10">
                                        <input
                                            type="text"
                                            name={`packages[${index}].packageLength`}
                                            placeholder=' '
                                            value={pkg.packageLength}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                            formik.touched.packages &&
                                            formik.errors.packages &&
                                            formik.touched.packages[index] &&
                                            formik.errors.packages[index] &&
                                            formik.touched.packages[index].packageLength &&
                                            formik.errors.packages[index].packageLength
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                                        />

                                        <label
                                        htmlFor="packageLength"
                                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.packageLength ? 'z-10 px-2' : ''}
                                        `}
                                        >
                                            Package Length (cm)
                                        </label>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium">
                                        {formik.touched.packages &&
                                        formik.errors.packages &&
                                        formik.touched.packages[index] &&
                                        formik.errors.packages[index] &&
                                        formik.touched.packages[index].packageLength &&
                                        formik.errors.packages[index].packageLength}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <div className="relative z-10">
                                        <input
                                            type="text"
                                            name={`packages[${index}].packageWidth`}
                                            placeholder=' '
                                            value={pkg.packageWidth}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                            formik.touched.packages &&
                                            formik.errors.packages &&
                                            formik.touched.packages[index] &&
                                            formik.errors.packages[index] &&
                                            formik.touched.packages[index].packageWidth &&
                                            formik.errors.packages[index].packageWidth
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                                        />

                                        <label
                                        htmlFor="packageWidth"
                                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.packageWidth ? 'z-10 px-2' : ''}
                                        `}
                                        >
                                            Package Width (cm)
                                        </label>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium">
                                        {formik.touched.packages &&
                                        formik.errors.packages &&
                                        formik.touched.packages[index] &&
                                        formik.errors.packages[index] &&
                                        formik.touched.packages[index].packageWidth &&
                                        formik.errors.packages[index].packageWidth}
                                    </p>
                                </div>

                                <div className="relative flex flex-col">
                                    <div className="relative z-10">
                                        <input
                                            type="text"
                                            name={`packages[${index}].packageHeight`}
                                            placeholder=' '
                                            value={pkg.packageHeight}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                            peer outline-[1px] outline-main6 outline
                                            text-black md:rounded-lg rounded-md md:text-[14px]
                                            ss:text-[14px] text-[12px] focus:outline-primary
                                            bg-transparent w-full
                                            ${
                                            formik.touched.packages &&
                                            formik.errors.packages &&
                                            formik.touched.packages[index] &&
                                            formik.errors.packages[index] &&
                                            formik.touched.packages[index].packageHeight &&
                                            formik.errors.packages[index].packageHeight
                                                ? "outline-mainRed"
                                                : "outline-main6"
                                            }`}
                                        />

                                        <label
                                        htmlFor="packageHeight"
                                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                        duration-300 peer-placeholder-shown:translate-y-0 
                                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                        ${pkg.packageHeight ? 'z-10 px-2' : ''}
                                        `}
                                        >
                                            Package Height (cm)
                                        </label>
                                    </div>
                                    
                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] mt-1 font-medium">
                                        {formik.touched.packages &&
                                        formik.errors.packages &&
                                        formik.touched.packages[index] &&
                                        formik.errors.packages[index] &&
                                        formik.touched.packages[index].packageHeight &&
                                        formik.errors.packages[index].packageHeight}
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

                                <div className='grid md:grid-cols-4 ss:grid-cols-4 w-full
                                grid-cols-2 gap-2.5'>
                                    {packageOptions.map((option, optionIndex) => (
                                        <PackageCard 
                                            key={optionIndex}
                                            option={option}
                                            index={optionIndex}
                                            selected={selectedOption[index] === optionIndex}
                                            onSelect={() => handleSelectOption(index, optionIndex)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className='w-full h-[1px] bg-main7'/>

                            <div className='w-full'>
                                <div className='flex gap-5'>
                                    <div className='flex items-center gap-1.5'>
                                        <input
                                            type='checkbox'
                                            className='cursor-pointer'
                                            name={`packages[${index}].isFragile`}
                                            checked={pkg.isFragile}
                                            onChange={formik.handleChange}
                                        />
                                        <p className='text-main2 md:text-[16px]
                                        ss:text-[16px] text-[15px] font-medium'>
                                            Fragile
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-1.5'>
                                        <input
                                            type='checkbox'
                                            className='cursor-pointer'
                                            name={`packages[${index}].isPerishable`}
                                            checked={pkg.isPerishable}
                                            onChange={formik.handleChange}
                                        />
                                        <p className='text-main2 md:text-[16px]
                                        ss:text-[16px] text-[15px] font-medium'>
                                            Perishable
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-1.5'>
                                        <input
                                            type='checkbox'
                                            className='cursor-pointer'
                                            name={`packages[${index}].isHazardous`}
                                            checked={pkg.isHazardous}
                                            onChange={formik.handleChange}
                                        />
                                        <p className='text-main2 md:text-[16px]
                                        ss:text-[16px] text-[15px] font-medium'>
                                            Hazardous
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='w-full'>
                        <div className='inline-flex items-center gap-3 
                        grow4 cursor-pointer'
                        onClick={addPackage}
                        > 
                           <img 
                                src={addicon}
                                alt='addpackage'
                                className='w-[1.8rem] h-auto'
                           />

                            <h2 className='text-main2 font-semibold md:text-[18px]
                            ss:text-[18px] text-[15px] tracking-tight'>
                                Add Another Package
                            </h2>
                        </div>
                    </div>

                    <div className="mt-2 flex w-full items-center 
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