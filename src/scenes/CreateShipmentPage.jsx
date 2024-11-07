import {
    Navbar,
    Footer
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
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default CreateShipmentPage;