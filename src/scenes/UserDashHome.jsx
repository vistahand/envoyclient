// import { SectionWrapperDash } from '../hoc';
import styles from '../styles';
import {
  Navbar,
  Sidebar,
} from '../dashboard/user';

import { Helmet } from 'react-helmet';

const UserDashHome = () => {

  return (
    <div className={`${styles.padding1} font-manrope`}>
      <Helmet>
        <title>User | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <div className='flex w-full h-full relative'>
        <div className='w-[20%] footer hidden md:flex fixed overflow-y-auto'>
          <Sidebar />
        </div>
        
        <div className='flex flex-col flex-1 w-full'>
          <div className='fixed w-full md:w-[80%] top-0 left-[20%]'>
            <Navbar />
          </div>
          
        </div>
      </div>
    </div>
  )
};

export default UserDashHome;