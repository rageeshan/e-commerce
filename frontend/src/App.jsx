import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Details from "./pages/Details";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
    </Routes>
  );
};

export default App;
