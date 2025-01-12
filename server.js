const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectToDB } = require("./db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 0; 

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

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  const assignedPort = server.address().port;
  console.log(`Server is running on http://0.0.0.0:${assignedPort}`);
});

process.on("SIGTERM", () => {
  console.log("Server is shutting down...");
  server.close(() => {
    console.log("Server has been closed.");
  });
});
