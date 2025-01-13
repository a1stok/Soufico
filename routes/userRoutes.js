const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

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

router.post("/basket", async (req, res) => {
  console.log("POST /basket - Request received:", req.body);

  const { uid, basket } = req.body;

  if (!uid || !basket) {
    const missingFields = [
      !uid && "uid",
      !basket && "basket",
    ].filter(Boolean);

    console.log("POST /basket - Missing fields:", missingFields);
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("POST /basket - Updating basket for uid:", uid);
    await usersCollection.updateOne(
      { uid },
      { $set: { basket, lastUpdated: new Date() } },
      { upsert: true }
    );

    console.log("POST /basket - Basket data saved successfully.");
    res.status(200).json({ message: "Basket data saved successfully!" });
  } catch (error) {
    console.error("Error saving basket data:", error);
    res.status(500).json({ error: "Failed to save basket data." });
  }
});

router.post("/order", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !basket) {
    return res.status(400).json({
      error: "Missing required fields: uid or basket",
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { uid },
      {
        $set: { basket: [] }, 
        $push: {
          purchases: {
            $each: basket.map((item) => ({
              ...item,
              purchaseDate: new Date(), 
            })),
            $position: 0,
          },
        },
      },
      { upsert: true }
    );

    res.status(200).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order." });
  }
});

router.post("/complete-purchase", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !basket) {
    return res.status(400).json({ error: "Missing required fields: uid or basket" });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newPurchases = user.purchases ? [...user.purchases, ...basket] : basket;

    await usersCollection.updateOne(
      { uid },
      { $set: { basket: [], purchases: newPurchases } } 
    );

    res.status(200).json({ message: "Purchase completed successfully!", purchases: newPurchases });
  } catch (error) {
    console.error("Error completing purchase:", error);
    res.status(500).json({ error: "Failed to complete purchase." });
  }
});

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
    return res.status(500).json({ error: "Failed to fetch user data." });
  }
});

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

    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user data:", error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
