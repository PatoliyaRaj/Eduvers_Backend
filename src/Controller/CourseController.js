const Course = require("../Models/CourseModel");

const CreateCourse = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty or not properly parsed",
      success: false,
    });
  }

  const {
    title,
    image,
    description,
    category,
    rating,
    reviewCount,
    videoUrl,
    tags,
  } = req.body;

  try {
    if (!title || !image || !description || !category || !videoUrl) {
      return res.status(400).json({
        message: "Please Enter Necessary Details",
        success: false,
      });
    }

    const findcourse = await Course.findOne({ title });
    if (findcourse) {
      return res.status(400).json({
        message: "This Course Is Already Available",
        success: false,
      });
    }

    const newCourse = new Course({
      title,
      image,
      description,
      category,
      rating,
      reviewCount,
      videoUrl,
      tags,
    });

    const addcourse = await newCourse.save();

    if (!addcourse) {
      return res.status(400).json({
        message: "Faild To Add Course , Please Try Again",
        success: false,
      });
    }
    console.log(addcourse);

    return res.status(200).json({
      message: "The Cousre Successfully Added",
      success: true,
      data: addcourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error,Please Try Again",
      success: false,
    });
  }
};

const allCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
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
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error,Please Try Again",
      success: false,
    });
  }
};

const DeleteCourse = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({
        message: "Course Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Course Deleted Successfully",
      success: true,
      data: deletedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

const getcourseById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "Course ID is required",
        success: false,
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Course Retrieved Successfully",
      success: true,
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

const UpdateCourse = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty or not properly parsed",
      success: false,
    });
  }

  try {
    const { title, image, description, category, videoUrl, tags } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Occurs Some Issues Please Try Agani",
        success: false,
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    if (!title.length > 0) {
      return res.status(400).json({
        message: "Title is required",
        success: false,
      });
    }
    if (!image.length > 0) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }
    if (!description.length > 0) {
      return res.status(400).json({
        message: "Description is required",
        success: false,
      });
    }
    if (!category.length > 0) {
      return res.status(400).json({
        message: "Category is required",
        success: false,
      });
    }
    if (!videoUrl.length > 0) {
      return res.status(400).json({
        message: "Video URL is required",
        success: false,
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title && { title }),
          ...(image && { image }),
          ...(description && { description }),
          ...(category && { category }),
          ...(videoUrl && { videoUrl }),
          ...(tags && { tags }),
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(400).json({
        message: "Failed to update course, please try again",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error, Please Try Again",
      success: false,
    });
  }
};

module.exports = {
  CreateCourse,
  allCourses,
  DeleteCourse,
  getcourseById,
  UpdateCourse
};
