// config/db.js
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config()
// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // Remove deprecated options
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
mongoose.set('strictQuery', false);
module.exports = connectDB;
