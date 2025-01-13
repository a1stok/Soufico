const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

// Save user information
router.post("/save", async (req, res) => {
  console.log("POST /save - Request received:", req.body);

  const { uid, name, photoURL } = req.body;

  if (!uid || !name || !photoURL) {
    const missingFields = [
      !uid && "uid",
      !name && "name",
      !photoURL && "photoURL",
    ].filter(Boolean);

    console.log("POST /save - Missing fields:", missingFields);
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("POST /save - Connecting to MongoDB...");
    await usersCollection.updateOne(
      { uid },
      { $set: { name, photoURL, lastUpdated: new Date() } },
      { upsert: true }
    );
    console.log("POST /save - User data saved successfully.");
    res.status(200).json({ message: "User data saved successfully!" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// Order endpoint: Save items to basket
router.post("/order", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !basket || !Array.isArray(basket)) {
    return res.status(400).json({
      error: "Missing required fields: uid or basket (must be an array)",
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    // Update the user's basket in MongoDB
    const result = await usersCollection.updateOne(
      { uid },
      { $set: { basket, lastUpdated: new Date() } },
      { upsert: true }
    );

    console.log("Basket update result:", result);
    res.status(200).json({ message: "Basket updated successfully!" });
  } catch (error) {
    console.error("Error updating basket:", error);
    res.status(500).json({ error: "Failed to update basket." });
  }
});

// Fetch basket
router.get("/basket/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("GET /basket/:uid - Fetching basket for uid:", uid);

    const user = await usersCollection.findOne(
      { uid },
      { projection: { basket: 1 } }
    );

    if (!user || !user.basket) {
      return res.status(404).json({ error: "Basket not found for user." });
    }

    res.status(200).json({ basket: user.basket });
  } catch (error) {
    console.error("Error fetching basket:", error);
    res.status(500).json({ error: "Failed to fetch basket." });
  }
});

// Complete purchase
router.post("/complete-purchase", async (req, res) => {
  console.log("POST /complete-purchase - Request received:", req.body);

  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("POST /complete-purchase - Fetching basket for uid:", uid);

    const user = await usersCollection.findOne(
      { uid },
      { projection: { basket: 1 } }
    );

    if (!user || !user.basket || user.basket.length === 0) {
      return res.status(400).json({ error: "Basket is empty or user not found." });
    }

    const basket = user.basket;

    await usersCollection.updateOne(
      { uid },
      {
        $set: { basket: [] }, 
        $push: {
          purchases: {
            $each: basket.map((item) => ({
              ...item,
              purchaseDate: new Date().toISOString(), 
            })),
            $position: 0,
          },
        },
      }
    );

    console.log("POST /complete-purchase - Purchase completed successfully.");
    res.status(200).json({
      message: "Purchase completed successfully!",
      purchases: basket,
    });
  } catch (error) {
    console.error("Error completing purchase:", error);
    res.status(500).json({ error: "Failed to complete purchase." });
  }
});

// Fetch user data
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("GET /:uid - Fetching data for uid:", uid);

    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data." });
  }
});

// Delete user
router.delete("/:uid", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "Missing required field: uid." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("DELETE /:uid - Deleting user with uid:", uid);

    const result = await usersCollection.deleteOne({ uid });

    console.log("DELETE /:uid - MongoDB result:", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
