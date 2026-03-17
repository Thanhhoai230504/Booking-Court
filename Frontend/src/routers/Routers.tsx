import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login, SignUp } from "../pages";
import MainLayout from "@/layout/MainLayout/MainLayout";
import Home from "@/pages/Home";
import CourtDetail from "@/pages/CourtDetail";

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courts/:id" element={<CourtDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
