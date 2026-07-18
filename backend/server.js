import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Support for a debugging flag to allow all origins when troubleshooting CORS in deployment.
const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === 'true';
const allowedOrigins = allowAllOrigins
    ? []
    : process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()).filter(Boolean);

if (allowAllOrigins) {
    console.warn('ALLOW_ALL_ORIGINS is enabled — accepting requests from any origin (debug only)');
}

app.use(cors({
    origin: allowAllOrigins ? true : (allowedOrigins?.length ? allowedOrigins : true),
    credentials: true,
}));
app.use(express.json());

// Simple request logger to help debug CORS/origin issues in deployment
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} Origin: ${req.headers.origin || '-'} `);
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Airline Reservation API is running...');
});

// Health route for quick DB + server checks
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection?.readyState;
    res.json({ status: 'ok', dbState });
});

const PORT = Number(process.env.PORT) || 5000;

// Log important runtime info to help with deployed debugging
console.log('Server starting with env:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    allowedOrigins: allowedOrigins,
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
