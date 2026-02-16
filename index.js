const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// ============ SEQUELIZE (ACTIVE) ============
const { testConnection, syncDatabase } = require("./src/Db/sequelize");

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await testConnection();

    // Only sync database when SYNC_DB=true (set this once to create tables)
    if (process.env.SYNC_DB === "true") {
      await syncDatabase();
      console.log("Database synced and tables created");
    }

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

initializeDatabase();
// ============ END SEQUELIZE ============

// Import Routes
const userRoutes = require("./src/routes/userRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const authRoutes = require("./src/routes/authRoutes");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL_DEV,
      process.env.FRONTEND_URL_PROD,
      "http://localhost:3000",
      "http://localhost:3001",
      undefined,
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Cache-Control",
    "Pragma",
    "Expires",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "EduVers API is running",
    status: "success",
    environment: process.env.NODE_ENV,
  });
});

// Use Routes
app.use("/User", userRoutes);
app.use("/Course", courseRoutes);
app.use("/Contact", contactRoutes);
app.use("/Auth", authRoutes);

// Compatibility with old structure (if requested)
app.use("/Login", authRoutes); // /Login/Login will work, or I can map it directly
app.use("/Logout", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port http://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
