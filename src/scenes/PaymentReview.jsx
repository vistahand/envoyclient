import {
    Navbar,
    HeroPaymentReview,
    ShipmentDetails,
    Footer,
} from '../components';

import { Helmet } from 'react-helmet';

const PaymentReview = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Create Shipment (Payment Review) | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            <HeroPaymentReview />

            <ShipmentDetails />
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default PaymentReview;