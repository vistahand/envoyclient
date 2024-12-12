import { useState, useEffect } from 'react';
import { SectionWrapper } from "../hoc";
// import { motion } from "framer-motion";
// import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";

const ShipmentDetails = () => {
  const [countries, setCountries] = useState([]);

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
    <section className='w-full flex md:min-h-[1320px] ss:min-h-[1500px]
    min-h-[1500px]'>
      <div className="w-full flex md:flex-row flex-col gap-14 
      justify-between">
        <div className="w-full flex flex-col gap-6">
          <h1 className='text-primary font-bold md:text-[30px] 
          ss:text-[28px] text-[22px] tracking-tight'>
            Your Shipment Details
          </h1>

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
                payment. <a href='/terms' className="text-primary font-semibold">Read our terms for more details.</a>
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

          <div className='w-full h-[1px] bg-main5 mt-4'/>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="font-bold md:text-[15px] ss:text-[15px] 
            text-[14px] tracking-tight text-main4">
              PACKAGE DETAILS
            </h2>

            <div className='flex items-center text-primary gap-3'>
              <BsBoxSeam 
                className='w-[1.5rem] h-auto text-primary'
              />

              <h2 className='md:text-[15px] ss:text-[15px] text-[14px] 
              font-bold tracking-tight'
              >
                Parcel
              </h2>
            </div>

            <div className="flex flex-wrap gap-5 items-center">
              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                tracking-tight font-medium text-main2">
                  Weight
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                font-medium text-main2">
                  -
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-bold text-main2">
                  12kg
                </p>
              </div>

              <div className='h-[80%] w-[1px] bg-main4'/>

              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  Length
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                font-medium text-main2">
                  -
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-bold text-main2">
                  15cm
                </p>
              </div>

              <div className='h-[80%] w-[1px] bg-main4'/>

              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  Width
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                font-medium text-main2">
                  -
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-bold text-main2">
                  24cm
                </p>
              </div>

              <div className='h-[80%] w-[1px] bg-main4'/>

              <div className="flex items-center gap-1">
                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  Height
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                font-medium text-main2">
                  -
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                tracking-tight font-bold text-main2">
                  20cm
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 items-center">
              <p className="md:text-[15px] ss:text-[15px] text-[12px]  
              tracking-tight font-medium text-main2">
                Fragile
              </p>

              <div className='h-[80%] w-[1px] bg-main4'/>

              <p className="md:text-[15px] ss:text-[15px] text-[12px]  
              tracking-tight font-medium text-main2">
                Perishable
              </p>
            </div>
          </div>

          <div className='w-full h-[1px] bg-main5 mt-4'/>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="font-bold md:text-[15px] ss:text-[15px] 
            text-[14px] tracking-tight text-main4">
              CONTACT DETAILS
            </h2>

            <div className="flex w-full justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="md:text-[15px] ss:text-[15px] text-[12px] 
                  tracking-tight font-bold text-main2">
                    Rufus Benson Antagony
                  </h3>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                  tracking-tight font-medium text-main2">
                    rufusbantags@email.com
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    0901 234 5678
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    No. 5 Friday Anazodo Street
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                  tracking-tight font-medium text-main2">
                    Cleveland Estates
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    Brooks Heights, Dublin
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    Leinster, <span className="font-bold">IE.</span>
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                    tracking-tight font-medium text-main2">
                      456789
                    </p>

                    <div className='h-[70%] w-[1px] bg-main4'/>

                    <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                    tracking-tight font-medium text-main2">
                      Tax ID: 34FA89000HJ1
                    </p>
                  </div>
                </div>

                <div>
                  <p className="md:text-[13px] ss:text-[13px] text-[10px] 
                  tracking-tight font-semibold text-primary underline
                  hover:text-secondary cursor-pointer inline-flex navsmooth"
                  // onClick={f}
                  >
                    Change shipping address
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="md:text-[15px] ss:text-[15px] text-[12px] 
                  tracking-tight font-bold text-main2">
                    Annabella Isiagu Johnbosco
                  </h3>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                  tracking-tight font-medium text-main2">
                    annabellajb24@email.com
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    0703 123 4567
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    15 Barracks Road
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                  tracking-tight font-medium text-main2">
                    Off Biogbolo School Road
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    Biogbolo, Yenagoa
                  </p>

                  <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                  tracking-tight font-medium text-main2">
                    Bayelsa, <span className="font-bold">NG.</span>
                  </p>

                  <div className="flex items-center gap-3">
                    <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                    tracking-tight font-medium text-main2">
                      123890
                    </p>

                    <div className='h-[70%] w-[1px] bg-main4'/>

                    <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                    tracking-tight font-medium text-main2">
                      Tax ID: NG0685TGY8R
                    </p>
                  </div>
                </div>

                <div>
                  <p className="md:text-[13px] ss:text-[13px] text-[10px] 
                  tracking-tight font-semibold text-primary underline
                  hover:text-secondary cursor-pointer inline-flex navsmooth"
                  // onClick={f}
                  >
                    Change recipient address
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full h-[1px] bg-main5 mt-4'/>

          <div className="flex flex-col gap-4 mt-4">
            <h2 className="font-bold md:text-[15px] ss:text-[15px] 
            text-[14px] tracking-tight text-main4">
              PICKUP LOCATION
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-0.5">
                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  276 Garden Heights Road
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px] 
                tracking-tight font-medium text-main2">
                  Heightenton Industrial Layout
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  Brooks Heights, Dublin
                </p>

                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  Leinster, <span className="font-bold">IE.</span>
                </p>
                
                <p className="md:text-[15px] ss:text-[15px] text-[12px]  
                tracking-tight font-medium text-main2">
                  456882
                </p>
              </div>

              <div>
                <p className="md:text-[13px] ss:text-[13px] text-[10px] 
                tracking-tight font-semibold text-primary underline
                hover:text-secondary cursor-pointer inline-flex navsmooth"
                // onClick={f}
                >
                  Change pickup location
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[55%] ss:w-[60%]">
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

            <a href='/createshipment-paymentreview'
            className='bg-primary py-3 w-full flex text-white rounded-full 
            grow4 cursor-pointer items-center gap-3 justify-center'
            >
              <p className='text-[12px]'>
                Proceed to Payment
              </p>
              
              <HiOutlineArrowRight className='text-[14px]'/>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
};

export default SectionWrapper(ShipmentDetails, '');