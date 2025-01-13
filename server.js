const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { connectToDB } = require("./db");
const userRoutes = require("./routes/userRoutes");
const { getDB } = require("./db");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectToDB();

app.use("/api/users", userRoutes);

app.post("/api/users/basket", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !Array.isArray(basket)) {
    const missingFields = [
      !uid && "uid",
      !Array.isArray(basket) && "basket (must be an array)",
    ].filter(Boolean);

    return res.status(400).json({
      error: `Missing or invalid fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { uid },
      { $set: { basket, lastUpdated: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: "Basket updated successfully!" });
  } catch (error) {
    console.error("Error updating basket:", error);
    res.status(500).json({ error: "Failed to update basket." });
  }
});

app.get("/api/users/basket/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid }, { projection: { basket: 1 } });

    if (!user || !user.basket) {
      return res.status(404).json({ error: "Basket not found for the user." });
    }

    res.status(200).json({ success: true, basket: user.basket });
  } catch (error) {
    console.error("Error fetching basket:", error);
    res.status(500).json({ error: "Failed to fetch basket." });
  }
});

app.post("/api/payment/create-payment-intent", async (req, res) => {
  const { basket } = req.body;

  if (!basket || !Array.isArray(basket)) {
    return res.status(400).json({ error: "Invalid basket format." });
  }

  const totalAmount = basket.reduce(
    (sum, item) => sum + item.price * item.quantity * 100,
    0
  );

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent." });
  }
});

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server has been closed.");
  });
});