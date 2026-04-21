import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout/MainLayout";
import AdminLayout from "../layout/AdminLayout/AdminLayout";
import AdminGuard from "../components/AdminGuard/AdminGuard";
import AdminOnlyGuard from "../components/AdminOnlyGuard/AdminOnlyGuard";
import {
  Home,
  Login,
  SignUp,
  CourtDetail,
  Booking,
  BookingSchedule,
  MyBookings,
  AccountPage,
  FavoriteCourts,
  AdminDashboard,
  AdminCourts,
  AdminBookings,
  AdminDrinks,
  AdminRevenue,
  AdminManagementDashboard,
  ManageOwners,
  ManageCustomers,
  SystemRevenue,
} from "../pages";

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages - no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Booking schedule - fullscreen, no layout */}
        <Route
          path="/booking-schedule/:courtId"
          element={<BookingSchedule />}
        />

        {/* Main layout pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courts/:id" element={<CourtDetail />} />
          <Route path="/booking/:courtId" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/favorites" element={<FavoriteCourts />} />
        </Route>

        {/* Owner/Admin pages (both owner and admin can access) */}
        <Route
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courts" element={<AdminCourts />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/drinks" element={<AdminDrinks />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
        </Route>

        {/* Admin management pages (admin only) */}
        <Route
          element={
            <AdminOnlyGuard>
              <AdminLayout />
            </AdminOnlyGuard>
          }
        >
          <Route
            path="/admin-management"
            element={<AdminManagementDashboard />}
          />
          <Route path="/admin-management/owners" element={<ManageOwners />} />
          <Route
            path="/admin-management/customers"
            element={<ManageCustomers />}
          />
          <Route path="/admin-management/revenue" element={<SystemRevenue />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
