import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Details from "./pages/Details";
// import toast from "react-hot-toast";

const App = () => {
  return (
    <div>
      {/* <button onClick={() => toast.success("Hello World!")}>Click Me</button> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </div>
  );
};

export default App;
