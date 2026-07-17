import mongoose from 'mongoose';
import seedDB from './seed.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/airline_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Auto-seed database if empty
        await seedDB();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
