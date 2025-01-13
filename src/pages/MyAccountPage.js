import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./MyAccountPage.css";

const MyAccountPage = () => {
  const location = useLocation();
  const uid = location.state?.uid || localStorage.getItem("uid");
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [photoURL, setPhotoURL] = useState(localStorage.getItem("photoURL") || "");
  const [basket, setBasket] = useState([]);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [transactionId, setTransactionId] = useState(location.state?.transactionId || null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        console.error("User ID is missing.");
        return;
      }

      try {
        const response = await fetch(`https://soufico.onrender.com/api/users/${uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const userData = await response.json();
        setName(userData.name || "");
        setPhotoURL(userData.photoURL || "");
        setBasket(userData.basket || []);
        setPurchases(userData.purchases || []);

        localStorage.setItem("uid", uid);
        localStorage.setItem("name", userData.name || "");
        localStorage.setItem("photoURL", userData.photoURL || "");
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
      const response = await fetch("https://soufico.onrender.com/api/users/save", {
        method: "POST",
        body: JSON.stringify({ uid, name, photoURL }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("User information updated!");
        localStorage.setItem("name", name);
        localStorage.setItem("photoURL", photoURL);
      } else {
        const errorResponse = await response.json();
        alert(`Failed to update user information: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      alert("Failed to save user info. Please try again.");
    }
  };

  const basketTotal = basket.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (basket.length === 0) {
      alert("Your basket is empty!");
      return;
    }

    try {
      const response = await fetch("https://soufico.onrender.com/api/payment/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ basket }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent.");
      }

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setPaymentError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        const purchaseResponse = await fetch("https://soufico.onrender.com/api/users/complete-purchase", {
          method: "POST",
          body: JSON.stringify({ uid, basket }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (purchaseResponse.ok) {
          const { purchases } = await purchaseResponse.json();
          setBasket([]);
          setPurchases(purchases);
          setTransactionId(paymentIntent.id);
          alert("Purchase completed successfully!");
        } else {
          console.error("Failed to complete purchase.");
        }
      }
    } catch (error) {
      setPaymentError("An error occurred while processing your payment. Please try again.");
    }
  };

  return (
    <div className="my-account-page">
      {transactionId && (
        <div className="transaction-info">
          <p>Your Transaction ID: {transactionId}</p>
        </div>
      )}
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
        <div>
          <CardElement />
          <button className="button-81 purchase-button" onClick={handlePayment}>
            Purchase
          </button>
          {paymentError && <p style={{ color: "red" }}>{paymentError}</p>}
          {paymentSuccess && <p style={{ color: "green" }}>Payment Successful!</p>}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
