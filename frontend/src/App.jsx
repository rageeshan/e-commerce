import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/admin/SignUp";
import Login from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
