// import { useState, useEffect } from 'react';
import { GoPlus } from "react-icons/go";


const Shipments = () => {

  return (
    <section className='w-full'>
      <div className='w-full flex flex-col gap-8'>
        <div className="w-full flex md:flex-row flex-col md:gap-0 gap-5 
        md:justify-between items-center">
          <div className='flex flex-col'>
            <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]'>
              Shipments
            </h1>

            <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.2rem]'>
              Create, view, track and manage all your active and delivered 
              shipments in one place
            </h4>
          </div>

          <div className="w-full">
            <button type='button'
            className='bg-primary text-[13px] py-3.5 px-8
            flex text-white rounded-full grow4 cursor-pointer
            items-center justify-center gap-3'>
              <p>
                Create New
              </p>
              
              <GoPlus className='text-[14px]'/>
            </button>
          </div>
        </div>

        <div>

        </div>
      </div>

      {/* <table className="">
        <thead className='md:text-[13px] ss:text-[14px] text-[13px] 
        font-medium text-main4 tracking-tight'>
          <tr>
            <th className="py-3 pr-4 text-left w-1/3">Amount</th>
            <th className="py-3 pr-4 text-left w-1/3">Shipment ID</th>
            <th className="py-3 pr-4 text-left w-1/3">Date</th>
          </tr>
        </thead>

        <tbody className='md:text-[14px] ss:text-[15px] text-[13px] 
        text-main2 font-bold'>
          <tr className='hover:bg-main7 border-b border-main7
          cursor-pointer'>
            <td className="pr-4 py-3"><span className='line-through'>N</span>280,500</td>
            <td className="pr-4 py-3">001F5TG8XR4U</td>
            <td className="pr-4 py-3">29 Oct 2024</td>
          </tr>

          <tr className='hover:bg-main7 border-b border-main7
          cursor-pointer'>
            <td className="pr-4 py-3"><span className='line-through'>N</span>280,500</td>
            <td className="pr-4 py-3">001F5TG8XR4U</td>
            <td className="pr-4 py-3">29 Oct 2024</td>
          </tr>

          <tr className='hover:bg-main7 border-b border-main7
          cursor-pointer'>
            <td className="pr-4 py-3"><span className='line-through'>N</span>280,500</td>
            <td className="pr-4 py-3">001F5TG8XR4U</td>
            <td className="pr-4 py-3">29 Oct 2024</td>
          </tr>
        </tbody>
      </table> */}
    </section>
  );
};

export default Shipments;