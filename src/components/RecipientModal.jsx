import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsX } from 'react-icons/bs';
import { useFormik } from "formik";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';

const RecipientModal = ({ onClose }) => {
  const formRef = useRef();
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

  const formik = useFormik({
    initialValues: {
      fullNameRec: '',
      phoneRec: '',
      mailRec: '',
      altPhoneRec: '',
      countryRec: 'NG',
      address1Rec: '',
      address2Rec: '',
      areaRec: '',
      townRec: '',
      stateRec: '',
      postalRec: '',
      vatRec: '',
    },
    validationSchema: Yup.object().shape({
      fullNameRec: Yup.string().required("Full name is required"),
      phoneRec: Yup.number().required("Phone number is required"),
      mailRec: Yup.string().email("Invalid email address").required("Email is required"),
      altPhoneRec: Yup.number(), // Optional field
      countryRec: Yup.string().required("Country is required"),
      address1Rec: Yup.string().required("Address is required"),
      address2Rec: Yup.string(), // Optional field
      areaRec: Yup.string().required("Area is required"), // Optional field
      townRec: Yup.string().required("Town/City is required"),
      stateRec: Yup.string().required("State is required"), // Optional field (depending on country)
      postalRec: Yup.string().required("Postal code is required"),
      vatRec: Yup.string(), // Optional field
    }),
    
    onSubmit: (values) => {

    },
  });

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
        ss:justify-center md:mx-0 ss:mx-16 mx-5 md:h-[75%] ss:h-[75%] 
        h-[80%]'>
          <motion.div
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white md:rounded-3xl ss:rounded-3xl relative
          rounded-2xl shadow-xl flex flex-col md:w-[90%] w-full 
          overflow-auto items-center scrollbar-hidden">
            <div className='flex justify-between items-center w-full
            border-b border-b-main7 md:py-6 md:px-12 ss:py-6 
            ss:px-12 py-4 px-5 bg-white top-0 sticky z-10'>
              <h1 className="md:text-[30px] ss:text-[25px] 
              text-[20px] tracking-tight font-bold text-main2">
                Edit Recipient Information
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

            <div className='flex items-center w-full flex-col md:px-12 
            ss:px-12 px-5 mb-3'>
              <form ref={formRef} onSubmit={formik.handleSubmit}
              className='w-full md:mt-6 ss:mt-6 mt-4'>
                <div className='flex flex-col w-full items-center'>
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
                          name="fullNameRec"
                          placeholder=' '
                          value={formik.values.fullNameRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.fullNameRec && formik.errors.fullNameRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="fullNameRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.fullNameRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Enter the recipient's full name
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.fullNameRec && formik.errors.fullNameRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="number"
                          name="phoneRec"
                          placeholder=' '
                          value={formik.values.phoneRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.phoneRec && formik.errors.phoneRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="phoneRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.phoneRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Enter the recipient's phone number
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.phoneRec && formik.errors.phoneRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="text"
                          name="mailRec"
                          placeholder=' '
                          value={formik.values.mailRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.mailRec && formik.errors.mailRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="mailRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.mailRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Enter the recipient's email
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.mailRec && formik.errors.mailRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="number"
                          name="altPhoneRec"
                          placeholder=' '
                          value={formik.values.altPhoneRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.altPhoneRec && formik.errors.altPhoneRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="altPhoneRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.altPhoneRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Enter alternate phone number (optional)
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.altPhoneRec && formik.errors.altPhoneRec}
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
                          {formik.values.countryRec && (
                            <img
                              src={
                                countries.find(
                                  (country) => country.cca2 === formik.values.countryRec
                                )?.flags?.png
                              }
                              alt="flag"
                              className="absolute md:left-3.5 left-3 w-10
                              h-[1.4rem] rounded-sm"
                            />
                          )}
                          <select
                            type="text"
                            name="countryRec"
                            value={formik.values.countryRec}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`md:py-3.5 py-3 md:px-3.5 md:pl-[3.8rem]
                            px-3 outline text-main2 md:rounded-lg rounded-md
                            cursor-pointer md:text-[14px] font-bold pl-[3.6rem]
                            ss:text-[14px] text-[12px] focus:outline-primary
                            bg-transparent w-full custom-select outline-[1px]
                            ${formik.touched.countryRec && formik.errors.countryRec ? 'outline-mainRed' : 'outline-main6'}`}
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
                          {formik.touched.countryRec && formik.errors.countryRec}
                        </p>

                        <p className='text-main2 font-medium md:text-[12px]
                        ss:text-[12px] text-[11px] tracking-tight'>
                          You cannot change the country/region of recipient unless you cancel shipment.
                        </p>
                      </div>
                    </div>

                    <div className='grid md:grid-cols-4 grid-cols-2 md:gap-5 
                    ss:gap-5 gap-4 w-full'>
                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="text"
                          name="address1Rec"
                          placeholder=' '
                          value={formik.values.address1Rec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.address1Rec && formik.errors.address1Rec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="address1Rec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.address1Rec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Address Line 1
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.address1Rec && formik.errors.address1Rec}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-2">
                        <input
                          type="text"
                          name="address2Rec"
                          placeholder=' '
                          value={formik.values.address2Rec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.address2Rec && formik.errors.address2Rec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="address2Rec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.address2Rec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Address Line 2 (optional)
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.address2Rec && formik.errors.address2Rec}
                        </p>
                      </div>

                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="areaRec"
                          placeholder=' '
                          value={formik.values.areaRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.areaRec && formik.errors.areaRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="areaRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.areaRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Area
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.areaRec && formik.errors.areaRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="townRec"
                          placeholder=' '
                          value={formik.values.townRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.townRec && formik.errors.townRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="townRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.townRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Town/City
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.townRec && formik.errors.townRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col col-span-2">
                        <div className='relative flex items-center'>
                          <div className='w-full'>
                            <CustomSelect 
                              name="stateRec"
                              value={formik.values.stateRec}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              options={stateOptions}
                              placeholder="State of residence"
                              error={
                                formik.touched.stateRec && formik.errors.stateRec
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
                          {formik.touched.stateRec && formik.errors.stateRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="postalRec"
                          placeholder=' '
                          value={formik.values.postalRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.postalRec && formik.errors.postalRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="postalRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.postalRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          Postal Code
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.postalRec && formik.errors.postalRec}
                        </p>
                      </div>

                      <div className="relative flex flex-col">
                        <input
                          type="text"
                          name="vatRec"
                          placeholder=' '
                          value={formik.values.vatRec}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`md:py-3.5 py-3 md:px-3.5 px-3 
                          peer outline text-black md:rounded-lg rounded-md 
                          md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                          bg-transparent w-full focus:outline-primary
                          ${formik.touched.vatRec && formik.errors.vatRec ? 'outline-mainRed' : 'outline-main6'}
                          `}
                        />

                        <label
                        htmlFor="vatRec"
                        className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                        md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                        md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                        duration-300 peer-placeholder-shown:translate-y-0 
                        peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                        ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                        peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                        ${formik.values.vatRec ? 'z-10 px-2' : ''}
                        `}
                        >
                          VAT/Tax ID (optional)
                        </label>

                        <p className="text-mainRed md:text-[12px] flex justify-end
                        ss:text-[12px] text-[11px] md:mt-2 ss:mt-2 mt-1 font-medium">
                          {formik.touched.vatRec && formik.errors.vatRec}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className='flex md:justify-end ss:justify-end w-full
            border-t border-t-main7  md:py-6 md:px-12 ss:py-6 
            ss:px-12 py-4 px-5 bg-white bottom-0 sticky'>
              <div className="flex md:w-[45%] ss:w-[45%] w-full items-center 
              md:gap-5 ss:gap-5 gap-3">
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

export default RecipientModal;