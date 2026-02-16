const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/Login", authController.CreateLogin);
router.post("/Logout", authController.LogOutController);
router.post("/refresh-token", authController.RefreshToken);
router.get("/me", authenticate, authController.GetMe);

module.exports = router;
