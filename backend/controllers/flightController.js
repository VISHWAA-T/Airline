import Flight from '../models/flightModel.js';

// @desc    Get all flights (with optional filtering)
// @route   GET /api/flights
// @access  Public
const getFlights = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = {};
        if (type) {
            filter.type = type.toLowerCase();
        }
        const flights = await Flight.find(filter);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search flights with origin, destination, date — returns exact matches + suggestions
// @route   GET /api/flights/search
// @access  Public
const searchFlights = async (req, res) => {
    try {
        const { origin, destination, date, type } = req.query;

        // Build the exact-match query
        const exactQuery = {};
        if (origin) exactQuery.origin = origin.toUpperCase();
        if (destination) exactQuery.destination = destination.toUpperCase();
        if (type) exactQuery.type = type.toLowerCase();

        // If a date is provided, match flights departing on that calendar day
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);
            exactQuery.departureTime = { $gte: searchDate, $lt: nextDay };
        }

        const exactMatches = await Flight.find(exactQuery);

        let suggestions = [];

        // When there are no exact matches, suggest flights that share the destination and type
        if (exactMatches.length === 0 && destination) {
            const destQuery = { destination: destination.toUpperCase() };
            if (type) destQuery.type = type.toLowerCase();
            suggestions = await Flight.find(destQuery);

            // If still nothing by destination, try flights FROM the origin and type
            if (suggestions.length === 0 && origin) {
                const originQuery = { origin: origin.toUpperCase() };
                if (type) originQuery.type = type.toLowerCase();
                suggestions = await Flight.find(originQuery);
            }
        }

        res.json({ exactMatches, suggestions });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get flight by ID
// @route   GET /api/flights/:id
// @access  Public
const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (flight) {
            res.json(flight);
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a flight
// @route   POST /api/flights
// @access  Private/Admin
const createFlight = async (req, res) => {
    const {
        airline,
        flightNumber,
        origin,
        destination,
        departureTime,
        arrivalTime,
        price,
        totalSeats,
        type,
    } = req.body;

    try {
        const flightExists = await Flight.findOne({ flightNumber });

        if (flightExists) {
            return res.status(400).json({ message: 'Flight number already exists' });
        }

        const flight = new Flight({
            airline,
            flightNumber,
            origin,
            destination,
            departureTime,
            arrivalTime,
            price,
            totalSeats,
            availableSeats: totalSeats,
            type: type || 'local',
        });

        const createdFlight = await flight.save();
        res.status(201).json(createdFlight);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
const updateFlight = async (req, res) => {
    const {
        airline,
        flightNumber,
        origin,
        destination,
        departureTime,
        arrivalTime,
        price,
        totalSeats,
        availableSeats,
        type,
    } = req.body;

    try {
        const flight = await Flight.findById(req.params.id);

        if (flight) {
            flight.airline = airline || flight.airline;
            flight.flightNumber = flightNumber || flight.flightNumber;
            flight.origin = origin || flight.origin;
            flight.destination = destination || flight.destination;
            flight.departureTime = departureTime || flight.departureTime;
            flight.arrivalTime = arrivalTime || flight.arrivalTime;
            flight.price = price || flight.price;
            flight.totalSeats = totalSeats || flight.totalSeats;
            flight.availableSeats = availableSeats !== undefined ? availableSeats : flight.availableSeats;
            flight.type = type || flight.type;

            const updatedFlight = await flight.save();
            res.json(updatedFlight);
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
const deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (flight) {
            await flight.deleteOne();
            res.json({ message: 'Flight removed' });
        } else {
            res.status(404).json({ message: 'Flight not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    searchFlights,
};
