import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopPage.css";
import { auth } from "../firebaseConfig";


import letterboxImg from "../images/letterbox.png";
import sponsormeImg from "../images/sponsorme.jpg";
import mymediaImg from "../images/mymedia.png";

const services = [
  {
    id: 1,
    name: "Letterboxd One-Liner Review",
    description: "Get a concise review of any film you choose.",
    price: 0.99,
    image: letterboxImg,
  },
  {
    id: 2,
    name: "Film Playlist",
    description: "Create a custom playlist. Includes unlimited credits. Subscription available for 2.99$/month.",
    price: 2.99,
    image: mymediaImg,
  },
  {
    id: 3,
    name: "Sponsor Me ❤️",
    description: "Support my work and help me create more amazing content.",
    price: null, 
    image: sponsormeImg,
  },
];

const ShopPage = () => {
  const [basket, setBasket] = useState([]);
  const [sponsorAmount, setSponsorAmount] = useState(""); 
  const navigate = useNavigate();

  const handleSponsorAmountChange = (e) => {
    const value = e.target.value;

    if (value === "" || (parseFloat(value) >= 0)) {
      setSponsorAmount(value);
    }
  };

  const handleSponsorUpdate = (service) => {
    if (sponsorAmount === "") {
      alert("Please enter an amount to sponsor!");
      return;
    }

    const customPrice = parseFloat(sponsorAmount);

    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === service.id);

      // "Sponsor Me ❤️" added just cuz i love the ❤️ emoji
      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === service.id ? { ...item, price: customPrice } : item
        );
      } else {
        return [
          ...prevBasket,
          { ...service, quantity: 1, price: customPrice },
        ];
      }
    });
  };

  const addToBasket = (service) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === service.id);

      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevBasket, { ...service, quantity: 1 }];
      }
    });
  };

  const decreaseQuantity = (id) => {
    setBasket((prevBasket) =>
      prevBasket
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const basketTotal = basket.reduce((total, item) => total + item.price * item.quantity, 0);
  const handleOrder = async () => {
    if (basket.length === 0) {
      alert("Your basket is empty!");
      return;
    }
  
    const user = auth.currentUser;
    const userId = user ? user.uid : null;
  
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }
  
    try {
      const response = await fetch("https://soufico.onrender.com/api/users/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, basket }),
      });
  
      if (!response.ok) {
        const errorHtml = await response.text();
        console.error("Server error:", errorHtml);
        alert(`Order failed: ${response.status} ${response.statusText}`);
        return;
      }
  
      alert("Order placed successfully!");
      navigate("/my-account", { state: { basket } });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };
  
  
  
  

  return (
    <div className="shop-page">
      <h1>My Services</h1>
      <div className="service-list">
        {services.map((service) => (
          <div key={service.id} className="service-block hover11">
            <figure>
              <img src={service.image} alt={service.name} className="service-image" />
            </figure>
            <div className="service-text">
              <h2 className="service-title">{service.name}</h2>
              <p className="service-description">{service.description}</p>
              {service.id === 3 ? (
                <div>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="custom-price-input styled-input"
                    value={sponsorAmount}
                    onChange={handleSponsorAmountChange}
                  />
                  <button
                    className="button-81 button-sponsor"
                    onClick={() => handleSponsorUpdate(service)}
                  >
                    Add to Basket
                  </button>
                </div>
              ) : service.id === 2 ? (
                <div>
                  <p className="service-price">${service.price.toFixed(2)}</p>
                  <button
                    className="button-81 button-playlist"
                    onClick={() => addToBasket(service)}
                  >
                    Add to Basket
                  </button>
                </div>
              ) : (
                <div>
                  <p className="service-price">${service.price.toFixed(2)}</p>
                  <button
                    className="button-81"
                    onClick={() => addToBasket(service)}
                  >
                    Add to Basket
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="basket-summary">
  <h2>Your Basket</h2>
  {basket.length > 0 ? (
    basket.map((item) => (
      <div key={item.id} className="basket-item">
        <span className="basket-remove" onClick={() => decreaseQuantity(item.id)}>
          Remove
        </span>
        <img src={item.image} alt={item.name} className="basket-item-image" />
        <div className="basket-item-text">
          <h3>
            {item.name} {item.id !== 3 && item.quantity > 1 && `x${item.quantity}`}
          </h3>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    ))
  ) : (
    <p>Your basket is empty.</p>
  )}
  <h3 className="basket-total">Total: ${basketTotal.toFixed(2)}</h3>
  <button className="button-81 order-button" onClick={handleOrder}>
    Order
  </button>
</div>


    </div>
  );
};

export default ShopPage;