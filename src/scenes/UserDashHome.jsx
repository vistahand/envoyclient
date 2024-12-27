import styles from '../styles';
import {
  Navbar,
  Sidebar,
} from '../dashboard/user';

import { Helmet } from 'react-helmet';
import { Outlet} from 'react-router-dom';

const UserDashHome = () => {
 
  return (
    <div className={`${styles.padding1} font-manrope`}>
      <Helmet>
        <title>User | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <div className='flex w-full h-full relative'>
        <div className='w-[21%] footer hidden md:flex fixed overflow-y-auto'>
          <Sidebar />
        </div>
        
        <div className='w-full h-full'>
          <div className='fixed w-full md:w-[79%] top-0 left-[21%] h-full'>
            <Navbar />

            <div className='md:py-6 ss:py-6 py-5 md:px-7 overflow-y-auto h-full'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default UserDashHome;