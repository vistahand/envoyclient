import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';

const ShipmentDetails = () => {
  return (
    <section className='w-full flex md:min-h-[1500px] ss:min-h-[1500px]
    min-h-[1500px]'>
      <div className="w-full md:flex-row ss:flex-row flex-col justify-between">
        <div className="w-[60%] flex flex-col gap-6">
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

        <div className="bg-primary1 p-6 flex flex-col rounded-lg gap-5">
          <h1 className="font-bold md:text-[15px] ss:text-[15px] text-[14px]
          tracking-tight text-main2">
            Payment Summary
          </h1>

          <div className="">

          </div>
        </div>
      </div>
    </section>
  )
};

export default SectionWrapper(ShipmentDetails, '');