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
    <div>RecipientModal</div>
  )
}

export default RecipientModal