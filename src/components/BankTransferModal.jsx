import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsX } from 'react-icons/bs';
import { PiBank } from "react-icons/pi";
import { copy } from '../assets';
import { useFormik } from "formik";
import * as Yup from 'yup';

const BankTransferModal = ({ onClose, handleNext }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy');
    const [countries, setCountries] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
  
    const handleCopyClick = () => {
        navigator.clipboard.writeText('001F5TG8XR4U')
        .then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => {
                setCopyButtonText('Copy');
            }, 3000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    const enableScroll = () => {
        document.body.style.overflow = 'auto';
        document.body.style.top = '0';
    };

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
            accName: '',
            bankName: '',
        },
        validationSchema: Yup.object().shape({
            bankName: Yup.string(),
            accName: Yup.string(),
        }),
        
        onSubmit: (values) => {
         
        },
    });

    return (
        <AnimatePresence>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center
            bg-black bg-opacity-40 z-50">
                <div className='max-w-[68rem] w-full flex md:justify-center 
                ss:justify-center md:mx-0 ss:mx-16 mx-0 h-auto'>
                    <motion.div
                    initial={{ y: 0, opacity: 0.7 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className={`bg-white md:rounded-2xl ss:rounded-2xl rounded-xl relative
                    shadow-xl flex flex-col ${showConfirmation ? 'md:w-[65%] ss:w-[80%] w-full' : 'md:w-auto ss:w-auto w-full'} 
                    items-center`}>
                        <div className='flex justify-between items-center w-full
                        border-b border-b-main7 md:py-6 md:px-10 ss:py-6 
                        ss:px-10 py-5 px-5 top-0 sticky z-10'>
                            <h1 className="md:text-[30px] ss:text-[25px] text-[20px] 
                            tracking-tight font-bold text-main2">
                                Bank Transfer
                            </h1>

                            <BsX 
                                className='md:w-[3.1rem] ss:w-[3.1rem] w-[2rem] h-auto 
                                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full cursor-pointer grow2'
                                strokeWidth={0.2}
                                onClick={() => {
                                onClose();
                                enableScroll();
                                }}
                            />
                        </div>

                        {!showConfirmation ? (
                            <>
                                <div className='w-full flex md:flex-row ss:flex-row flex-col 
                                md:gap-8 ss:gap-7 gap-6 items-center justify-center md:px-10 ss:px-10 px-5
                                md:py-12 ss:py-10 py-6 md:justify-between ss:justify-between'>
                                    <div className='w-full flex flex-col gap-3'>
                                        <div className='flex md:gap-3 gap-5 w-full items-center'>
                                            <div className='md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto 
                                            bg-primary1 rounded-full'>
                                                <PiBank 
                                                className='md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto
                                                text-primary md:p-4 ss:p-3 p-4'
                                                />
                                            </div>

                                            <div className='w-full flex flex-col'>
                                                <div className='w-full flex md:gap-2 gap-3 items-center'>
                                                    <h1 className="md:text-[25px] ss:text-[23px] text-[20px] 
                                                    tracking-tight font-bold text-main2">
                                                        5401893281
                                                    </h1>

                                                    <div className='flex items-center gap-1 cursor-pointer'
                                                    onClick={handleCopyClick}
                                                    >
                                                        <img
                                                            src={copy}
                                                            alt='copy'
                                                            className='w-[0.9rem] h-auto text-primary'
                                                        />

                                                        <p className='text-primary text-[12px] tracking-tight font-bold'>
                                                            {copyButtonText}
                                                        </p>
                                                    </div>
                                                </div>

                                                <h2 className="md:text-[16px] ss:text-[16px] text-[13px] 
                                                tracking-tight font-bold text-main2">
                                                    Zenith Bank
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <img
                                                src={
                                                    countries.find(
                                                    (country) => country.cca2 === 'NG'
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="w-8 h-[1.2rem] rounded-[0.2rem]"
                                            />

                                            <p className="md:text-[14px] ss:text-[14px] 
                                            text-[13px] tracking-tight font-bold text-main2">
                                                Nigeria
                                            </p>
                                        </div>

                                        <h1 className="md:text-[25px] ss:text-[23px] text-[20px] 
                                        tracking-tight font-bold text-primary">
                                            ₦412,375.00
                                        </h1>
                                    </div>

                                    <div className='w-[1px] h-full bg-main7 md:flex ss:flex hidden'/>
                                    <div className='w-full h-[1px] bg-main7 md:hidden ss:hidden flex'/>

                                    <div className='w-full flex flex-col gap-3'>
                                        <div className='flex md:gap-3 gap-5 w-full items-center'>
                                            <div className='md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto 
                                            bg-primary1 rounded-full'>
                                                <PiBank 
                                                className='md:w-[5rem] ss:w-[4rem] w-[4.5rem] h-auto
                                                text-primary md:p-4 ss:p-3 p-4'
                                                />
                                            </div>

                                            <div className='w-full flex flex-col'>
                                                <div className='w-full flex md:gap-2 gap-3 items-center'>
                                                    <h1 className="md:text-[25px] ss:text-[23px] text-[20px] 
                                                    tracking-tight font-bold text-main2">
                                                        0017685892
                                                    </h1>

                                                    <div className='flex items-center gap-1 cursor-pointer'
                                                    onClick={handleCopyClick}
                                                    >
                                                        <img
                                                            src={copy}
                                                            alt='copy'
                                                            className='w-[0.9rem] h-auto text-primary'
                                                        />

                                                        <p className='text-primary text-[12px] tracking-tight font-bold'>
                                                            {copyButtonText}
                                                        </p>
                                                    </div>
                                                </div>

                                                <h2 className="md:text-[16px] ss:text-[16px] text-[13px] 
                                                tracking-tight font-bold text-main2">
                                                    Bank of Ireland
                                                </h2>

                                                <p className="md:text-[14px] ss:text-[14px] text-[13px] 
                                                tracking-tight font-semibold text-main4">
                                                    BIC- 013425
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <img
                                                src={
                                                    countries.find(
                                                    (country) => country.cca2 === 'IE'
                                                    )?.flags?.png
                                                }
                                                alt="flag"
                                                className="w-8 h-[1.2rem] rounded-[0.2rem]"
                                            />

                                            <p className="md:text-[14px] ss:text-[14px] 
                                            text-[13px] tracking-tight font-bold text-main2">
                                                Ireland
                                            </p>
                                        </div>

                                        <h1 className="md:text-[25px] ss:text-[23px] text-[20px] 
                                        tracking-tight font-bold text-primary">
                                        €262.44
                                        </h1>
                                    </div>
                                </div>

                                <div className='flex items-center justify-center w-full md:max-w-[40rem]
                                ss:max-w-[35rem] md:pb-8 ss:pb-8 pb-5 md:px-10 ss:px-10 px-5'>
                                    <p className='text-main4 md:text-[13px] ss:text-[13px] text-[12px] trackng-tight
                                    md:leading-[1.2rem] ss:leading-[1.1rem] leading-[1.1rem] md:text-center ss:text-center'>
                                        Transfer the amount seen above to the bank account details related to your country.
                                        <br></br>Ensure you transfer the exact amount shown.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className='w-full flex flex-col items-center justify-center gap-6 
                            md:py-12 ss:py-10 py-20 md:px-10 ss:px-10 px-5'>
                                <div className='flex flex-col items-center gap-2 w-full'>
                                    <h1 className="md:text-[23px] ss:text-[23px] text-[19px] 
                                    tracking-tight font-bold text-main2 text-center md:leading-[1.8rem] 
                                    ss:leading-[1.8rem] leading-[1.6rem] md:max-w-[25rem] ss:max-w-[25rem]">
                                        Please enter the account details <br></br>you sent us the money from
                                    </h1>
                                    
                                    <p className='text-main2 text-[12px] tracking-tight text-center 
                                    md:max-w-[25rem] ss:max-w-[25rem] font-medium'>
                                        This will enable us process your payment as quickly as possible
                                    </p>

                                    <form className='md:w-[70%] ss:w-[80%] w-full flex flex-col gap-4 md:mt-8 ss:mt-8 mt-3'>
                                        <div className="relative flex flex-col">
                                            <input
                                                type="text"
                                                name="accName"
                                                placeholder=' '
                                                value={formik.values.accName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className='md:py-3.5 py-3 md:px-3.5 px-3 
                                                peer outline text-black md:rounded-lg rounded-md 
                                                md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                                bg-transparent w-full focus:outline-primary outline-main6'
                                            />

                                            <label
                                            htmlFor="accName"
                                            className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                            md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                            md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                            duration-300 peer-placeholder-shown:translate-y-0 
                                            peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                            ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                            ${formik.values.accName ? 'z-10 px-2' : ''}
                                            `}
                                            >
                                                Account Name
                                            </label>
                                        </div>

                                        <div className="relative flex flex-col">
                                            <input
                                                type="text"
                                                name="bankName"
                                                placeholder=' '
                                                value={formik.values.bankName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className='md:py-3.5 py-3 md:px-3.5 px-3 
                                                peer outline text-black md:rounded-lg rounded-md 
                                                md:text-[14px] ss:text-[14px] text-[12px] outline-[1px]
                                                bg-transparent w-full focus:outline-primary outline-main6'
                                            />

                                            <label
                                            htmlFor="bankName"
                                            className={`absolute md:left-3.5 left-3 md:top-3.5 top-3 origin-[0] 
                                            md:-translate-y-6 ss:-translate-y-5 -translate-y-5 scale-75 transform text-main6 
                                            md:text-[14px] ss:text-[14px] text-[12px] bg-white peer-focus:px-2
                                            duration-300 peer-placeholder-shown:translate-y-0 
                                            peer-placeholder-shown:scale-100 md:peer-focus:-translate-y-6
                                            ss:peer-focus:-translate-y-5 peer-focus:-translate-y-5
                                            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
                                            ${formik.values.bankName ? 'z-10 px-2' : ''}
                                            `}
                                            >
                                                Bank Name
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className='flex justify-center w-full border-t border-t-main7 md:py-6 md:px-10 
                        ss:py-6 ss:px-10 py-5 px-5 bottom-0 sticky'>
                            <button
                            className={`bg-primary text-[13px] py-3.5 ${showConfirmation ? 'px-14' : 'px-8'}
                            text-white rounded-full grow4 cursor-pointer
                            items-center justify-center mobbut`}
                            onClick={showConfirmation ? handleNext : () => setShowConfirmation(true)}
                            >
                                <p>
                                    {showConfirmation ? 'Submit' : 'I have made payment'}
                                </p>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BankTransferModal;