import { useState, useRef, useEffect } from 'react';
import { useGuestShipment } from '../context/GuestShipmentContext';
import { useNotifications } from '../context/NotificationContext';
import { useFormik } from "formik";
import { HiOutlineArrowRight } from "react-icons/hi";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
import { SectionWrapper } from '../hoc';


const PickupLocation = ({ onNext, onPrev, selectedTab, senderTab }) => {
    const formRef = useRef();
    const currentTab = selectedTab;
    const [countries, setCountries] = useState([]);
    const { shipmentData, updatePickupLocation, loading } = useGuestShipment();
    const { addNotification } = useNotifications();
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

    const formik = useFormik({
        initialValues: {
            countryPick: 'IE',
            statePick: '',
            townPick: '',
        },
        validationSchema: Yup.object().shape({
            countryPick: Yup.string(),
            statePick: Yup.string().required("State is required"),
            townPick: Yup.string().required("Town/City is required"),
        }),
        
        onSubmit: async (values) => {
            try {
                if (!shipmentData?.id) {
                    addNotification({
                        type: 'error',
                        title: 'Error',
                        message: 'No shipment ID found. Please try again from step 1.'
                    });
                    return;
                }

                const pickupData = {
                    country: values.countryPick,
                    state: values.statePick,
                    city: values.townPick
                };

                const response = await updatePickupLocation(pickupData);
                if (response?.success && response?.data?.shipment?._id) {
                    addNotification({
                        type: 'success',
                        title: 'Success',
                        message: 'Pickup location updated successfully'
                    });
                    onNext(currentTab, senderTab);
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (err) {
                addNotification({
                    type: 'error',
                    title: 'Error',
                    message: err.message || 'Failed to update pickup location'
                });
            }
        },
    });

    const handlePrevious = () => {
        onPrev(currentTab, senderTab);
    };

    const stateOptions = [
        { value: "abia", label: "Abia" },
        { value: "adamawa", label: "Adamawa" },
        { value: "akwa-ibom", label: "Akwa Ibom" },
        { value: "anambra", label: "Anambra" },
        { value: "bauchi", label: "Bauchi" },
        { value: "bayelsa", label: "Bayelsa" },
        { value: "benue", label: "Benue" },
        { value: "borno", label: "Borno" },
        { value: "cross-river", label: "Cross River" },
        { value: "delta", label: "Delta" },
        { value: "ebonyi", label: "Ebonyi" },
        { value: "edo", label: "Edo" },
        { value: "ekiti", label: "Ekiti" },
        { value: "enugu", label: "Enugu" },
        { value: "gombe", label: "Gombe" },
        { value: "imo", label: "Imo" },
        { value: "jigawa", label: "Jigawa" },
        { value: "kaduna", label: "Kaduna" },
        { value: "kano", label: "Kano" },
        { value: "katsina", label: "Katsina" },
        { value: "kebbi", label: "Kebbi" },
        { value: "kogi", label: "Kogi" },
        { value: "kwara", label: "Kwara" },
        { value: "lagos", label: "Lagos" },
        { value: "nasarawa", label: "Nasarawa" },
        { value: "niger", label: "Niger" },
        { value: "ogun", label: "Ogun" },
        { value: "ondo", label: "Ondo" },
        { value: "osun", label: "Osun" },
        { value: "oyo", label: "Oyo" },
        { value: "plateau", label: "Plateau" },
        { value: "rivers", label: "Rivers" },
        { value: "sokoto", label: "Sokoto" },
        { value: "taraba", label: "Taraba" },
        { value: "yobe", label: "Yobe" },
        { value: "zamfara", label: "Zamfara" },
        { value: "fct", label: "Federal Capital Territory" },
    ];

    const CustomSelect = ({ name, value, onChange, onBlur, options, placeholder, error }) => {
        const [showOptions, setShowOptions] = useState(false);
        const [selectedValue, setSelectedValue] = useState(value);
        const selectRef = useRef(null);
        const [filterText, setFilterText] = useState("");
        const [inputValue, setInputValue] = useState(value);

        const handleKeyDown = (event) => {
            if (event.key.length === 1) {
                setInputValue(prev => prev + event.key); // Update inputValue
            } else if (event.key === "Backspace") {
                setInputValue(prev => prev.slice(0, -1));
            }
        };

        useEffect(() => {
            // Update filterText when inputValue changes
            setFilterText(inputValue); 
        }, [inputValue]);

        const filteredOptions = options.filter(option => 
            option.label.toLowerCase().includes(filterText.toLowerCase())
        );

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
            <div className="relative" ref={selectRef} onKeyDown={handleKeyDown}>
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
                        <span className="text-main6">{inputValue || placeholder}</span>
                    )}
                </div>

                {showOptions && (
                    <div className="absolute z-20 w-full bg-white rounded-md mt-2 
                    shadow-[0px_5px_15px_rgba(0,0,0,0.25)] max-h-[16rem] overflow-auto">
                        {filteredOptions.map((option, optionIndex) => (
                            <div 
                            key={optionIndex}
                            data-option-index={optionIndex}
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
    min-h-[600px]'>
        <div className='flex items-center w-full flex-col'>
            <div className='w-full flex flex-col gap-1.5 items-center'>
                <h1 className='text-primary font-bold md:text-[40px] 
                ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem]
                ss:leading-[3.5rem] leading-[2.5rem] text-center'>
                    Where should we pick up your package?
                </h1>

                <p className='text-main6 md:text-[17px] ss:text-[16px] 
                text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] 
                leading-[1.2rem] tracking-tight font-medium text-center'>
                    Select a pickup location from the options below
                </p>
            </div>

            <div className='md:w-[85%] w-full md:mt-10 ss:mt-10 mt-8'>
                <h1 className='flex text-main2 font-bold md:text-[30px] 
                    ss:text-[25px] text-[22px] tracking-tighter'>
                    Pickup Location
                </h1>
            </div>

            <form ref={formRef} onSubmit={formik.handleSubmit}
            className='md:w-[85%] w-full md:mt-6 ss:mt-6 mt-4'>
                <div className='flex flex-col w-full items-center gap-8'>
                    <div className='flex flex-col w-full items-center gap-4'>   
                        <div className='grid md:grid-cols-2 ss:grid-cols-2 w-full md:gap-5 ss:gap-5 gap-4'>
                            <div className="relative flex flex-col">
                                <div className='relative flex items-center'>
                                    {formik.values.countryPick && (
                                        <img
                                            src={
                                                countries.find(
                                                    (country) => country.cca2 === formik.values.countryPick
                                                )?.flags?.png
                                            }
                                            alt="flag"
                                            className="absolute md:left-3.5 left-3 w-10
                                            h-[1.4rem] rounded-sm"
                                        />
                                    )}
                                    <select
                                        type="text"
                                        name="countryPick"
                                        value={formik.values.countryPick}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                                        px-3 outline text-main2 md:rounded-lg rounded-md
                                        cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                                        ss:text-[14px] text-[12px] focus:outline-primary
                                        bg-transparent w-full custom-select outline-[1px]
                                        ${formik.touched.countryPick && formik.errors.countryPick ? 'outline-mainRed' : 'outline-main6'}`}
                                    >
                                        <option value="" disabled hidden>Select recipient's country</option>
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
                                    {formik.touched.countryPick && formik.errors.countryPick}
                                </p>

                                <p className='text-main2 font-medium md:text-[12px]
                                ss:text-[12px] text-[11px] tracking-tight'>
                                    This is your selected country/region
                                </p>
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 ss:grid-cols-2 w-full md:gap-5 ss:gap-5 gap-4'>
                            <div className="relative flex flex-col">
                                <div className='relative flex items-center'>
                                    <div className='w-full'>
                                        <CustomSelect 
                                            name="statePick"
                                            value={formik.values.statePick}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            options={stateOptions}
                                            placeholder="Select a state/district"
                                            error={
                                                formik.touched.statePick && formik.errors.statePick
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
                                    {formik.touched.statePick && formik.errors.statePick}
                                </p>
                            </div>

                            <div className="relative flex flex-col">
                                <input
                                    type="text"
                                    name="townPick"
                                    placeholder=' '
                                    value={formik.values.townPick}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                    peer outline text-black md:rounded-lg rounded-md 
                                    md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                    bg-transparent w-full focus:outline-primary
                                    ${formik.touched.townPick && formik.errors.townPick ? 'outline-mainRed' : 'outline-main6'}
                                    `}
                                />

                                <label
                                htmlFor="townPick"
                                className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                duration-300 peer-placeholder-shown:translate-y-0 
                                peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                ${formik.values.townPick ? 'z-10 px-2' : ''}
                                `}
                                >
                                    Enter a town/city
                                </label>

                                <p className="text-mainRed md:text-[12px] flex justify-end
                                ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                    {formik.touched.townPick && formik.errors.townPick}
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
                        disabled={loading}
                        >
                            <p>
                                {loading ? 'Updating...' : 'Next'}
                            </p>
                            
                            {!loading && <HiOutlineArrowRight className='text-[14px]'/>}
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

export default SectionWrapper(PickupLocation, '');
