import {
    Navbar,
    HeroPrivacy,
    Privacy,
    CTA,
    Footer
} from '../components';

import { Helmet } from 'react-helmet';

const PrivacyPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Privacy Policy | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            <div className='heroShipment'>
                <HeroPrivacy />
            </div>
            
            <Privacy />

            <div className='cta'>
                <CTA />
            </div>
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default PrivacyPage;