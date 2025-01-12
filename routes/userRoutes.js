const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

router.post("/save", async (req, res) => {
  console.log("POST /save - Request received:", req.body);

  const { uid, name, photoURL, basket } = req.body;

  if (!uid) {
    return res.status(400).json({
      error: "Missing required field: uid.",
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    let updateData = {
      lastUpdated: new Date(),
    };

    if (name) updateData.name = name;
    if (photoURL) updateData.photoURL = photoURL;

    if (basket && Array.isArray(basket)) {
      updateData.basket = basket.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
    }

    await usersCollection.updateOne(
      { uid },
      { $set: updateData },
      { upsert: true }
    );

    console.log("POST /save - User data and basket saved successfully.");
    res.status(200).json({ message: "User data and basket saved successfully!" });
  } catch (error) {
    console.error("Error saving user data or basket:", error);
    res.status(500).json({ error: "Failed to save user data or basket." });
  }
});

router.post("/basket", async (req, res) => {
  console.log("POST /basket - Request received:", req.body);

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

    console.log("POST /basket - Basket data saved successfully.");
    res.status(200).json({ message: "Basket data saved successfully!" });
  } catch (error) {
    console.error("Error saving basket data:", error);
    res.status(500).json({ error: "Failed to save basket data." });
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

    const result = await usersCollection.deleteOne({ uid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ message: "User and basket data deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user data:", error);
    return res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
