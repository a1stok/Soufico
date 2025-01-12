const express = require("express");
const { getDB } = require("../db");
const router = express.Router();

 
router.post("/save", async (req, res) => {
  console.log("POST /save - Request received:", req.body);

  const { uid, name, photoURL } = req.body;

  if (!uid || !name || !photoURL) {
    console.log("POST /save - Missing required fields.");
    return res.status(400).json({ error: "Missing required fields: uid, name, or photoURL." });
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
