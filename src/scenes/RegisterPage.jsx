import {
    Register,
} from '../pages';

import { Helmet } from 'react-helmet';

const RegisterPage = () => {

    return (
        <div className='font-manrope'>
            <Helmet>
                <title>Register | Envoy Angel Shipping and Logistics</title>
                <meta name="description" content="Content" />
            </Helmet>

            <Register />
        </div>
    )
};

export default RegisterPage;