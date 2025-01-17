import { useState } from 'react';
import { GoPlus } from "react-icons/go";
import { HiOutlineSearch } from "react-icons/hi";
import { shipmentHead } from '../../constants';
// import { VscArrowSwap } from "react-icons/vsc";

const Shipments = () => {
  const [selectedTab, setSelectedTab] = useState('active');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section className='w-full'>
      <div className='w-full flex flex-col gap-8'>
        <div className="w-full flex md:flex-row flex-col md:gap-0 gap-5 
        md:justify-between md:items-center">
          <div className='flex flex-col'>
            <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]'>
              Shipments
            </h1>

            <h4 className='text-main2 trackin
            g-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.2rem]'>
              Create, view, track and manage all your active and delivered 
              shipments in one place
            </h4>
          </div>
        
          <button type='button'
          className='bg-primary md:text-[14px] ss:text-[15px] text-[13px]
          py-3 px-6 flex text-white rounded-xl grow4 cursor-pointer
          items-center justify-center gap-3'>
            <p>
              Create New
            </p>
            
            <GoPlus className='text-[20px]'/>
          </button>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center md:gap-6 ss:gap-6 gap-5 
          tracking-tight">
            <h2 className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            ${selectedTab === 'active' 
            ? 'text-primary font-extrabold border-b-primary border-b-[2px] px-3' : 'font-semibold'} 
              md:pb-2 ss:pb-2 pb-1 text-center cursor-pointer
              hover:text-primary navsmooth3`} 
              onClick={() => handleTabChange('active')}
            >
              Active
            </h2>

            <h2 className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            text-center hover:text-primary cursor-pointer navsmooth3
            ${selectedTab === 'delivered' 
            ? 'text-primary font-extrabold border-b-primary border-b-[2px] px-3' : 'font-semibold'}
            md:pb-2 ss:pb-2 pb-1`} 
            onClick={() => handleTabChange('delivered')}
            >
              Delivered
            </h2>

            <h2 className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            text-center hover:text-primary cursor-pointer navsmooth3
            ${selectedTab === 'pending' 
            ? 'text-primary font-extrabold border-b-primary border-b-[2px] px-3' : 'font-semibold'}
            md:pb-2 ss:pb-2 pb-1`} 
            onClick={() => handleTabChange('pending')}
            >
              Pending
            </h2>
          </div>

          <div className="w-full">
            <div className="md:w-[40%] ss:w-[70%] w-full rounded-lg p-3 
            gap-5 outline outline-[1px] outline-main7 bg-mainalt flex 
            items-center justify-between">
              <input
                type="text"
                placeholder="Search by origin, destination, recipient details, etc."
                className="text-main8 focus:outline-none text-[14px] w-full
                placeholder:text-[13px] placeholder:text-main8 font-medium 
                tracking-tight bg-transparent"
              />

              <HiOutlineSearch
                className='w-[1.4rem] h-auto text-main8 cursor-pointer'
              />
            </div>
          </div>

          <div className="w-full rounded-lg outline outline-[1px] outline-main9
          md:p-5 ss:p-5 p-4 flex flex-col gap-5">
            <table className="w-full rounded-lg outline outline-[1px] 
            outline-main9 md:p-5 ss:p-5 p-4">
              <thead className='md:text-[14px] ss:text-[14px] text-[13px] 
              font-medium text-main4 tracking-tight'>
                <tr className='w-full'>
                  {shipmentHead.map((item, index) => (
                    <th 
                    key={index}
                    index={index}
                    className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 
                    ss:py-5 py-4">
                      {item.title}
                      {/* {item.id === "shipdate" || item.id === "estDelivery" && (
                        <VscArrowSwap className="w-2.5 h-2.5 pl-3" />
                      )} */}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>

            <div className="w-full border-t-[1px] border-main9 px-5 py-5">
              <div className="flex items-center justify-end md:gap-7
              ss:gap-7 gap-5 text-main8 md:text-[14px] ss:text-[15px]
              text-[14px] tracking-tight font-medium">
                Rows per page:
              </div>
            </div>
          </div>
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