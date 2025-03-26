import React, { useState } from 'react';
import { MdOutlineCopyAll } from "react-icons/md";
import { FaDiagramSuccessor } from "react-icons/fa6";

const PaymentSuccessPage = () => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const transactionId = 'TRX-18084578123';

  const handleCopyClick = () => {
    navigator.clipboard.writeText(transactionId)
      .then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => {
          setCopyButtonText('Copy');
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <section className='w-full flex min-h-[400px] justify-center items-center flex-col gap-6'>
      <div className='w-full flex flex-col items-center gap-4'>
        {/* Success Icon */}
        <div className='w-[6rem] h-[6rem] bg-primary1 rounded-full flex justify-center items-center p-6'>
          <FaDiagramSuccessor className='w-[4rem] h-[4rem] text-white' />
        </div>

        <h1 className='text-primary font-bold text-[30px] tracking-tight text-center'>
          Payment Successful!
        </h1>
        <p className='text-main4 text-[16px] text-center md:w-[60%] w-[90%]'>
          Your payment has been successfully processed. You will receive an email confirmation shortly.
        </p>
      </div>

      {/* Transaction ID with Copy Button */}
      <div className='flex items-center justify-between rounded-xl bg-primary1 px-5 py-3 w-full max-w-md'>
        <p className='text-primary text-[17px] font-medium'>
          Transaction ID: <span className='font-bold'>{transactionId}</span>
        </p>

        <div className='flex items-center gap-2 cursor-pointer' onClick={handleCopyClick}>
          <MdOutlineCopyAll className='w-[1.5rem] h-[1.5rem] text-primary' />
          <p className='text-primary text-[12px] font-bold'>{copyButtonText}</p>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;
