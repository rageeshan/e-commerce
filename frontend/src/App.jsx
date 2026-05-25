import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Details from "./pages/Details";
import SignUp from "./pages/admin/SignUp";
import Login from "./pages/admin/Login";
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
      <Route path="/admin" element={<AdminProductView />} />
      <Route path="/product/:id" element={<ProductView />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      <Route path="/track" element={<TrackOrder />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
