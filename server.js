const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { connectToDB, getDB } = require("./db");
const userRoutes = require("./routes/userRoutes");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));  // Add payload limit
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGIN 
      : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400  // CORS preflight cache time
  })
);

// Database connection
connectToDB().catch(console.error);

// Routes
app.use("/api/users", userRoutes);

// Input validation middleware
const validateBasketInput = (req, res, next) => {
  const { uid, basket } = req.body;
  
  if (!uid || !Array.isArray(basket)) {
    const missingFields = [
      !uid && "uid",
      !Array.isArray(basket) && "basket (must be an array)",
    ].filter(Boolean);
    
    return res.status(400).json({
      error: `Missing or invalid fields: ${missingFields.join(", ")}`,
      success: false
    });
  }

  // Validate basket items
  const invalidItems = basket.filter(
    item => !item.id || typeof item.price !== 'number' || !Number.isFinite(item.quantity)
  );

  if (invalidItems.length > 0) {
    return res.status(400).json({
      error: "Invalid basket items found",
      invalidItems,
      success: false
    });
  }

  next();
};

// Basket endpoints
app.post("/api/users/basket", validateBasketInput, async (req, res) => {
  const { uid, basket } = req.body;

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { uid },
      { 
        $set: { 
          basket,
          lastUpdated: new Date(),
          updatedFrom: req.ip
        }
      },
      { upsert: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Basket updated successfully!",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error updating basket:", error);
    res.status(500).json({ 
      error: "Failed to update basket.",
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get("/api/users/basket/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ 
      error: "Missing required field: uid.",
      success: false
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { uid }, 
      { projection: { basket: 1, lastUpdated: 1 } }
    );

    if (!user || !user.basket) {
      return res.status(404).json({ 
        error: "Basket not found for the user.",
        success: false
      });
    }

    res.status(200).json({ 
      success: true, 
      basket: user.basket,
      lastUpdated: user.lastUpdated
    });
  } catch (error) {
    console.error("Error fetching basket:", error);
    res.status(500).json({ 
      error: "Failed to fetch basket.",
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Payment endpoint with rate limiting
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post("/api/payment/create-payment-intent", paymentLimiter, async (req, res) => {
  const { basket } = req.body;

  if (!basket || !Array.isArray(basket)) {
    return res.status(400).json({ 
      error: "Invalid basket format.",
      success: false
    });
  }

  const totalAmount = basket.reduce(
    (sum, item) => sum + Math.round(item.price * item.quantity * 100),
    0
  );

  // Validate total amount
  if (totalAmount <= 0 || !Number.isFinite(totalAmount)) {
    return res.status(400).json({ 
      error: "Invalid total amount",
      success: false
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        basketSize: basket.length,
        timestamp: new Date().toISOString()
      }
    });

    res.status(200).json({ 
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ 
      error: "Failed to create payment intent.",
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Production setup
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  
  const errorResponse = {
    error: "Internal Server Error",
    success: false,
    path: req.path,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.message;
  }

  res.status(500).json(errorResponse);
});

// Graceful shutdown handling
const gracefulShutdown = () => {
  server.close(async () => {
    console.log("Server is shutting down...");
    try {
      // Close database connection here if needed
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
};

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle various shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

module.exports = app;