const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectToDB } = require("./db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
  })
);

connectToDB();

app.use("/api/users", userRoutes); 

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
