import { useState } from 'react';
import {
    Navbar,
    HeroPaymentReview,
    Footer,
    NextSteps,
    ShipCTA,
} from '../components';
import { ShipmentReview } from '../pages';
import { Helmet } from 'react-helmet';

const PaymentReview = () => {
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

            <Navbar />

            <HeroPaymentReview currentStep={currentStep} onNavigate={handleNavigateToStep} />

            <ShipmentReview currentStep={currentStep} onStepChange={setCurrentStep} />

            {currentStep === 3 && (
                <div>
                    <NextSteps />

                    <div className='cta'>
                        <ShipCTA />
                    </div>
                </div>
            )}
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default PaymentReview;