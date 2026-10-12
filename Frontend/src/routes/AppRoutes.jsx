import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/admin/dashboard/Dashboard.jsx";
import PortalPage from "../pages/admin/PortalPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PortalPage />} />
    </Routes>
  );
};

export default AppRoutes;
