import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./MyAccountPage.css";

const MyAccountPage = () => {
  const location = useLocation();
  const uid = location.state?.uid; 
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;

      try {
        const response = await fetch(`http://localhost:3000/api/users/${uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const userData = await response.json();
        setName(userData.name || "");
        setPhotoURL(userData.photoURL || "");
        setBasket(userData.basket || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleNameChange = (e) => setName(e.target.value);

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setPhotoURL(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveUserInfo = async () => {
    if (!uid) {
      alert("User not logged in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("uid", uid);
      formData.append("name", name);
      formData.append("photoURL", photoURL);

      const response = await fetch("http://localhost:3000/api/users/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, name, photoURL }),
      });

      if (response.ok) {
        alert("User information updated!");
      } else {
        alert("Failed to update user information.");
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      alert("Failed to save user info. Please try again.");
    }
  };

  const basketTotal = basket.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="my-account-page">
      <div className="glass-container">
        <h2>My Account</h2>
        <div className="profile-picture">
          <label htmlFor="photo-upload">
            <div className="photo-circle">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="profile-image" />
              ) : (
                <span className="photo-placeholder">Upload</span>
              )}
            </div>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="photo-input"
          />
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
          className="styled-input"
        />
        <button onClick={saveUserInfo} className="save-info-button">
          Save Info
        </button>
      </div>

      <div className="glass-container basket-summary">
        <h2>Your Basket</h2>
        {basket.length > 0 ? (
          basket.map((item) => (
            <div key={item.id} className="basket-item">
              <img src={item.image} alt={item.name} className="basket-item-image" />
              <div className="basket-item-text">
                <h3>
                  {item.name} {item.quantity > 1 && `x${item.quantity}`}
                </h3>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Your basket is empty.</p>
        )}
        <h3 className="basket-total">Total: ${basketTotal.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default MyAccountPage;
