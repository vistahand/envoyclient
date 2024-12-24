import {
  Navbar,
  Sidebar,
} from '../dashboard/user';

import { Helmet } from 'react-helmet';

const UserDashHome = () => {

  return (
    <div className='font-manrope'>
      <Helmet>
        <title>User | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <div className='footer'>
        <Sidebar />
      </div>

      <Navbar />

    </div>
  )
};

export default UserDashHome;