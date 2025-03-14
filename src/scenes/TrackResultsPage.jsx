// import { useState } from 'react';
import {
    Navbar,
    Footer,
    TrackShipment,
    ShipCTA,
} from '../components';
import { Helmet } from 'react-helmet';

const TrackResultsPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Track Shipment | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Navbar />

            <TrackShipment />
            
            <div className='cta'>
                <ShipCTA />
            </div>
    
            <div className='footer'>
                <Footer />
            </div>
        </div>
    )
};

export default TrackResultsPage;