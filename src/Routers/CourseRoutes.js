const router = require('express').Router();
const { CreateCourse } = require('../Controller/CourseController');

router.post('/create', CreateCourse);

module.exports = router;

