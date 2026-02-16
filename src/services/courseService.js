const Course = require("../Models/Course");

const createCourse = async (courseData) => {
  const {
    title,
    image,
    description,
    category,
    rating,
    reviewCount,
    videoUrl,
    tags,
  } = courseData;

  if (!title || !image || !description || !category || !videoUrl) {
    throw new Error("Please Enter Necessary Details");
  }

  const existingCourse = await Course.findOne({ where: { title } });
  if (existingCourse) {
    throw new Error("This Course Is Already Available");
  }

  const newCourse = await Course.create({
    title,
    image,
    description,
    category,
    rating,
    reviewCount,
    videoUrl,
    tags,
  });

  return newCourse;
};

const getAllCourses = async () => {
  const courses = await Course.findAll();
  return courses;
};

const getCourseById = async (id) => {
  if (!id) throw new Error("Course ID is required");

  const course = await Course.findByPk(id);
  if (!course) throw new Error("Course Not Found");

  return course;
};

const updateCourse = async (id, updateData) => {
  if (!id) throw new Error("Course ID is required");

  const course = await Course.findByPk(id);
  if (!course) throw new Error("Course Not Found");

  const { title, image, description, category, videoUrl, tags } = updateData;

  if (title !== undefined && title.length === 0)
    throw new Error("Title is required");
  if (image !== undefined && image.length === 0)
    throw new Error("Image is required");
  if (description !== undefined && description.length === 0)
    throw new Error("Description is required");
  if (category !== undefined && category.length === 0)
    throw new Error("Category is required");
  if (videoUrl !== undefined && videoUrl.length === 0)
    throw new Error("Video URL is required");

  await course.update({
    title,
    image,
    description,
    category,
    videoUrl,
    tags,
  });

  return course;
};

const deleteCourse = async (id) => {
  if (!id) throw new Error("Course ID is required");

  const course = await Course.findByPk(id);
  if (!course) throw new Error("Course Not Found");

  await course.destroy();
  return course;
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
