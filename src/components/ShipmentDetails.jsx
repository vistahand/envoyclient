import { SectionWrapper } from "../hoc";
import { motion } from "framer-motion";

const ShipmentDetails = () => {
  return (
    <section className='w-full flex md:min-h-[1500px] ss:min-h-[1500px]
    min-h-[1500px]'>
      <div className="w-full md:flex-row ss:flex-row flex-col justify-between">
        <div className="w-[60%] flex flex-col gap-5">
          <h1 className='text-primary font-bold md:text-[30px] 
          ss:text-[25px] text-[22px] tracking-tighter text-center'>
            Your Shipment Details
          </h1>
        </div>

        <div>

        </div>
      </div>
    </section>
  )
};

export default SectionWrapper(ShipmentDetails, '');