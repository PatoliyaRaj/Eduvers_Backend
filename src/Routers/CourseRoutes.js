const router = require("express").Router();
const { CreateCourse, allCourses, DeleteCourse, getcourseById, UpdateCourse } = require("../Controller/CourseController");

router.post("/create", CreateCourse);
router.get("/all", allCourses);
router.delete("/delete", DeleteCourse);
router.get("/get/:id", getcourseById);
router.patch("/update/:id", UpdateCourse);

module.exports = router;
