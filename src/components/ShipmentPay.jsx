import { useState, useEffect } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
// import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { HiOutlineArrowRight } from "react-icons/hi";
import { ShippingModal } from '../components';
import { paystack } from '../assets';

const ShipmentPay = () => {
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = 'hidden';
    document.body.style.top = `-${scrollPosition}px`;
  };


  return (
    <section className='w-full flex md:min-h-[900px] ss:min-h-[1200px]
    min-h-[1200px]'>
        <div className="w-full flex md:flex-row flex-col md:gap-14 gap-10 
        justify-between">
            <div className="w-full flex flex-col gap-6">
                <h1 className='text-primary font-bold md:text-[30px] 
                ss:text-[28px] text-[22px] tracking-tight'>
                    You're about to pay <span className='line-through'>
                    N
                    </span>
                    412,375.00
                </h1>

                <div className="flex flex-col gap-4">
                    <h2 className="font-bold text-[15px] tracking-tight text-main4">
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
                            <p className="md:text-[13px] ss:text-[13px] text-[12px] 
                            tracking-tight font-semibold text-primary underline
                            hover:text-secondary cursor-pointer inline-flex navsmooth"
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

                <div className='w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2'/>
                
                <div className='w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 
                mt-2 flex flex-col gap-4'>
                    <p className="text-main4 text-[11px] font-medium 
                    leading-[16px]">
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
                            // onClick={handlePrevious}
                            >
                                <p className='font-semibold'>
                                    Go back
                                </p>
                            </button>

                            <button
                            className='bg-primary text-[13px] py-3.5 w-[50%] 
                            flex text-white rounded-full grow4 cursor-pointer
                            items-center justify-center gap-3 mobbut'
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
                        className='w-auto h-auto'
                    />
                </div>
            </div>

            <div className="md:w-[55%] ss:w-[60%] md:mb-0 ss:mb-0 mb-8">
                <div className="bg-primary1 md:p-10 ss:p-10 p-5 flex flex-col 
                rounded-2xl gap-6 sticky-cart">
                    <h1 className="font-bold md:text-[16px] ss:text-[16px] text-[15px]
                    tracking-tight text-main2">
                    Payment Summary
                    </h1>

                    <div className="flex flex-col w-full gap-2.5 text-[13px] 
                    tracking-tight">
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
                        <p className="text-[13px]">
                            Subtotal:
                        </p>

                        <p className="text-primary md:text-[23px] ss:text-[22px] 
                        text-[20px] font-bold">
                            <span className='line-through'>
                            N
                            </span>
                            412,375.00
                        </p>
                    </div>

                    <div className='w-full h-[1px] bg-main5'/>

                    <p className="text-main4 text-[11px] font-medium 
                    leading-[16px]">
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
    </section>
  );
};

export default SectionWrapper(ShipmentPay, '');