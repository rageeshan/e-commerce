import React from "react";
import { Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Clothes from "./pages/Clothes";
import Accessories from "./pages/Accessories";
import Shoes from "./pages/Shoes";
import Bags from "./pages/Bags";
import Sale from "./pages/Sale";
import AdminProductView from "./pages/AdminProductView";
import ProductView from "./pages/ProductView";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

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
      {/* <Route path="/signup" element={<SignUp />} /> */}
    </Routes>
  );
};

export default App;
