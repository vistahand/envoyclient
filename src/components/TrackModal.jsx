import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsX } from 'react-icons/bs';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { tracking } from '../assets';
import { GrLocation } from "react-icons/gr";

const TrackModal = ({ onClose }) => {
  const formRef = useRef();
  // const navigate = useNavigate();

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
          items-center">
            <div className='flex justify-end items-center w-full
            md:py-6 md:px-12 ss:py-6 ss:px-12 py-4 px-5 top-0 absolute 
            z-10'>
              <BsX 
                className='md:w-[3.2rem] ss:w-[3.2rem] w-[2rem] h-auto 
                text-redClose bg-redCircle md:p-2.5 ss:p-2.5 p-1.5 rounded-full 
                cursor-pointer grow2'
                strokeWidth={0.2}
                onClick={() => {
                  onClose();
                  enableScroll();
                }}
              />
            </div>

            <div className='flex w-full md:justify-between md:gap-14
            ss:gap-10 gap-8'>
              <div className='md:w-[50%] ss:w-[70%] md:hidden flex'>
                <div className='w-full relative ss:rounded-2xl rounded-xl'>
                  <img
                    src={tracking}
                    alt='trackshipment'
                    className='object-cover ss:rounded-2xl rounded-xl'
                  />
                </div>
              </div>

              <div className='md:w-[50%] w-full flex flex-col gap-8
              justify-between'>
                <GrLocation 
                  className='md:w-[5rem] ss:w-[5rem] w-[4rem] h-auto 
                  text-primary bg-primary1 md:p-3 ss:p-3 p-2 rounded-full'
                  strokeWidth={0.2}
                />
                
                <div className='flex flex-col gap-6 w-full'>
                  <h1 className='text-primary font-bold md:text-[35px]
                  ss:text-[33px] text-[27px] tracking-tight'>
                    Track a Shipment
                  </h1>

                  <h2 className="md:text-[25px] ss:text-[23px] text-[18px]  
                  tracking-tight font-medium text-main2 md:leading-[25px]
                  ss:leading-[23px] leading-[20px]">
                    Enter your shipment tracking ID to see where your
                    package is and where it's been in real time.
                  </h2>

                  
                </div>

                <div className='flex md:justify-end ss:justify-end w-full
                md:py-6 md:px-12 ss:py-6 ss:px-12 py-4 px-5'>
                  <div className="flex md:flex-row ss:flex-row flex-col 
                  w-full items-center md:gap-5 ss:gap-5 gap-3">
                    <a href='/createshipment-payment' 
                    className='text-primary text-[17px] underline cursor-pointer 
                    font-bold'>
                      I don't remember my tracking ID
                    </a>

                    <a href='/createshipment-payment'
                    className='text-primary text-[17px] underline cursor-pointer 
                    font-bold'>
                      Still need help? Contact Us
                    </a>
                  </div>
                </div>
              </div>

              <div className='w-[50%] md:flex hidden'>
                <div className='w-full relative rounded-2xl'>
                  <img
                    src={tracking}
                    alt='trackshipment'
                    className='object-cover rounded-2xl'
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrackModal;