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