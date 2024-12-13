import { useState } from 'react';
import {
    ShipmentDetails,
    ShipmentPay,
} from '../components';

const ShipmentReview = () => {
    const [currentStep, setCurrentStep] = useState(1);
    // const [selectedTab, setSelectedTab] = useState('international');
    // const [senderTab, setSenderTab] = useState('individual');

    const handleNextStep = (tab) => {
        setCurrentStep(currentStep + 1);
        // setSelectedTab(tab);
    };

    const handlePreviousStep = (tab, ) => {
        setCurrentStep(currentStep - 1);
        // setSelectedTab(tab);
    };

    return (
        <div className='font-manrope'>
            {currentStep === 1 && <ShipmentDetails onNext={handleNextStep} />}
            {currentStep === 2 && <ShipmentPay onPrev={handlePreviousStep} onNext={handleNextStep} />}
        </div>
    )
};

export default ShipmentReview;