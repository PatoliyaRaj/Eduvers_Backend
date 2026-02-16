const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.post("/Create", courseController.CreateCourse);
router.get("/All", courseController.allCourses);
router.get("/:id", courseController.getcourseById);
router.patch("/Update/:id", courseController.UpdateCourse);
router.delete("/Delete", courseController.DeleteCourse);

module.exports = router;
