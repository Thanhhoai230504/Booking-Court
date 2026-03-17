import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Login, SignUp} from '../pages';

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
