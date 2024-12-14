import { useState } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
// import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { HiOutlineArrowRight } from "react-icons/hi";
import { PiWarningCircle } from "react-icons/pi";
import { ShippingModal, PaystackModal } from '../components';
import { paystack } from '../assets';

const ShipmentPay = ({ onPrev }) => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isPayStackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

    const disableScroll = () => {
        setScrollPosition(window.pageYOffset);
        document.body.style.overflow = 'hidden';
        document.body.style.top = `-${scrollPosition}px`;
    };

    const handlePay = () => {
        setIsPaystackModalOpen(true);
        disableScroll();
    };

    const handlePrevious = () => {
        onPrev();
    };


  return (
    <section className='w-full flex md:min-h-[600px] ss:min-h-[800px]
    min-h-[800px]'>
        <div className="w-full flex md:flex-row flex-col gap-14 
        justify-between">
            <div className="w-full flex flex-col gap-6">
                <h1 className='text-primary font-bold md:text-[30px] 
                ss:text-[28px] text-[22px] tracking-tight'>
                    You're about to pay <span className='line-through'>
                    N
                    </span>
                    412,375.00
                </h1>

                <div className="flex flex-col gap-4 w-full">
                    <div className='flex items-center gap-2 rounded-xl 
                    bg-primary1 px-5 py-3.5 cursor-pointer w-full'>
                        <PiWarningCircle 
                            className='md:w-[1.8rem] ss:w-[1.8rem] w-[3.2rem] 
                            h-auto text-primary'
                        />

                        <p className='text-main4 md:text-[14px] ss:text-[14px] 
                        text-[12px] md:leading-[1.3rem] ss:leading-[1.3rem] 
                        leading-[1.1rem] tracking-tight font-medium'>
                            NB: Your billing address has been set to 
                            your shipping address by default as a guest. 
                            To  change this, you can <a href='/createshipment-payment' className='font-bold text-primary'>
                            create an account
                            </a> or <a href='/createshipment-payment' className='font-bold text-primary'>login here</a>
                        </p>
                    </div>

                    <h2 className="font-bold md:text-[18px] ss:text-[18px] 
                    text-[15px] tracking-tight text-main4 mt-2">
                        BILLING DETAILS
                    </h2>

                    <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                        <div className="flex flex-col gap-0.5">
                            <h3 className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-bold text-main2">
                                Rufus Benson Antagony
                            </h3>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-medium text-main2">
                                rufusbantags@email.com
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2">
                                0901 234 5678
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2">
                                No. 5 Friday Anazodo Street
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-medium text-main2">
                                Cleveland Estates
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2">
                                Brooks Heights, Dublin
                            </p>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2">
                                Leinster, <span className="font-bold">IE.</span>
                            </p>

                            <div className="flex items-center gap-3">
                                <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                                tracking-tight font-medium text-main2">
                                    456789
                                </p>

                                <div className='h-[70%] w-[1px] bg-main4'/>

                                <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                                tracking-tight font-medium text-main2">
                                    Tax ID: 34FA89000HJ1
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[13px] navsmooth underline
                            tracking-tight font-semibold text-primary 
                            hover:text-secondary cursor-pointer inline-flex "
                            onClick={() => {
                                setIsShippingModalOpen(true);
                                disableScroll();
                            }}
                            >
                                Change shipping address
                            </p>
                        </div>
                    </div>
                </div>

                <div className='w-full h-[1px] bg-main5 mt-2'/>
                
                <div className='w-full mt-2 flex flex-col gap-5'>
                    <p className="text-main4 text-[12px] font-medium 
                    leading-[18px]">
                        By clicking on the Pay Now button, you agree to 
                        Envoy Angel's Terms of Service and Privacy Policy 
                        and acknowledge that payment processing is securely 
                        handled by Paystack. You consent to Paystack's 
                        Terms of Service and Privacy Policy, which govern 
                        the handling of your payment information. Please 
                        review both policies carefully to understand your 
                        rights and obligations.
                    </p>
                    
                    <div className='w-full'>
                        <div className="flex items-center md:w-[55%] ss:w-[55%]
                        md:gap-5 ss:gap-5 gap-3">
                            <button
                            className='bg-none text-[13px] py-3.5 w-[50%]
                            text-primary rounded-full grow2 cursor-pointer
                            items-center justify-center border border-primary'
                            onClick={handlePrevious}
                            >
                                <p className='font-semibold'>
                                    Go back
                                </p>
                            </button>

                            <button
                            className='bg-primary text-[13px] py-3.5 w-[50%] 
                            flex text-white rounded-full grow4 cursor-pointer
                            items-center justify-center gap-3'
                            onClick={handlePay}
                            >
                                <p>
                                    Pay Now
                                </p>
                                
                                <HiOutlineArrowRight className='text-[14px]'/>
                            </button>
                        </div>
                    </div>

                    <img
                        src={paystack}
                        alt='paystack'
                        className='md:w-[10rem] ss:w-[10rem] w-[9rem] h-auto'
                    />
                </div>
            </div>

            <div className="md:w-[55%] ss:w-[60%] md:mb-0 ss:mb-0 mb-8">
                <div className="bg-primary1 md:p-10 ss:p-10 p-5 flex flex-col 
                rounded-2xl md:gap-6 ss:gap-6 gap-5 sticky-cart">
                    <h1 className="font-bold text-[16px] tracking-tight text-main2">
                        Payment Summary
                    </h1>

                    <div className="flex flex-col w-full gap-2.5 md:text-[13px] 
                    ss:text-[15px] text-[14px] tracking-tight">
                        <div className="flex justify-between items-center w-full
                        text-main2 font-medium">
                            <p>
                                Shipment Cost
                            </p>

                            <p>
                            <span className='line-through'>
                                N
                            </span>
                                365,000.00
                            </p>
                        </div>

                        <div className="flex justify-between items-center w-full
                        text-main2 font-medium">
                            <p>
                                VAT (7.5%)
                            </p>

                            <p>
                            <span className='line-through'>
                                N
                            </span>
                                27,375.00
                            </p>
                        </div>

                        <div className="flex justify-between items-center w-full
                        text-main2 font-medium">
                            <p>
                                Insurance Coverage (Basic)
                            </p>

                            <p>
                            <span className='line-through'>
                                N
                            </span>
                                20,000.00
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                        <p className="md:text-[13px] ss:text-[15px] text-[14px]">
                            Subtotal:
                        </p>

                        <p className="text-primary md:text-[23px] ss:text-[24px] 
                        text-[22px] font-bold">
                            <span className='line-through'>
                            N
                            </span>
                            412,375.00
                        </p>
                    </div>

                    <div className='w-full h-[1px] bg-main5'/>

                    <p className="text-main4 md:text-[12px] ss:text-[13px]
                    text-[12px] font-medium md:leading-[17px] ss:leading-[18px]
                    leading-[17px]">
                        This figure does not include any other extra fees that may 
                        be incurred via delayed orders, payment gateway fees, etc. 
                        For more details, <a href='/terms' className="text-primary font-semibold">read our terms of usage here.</a>
                    </p>
                </div>
            </div>
        </div>

        {isShippingModalOpen && (
            <ShippingModal 
                onClose={() => setIsShippingModalOpen(false)}
            />
        )}

        {isPayStackModalOpen && (
            <PaystackModal 
                onClose={() => setIsPaystackModalOpen(false)}
            />
        )}
    </section>
  );
};

export default SectionWrapper(ShipmentPay, '');