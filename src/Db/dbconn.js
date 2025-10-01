const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

// const mongoose = require('mongoose');
// require('dotenv').config();

// const connectDB = async () => {
//     try {
//         console.log('Connecting to MongoDB Atlas...');
        
//         // Remove deprecated options
//         const conn = await mongoose.connect(process.env.MONGO_URI);
        
//         console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//         console.log(`Database: ${conn.connection.name}`);
        
//     } catch (error) {
//         console.error('❌ MongoDB connection error:', error.message);
        
//         if (error.message.includes('authentication failed')) {
//             console.error('❌ Authentication failed - Check your username and password in MongoDB Atlas');
//         } else if (error.message.includes('ENOTFOUND')) {
//             console.error('❌ Network error - Check your internet connection');
//         }
        
//         process.exit(1);
//     }
// };

// module.exports = connectDB;