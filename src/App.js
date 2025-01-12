import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SpotifyCallback from "./pages/SpotifyCallback"; 
import MyAccountPage from "./pages/MyAccountPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/callback" element={<SpotifyCallback />} /> {}
      </Routes>
    </Router>
  );
}

export default App;
