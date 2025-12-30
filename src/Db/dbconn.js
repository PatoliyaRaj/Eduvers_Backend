const mongoose = require("mongoose");
require("dotenv").config();

// Singleton connection instance
let isConnected; 

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection.");
    return;
  }

  try {
    console.log(
      `Connecting to MongoDB in ${process.env.NODE_ENV} environment...`
    );
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = mongoose.connection.readyState;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

