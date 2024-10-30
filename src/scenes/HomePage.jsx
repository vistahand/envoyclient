import {
    Navbar,
    Hero,
    Cards,
    Hands,
    Move,
    // CTA,
    // Footer,
    // Categories,
    // Top
} from '../components';

import { Helmet } from 'react-helmet';

const HomePage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />
            <Hero />
            <Cards />
            <Hands />

            <div className='move'>
                <Move />
            </div>
            {/* 
            <Discover />
            <Steps />

            <div className='help'>
                <Help />
            </div>
            
            <CTA />

            <div className='footer'>
                <Footer />
            </div> */}
        </div>
    )
};

export default HomePage;