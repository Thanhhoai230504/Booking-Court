import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login, SignUp, FavoriteCourts } from "../pages";
import MainLayout from "@/layout/MainLayout/MainLayout";
import Home from "@/pages/Home";
import CourtDetail from "@/pages/CourtDetail";
import BookingSchedule from "@/pages/BookingSchedule";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
