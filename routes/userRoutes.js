const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

router.post("/save", async (req, res) => {
  const { uid, name, photoURL } = req.body;

  if (!uid || !name || !photoURL) {
    const missingFields = [
      !uid && "uid",
      !name && "name",
      !photoURL && "photoURL",
    ].filter(Boolean);

    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { uid },
      { $set: { name, photoURL, lastUpdated: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ message: "User data saved successfully!" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

router.post("/basket", async (req, res) => {
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

    res.status(200).json({ message: "Basket updated successfully!" });
  } catch (error) {
    console.error("Error updating basket:", error);
    res.status(500).json({ error: "Failed to update basket." });
  }
});

router.post("/complete-purchase", async (req, res) => {
  const { uid, basket } = req.body;

  if (!uid || !Array.isArray(basket)) {
    return res.status(400).json({ error: "Missing or invalid fields: uid or basket" });
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

    res.status(200).json({ message: "Purchase completed successfully!" });
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

    const user = await usersCollection.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data." });
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

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

module.exports = router;
