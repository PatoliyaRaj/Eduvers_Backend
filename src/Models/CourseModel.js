

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: { type: Number, required: true, default: 0 },
    videoUrl: { type: String, required: true },
    tags: {
      type: [String],
      required: true,
      max: 3,
      min: 1,
      default: ["Popular", "New"],
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
