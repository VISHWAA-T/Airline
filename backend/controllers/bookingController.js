import Booking from '../models/bookingModel.js';
import Flight from '../models/flightModel.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = async (req, res) => {
    const { flightId, passengers, seats, totalPrice } = req.body;

    if (!passengers || passengers.length === 0) {
        res.status(400).json({ message: 'No passengers found' });
        return;
    }

    const invalidPassenger = passengers.some(
        (p) => !p.name || !p.name.toString().trim() || p.age === '' || p.age === null || p.age === undefined
    );

    if (invalidPassenger) {
        res.status(400).json({ message: 'Please provide name and age for all passengers' });
        return;
    }

    if (!seats || seats.length !== passengers.length) {
        res.status(400).json({ message: 'Please select one seat for each passenger' });
        return;
    }

    try {
        const flight = await Flight.findById(flightId);

        if (!flight) {
            res.status(404).json({ message: 'Flight not found' });
            return;
        }

        if (flight.availableSeats < passengers.length) {
            res.status(400).json({ message: 'Not enough available seats' });
            return;
        }

        const booking = new Booking({
            user: req.user._id,
            flight: flightId,
            passengers,
            seats,
            totalPrice,
        });

        const createdBooking = await booking.save();

        flight.availableSeats -= passengers.length;
        await flight.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('flight');

        if (booking && (req.user.isAdmin || booking.user._id.toString() === req.user._id.toString())) {
            res.json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found or you are not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('flight');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name').populate('flight');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    addBookingItems,
    getBookingById,
    getMyBookings,
    getBookings,
};
