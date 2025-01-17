require("dotenv").config();
const { MongoClient } = require("mongodb");

console.log("MONGO_URI:", process.env.MONGO_URI);

let db; 
let client; 

async function connectToDB() {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI, {
        maxPoolSize: 10, 
      });
      await client.connect();
      console.log("MongoDB Client connected.");
    }

    if (!db) {
      db = client.db("Soufico");
      console.log("Connected to database: Soufico");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected! Please call connectToDB first.");
  }
  return db;
}

async function disconnectDB() {
  if (client) {
    await client.close();
    console.log("MongoDB Client disconnected.");
    db = null; 
    client = null; 
  }
}

module.exports = { connectToDB, getDB, disconnectDB };
