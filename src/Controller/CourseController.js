
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

module.exports = {
  CreateCourse,
};
