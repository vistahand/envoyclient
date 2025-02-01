import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  CreateShipmentPage, 
  HomePage, 
  PaymentReviewPage,
  PaymentReviewPageUser, 
  TrackResultsPage, 
  RegisterPage,
  UserDashHome,
  AdminDashHome,
  AboutPage,
  TermsPage,
  PrivacyPage,
} from './scenes';

import { Login } from './dashboard';
import { Home, Shipments, SavedLoc, Payments, ShipmentDetails, PaymentDetails } from './dashboard/user';
import { AdminHome, ShipmentMgt, PaymentsAdmin, PickupLoc, QuoteMgt, Analytics, Users } from './dashboard/admin';
import ScrollToTopButton from './constants/ScrollToTop';
import { CreateShipmentUser } from './pages';
import { TrackShipmentUser } from './components';


const App = () => {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/termsofusage' element={<TermsPage />} />
          <Route path='/privacypolicy' element={<PrivacyPage />} />
          <Route path='/createshipment' element={<CreateShipmentPage />} />
          <Route path='/createshipment-payment' element={<PaymentReviewPage />} />
          <Route path='/trackshipment' element={<TrackResultsPage />} />
          
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<Login />} />
          
          <Route path='/user' element={<UserDashHome />}>
            <Route index element={<Home />} />
            <Route path='shipments' element={<Shipments />} />
            <Route path='payments' element={<Payments />} />
            <Route path='savedlocations' element={<SavedLoc />} />
            <Route path='shipments/createshipment' element={<CreateShipmentUser />} />
            <Route path='shipments/createshipment-payment' element={<PaymentReviewPageUser />} />
            <Route path='trackshipment' element={<TrackShipmentUser />} />
            <Route path='shipments/details' element={<ShipmentDetails />} />
            <Route path='payments/details' element={<PaymentDetails />} />
          </Route>

          <Route path='/admin' element={<AdminDashHome />}>
            <Route index element={<AdminHome />} />
            <Route path='shipmentmanagement' element={<ShipmentMgt />} />
            <Route path='payments' element={<PaymentsAdmin />} />
            <Route path='pickuplocations' element={<PickupLoc />} />
            <Route path='quotemanagement' element={<QuoteMgt />} />
            <Route path='analytics' element={<Analytics />} />
            <Route path='users' element={<Users />} />
            {/* <Route path='trackshipment' element={<TrackShipmentUser />} />
            <Route path='shipments/details' element={<ShipmentDetails />} />
            <Route path='payments/details' element={<PaymentDetails />} /> */}
          </Route>
        </Routes>

        <ScrollToTopButton />
      </div>
    </BrowserRouter>
  )
};

export default App;