import {
    Navbar,
    Hero,
    Cards,
    Hands,
    Move,
    Testimonial,
    Continent,
    Blog,
    CTA,
    Footer
} from '../components';

import { Helmet } from 'react-helmet';
import VideoLoader from '../components/VideoLoader'; // Import the new component

const HomePage = () => {
    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            {/* Video Modal will appear automatically based on localStorage status */}
            <VideoLoader />
            
            <Navbar />
            <Hero />
            <Cards />
            <Hands />

            <div className='move'>
                <Move />
            </div>

            <Testimonial />

            <div className='move'>
                <Continent />
            </div>

            <Blog />

            <div className='cta'>
                <CTA />
            </div>
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default HomePage;