import {
    Navbar,
    HeroAbout,
    AboutUs,
    CTA,
    Footer
} from '../components';

import { Helmet } from 'react-helmet';

const AboutPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>About Us | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            <div className='heroShipment'>
                <HeroAbout />
            </div>
            
            <AboutUs />

            <div className='cta'>
                <CTA />
            </div>
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default AboutPage;