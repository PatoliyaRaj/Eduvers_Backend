const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authorize, authenticate } = require("../middlewares/authMiddleware");

router.post(
  "/Create",
  authenticate,
  authorize("teacher"),
  courseController.CreateCourse,
);
router.get("/All", courseController.allCourses);

router.get("/:id", courseController.getcourseById);

router.patch(
  "/Update/:id",
  authenticate,
  authorize("teacher"),
  courseController.UpdateCourse,
);

router.delete(
  "/Delete",
  authenticate,
  authorize("teacher"),
  courseController.DeleteCourse,
);

module.exports = router;
