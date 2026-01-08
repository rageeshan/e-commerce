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
import AddProduct from "./pages/AddProduct";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/clothes" element={<Clothes />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/shoes" element={<Shoes />} />
      <Route path="/bags" element={<Bags />} />
      <Route path="/sale" element={<Sale />} />
      <Route path="/addProduct" element={<AddProduct />} />
      {/* <Route path="/signup" element={<SignUp />} /> */}
    </Routes>
  );
};

export default App;
