import {
    Navbar,
    HeroTerms,
    Terms,
    CTA,
    Footer
} from '../components';

import { Helmet } from 'react-helmet';

const TermsPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Terms of Usage | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            <div className='heroShipment'>
                <HeroTerms />
            </div>
            
            <Terms />

            <div className='cta'>
                <CTA />
            </div>
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default TermsPage;