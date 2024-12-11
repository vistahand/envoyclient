import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';

const ShipmentDetails = () => {
  return (
    <section className='w-full flex md:min-h-[1500px] ss:min-h-[1500px]
    min-h-[1500px]'>
      <div className="w-full flex md:flex-row ss:flex-row flex-col 
      gap-6 justify-between">
        <div className="w-full flex flex-col gap-6">
          <h1 className='text-primary font-bold md:text-[30px] 
          ss:text-[25px] text-[22px] tracking-tighter'>
            Your Shipment Details
          </h1>

          <div className="flex flex-col gap-3">
            <h2 className="font-bold md:text-[15px] ss:text-[15px] 
            text-[14px] tracking-tight text-main4">
              SHIPPING DETAILS
            </h2>

            <div className='flex items-center text-primary gap-2'>
              <InternationalIcon 
                className='w-[1.8rem] h-auto object-contain
                stroke-primary'
              />

              <h2 className='md:text-[15px] ss:text-[15px] text-[14px] 
              font-bold tracking-tight'
              >
                International Shipping
              </h2>
            </div>
          </div>
        </div>

        <div className="md:w-[45%] ss:w-[45%]">
          <div className="bg-primary1 md:p-8 ss:p-8 p-6 flex flex-col 
          rounded-lg gap-5">
            <h1 className="font-bold md:text-[15px] ss:text-[15px] text-[14px]
            tracking-tight text-main2">
              Payment Summary
            </h1>

            <div className="flex flex-col w-full gap-3 md:text-[14px] 
            ss:text-[14px] text-[13px]">
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
              <p className="md:text-[14px] ss:text-[14px] text-[13px]">
                Subtotal:
              </p>

              <p className="text-primary md:text-[20px] ss:text-[20px] 
              text-[17px] font-bold">
                <span className='line-through'>
                  N
                </span>
                412,375.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

export default SectionWrapper(ShipmentDetails, '');