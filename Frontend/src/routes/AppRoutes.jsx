import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      {/* <Route path="/generate-script" element = {}/> */}
    </Routes>
  );
};

export default AppRoutes;
