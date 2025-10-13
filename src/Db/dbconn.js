const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log(
      `Connecting to MongoDB in ${process.env.NODE_ENV} environment...`
    );
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;


