import { useState, useRef, useEffect } from 'react';
import {
    GetStartedForm,
    PackageDescribe,
} from '../pages';

const GetStarted = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const sectionRef = useRef(null); 

    useEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' }); 
        }
    }, [currentStep]);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div ref={sectionRef} className='font-manrope'>
           {currentStep === 1 && <GetStartedForm onNext={handleNextStep} />} 
           {currentStep === 2 && <PackageDescribe onNext={handleNextStep} onPrev={handlePreviousStep} />} 
        </div>
    )
};

export default GetStarted;