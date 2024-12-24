import { SectionWrapperDash } from '../hoc';
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

      <div className='flex w-full relative'>
        <div className='md:w-1/5 footer'>
          <Sidebar />
        </div>
        
        <div className='flex flex-col flex-1 w-full'>
          <div className='fixed w-full md:w-4/5'>
            <Navbar />
          </div>
          
        </div>
      </div>
    </div>
  )
};

export default SectionWrapperDash(UserDashHome, '');