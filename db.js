require("dotenv").config();
const { MongoClient } = require("mongodb");

console.log("MONGO_URI:", process.env.MONGO_URI);

let db;
const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Limit connection pool size to 10
});

async function connectToDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db("Soufico"); // Replace with your database name
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected!");
  }
  return db;
}

module.exports = { connectToDB, getDB };
