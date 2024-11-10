import {
    Navbar,
    HeroShipment,
    Footer,
    ShipmentSteps,
    GetStarted
} from '../components';

import { Helmet } from 'react-helmet';

const CreateShipmentPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Create Shipment | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            <div className='heroShipment'>
                <HeroShipment />
            </div>

            <ShipmentSteps />

            <GetStarted />
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default CreateShipmentPage;