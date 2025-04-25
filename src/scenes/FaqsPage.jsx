import {
    Navbar,
    Footer,
} from '../components';

import { Helmet } from 'react-helmet';
import Faqs from '../components/Faqs';

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
            <div className='py-16'>
            <Faqs />

            </div>

           
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default BlogPage;