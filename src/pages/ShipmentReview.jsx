import { useState, useRef, useEffect } from 'react';
import {
    ShipmentDetails,
    ShipmentPay,
} from '../components';

const ShipmentReview = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    // const [selectedTab, setSelectedTab] = useState('international');
    // const [senderTab, setSenderTab] = useState('individual');
    const sectionRef = useRef(null); 

    useEffect(() => {
        if (!initialLoad && sectionRef.current) {
            const offset = -180; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep, initialLoad]);

    const handleNextStep = (tab) => {
        setCurrentStep(currentStep + 1);
        setInitialLoad(false);
        // setSelectedTab(tab);
    };

    const handlePreviousStep = (tab, ) => {
        setCurrentStep(currentStep - 1);
        setInitialLoad(false);
        // setSelectedTab(tab);
    };

    return (
        <div ref={sectionRef} className='font-manrope'>
            {currentStep === 1 && <ShipmentDetails onNext={handleNextStep} />}
            {currentStep === 2 && <ShipmentPay onPrev={handlePreviousStep} onNext={handleNextStep} />}
        </div>
    )
};

export default ShipmentReview;