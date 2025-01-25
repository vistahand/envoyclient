import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  CreateShipmentPage, 
  HomePage, 
  PaymentReviewPage,
  PaymentReviewPageUser, 
  TrackResultsPage, 
  RegisterPage,
  UserDashHome,
} from './scenes';

import { Home, Shipments, SavedLoc, PaymentsInv } from './dashboard/user';
import ScrollToTopButton from './constants/ScrollToTop';
import { CreateShipmentUser } from './pages';
import { TrackShipmentUser } from './components';


const App = () => {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/createshipment' element={<CreateShipmentPage />} />
          <Route path='/createshipment-payment' element={<PaymentReviewPage />} />
          <Route path='/trackshipment' element={<TrackResultsPage />} />
          
          <Route path='/register' element={<RegisterPage />} />
          
          <Route path='/user' element={<UserDashHome />}>
            <Route index element={<Home />} />
            <Route path='shipments' element={<Shipments />} />
            <Route path='paymentsandinvoices' element={<PaymentsInv />} />
            <Route path='savedlocations' element={<SavedLoc />} />
            <Route path='shipments/createshipment' element={<CreateShipmentUser />} />
            <Route path='shipments/createshipment-payment' element={<PaymentReviewPageUser />} />
            <Route path='trackshipment' element={<TrackShipmentUser />} />
          </Route>
        </Routes>

        <ScrollToTopButton />
      </div>
    </BrowserRouter>
  )
};

export default App;