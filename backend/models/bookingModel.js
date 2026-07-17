import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        flight: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Flight',
        },
        passengers: [
            {
                name: { type: String, required: true },
                age: { type: Number, required: true },
            },
        ],
        seats: [
            {
                type: String,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            default: 'Confirmed',
            enum: ['Confirmed', 'Cancelled'],
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
