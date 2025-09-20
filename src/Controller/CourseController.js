const Course = require('../Models/CourseModel');

const CreateCourse = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            message: 'Request body is empty or not properly parsed', 
            success: false 
        });
    }

    const { title, image, description, category, rating, reviewCount, videoUrl, tags } = req.body;
    console.log('Request body:', req.body);
    try {
        if (!title || !image || !description || !category || !rating || !reviewCount || !videoUrl || !tags) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const newCourse = new Course({
            title,
            image,
            description,    
            category,
            rating,
            reviewCount,
            videoUrl,
            tags
        });
        
        return res.status(201).json({ message: 'Course created successfully', success: true, data: newCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = {
    CreateCourse
};
