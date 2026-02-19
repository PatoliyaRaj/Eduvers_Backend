const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authorize, authenticate, isTenantOwner } = require("../middlewares/authMiddleware");

// Only tenant owners (from tenants table) can create users — user-level admins cannot
router.post("/Signup", authenticate, isTenantOwner, authorize("admin", "superadmin"), userController.CreateUser);
router.get("/Details/:email", userController.getuserDetails);
router.get("/AllUsers", userController.getAllUsers);
router.patch("/Update/:id", userController.UpdateUsers);
module.exports = router;
