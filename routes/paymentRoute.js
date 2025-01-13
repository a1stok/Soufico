const express = require("express");
const router = express.Router();
require("dotenv").config(); 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 

router.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Missing required fields: amount or currency" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: currency,
      automatic_payment_methods: { enabled: true }, 
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

module.exports = router;
