import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login, SignUp } from "../pages";
import MainLayout from "@/layout/MainLayout/MainLayout";
import Home from "@/pages/Home";
import CourtDetail from "@/pages/CourtDetail";
import { Login, SignUp, FavoriteCourts, MyBookings, AccountPage } from "../pages";
import MainLayout from "@/layout/MainLayout/MainLayout";
import Home from "@/pages/Home";
import CourtDetail from "@/pages/CourtDetail";
import BookingSchedule from "@/pages/BookingSchedule";
import Booking from '@/pages/Booking';

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/booking-schedule/:courtId"
          element={<BookingSchedule />}
        />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courts/:id" element={<CourtDetail />} />
          <Route path="/favorites" element={<FavoriteCourts />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking/:courtId" element={<Booking />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
