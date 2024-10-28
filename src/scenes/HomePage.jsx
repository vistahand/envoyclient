import {
    Hero,
    Navbar,
    Discover,
    Steps,
    Help,
    CTA,
    Footer,
    Categories,
    Top
} from '../components';

import { Helmet } from 'react-helmet';

const HomePage = () => {

    return (
        <div className='font-encode-sans'>
            <Helmet>
                <title>Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />
            {/* <Hero />
            <Categories />

            <div className='footer'>
                <Top />
            </div>

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