import { useState, useRef, useEffect } from 'react';
import {
    DeliveryOptionsUser,
    GetStartedFormUser,
    InsuranceFormUser,
    PackageDescribeUser,
    PickupLocationUser,
    RecipientFormUser,
    SenderFormUser,
} from '../components';
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';

const CreateShipmentUser = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedTab, setSelectedTab] = useState('international');
    const [senderTab, setSenderTab] = useState('individual');
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialLoad && sectionRef.current) {
            const offset = -80; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep, initialLoad]);

    const handleNextStep = (tab, nextTab) => {
        setCurrentStep(currentStep + 1);
        setInitialLoad(false);
        setSelectedTab(tab);
        if (nextTab) {
            setSenderTab(nextTab); 
        }
    };

    const handlePreviousStep = (tab, prevTab) => {
        setCurrentStep(currentStep - 1);
        setInitialLoad(false);
        setSelectedTab(tab);
      
        if (prevTab) {
            setSenderTab(prevTab);
        }
    };

    return (
        <div className='w-full flex flex-col gap-8'>
            <div className="w-full flex justify-between items-center md:gap-0 ss:gap-0 gap-8">
                <div className='flex flex-col w-full'>
                    <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
                    ss:text-[30px] text-[23px]'>
                        Create New Shipment
                    </h1>

                    <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
                    ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
                    leading-[1.2rem] md:max-w-full ss:max-w-[80%] max-w-full'>
                        Follow the simple step-by-step form to create, get a quote and confirm a new shipment
                    </h4>
                </div>

                <button type='button'
                onClick={() => navigate(-1)}
                className='bg-mainalt md:text-[14px] ss:text-[15px] text-[13px] font-semibold outline outline-[1px] outline-main7
                md:py-3 ss:py-3 py-2.5 md:px-8 ss:px-6 px-2.5 flex text-main2 md:rounded-xl ss:rounded-xl whitespace-nowrap
                rounded-lg grow4 cursor-pointer items-center justify-center gap-3 md:w-auto ss:w-[27%]'>
                    <HiArrowLeft className='text-[20px]'/>

                    <p className='hidden md:flex ss:flex'>
                        Go back
                    </p>
                </button>
            </div>
            
            <div ref={sectionRef} className='font-manrope'>
                {currentStep === 1 && <GetStartedFormUser onNext={handleNextStep} selectedTab={selectedTab} />}
                {currentStep === 2 && <PackageDescribeUser onPrev={handlePreviousStep} onNext={handleNextStep} selectedTab={selectedTab} />}
                {currentStep === 3 && <DeliveryOptionsUser onNext={(tab) => handleNextStep(tab, 'individual')} onPrev={handlePreviousStep} selectedTab={selectedTab} />}
                {currentStep === 4 && <SenderFormUser onNext={(tab) => handleNextStep(tab, senderTab)} onPrev={handlePreviousStep} selectedTab={selectedTab} senderTab={senderTab} setSenderTab={setSenderTab} />}
                {currentStep === 5 && <RecipientFormUser onNext={(tab) => handleNextStep(tab, senderTab)} onPrev={() => handlePreviousStep(selectedTab, senderTab)} selectedTab={selectedTab} senderTab={senderTab} />}
                {currentStep === 6 && <PickupLocationUser onNext={(tab) => handleNextStep(tab, senderTab)} onPrev={() => handlePreviousStep(selectedTab, senderTab)} selectedTab={selectedTab} senderTab={senderTab} />}
                {currentStep === 7 && <InsuranceFormUser onPrev={() => handlePreviousStep(selectedTab, senderTab)} selectedTab={selectedTab} senderTab={senderTab} setCurrentStep={setCurrentStep} />} 
            </div>
        </div>
    )
};

export default CreateShipmentUser;