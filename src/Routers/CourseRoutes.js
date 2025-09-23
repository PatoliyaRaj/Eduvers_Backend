const router = require("express").Router();
const { CreateCourse, allCourses, DeleteCourse } = require("../Controller/CourseController");

router.post("/create", CreateCourse);
router.get("/all", allCourses);
router.delete("/delete", DeleteCourse);

module.exports = router;
