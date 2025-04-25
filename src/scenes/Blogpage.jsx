import {
    Navbar,
    Footer,
    Blog
} from '../components';

import { Helmet } from 'react-helmet';

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
            <Blog />

            </div>

           
            
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default BlogPage;