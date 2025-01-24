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

const CreateShipmentUser = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedTab, setSelectedTab] = useState('international');
    const [senderTab, setSenderTab] = useState('individual');
    const sectionRef = useRef(null); 

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
            <div className='flex flex-col w-full'>
                <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
                ss:text-[30px] text-[23px]'>
                    Create New Shipment
                </h1>

                <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
                ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
                leading-[1.2rem]'>
                    Follow the simple step-by-step form to create, get a quote and confirm a new shipment
                </h4>
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