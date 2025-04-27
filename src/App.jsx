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
  UserShipmentCreate,
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
import SettingsPage from "./pages/SettingPage";
import { ShipmentProvider } from "./context/ShipmentContext";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import FinishShipmentPage from "./scenes/FinishShipmentPage";
import PaymentSuccessScene from "./scenes/PaymentSuccess";
import PendingPayments from "./dashboard/admin/PendingPayments";
import ShipmentSuccessScene from "./scenes/ShipmentSuccessScene";
import AdminPaymentDetail from "./components/AdminPaymentDtl";
import { Toaster } from "react-hot-toast";
import AdminUserDetail from "./components/AdminUsersDetail";
// import TidioChat from "./components/TidioChat";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ContactPage from "./scenes/ContactPage";
import BlogPage from "./scenes/Blogpage";
import FaqsPage from "./scenes/FaqsPage";
import CareersPage from "./scenes/CareersPage";
import CareerPage from "./dashboard/admin/CareerPage";
import AdminVerify from "./dashboard/AdminVerify";

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ShipmentProvider>
          <BrowserRouter>
            <Toaster />
            <div>
              <Routes>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/termsofusage" element={<TermsPage />} />
                <Route path="/privacypolicy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/faqs" element={<FaqsPage />} />
                <Route path="/careers" element={<CareersPage />} />

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
                  path="/admin-verify"
                  element={
                    <GuestRoute>
                      <AdminVerify />
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
                    element={<UserShipmentCreate />}
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
                  <Route path="payments" element={<PaymentsAdmin />} />
                  <Route
                    path="pending-payments"
                    element={<PendingPayments />}
                  />
                  <Route
                    path="payments/:paymentId"
                    element={<AdminPaymentDetail />}
                  />

                  <Route path="pickuplocations" element={<PickupLoc />} />
                  <Route
                    path="pickuplocations/create"
                    element={<CreatePickupLocation />}
                  />

                  <Route path="quotemanagement" element={<QuoteMgt />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="users" element={<Users />} />
                  <Route path="users/:userId" element={<AdminUserDetail />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="careers" element={<CareerPage />} />
                </Route>

                <Route
                  path="/shipment-success"
                  element={<ShipmentSuccessScene />}
                />
              </Routes>

              <NotificationToast />
              <ScrollToTopButton />
              {/* <TidioChat /> */}
            </div>
          </BrowserRouter>
        </ShipmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
