import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";
import { ReactComponent as LocalIcon } from '../assets/loc-ship.svg';
import { ReactComponent as InternationalIcon } from '../assets/int-ship.svg';

const ShipmentDetails = () => {
  return (
    <section className='w-full flex md:min-h-[1500px] ss:min-h-[1500px]
    min-h-[1500px]'>
      <div className="w-full md:flex-row ss:flex-row flex-col justify-between">
        <div className="w-[60%] flex flex-col gap-8">
          <h1 className='text-primary font-bold md:text-[30px] 
          ss:text-[25px] text-[22px] tracking-tighter'>
            Your Shipment Details
          </h1>

          <div className="flex flex-col gap-5">
            <h2 className="font-bold md:text-[20px] ss:text-[20px] 
            text-[16px] tracking-tight text-main4">
              SHIPPING DETAILS
            </h2>

            <div className='flex items-center text-primary gap-3'>
              <InternationalIcon 
                className='w-[2.3rem] h-auto object-contain
                stroke-primary'
              />

              <h2 className='md:text-[18px] ss:text-[18px] 
              text-[15px] font-bold'
              >
                International Shipping
              </h2>
            </div>
          </div>
        </div>

        <div>

        </div>
      </div>
    </section>
  )
};

export default SectionWrapper(ShipmentDetails, '');