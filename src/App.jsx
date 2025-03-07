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
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import NotificationToast from './components/NotificationToast';

import { Login } from './dashboard';
import { Home, Shipments, SavedLoc, Payments, ShipmentDetails, PaymentDetails } from './dashboard/user';
import { AdminHome, ShipmentMgt, PaymentsAdmin, PickupLoc, QuoteMgt, Analytics, Users } from './dashboard/admin';
import ScrollToTopButton from './constants/ScrollToTop';
import { CreateShipmentUser } from './pages';
import { TrackShipmentUser } from './components';
import SettingsPage from './pages/SettingPage';



const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
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
              
              <Route path='/register' element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path='/login' element={<GuestRoute><Login /></GuestRoute>} />
              
              <Route path='/user' element={<ProtectedRoute><UserDashHome /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path='shipments' element={<Shipments />} />
                <Route path='payments' element={<Payments />} />
                <Route path='savedlocations' element={<SavedLoc />} />
                <Route path='shipments/createshipment' element={<CreateShipmentUser />} />
                <Route path='shipments/createshipment-payment' element={<PaymentReviewPageUser />} />
                <Route path='trackshipment' element={<TrackShipmentUser />} />
                <Route path='shipments/details' element={<ShipmentDetails />} />
                <Route path='payments/details' element={<PaymentDetails />} />
                <Route path='settings' element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              </Route>

              <Route path='/admin' element={<ProtectedRoute requireAdmin><AdminDashHome /></ProtectedRoute>}>
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
            
            <NotificationToast />
            <ScrollToTopButton />
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
};

export default App;