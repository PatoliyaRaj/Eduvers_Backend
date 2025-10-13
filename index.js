const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/Db/dbconn");
const signupRoutes = require("./src/Routers/SignupRoutes");
const CourseRoutes = require("./src/Routers/CourseRoutes");
const ContactUsRoutes = require("./src/Routers/ContactUsRoutes");
const LoginRoutes = require("./src/Routers/LoginRouters");
const LogoutRoutes = require("./src/Routers/LogoutRouter");

// Connect to database
connectDB();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL_DEV,
      process.env.FRONTEND_URL_PROD,
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
    "Authorization",
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
    environment: process.env.NODE_ENV
  });
});
app.use("/User", signupRoutes);
app.use("/Course", CourseRoutes);
app.use("/Contact", ContactUsRoutes);
app.use("/Login", LoginRoutes);
app.use("/Logout", LogoutRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT} in  ${process.env.NODE_ENV} mode`);
});
