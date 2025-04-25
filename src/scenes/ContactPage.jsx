import {
    Navbar,
    CTA,
    Footer
} from '../components';

import { Helmet } from 'react-helmet';
import ContactUs from '../components/ContactUs';

const ContactPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>About Us | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            {/* <div className='heroShipment'>
                <HeroAbout />
            </div> */}
            <div className='py-16'>
            <ContactUs />

            </div>

            <div className='cta'>
                <CTA />
            </div>
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default ContactPage;