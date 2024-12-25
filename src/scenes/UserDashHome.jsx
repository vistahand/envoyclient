import styles from '../styles';
import {
  Navbar,
  Sidebar,
  Home,
  Shipments,
  PaymentsInv,
  SavedLoc,
} from '../dashboard/user';
import { useNavigate, useParams } from 'react-router-dom';

import { Helmet } from 'react-helmet';

const tabs = {
  '/user': Home,
  '/user/shipments': Shipments,
  '/user/paymentsandinvoices': PaymentsInv,
  '/user/savedlocations': SavedLoc,
};

const UserDashHome = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const TabComponent = tabs[tab] || Home;

  const handleTabChange = (tab) => {
    navigate(tab.route);
  };

  return (
    <div className={`${styles.padding1} font-manrope`}>
      <Helmet>
        <title>User | Envoy Angel Shipping and Logistics</title>
        <meta name="description" content="Content" />
      </Helmet>

      <div className='flex w-full h-full relative'>
        <div className='w-[20%] footer hidden md:flex fixed overflow-y-auto'>
          <Sidebar onTabChange={handleTabChange}/>
        </div>
        
        <div className='w-full'>
          <div className='fixed w-full md:w-[80%] top-0 left-[20%]'>
            <Navbar />

            <div className='md:py-6 md:px-7 ss:py-6 py-5'>
              <TabComponent />
            </div>
          </div>
        
        </div>
      </div>
    </div>
  )
};

export default UserDashHome;