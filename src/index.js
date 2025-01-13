import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PaymentPage from "./pages/PaymentPage";
import ShopPage from "./pages/ShopPage"; 
import MyAccountPage from "./pages/MyAccountPage"; 

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/payment" element={<PaymentPage />} /> 
        <Route path="/my-account" element={<MyAccountPage />} /> 
      </Routes>
    </Router>
  </React.StrictMode>
);
