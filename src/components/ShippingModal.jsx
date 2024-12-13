import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsX } from 'react-icons/bs';
import { useFormik } from "formik";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';

const ShippingModal = ({ onClose }) => {
  const formRef = useRef();
  const currentTab = selectedTab;
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
    fullNameInd: Yup.string().required("Full name is required"),
    phoneInd: Yup.number().required("Phone number is required"),
    mailInd: Yup.string().email("Invalid email address").required("Email is required"),
    altPhoneInd: Yup.number(), // Optional field
    countryInd: Yup.string().required("Country is required"),
    address1Ind: Yup.string().required("Address is required"),
    address2Ind: Yup.string(), // Optional field
    areaInd: Yup.string().required("Area is required"), // Optional field
    townInd: Yup.string().required("Town/City is required"),
    stateInd: Yup.string().required("State is required"), // Optional field (depending on country)
    postalInd: Yup.string().required("Postal code is required"),
    vatInd: Yup.string(), // Optional field
  });
    
  const businessSchema = Yup.object().shape({
    businessName: Yup.string().required("Business name is required"),
    businessPhone: Yup.number().required("Business phone number is required"),
    businessMail: Yup.string().email("Invalid email address").required("Business email is required"),
    businessPhoneAlt: Yup.number(), // Optional field
    registrationID: Yup.string(),
    vatBus: Yup.string(), // Optional field
    countryBus: Yup.string().required("Country is required"),
    address1Bus: Yup.string().required("Address is required"),
    address2Bus: Yup.string(), // Optional field
    areaBus: Yup.string().required("Area is required"), // Optional field
    townBus: Yup.string().required("Town/City is required"),
    stateBus: Yup.string().required("State is required"),
    fullNameBus: Yup.string().required("Contact person's full name is required"),
    phoneBus: Yup.number().required("Contact person's phone number is required"),
    mailBus: Yup.string().email("Invalid email address").required("Contact person's email is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullNameInd: '',
      phoneInd: '',
      mailInd: '',
      altPhoneInd: '',
      countryInd: 'IE',
      address1Ind: '',
      address2Ind: '',
      areaInd: '',
      townInd: '',
      stateInd: '',
      postalInd: '',
      vatInd: '',
      businessName: '',
      businessPhone: '',
      businessMail: '',
      businessPhoneAlt: '',
      registrationID: '',
      vatBus: '',
      countryBus: 'IE',
      address1Bus: '',
      address2Bus: '',
      areaBus: '',
      townBus: '',
      stateBus: '',
      fullNameBus: '',
      phoneBus: '',
      mailBus: '',
    },
    validationSchema: senderTab === 'individual' ? individualSchema : businessSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      
    },
  });

  const handleTabChange = (tab) => {
    setSenderTab(tab);
    formik.resetForm();
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.style.top = '0';
  };

  return (
    <AnimatePresence>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center
      bg-black bg-opacity-40 z-50">
        <div className='max-w-[68rem] w-full flex md:justify-center 
        ss:justify-center md:mx-0 ss:mx-0 mx-5'>
          <motion.div
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white padphone md:rounded-2xl ss:rounded-2xl
          rounded-xl shadow-xl flex flex-col gap-5 md:w-[85%] ss:w-[85%]
          w-full md:h-[80%] ss:h-[80%] h-[100%] overflow-auto items-center 
          relative  md:py-6 md:px-12 ss:py-6 ss:px-12 py-4
          px-5">
            <div className='flex justify-between items-center w-full'>
              <h1 className="md:text-[30px] ss:text-[25px] 
              text-[20px] tracking-tight font-bold text-main2">
                Edit Sender Information
              </h1>

              <BsX 
                className='md:w-[3.2rem] ss:w-[3.2rem] w-[2rem] h-auto 
                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full cursor-pointer grow2'
                strokeWidth={0.2}
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
              />
            </div>

            <div className='flex items-center w-full flex-col'>
              <div className='flex items-center md:gap-3 ss:gap-3 gap-2.5 
              w-full md:mt-12 ss:mt-10 mt-8'>
                <div className='flex flex-col w-full gap-3 items-center'>
                  <div className='w-full'>
                    <div className='inline-flex bg-mainalt rounded-lg p-1'>
                      <div className={`py-3.5 px-4 flex items-center mobship
                      ${senderTab === 'individual'
                      ? 'bg-primary text-white'
                      : 'text-primary grow2'
                      }  cursor-pointer mobbut rounded-[4px] mobship2
                      transition-all duration-300 ease-in-out`}
                      onClick={() => handleTabChange('individual')}
                      >
                        <h2 className={`md:text-[15px] ss:text-[15px] 
                        text-[14px] ${senderTab === 'individual'
                        ? 'font-bold'
                        : 'font-medium'}`}
                        >
                          I am an individual
                        </h2>
                      </div>
                        
                      <div className={`py-3.5 px-4 flex items-center mobship
                      ${senderTab === 'business'
                      ? 'bg-primary text-white'
                      : 'text-primary grow2'
                      }  cursor-pointer mobbut rounded-[4px] mobship2
                      transition-all duration-300 ease-in-out`}
                      onClick={() => handleTabChange('business')}
                      >
                        <h2 className={`md:text-[15px] ss:text-[15px] 
                        text-[14px] ${senderTab === 'business'
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
                      {senderTab === 'individual' 
                      ? "The selected option is for individuals/persons shipping personal items"
                      : "The selected option is for businesses/companies shipping commercial items"
                      }
                    </p>
                  </div>
                </div>
              </div>

              <form ref={formRef} onSubmit={formik.handleSubmit}
              className='w-full md:mt-6 ss:mt-6 mt-4'>
                {senderTab === 'individual' ? (
                  <div className='flex flex-col w-full items-center gap-8'>
                    <div className='flex flex-col w-full items-center gap-4'>
                      <div className='w-full'>
                        <h2 className='text-main2 font-semibold md:text-[20px]
                        ss:text-[20px] text-[17px] tracking-tight'>
                          Personal Information
                        </h2>
                      </div>

                        <div className='grid md:grid-cols-4 grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full'>
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
                              You cannot change your billing country/region unless you cancel shipment.
                            </p>
                          </div>
                        </div>

                        <div className='grid md:grid-cols-4 grid-cols-2 md:gap-5 
                        ss:gap-5 gap-4 w-full'>
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
                              name="areaInd"
                              placeholder=' '
                              value={formik.values.areaInd}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`md:py-3.5 py-3 md:px-3.5 px-3 
                              peer outline text-black md:rounded-lg rounded-md 
                              md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                              bg-transparent w-full focus:outline-primary
                              ${formik.touched.areaInd && formik.errors.areaInd ? 'outline-mainRed' : 'outline-main6'}
                              `}
                            />

                            <label
                            htmlFor="areaInd"
                            className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                            md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                            md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                            duration-300 peer-placeholder-shown:translate-y-0 
                            peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                            ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                            ${formik.values.areaInd ? 'z-10 px-2' : ''}
                            `}
                            >
                              Area
                            </label>

                            <p className="text-mainRed md:text-[12px] flex justify-end
                            ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                              {formik.touched.areaInd && formik.errors.areaInd}
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
                            <div className='relative flex items-center'>
                              <div className='w-full'>
                                <CustomSelect 
                                  name="stateInd"
                                  value={formik.values.stateInd}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  options={stateOptions}
                                  placeholder="State of residence"
                                  error={
                                    formik.touched.stateInd && formik.errors.stateInd
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

                            <div className='grid md:grid-cols-4 grid-cols-2 md:gap-5 
                            ss:gap-5 gap-4 w-full'>
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
                                        name="businessPhone"
                                        placeholder=' '
                                        value={formik.values.businessPhone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.businessPhone && formik.errors.businessPhone ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="businessPhone"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.businessPhone ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter the business/company's contact number
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.businessPhone && formik.errors.businessPhone}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="text"
                                        name="businessMail"
                                        placeholder=' '
                                        value={formik.values.businessMail}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.businessMail && formik.errors.businessMail ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="businessMail"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.businessMail ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter the business/company's contact email
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.businessMail && formik.errors.businessMail}
                                    </p>
                                </div>

                                <div className="relative flex flex-col col-span-2">
                                    <input
                                        type="number"
                                        name="businessPhoneAlt"
                                        placeholder=' '
                                        value={formik.values.businessPhoneAlt}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.businessPhoneAlt && formik.errors.businessPhoneAlt ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="businessPhoneAlt"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.businessPhoneAlt ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Enter alternate phone number (optional)
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.businessPhoneAlt && formik.errors.businessPhoneAlt}
                                    </p>
                                </div>

                                <div className="relative flex flex-col md:col-span-1
                                ss:col-span-1 col-span-2">
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

                                <div className="relative flex flex-col md:col-span-1
                                ss:col-span-1 col-span-2">
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
                                        name="areaBus"
                                        placeholder=' '
                                        value={formik.values.areaBus}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`md:py-3.5 py-3 md:px-3.5 px-3 
                                        peer outline text-black md:rounded-lg rounded-md 
                                        md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                        bg-transparent w-full focus:outline-primary
                                        ${formik.touched.areaBus && formik.errors.areaBus ? 'outline-mainRed' : 'outline-main6'}
                                        `}
                                    />

                                    <label
                                    htmlFor="areaBus"
                                    className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                    md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                    md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                    duration-300 peer-placeholder-shown:translate-y-0 
                                    peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                    ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                    peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                    ${formik.values.areaBus ? 'z-10 px-2' : ''}
                                    `}
                                    >
                                        Area
                                    </label>

                                    <p className="text-mainRed md:text-[12px] flex justify-end
                                    ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                                        {formik.touched.areaBus && formik.errors.areaBus}
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
                                    <div className='relative flex items-center'>
                                        <div className='w-full'>
                                            <CustomSelect 
                                                name="stateBus"
                                                value={formik.values.stateBus}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                options={stateOptions}
                                                placeholder="State of residence"
                                                error={
                                                    formik.touched.stateBus && formik.errors.stateBus
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

            <div className='flex md:justify-end ss:justify-end w-full'>
              <div className="flex md:w-[45%] ss:w-[45%] w-full items-center 
              phone4 md:gap-5 ss:gap-5 gap-3">
                <button
                className='bg-none text-[13px] py-3.5 w-[50%]
                text-primary rounded-full grow2 cursor-pointer
                items-center justify-center border border-primary'
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
                >
                  <p className='font-semibold'>
                    Cancel
                  </p>
                </button>

                <button
                className='bg-primary text-[13px] py-3.5 w-[50%] flex
                text-white rounded-full grow4 cursor-pointer
                items-center justify-center gap-3'
                >
                  <p>
                    Confirm
                  </p>
                  
                  <HiOutlineArrowRight className='text-[14px]'/>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShippingModal;