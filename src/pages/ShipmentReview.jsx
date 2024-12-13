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
            const offset = -80; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep, initialLoad]);

    // const handleNextStep = (tab, nextTab) => {
    //     setCurrentStep(currentStep + 1);
    //     setInitialLoad(false);
    //     setSelectedTab(tab);
    //     if (nextTab) {
    //         setSenderTab(nextTab); 
    //     }
    // };

    // const handlePreviousStep = (tab, prevTab) => {
    //     setCurrentStep(currentStep - 1);
    //     setInitialLoad(false);
    //     setSelectedTab(tab);
      
    //     if (prevTab) {
    //         setSenderTab(prevTab);
    //     }
    // };

    return (
        <div ref={sectionRef} className='font-manrope'>
            {currentStep === 1 && <ShipmentDetails />}
            {currentStep === 2 && <ShipmentPay />}
        </div>
    )
};

export default ShipmentReview;