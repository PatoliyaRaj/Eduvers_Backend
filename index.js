const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const syncRLSPolicies = require("./src/utils/syncPolicies");

const { testConnection, syncDatabase } = require("./src/Db/sequelize");
const supabase = require("./src/Db/supabase");
require("./src/models/index");

// Initialize database connection
const initializeDatabase = async () => {
  try {
    // Test Sequelize Connection
    await testConnection();

    // Test Supabase Connection (Optional check)
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .limit(1);
      if (error) {
        console.warn(
          "⚠️ Supabase client connected but failed to query 'users' table:",
          error.message,
        );
      } else {
        console.log("✅ Supabase client connected successfully.");
      }
    }

    // Only sync database when SYNC_DB=true (set this once to create tables)
    if (process.env.SYNC_DB === "true") {
      await syncRLSPolicies("drop");
      await syncDatabase();
      await syncRLSPolicies("full");

      console.log("🚀 Database Schema and RLS Policies synced successfully");
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
const tenantRoutes = require("./src/routes/tenantRoutes");
const superAdminRoutes = require("./src/routes/superAdminRoutes");

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

app.use("/User", userRoutes);
app.use("/Course", courseRoutes);
app.use("/Contact", contactRoutes);
app.use("/Auth", authRoutes);
app.use("/Tenant", tenantRoutes);
app.use("/SuperAdmin", superAdminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port http://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
