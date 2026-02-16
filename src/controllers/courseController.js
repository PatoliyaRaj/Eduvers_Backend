const courseService = require("../services/courseService");

const CreateCourse = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty or not properly parsed",
        success: false,
      });
    }

    const newCourse = await courseService.createCourse(req.body);

    return res.status(200).json({
      message: "The Course Successfully Added",
      success: true,
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    return res
      .status(error.message === "This Course Is Already Available" ? 400 : 500)
      .json({
        message: error.message || "Internal Server Error, Please Try Again",
        success: false,
      });
  }
};

const allCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "No Courses Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Courses Retrieved Successfully",
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    return res.status(500).json({
      message: "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

const DeleteCourse = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedCourse = await courseService.deleteCourse(id);

    return res.status(200).json({
      message: "Course Deleted Successfully",
      success: true,
      data: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    return res.status(error.message === "Course Not Found" ? 404 : 400).json({
      message: error.message || "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

const getcourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);

    return res.status(200).json({
      message: "Course Retrieved Successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error.message);
    return res.status(error.message === "Course Not Found" ? 404 : 400).json({
      message: error.message || "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

const UpdateCourse = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty or not properly parsed",
        success: false,
      });
    }

    const { id } = req.params;
    const updatedCourse = await courseService.updateCourse(id, req.body);

    return res.status(200).json({
      message: "Course updated successfully",
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error.message);
    return res.status(error.message === "Course Not Found" ? 404 : 400).json({
      message: error.message || "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

module.exports = {
  CreateCourse,
  allCourses,
  DeleteCourse,
  getcourseById,
  UpdateCourse,
};
