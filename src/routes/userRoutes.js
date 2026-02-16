const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/Signup", userController.CreateUser);
router.get("/Details/:email", userController.getuserDetails);
router.get("/AllUsers", userController.getAllUsers);
router.patch("/Update/:id", userController.UpdateUsers);

module.exports = router;
