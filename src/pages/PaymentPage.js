import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const PaymentPage = () => {
  useEffect(() => {
    const createPaymentIntent = async () => {
      const response = await fetch("https://soufico.onrender.com/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10, currency: "usd" }),
      });

      const { clientSecret } = await response.json();
      localStorage.setItem("clientSecret", clientSecret); 
    };

    createPaymentIntent();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <h1>Complete Your Payment</h1>
      <CheckoutForm amount={10} currency="USD" />
    </Elements>
  );
};

export default PaymentPage;
