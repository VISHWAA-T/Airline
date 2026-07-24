import mongoose from 'mongoose';
import dns from 'dns';
import seedDB from './seed.js';

const connectDB = async () => {
    try {
        // Use Google Public DNS to bypass local ISP DNS SRV lookup restrictions (EREFUSED)
        try {
            dns.setServers(['8.8.8.8', '8.8.4.4']);
        } catch (e) {
            console.warn('Could not set custom DNS servers:', e.message);
        }
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
