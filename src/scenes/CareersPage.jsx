import {
    Navbar,
    Footer,
} from '../components';

import { Helmet } from 'react-helmet';
import Careers from '../components/Careers';

const BlogPage = () => {

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
            <div className='sm:py-28 py-16'>
            <Careers />

            </div>

           
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default BlogPage;