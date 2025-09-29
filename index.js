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

// Middleware setup (MUST come before routes)
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes (MUST come after middleware)
app.use('/', (req, res) => {
  res.send('Welcome to the EduVers API');
});
app.use("/User", signupRoutes);
app.use("/Course", CourseRoutes);
app.use("/Contact", ContactUsRoutes);
app.use("/Login", LoginRoutes);
app.use("/Logout", LogoutRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
