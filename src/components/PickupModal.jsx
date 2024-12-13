import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsX } from 'react-icons/bs';
import { useFormik } from "formik";
import { TiArrowSortedDown } from "react-icons/ti";
import * as Yup from 'yup';

const PickupModal = ({ onClose }) => {
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
      countryPick: 'IE',
      statePick: '',
      townPick: '',
    },
    validationSchema: Yup.object().shape({
      countryPick: Yup.string(),
      statePick: Yup.string().required("State is required"),
      townPick: Yup.string().required("Town/City is required"),
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
        ss:justify-center md:mx-0 ss:mx-16 mx-5'>
          <motion.div
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white md:rounded-3xl ss:rounded-3xl relative
          rounded-2xl shadow-xl flex flex-col md:w-[90%] w-full 
          items-center">
            <div className='flex justify-between items-center w-full
            border-b border-b-main7 md:py-6 md:px-12 ss:py-6 
            ss:px-12 py-4 px-5 bg-white top-0 sticky z-10'>
              <h1 className="md:text-[30px] ss:text-[25px] 
              text-[20px] tracking-tight font-bold text-main2">
                Change Pickup Location
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

export default PickupModal;