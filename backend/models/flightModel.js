import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema(
    {
        airline: {
            type: String,
            required: true,
        },
        flightNumber: {
            type: String,
            required: true,
            unique: true,
        },
        origin: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        departureTime: {
            type: Date,
            required: true,
        },
        arrivalTime: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
            default: 150,
        },
        availableSeats: {
            type: Number,
            required: true,
            default: 150,
        },
        type: {
            type: String,
            required: true,
            enum: ['local', 'international'],
            default: 'local',
        },
    },
    {
        timestamps: true,
    }
);

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
