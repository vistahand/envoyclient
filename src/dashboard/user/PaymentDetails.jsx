import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiOutlineDocumentDownload } from "react-icons/hi";
import { PiWarningOctagon } from "react-icons/pi";

const PaymentDetails = () => {
  const navigate = useNavigate(); 

  return (
    <section className='w-full flex mb-6'>
        <div className="w-full flex flex-col gap-6">
            <div className='w-full flex items-center md:gap-0 ss:gap-5 gap-4 mb-3'>
                <div className='flex flex-col w-full'>
                    <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
                    ss:text-[30px] text-[23px]'>
                        Payment Details - TRX-18084578123
                    </h1>

                    <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
                    ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem]
                    leading-[1.2rem]'>
                        Full details for the payment
                    </h4>
                </div>

                <div className="flex items-center md:gap-3 ss:gap-3 gap-2 justify-end">
                    <button type='button'
                    onClick={() => navigate(-1)}
                    className='bg-mainalt md:text-[14px] ss:text-[15px] text-[13px] font-semibold outline outline-[1px] outline-main7
                    md:py-3 ss:py-3 py-2.5 md:px-8 ss:px-3 px-2.5 flex text-main2 md:rounded-xl rounded-lg whitespace-nowrap
                    grow4 cursor-pointer items-center justify-center gap-3 md:w-auto'>
                        <HiArrowLeft className='md:text-[20px] ss:text-[18px] text-[17px]'/>

                        <p className='hidden md:flex'>
                            Go back
                        </p>
                    </button>
                   
                   <button
                    className='bg-main7 md:text-[14px] ss:text-[14px] text-[13px] 
                    flex text-main2 md:rounded-xl rounded-lg grow4 cursor-pointer whitespace-nowrap
                    items-center justify-center gap-2 md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-3 px-2.5'
                    // onClick={handlePay}
                    >
                        <p className='font-semibold hidden md:flex'>
                           Report a problem
                        </p>

                        <PiWarningOctagon className='md:text-[16px] ss:text-[18px] text-[17px]'/> 
                    </button>

                    <button
                    className='bg-primary md:text-[14px] ss:text-[14px] text-[13px]
                    flex text-white md:rounded-xl rounded-lg grow4 cursor-pointer whitespace-nowrap
                    items-center justify-center gap-2 md:py-3 ss:py-3 py-2.5 md:px-6 ss:px-3 px-2.5'
                    // onClick={handlePay}
                    >
                        <p className='font-semibold hidden md:flex'>
                            Download Receipt
                        </p>
                        
                        <HiOutlineDocumentDownload className='md:text-[16px] ss:text-[18px] text-[17px]'/>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:gap-7 ss:gap-7 gap-6 md:p-8 ss:p-8 p-5 bg-mainalt md:rounded-2xl ss:rounded-2xl rounded-xl">
                <h2 className="font-bold md:text-[27px] ss:text-[25px] text-[21px] 
                tracking-tight text-primary">
                    ₦250,000.00
                </h2>
              
                <div className="flex flex-col gap-1">
                    <h2 className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
                    tracking-tight text-main4">
                        REFERENCE
                    </h2>

                    <h2 className="font-semibold md:text-[17px] ss:text-[17px] text-[15px]  
                    tracking-tight text-main2">
                        TRX-18084578123
                    </h2>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
                    tracking-tight text-main4">
                        STATUS
                    </h2>

                    <div className='flex md:gap-3 ss:gap-3 gap-2 items-center'>
                        <div className={`inline-block w-2.5 h-2.5 rounded-full bg-greenSuccess`} />

                        <h2 className="font-semibold md:text-[17px] ss:text-[17px] text-[15px]  
                        tracking-tight text-main2">
                            Successful
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
                    tracking-tight text-main4">
                        DATE INITIATED
                    </h2>

                    <h2 className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
                    tracking-tight text-main2">
                        28 Oct 2024
                    </h2>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
                    tracking-tight text-main4">
                        PAYMENT PURPOSE
                    </h2>

                    <h2 className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
                    tracking-tight text-main2">
                        Standard Shipping, Basic Insurance
                    </h2>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
                    tracking-tight text-main4">
                        BILLED TO
                    </h2>

                    <h2 className="font-semibold md:text-[17px] ss:text-[17px] text-[15px] 
                    tracking-tight text-main2">
                        Rufus Benson Antagony
                    </h2>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="font-bold md:text-[15px] ss:text-[15px] text-[13px] 
                    tracking-tight text-main4">
                        PAYMENT METHOD
                    </h2>

                    <h2 className="font-semibold md:text-[17px] ss:text-[17px] text-[15px]  
                    tracking-tight text-main2">
                        Online (Paystack)
                    </h2>
                </div>
            </div>
        </div>
    </section>
  )
};

export default PaymentDetails;