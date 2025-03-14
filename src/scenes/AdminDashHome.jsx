import styles from '../styles';
import {
  Navbar,
  Sidebar,
} from '../dashboard/admin';

import { Helmet } from 'react-helmet';
import { Outlet} from 'react-router-dom';

const AdminDashHome = () => {
 
  return (
    <div className={`${styles.padding1} font-manrope`}>
      <Helmet>
        <title>Admin | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <div className='flex w-full'>
        <div className='w-[21%] footer hidden md:flex fixed overflow-y-auto'>
          <Sidebar />
        </div>
        
        <div className='w-full md:ml-[21%] flex flex-col'>
          <div className='w-full fixed top-0 left-0 bg-white md:left-[21%]
          z-50 md:w-[79%]'>
            <Navbar />
          </div>
        
          <div className='flex-1 md:py-6 ss:py-6 py-5 md:px-7 mt-20'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
};

export default AdminDashHome;