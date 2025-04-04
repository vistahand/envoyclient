import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  CreateShipmentPage,
  HomePage,
  PaymentReviewPage,
  TrackResultsPage,
  RegisterPage,
  UserDashHome,
  AdminDashHome,
  AboutPage,
  TermsPage,
  PrivacyPage,
} from "./scenes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import NotificationToast from "./components/NotificationToast";

import { Login } from "./dashboard";
import {
  Home,
  Shipments,
  SavedLoc,
  Payments,
  ShipmentDetails,
  PaymentDetails,
} from "./dashboard/user";
import {
  AdminHome,
  ShipmentMgt,
  PaymentsAdmin,
  PickupLoc,
  QuoteMgt,
  Analytics,
  Users,
  ShipmentDetailMgt,
  CreatePickupLocation,
} from "./dashboard/admin";
import ScrollToTopButton from "./constants/ScrollToTop";
import { GetStarted } from "./pages";
import TrackShipment from "./components/TrackShipment";
import SettingsPage from "./pages/SettingPage";
import { GuestShipmentProvider } from "./context/GuestShipmentContext";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import FinishShipmentPage from "./scenes/FinishShipmentPage";
import PaymentSuccessScene from "./scenes/PaymentSuccess";
import PendingPayments from "./dashboard/admin/PendingPayments";
import ShipmentSuccessScene from "./scenes/ShipmentSuccessScene";

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <GuestShipmentProvider>
          <BrowserRouter>
            <div>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/termsofusage" element={<TermsPage />} />
                <Route path="/privacypolicy" element={<PrivacyPage />} />
                <Route
                  path="/createshipment"
                  element={<CreateShipmentPage />}
                />
                <Route
                  path="/createshipment-payment"
                  element={<PaymentReviewPage />}
                />
                <Route path="/trackshipment" element={<TrackResultsPage />} />

                <Route
                  path="/createshipment-payment/finish"
                  element={<FinishShipmentPage />}
                />
                <Route
                  path="/createshipment-payment/success"
                  element={<PaymentSuccessScene />}
                />
                <Route
                  path="/createshipment-payment/failure"
                  element={<PaymentFailedPage />}
                />

                <Route
                  path="/register"
                  element={
                    <GuestRoute>
                      <RegisterPage />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  }
                />

                <Route
                  path="/user"
                  element={
                    <ProtectedRoute>
                      <UserDashHome />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="shipments" element={<Shipments />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="savedlocations" element={<SavedLoc />} />
                  <Route
                    path="shipments/createshipment"
                    element={<GetStarted />}
                  />
                  <Route
                    path="shipments/createshipment-payment"
                    element={<PaymentReviewPage />}
                  />
                  <Route
                    path="shipments/details"
                    element={<ShipmentDetails />}
                  />
                  <Route path="payments/details" element={<PaymentDetails />} />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashHome />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminHome />} />

                  <Route path="shipmentmanagement" element={<ShipmentMgt />} />
                  <Route
                    path="shipmentmanagement/details/:shipmentId"
                    element={<ShipmentDetailMgt />}
                  />

                  {/* These are the routes for the paymens on the admin dashboard */}
                  <Route path="payment-history" element={<PaymentsAdmin />} />
                  <Route
                    path="pending-payments"
                    element={<PendingPayments />}
                  />

                  <Route path="pickuplocations" element={<PickupLoc />} />
                  <Route
                    path="pickuplocations/create"
                    element={<CreatePickupLocation />}
                  />
                  <Route path="quotemanagement" element={<QuoteMgt />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="users" element={<Users />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route
                  path="/shipment-success"
                  element={<ShipmentSuccessScene />}
                />
              </Routes>

              <NotificationToast />
              <ScrollToTopButton />
            </div>
          </BrowserRouter>
        </GuestShipmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
