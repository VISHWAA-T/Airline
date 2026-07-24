import mongoose from 'mongoose';
import dns from 'dns';
import seedDB from './seed.js';

const connectDB = async () => {
    try {
        // Only override DNS in non-production environments to avoid breaking cloud DNS on Render
        if (process.env.NODE_ENV !== 'production') {
            try {
                dns.setServers(['8.8.8.8', '8.8.4.4']);
            } catch (e) {
                console.warn('Could not set custom DNS servers:', e.message);
            }
        }
        
        const mongoUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/airline_db').trim();
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Auto-seed database if empty
        await seedDB();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
