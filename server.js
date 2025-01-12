const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./db");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
connectToDB();

app.use("/api/users", userRoutes); 

if (process.env.FUNCTION_NAME === undefined) {

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {

    const functions = require("firebase-functions");
  exports.api = functions.https.onRequest(app);
}
