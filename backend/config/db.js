const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lifelink';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.log("Tip: Check if your IP is whitelisted in Atlas or if local MongoDB is running.");
        // Don't exit, keep server alive for other services or debugging
    }
};


module.exports = connectDB;
