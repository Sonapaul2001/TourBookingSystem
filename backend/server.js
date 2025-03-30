console.log("Starting server...");

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Connecting to MongoDB...");
connectDB(); // Ensure this function is working

// ✅ Register Routes Before Starting the Server
app.use('/api/auth', require('./routes/authRoutes')); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
