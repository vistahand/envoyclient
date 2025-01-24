import { useState, useRef, useEffect } from 'react';
import {
    ShipmentDetailsUser,
    ShipmentFinishUser,
    ShipmentPayUser,
} from '../components';

const ShipmentReviewUser = ({ currentStep, onStepChange }) => {
    const [initialLoad, setInitialLoad] = useState(true);
    const sectionRef = useRef(null); 

    useEffect(() => {
        if (!initialLoad && sectionRef.current) {
            const offset = -180; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep, initialLoad]);

    const handleNextStep = () => {
        onStepChange(currentStep + 1);
        setInitialLoad(false);
    };

    const handlePreviousStep = () => {
        onStepChange(currentStep - 1);
        setInitialLoad(false);
    };

    return (
        <div ref={sectionRef} className='font-manrope'>
            {currentStep === 1 && <ShipmentDetailsUser onNext={handleNextStep} />}
            {currentStep === 2 && <ShipmentPayUser onPrev={handlePreviousStep} onNext={handleNextStep} />}
            {currentStep === 3 && <ShipmentFinishUser />}
        </div>
    )
};

export default ShipmentReviewUser;