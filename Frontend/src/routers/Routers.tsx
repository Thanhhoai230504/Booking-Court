import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
<<<<<<< Updated upstream
import { Login, SignUp } from "../pages";
import MainLayout from "@/layout/MainLayout/MainLayout";
import Home from "@/pages/Home";
import CourtDetail from "@/pages/CourtDetail";
=======
import {
  Login,
  SignUp,
  FavoriteCourts,
  MyBookings,
  AccountPage,
} from "../pages";
import MainLayout from "@/layout/MainLayout/MainLayout";
import Home from "@/pages/Home";
import CourtDetail from "@/pages/CourtDetail";
import BookingSchedule from "@/pages/BookingSchedule";
import Booking from "@/pages/Booking";
>>>>>>> Stashed changes

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courts/:id" element={<CourtDetail />} />
<<<<<<< Updated upstream
=======
          <Route path="/booking/:courtId" element={<Booking />} />
          <Route path="/favorites" element={<FavoriteCourts />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/account" element={<AccountPage />} />
>>>>>>> Stashed changes
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
