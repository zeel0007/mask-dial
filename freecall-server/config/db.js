const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    if (!connStr || connStr.includes("your_username")) {
      console.log("ℹ️ MONGO_URI not configured. Running in memory / offline DB mode.");
      return;
    }
    await mongoose.connect(connStr);
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;
