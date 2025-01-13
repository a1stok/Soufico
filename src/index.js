import React from "react";
import ReactDOM from "react-dom/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import App from "./App";

const stripePromise = loadStripe("pk_test_51QgbeHCazJ6cZddClll4nMwC3eieaQbrX51Sc4FQWYRlPoo5kxzjGCtMNd7CncTinshiFpSRLJrwiXO0WqOcPjVk00pTin69MH"); 

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);