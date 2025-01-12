const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

router.post("/save", async (req, res) => {
  const { uid, name, photoURL } = req.body;

  if (!uid || !name || !photoURL) {
    return res.status(400).json({ error: "Missing required fields: uid, name, or photoURL." });
  }

  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    console.log("Request body:", req.body);

    await usersCollection.updateOne(
      { uid }, 
      { 
        $set: { 
          name, 
          photoURL, 
          lastUpdated: new Date() 
        } 
      },
      { upsert: true } 
    );

    res.status(200).json({ message: "User data saved successfully!" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data." });
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
