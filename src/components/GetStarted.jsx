import { useState, useRef, useEffect } from 'react';
import {
    DeliveryOptions,
    GetStartedForm,
    PackageDescribe,
} from '../pages';

const GetStarted = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedTab, setSelectedTab] = useState('international');
    const sectionRef = useRef(null); 

    useEffect(() => {
        if (!initialLoad && sectionRef.current) {
            const offset = -80; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep, initialLoad]);

    const handleNextStep = (tab) => {
        setCurrentStep(currentStep + 1);
        setInitialLoad(false);
        setSelectedTab(tab);
    };

    const handlePreviousStep = (tab) => {
        setCurrentStep(currentStep - 1);
        setInitialLoad(false);
        setSelectedTab(tab);
    };

    return (
        <div ref={sectionRef} className='font-manrope'>
           {currentStep === 1 && <GetStartedForm onNext={handleNextStep} selectedTab={selectedTab} />}
           {currentStep === 2 && <PackageDescribe onPrev={handlePreviousStep} onNext={handleNextStep} selectedTab={selectedTab} />}
           {currentStep === 3 && <DeliveryOptions onNext={handleNextStep} onPrev={handlePreviousStep} selectedTab={selectedTab}/>} 
        </div>
    )
};

export default GetStarted;