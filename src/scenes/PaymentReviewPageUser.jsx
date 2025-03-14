import { useState } from 'react';
import { HeroPaymentReviewUser } from '../components';
import { ShipmentReviewUser } from '../pages';
import { Helmet } from 'react-helmet';

const PaymentReviewUser = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNavigateToStep = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Create Shipment (Payment Review) | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <HeroPaymentReviewUser currentStep={currentStep} onNavigate={handleNavigateToStep} />

            <ShipmentReviewUser currentStep={currentStep} onStepChange={setCurrentStep} />
        </div>
    )
};

export default PaymentReviewUser;