import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import Navbar from "./components/Navbar";
import ReservationPage from "./pages/ReservationPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserLoginPage from "./pages/UserLoginPage";
import AccountPage from "./pages/AccountPage";
import PaymentPage from "./pages/PaymentPage";

import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./layouts/UsetLayout";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminCustomersPage from "./pages/AdminCustomersPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import AdminHousekeepingPage from "./pages/AdminHousekeepingPage";
import AdminRoomsStatusPage from "./pages/AdminRoomsStatusPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminRoomPricingPage from "./pages/AdminRoomPricingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomePage />
              </>
            }
          />
          <Route
            path="/rooms"
            element={
              <>
                <Navbar />
                <RoomsPage />
              </>
            }
          />
          <Route
            path="/reservation"
            element={
              <>
                <Navbar />
                <ReservationPage />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <RegisterPage />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <UserLoginPage />
              </>
            }
          />
          <Route
            path="/account"
            element={
              <>
                <Navbar />
                <AccountPage />
              </>
            }
          />
          <Route
            path="/payment"
            element={
              <>
                <Navbar />
                <PaymentPage />
              </>
            }
          />
        </Route>

        {/* Admin giriş sayfası (login için Navbar'a gerek yok) */}
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="rooms"
            element={
              <PrivateRoute>
                <AdminRoomsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="customers"
            element={
              <PrivateRoute>
                <AdminCustomersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="reservations"
            element={
              <PrivateRoute>
                <AdminReservationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="housekeeping"
            element={
              <PrivateRoute>
                <AdminHousekeepingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="rooms-status"
            element={
              <PrivateRoute>
                <AdminRoomsStatusPage />
              </PrivateRoute>
            }
          />
          <Route
            path="payments"
            element={
              <PrivateRoute>
                <AdminPaymentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="room-pricing"
            element={
              <PrivateRoute>
                <AdminRoomPricingPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
