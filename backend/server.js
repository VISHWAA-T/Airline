import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()).filter(Boolean);

app.use(cors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Airline Reservation API is running...');
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
