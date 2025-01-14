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
import MovieDetailsPage from "./pages/MovieDetailsPage"; // New movie details page
import CheckoutForm from "./components/CheckoutForm";

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
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/checkout" element={<CheckoutForm />} />
      </Routes>
    </Router>
  );
}

export default App;
