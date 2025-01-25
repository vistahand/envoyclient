import { useState, useEffect } from 'react';
// import { motion } from "framer-motion";
// import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../../assets/int-ship.svg';
import { BsBoxSeam } from "react-icons/bs";
import { TbTrashX } from "react-icons/tb";
import { PiWarningOctagon } from "react-icons/pi";
import { ShippingModal, RecipientModal, PickupModal } from '../../components';

const ShipmentDetails = () => {
  const [countries, setCountries] = useState([]);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const disableScroll = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = 'hidden';
    document.body.style.top = `-${scrollPosition}px`;
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


  return (
    <section className='w-full flex mb-6'>
        <div className="w-full flex flex-col gap-6">
            <div className='w-full flex justify-between items-center'>
                <div className='flex flex-col w-full'>
                    <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
                    ss:text-[30px] text-[23px]'>
                        Shipment Details - 001F5TG8XR4U
                    </h1>

                    <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
                    ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
                    leading-[1.2rem]'>
                        Full details of your shipment. 
                    </h4>
                </div>

                <div className="flex items-center md:w-[43%] ss:w-[43%] gap-4">
                   <button
                    className='bg-main7 text-[14px] py-3 w-[50%] 
                    flex text-main2 rounded-xl grow4 cursor-pointer
                    items-center justify-center gap-2'
                    // onClick={handlePay}
                    >
                        <p className='font-semibold'>
                           Report a problem
                        </p>

                        <PiWarningOctagon className='text-[16px]'/> 
                    </button>

                    <button
                    className='bg-logRed text-[14px] py-3 w-[50%] 
                    flex text-white rounded-xl grow4 cursor-pointer
                    items-center justify-center gap-2'
                    // onClick={handlePay}
                    >
                        <p className='font-semibold'>
                            Cancel Shipment
                        </p>
                        
                        <TbTrashX className='text-[16px]'/>
                    </button>
                </div>
            </div>
            

            <div className="flex flex-col gap-4">
                <h2 className="font-bold text-[15px] tracking-tight text-main4">
                    SHIPPING DETAILS
                </h2>

                <div className='flex items-center text-primary gap-2'>
                    <InternationalIcon 
                        className='w-[1.8rem] h-auto object-contain
                        stroke-primary'
                    />

                    <h2 className='text-[15px] font-bold tracking-tight'
                    >
                        International Shipping
                    </h2>
                </div>

                <div className="w-full flex gap-6 items-center">
                    <div className="rounded-lg md:px-8 ss:px-8 px-6 md:py-5 
                    ss:py-5 py-4 bg-mainalt flex gap-2">
                        <img
                            src={
                                countries.find(
                                (country) => country.cca2 === 'IE'
                                )?.flags?.png
                            }
                            alt="flag"
                            className="w-10 h-[1.4rem] rounded-[0.2rem]"
                        />

                        <p className="md:text-[15px] ss:text-[15px] 
                        text-[14px] tracking-tight font-bold text-main2">
                            Ireland
                        </p>
                    </div>

                    <p className="md:text-[15px] ss:text-[15px] 
                    text-[14px] tracking-tight font-semibold text-main4">
                        to
                    </p>

                    <div className="rounded-lg  md:px-8 ss:px-8 px-6 md:py-5 
                    ss:py-5 py-4 bg-mainalt flex gap-2">
                        <img
                            src={
                                countries.find(
                                (country) => country.cca2 === 'NG'
                                )?.flags?.png
                            }
                            alt="flag"
                            className="w-10 h-[1.4rem] rounded-[0.2rem]"
                        />

                        <p className="md:text-[15px] ss:text-[15px] 
                        text-[14px] tracking-tight font-bold text-main2">
                            Nigeria
                        </p>
                    </div>
                </div>

                <div className="flex flex-col w-full gap-1">
                    <p className="text-[14px] tracking-tight font-medium 
                    text-main4">
                        Shipping Date
                    </p>

                    <h1 className="md:text-[25px] ss:text-[23px] 
                        text-[20px] tracking-tight font-bold text-main2">
                        Monday 28th October, 2024
                    </h1>

                    <p className="text-main4 text-[12px] font-medium 
                    md:leading-[16px] leading-[17px] tracking-tight">
                        Shipments may not always be shipped on the date of
                        payment. <a target='blank' href='/terms' className="text-primary font-semibold">Read our terms for more details.</a>
                    </p>
                </div>

                <div className="flex flex-col w-full gap-1 mt-3">
                    <p className="text-[14px] tracking-tight font-medium 
                    text-main4">
                        Estimated Delivery Date
                    </p>

                    <h1 className="md:text-[25px] ss:text-[23px] 
                        text-[20px] tracking-tight font-bold text-main2">
                        Friday 1st November, 2024
                    </h1>

                    <p className="text-main4 text-[12px] font-medium 
                    md:leading-[16px] leading-[17px] tracking-tight">
                        Estimated delivery date only valid if you make payment
                        before 6PM on 29th October, 2024
                    </p>
                </div>
            </div>

            <div className='w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2'/>

            <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
                <h2 className="font-bold text-[15px] tracking-tight text-main4">
                    PACKAGE DETAILS
                </h2>

                <div className='flex items-center text-primary gap-3'>
                    <BsBoxSeam 
                        className='w-[1.5rem] h-auto text-primary'
                    />

                    <h2 className='text-[15px] font-bold tracking-tight'
                    >
                        Parcel
                    </h2>
                </div>

                <div className="flex flex-wrap gap-5 items-center">
                    <div className="flex items-center gap-1">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                        tracking-tight font-medium text-main2">
                            Weight
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                        font-medium text-main2">
                            -
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2">
                            12kg
                        </p>
                    </div>

                    <div className='md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4'/>

                    <div className="flex items-center gap-1">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            Length
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        font-medium text-main2">
                            -
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2">
                            15cm
                        </p>
                    </div>

                    <div className='md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4'/>

                    <div className="flex items-center gap-1">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            Width
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        font-medium text-main2">
                            -
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-bold text-main2">
                            24cm
                        </p>
                    </div>

                    <div className='md:h-[80%] ss:h-[80%] h-[30%] w-[1px] bg-main4'/>

                    <div className="flex items-center gap-1">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                        Height
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        font-medium text-main2">
                            -
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                        tracking-tight font-bold text-main2">
                            20cm
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-5 items-center">
                    <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                    tracking-tight font-medium text-main2">
                        Fragile
                    </p>

                    <div className='h-[80%] w-[1px] bg-main4'/>

                    <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                    tracking-tight font-medium text-main2">
                        Perishable
                    </p>
                </div>
            </div>

            <div className='w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2'/>

            <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
                <h2 className="font-bold text-[15px] tracking-tight 
                text-main4">
                    CONTACT DETAILS
                </h2>

                <div className="flex md:flex-row ss:flex-row flex-col w-full 
                justify-between md:gap-0 ss:gap-0 gap-5">
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
                            <p className="text-[13px] tracking-tight font-semibold 
                            text-primary underline hover:text-secondary cursor-pointer 
                            inline-flex navsmooth"
                            onClick={() => {
                                setIsShippingModalOpen(true);
                                disableScroll();
                            }}
                            >
                                Change shipping address
                            </p>
                        </div>
                    </div>

                <div className="flex flex-col md:gap-6 ss:gap-6 gap-5">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="md:text-[15px] ss:text-[15px] text-[14px] 
                        tracking-tight font-bold text-main2">
                            Annabella Isiagu Johnbosco
                        </h3>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                        tracking-tight font-medium text-main2">
                            annabellajb24@email.com
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            0703 123 4567
                        </p>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            15 Barracks Road
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                        tracking-tight font-medium text-main2">
                            Off Biogbolo School Road
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            Biogbolo, Yenagoa
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            Bayelsa, <span className="font-bold">NG.</span>
                        </p>

                        <div className="flex items-center gap-3">
                            <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                            tracking-tight font-medium text-main2">
                                123890
                            </p>

                            <div className='h-[70%] w-[1px] bg-main4'/>

                            <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                            tracking-tight font-medium text-main2">
                             Tax ID: NG0685TGY8R
                            </p>
                        </div>
                    </div>

                    <div>
                    <p className="text-[13px] tracking-tight font-semibold 
                    text-primary underline hover:text-secondary cursor-pointer 
                    inline-flex navsmooth"
                    onClick={() => {
                        setIsRecipientModalOpen(true);
                        disableScroll();
                    }}
                    >
                        Change recipient address
                    </p>
                    </div>
                </div>
                </div>
            </div>

            <div className='w-full h-[1px] bg-main5 md:mt-4 ss:mt-4 mt-2'/>

            <div className="flex flex-col gap-4 md:mt-4 ss:mt-4 mt-2">
                <h2 className="font-bold text-[15px] tracking-tight text-main4">
                    PICKUP LOCATION
                </h2>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-0.5">
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            276 Garden Heights Road
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px] 
                        tracking-tight font-medium text-main2">
                            Heightenton Industrial Layout
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            Brooks Heights, Dublin
                        </p>

                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            Leinster, <span className="font-bold">IE.</span>
                        </p>
                        
                        <p className="md:text-[15px] ss:text-[15px] text-[14px]  
                        tracking-tight font-medium text-main2">
                            456882
                        </p>
                    </div>

                    <div>
                        <p className="text-[13px] tracking-tight font-semibold 
                        text-primary underline hover:text-secondary cursor-pointer 
                        inline-flex navsmooth"
                        onClick={() => {
                        setIsPickupModalOpen(true);
                        disableScroll();
                        }}
                        >
                            Change pickup location
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {isShippingModalOpen && (
            <ShippingModal 
                onClose={() => setIsShippingModalOpen(false)}
            />
        )}

        {isRecipientModalOpen && (
            <RecipientModal 
                onClose={() => setIsRecipientModalOpen(false)}
            />
        )}

        {isPickupModalOpen && (
            <PickupModal 
                onClose={() => setIsPickupModalOpen(false)}
            />
        )}
    </section>
  )
};

export default ShipmentDetails;