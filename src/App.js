import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SpotifyCallback from "./pages/SpotifyCallback";
import MyAccountPage from "./pages/MyAccountPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import MyCollectionPage from "./pages/MyCollectionPage"; 
import CheckoutForm from "./components/CheckoutForm";
import "./App.css"; // Import for transition styles

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/my-playlist" element={<MyCollectionPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/callback" element={<SpotifyCallback />} />
          <Route path="/checkout" element={<CheckoutForm />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
