const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    videoUrl: { type: String, required: true },
    tags: { type: [String], required: true }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
