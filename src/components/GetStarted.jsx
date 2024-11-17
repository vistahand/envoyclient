import { useState, useRef, useEffect } from 'react';
import {
    GetStartedForm,
    PackageDescribe,
} from '../pages';

const GetStarted = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const sectionRef = useRef(null); 

    useEffect(() => {
        if (!initialLoad && sectionRef.current) {
            const offset = -80; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep, initialLoad]);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
        setInitialLoad(false);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
        setInitialLoad(false);
    };

    return (
        <div ref={sectionRef} className='font-manrope'>
           {currentStep === 1 && <GetStartedForm onNext={handleNextStep} />} 
           {currentStep === 2 && <PackageDescribe onNext={handleNextStep} onPrev={handlePreviousStep} />} 
        </div>
    )
};

export default GetStarted;