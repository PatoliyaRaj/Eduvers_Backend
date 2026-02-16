const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/Create", contactController.CreateContact);
router.get("/Comments", contactController.GetComments);

module.exports = router;
