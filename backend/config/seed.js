import User from '../models/userModel.js';
import Flight from '../models/flightModel.js';
import Booking from '../models/bookingModel.js';

const seedDB = async () => {
    try {
        // Check if database is already populated
        const userCount = await User.countDocuments();
        const flightCount = await Flight.countDocuments();
        const missingType = await Flight.findOne({ type: { $exists: false } });

        if (userCount > 0 && flightCount === 12 && !missingType) {
            console.log('Database already has the correct flight data. Skipping auto-seeding.');
            return;
        }

        console.log('Seeding/Re-seeding database with default data...');

        // If users don't exist, create them
        if (userCount === 0) {
            // Clear any user data just in case
            await User.deleteMany({});
            
            // Create Admin User
            await User.create({
                name: 'Admin User',
                email: 'admin@skywings.com',
                password: 'adminpassword',
                isAdmin: true,
            });

            // Create Standard User
            await User.create({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                isAdmin: false,
            });

            console.log('Users seeded successfully');
        }

        // Always drop flights and bookings if we need to reseed flights
        await Flight.deleteMany({});
        await Booking.deleteMany({});

        // Create Flight Routes (with relative future dates)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Helper to reset a date's hours/minutes/seconds
        const getFutureDate = (baseDate, hours, minutes) => {
            const d = new Date(baseDate);
            d.setHours(hours, minutes, 0, 0);
            return d;
        };

        const flights = [
            // International Trips
            {
                airline: 'Singapore Airlines',
                flightNumber: 'SQ-529',
                origin: 'MADURAI',
                destination: 'SINGAPORE',
                departureTime: getFutureDate(tomorrow, 11, 15),
                arrivalTime: getFutureDate(tomorrow, 18, 0),
                price: 18500,
                totalSeats: 180,
                availableSeats: 180,
                type: 'international',
            },
            {
                airline: 'Emirates',
                flightNumber: 'EK-543',
                origin: 'MADURAI',
                destination: 'DUBAI',
                departureTime: getFutureDate(dayAfter, 9, 30),
                arrivalTime: getFutureDate(dayAfter, 13, 15),
                price: 22400,
                totalSeats: 250,
                availableSeats: 250,
                type: 'international',
            },
            {
                airline: 'Air India',
                flightNumber: 'AI-101',
                origin: 'CHENNAI',
                destination: 'AMERICA',
                departureTime: getFutureDate(tomorrow, 2, 30),
                arrivalTime: getFutureDate(tomorrow, 16, 45),
                price: 68000,
                totalSeats: 300,
                availableSeats: 300,
                type: 'international',
            },
            {
                airline: 'Air France',
                flightNumber: 'AF-115',
                origin: 'CHENNAI',
                destination: 'FRANCE',
                departureTime: getFutureDate(nextWeek, 13, 0),
                arrivalTime: getFutureDate(nextWeek, 20, 30),
                price: 54500,
                totalSeats: 200,
                availableSeats: 200,
                type: 'international',
            },
            {
                airline: 'Japan Airlines',
                flightNumber: 'JL-746',
                origin: 'MUMBAI',
                destination: 'JAPAN',
                departureTime: getFutureDate(dayAfter, 19, 45),
                arrivalTime: new Date(getFutureDate(dayAfter, 7, 15).getTime() + 24 * 60 * 60 * 1000),
                price: 49500,
                totalSeats: 220,
                availableSeats: 220,
                type: 'international',
            },
            {
                airline: 'Qantas',
                flightNumber: 'QF-52',
                origin: 'MUMBAI',
                destination: 'AUSTRALIA',
                departureTime: getFutureDate(nextWeek, 22, 10),
                arrivalTime: new Date(getFutureDate(nextWeek, 10, 30).getTime() + 24 * 60 * 60 * 1000),
                price: 59000,
                totalSeats: 240,
                availableSeats: 240,
                type: 'international',
            },
            // Local Trips
            {
                airline: 'IndiGo',
                flightNumber: '6E-712',
                origin: 'MADURAI',
                destination: 'CHENNAI',
                departureTime: getFutureDate(tomorrow, 7, 30),
                arrivalTime: getFutureDate(tomorrow, 8, 45),
                price: 3200,
                totalSeats: 180,
                availableSeats: 180,
                type: 'local',
            },
            {
                airline: 'IndiGo',
                flightNumber: '6E-405',
                origin: 'MADURAI',
                destination: 'COIMBATORE',
                departureTime: getFutureDate(dayAfter, 14, 0),
                arrivalTime: getFutureDate(dayAfter, 15, 10),
                price: 2500,
                totalSeats: 180,
                availableSeats: 180,
                type: 'local',
            },
            {
                airline: 'Air India',
                flightNumber: 'AI-472',
                origin: 'MADURAI',
                destination: 'DELHI',
                departureTime: getFutureDate(tomorrow, 16, 20),
                arrivalTime: getFutureDate(tomorrow, 19, 30),
                price: 7200,
                totalSeats: 150,
                availableSeats: 150,
                type: 'local',
            },
            {
                airline: 'SpiceJet',
                flightNumber: 'SG-234',
                origin: 'CHENNAI',
                destination: 'KOLKATA',
                departureTime: getFutureDate(dayAfter, 10, 15),
                arrivalTime: getFutureDate(dayAfter, 12, 45),
                price: 5800,
                totalSeats: 160,
                availableSeats: 160,
                type: 'local',
            },
            {
                airline: 'IndiGo',
                flightNumber: '6E-5321',
                origin: 'CHENNAI',
                destination: 'MUMBAI',
                departureTime: getFutureDate(tomorrow, 20, 0),
                arrivalTime: getFutureDate(tomorrow, 22, 0),
                price: 4300,
                totalSeats: 180,
                availableSeats: 180,
                type: 'local',
            },
            {
                airline: 'Akasa Air',
                flightNumber: 'QP-1102',
                origin: 'CHENNAI',
                destination: 'BANGALORE',
                departureTime: getFutureDate(nextWeek, 18, 30),
                arrivalTime: getFutureDate(nextWeek, 19, 40),
                price: 2900,
                totalSeats: 180,
                availableSeats: 180,
                type: 'local',
            }
        ];

        await Flight.insertMany(flights);
        console.log('Flights seeded successfully');
        console.log('Database seeding completed!');
    } catch (error) {
        console.error(`Error with database seeding: ${error.message}`);
    }
};

export default seedDB;
