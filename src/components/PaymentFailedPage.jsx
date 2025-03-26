import React from 'react';
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/createshipment-payment'); // Redirect to payment page
  };

  return (
    <section className='w-full flex min-h-[400px] justify-center items-center flex-col gap-6'>
      <div className='w-full flex flex-col items-center gap-4'>
        {/* Failure Icon */}
        <div className='w-[6rem] h-[6rem] bg-red-500 rounded-full flex justify-center items-center p-6'>
          <MdErrorOutline className='w-[4rem] h-[4rem] text-white' />
        </div>

        <h1 className='text-red-600 font-bold text-[30px] tracking-tight text-center'>
          Payment Failed!
        </h1>
        <p className='text-main4 text-[16px] text-center md:w-[60%] w-[90%]'>
          Unfortunately, your payment could not be processed. Please try again or contact support.
        </p>
      </div>

      {/* Retry Button */}
      <button 
        className='bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition'
        onClick={handleRetry}
      >
        Retry Payment
      </button>
    </section>
  );
};

export default PaymentFailedPage;
