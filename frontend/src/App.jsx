import React from "react";
import { Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Details from "./pages/Details";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Clothes from "./pages/Clothes";
import Accessories from "./pages/Accessories";
import Shoes from "./pages/Shoes";
import Bags from "./pages/Bags";
import Sale from "./pages/Sale";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/clothes" element={<Clothes />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/shoes" element={<Shoes />} />
      <Route path="/bags" element={<Bags />} />
      <Route path="/sale" element={<Sale />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
