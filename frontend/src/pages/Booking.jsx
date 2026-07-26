import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Users, CreditCard } from 'lucide-react';

const Booking = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [passengers, setPassengers] = useState([{ name: '', age: '' }]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState(['1A', '1B', '2C', '3D']);
    const [step, setStep] = useState('seat');
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [seatError, setSeatError] = useState(null);
    const [bookingError, setBookingError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showPassengerErrors, setShowPassengerErrors] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchFlight = async () => {
            try {
                const { data } = await api.get(`/api/flights/${id}`);
                setFlight(data);
                setLoading(false);
            } catch (err) {
                setFetchError('Error fetching flight details');
                setLoading(false);
            }
        };

        fetchFlight();
    }, [id, user, navigate]);

    const seatRows = [1, 2, 3, 4, 5, 6, 7, 8];
    const seatCols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatLayout = seatRows.flatMap((row) => seatCols.map((col) => `${row}${col}`));

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    const handleSeatToggle = (seat) => {
        if (reservedSeats.includes(seat)) {
            return;
        }

        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
            return;
        }

        const availableSeatCount = Math.min(flight?.availableSeats || 0, seatLayout.length);
        if (selectedSeats.length >= availableSeatCount) {
            return;
        }
        setSelectedSeats([...selectedSeats, seat]);
    };

    const handleSeatContinue = () => {
        setSeatError(null);
        if (selectedSeats.length === 0) {
            setSeatError('Please select at least one seat to continue');
            return;
        }

        setPassengers(Array.from({ length: selectedSeats.length }, () => ({ name: '', age: '' })));
        setShowPassengerErrors(false);
        setStep('passenger');
    };

    const addPassenger = () => {
        setPassengers([...passengers, { name: '', age: '' }]);
    };

    const removePassenger = (index) => {
        const updatedPassengers = passengers.filter((_, i) => i !== index);
        setPassengers(updatedPassengers);
    };

    const handleBooking = async () => {
        setShowPassengerErrors(true);
        setBookingError(null);

        const allPassengersValid = passengers.every((p) => p.name.trim() && p.age !== '' && p.age !== null);
        if (!allPassengersValid) {
            return setBookingError('Please fill in name and age for all passengers');
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const totalPrice = flight.price * passengers.length;

            await api.post(
                '/api/bookings',
                {
                    flightId: flight._id,
                    passengers,
                    seats: selectedSeats,
                    totalPrice,
                },
                config
            );

            setBookingSuccess(true);
            setTimeout(() => {
                navigate('/my-bookings');
            }, 3000);
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Failed to create booking');
        }
    };

    const hasInvalidPassengers = showPassengerErrors && passengers.some((p) => !p.name.trim() || p.age === '' || p.age === null);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}><h2>Loading flight details...</h2></div>;
    if (fetchError) return <div className="container" style={{ color: 'red', marginTop: '5rem' }}><h2>{fetchError}</h2></div>;

    const totalPrice = flight.price * passengers.length;

    return (
        <div className="container" style={{ marginTop: '2.5rem', marginBottom: '3rem', maxWidth: '850px' }}>
            <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Complete Your Booking</h1>

            {bookingSuccess ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#d1e7dd', color: '#0f5132' }}>
                    <h2>Booking Confirmed!</h2>
                    <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Thank you for choosing SkyWings. Redirecting you to your bookings...</p>
                </div>
            ) : (
                <>
                    {/* Flight Details Summary */}
                    <div className="card animate-fade-in" style={{ marginBottom: '1.5rem', background: 'var(--primary-color)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem' }}>{flight.origin} to {flight.destination}</h3>
                                <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{flight.airline} - {flight.flightNumber}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>Departure</p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{new Date(flight.departureTime).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {step === 'seat' ? (
                        <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #efefef', paddingBottom: '0.8rem' }}>
                                <Users /> Select Your Seat
                            </h2>

                            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                Choose your seat(s) for this flight. Selected seats will determine how many passenger details you need to enter.
                            </p>

                            {/* Responsive Scrollable Seat Matrix */}
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
                                ↔ Swipe left/right if needed to view all seats
                            </p>
                            <div className="seat-matrix-wrapper">
                                <div className="seat-matrix-grid">
                                    <div />
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>A</div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>B</div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>C</div>
                                    <div />
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>D</div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>E</div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>F</div>

                                    {seatRows.map((row) => (
                                        <div key={row} style={{ display: 'contents' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{row}</div>
                                            {seatCols.slice(0, 3).map((col) => {
                                                const seat = `${row}${col}`;
                                                const selected = selectedSeats.includes(seat);
                                                const reserved = reservedSeats.includes(seat);
                                                const seatStyle = {
                                                    padding: '0.65rem 0.5rem',
                                                    borderRadius: '6px',
                                                    border: selected ? '2px solid #0d6efd' : reserved ? '1px solid #dc3545' : '1px solid #198754',
                                                    background: selected ? '#cfe2ff' : reserved ? '#f8d7da' : '#d1e7dd',
                                                    color: selected ? '#0d6efd' : reserved ? '#842029' : '#0f5132',
                                                    cursor: reserved ? 'not-allowed' : 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'center'
                                                };

                                                return (
                                                    <button
                                                        key={seat}
                                                        type="button"
                                                        onClick={() => handleSeatToggle(seat)}
                                                        disabled={reserved}
                                                        style={seatStyle}
                                                    >
                                                        {seat}
                                                    </button>
                                                );
                                            })}
                                            <div key={`aisle-${row}`} style={{ width: '100%' }} />
                                            {seatCols.slice(3).map((col) => {
                                                const seat = `${row}${col}`;
                                                const selected = selectedSeats.includes(seat);
                                                const reserved = reservedSeats.includes(seat);
                                                const seatStyle = {
                                                    padding: '0.65rem 0.5rem',
                                                    borderRadius: '6px',
                                                    border: selected ? '2px solid #0d6efd' : reserved ? '1px solid #dc3545' : '1px solid #198754',
                                                    background: selected ? '#cfe2ff' : reserved ? '#f8d7da' : '#d1e7dd',
                                                    color: selected ? '#0d6efd' : reserved ? '#842029' : '#0f5132',
                                                    cursor: reserved ? 'not-allowed' : 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'center'
                                                };

                                                return (
                                                    <button
                                                        key={seat}
                                                        type="button"
                                                        onClick={() => handleSeatToggle(seat)}
                                                        disabled={reserved}
                                                        style={seatStyle}
                                                    >
                                                        {seat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '14px', height: '14px', display: 'inline-block', background: '#d1e7dd', border: '1px solid #198754', borderRadius: '4px' }}></span> Available</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '14px', height: '14px', display: 'inline-block', background: '#f8d7da', border: '1px solid #dc3545', borderRadius: '4px' }}></span> Reserved</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '14px', height: '14px', display: 'inline-block', background: '#cfe2ff', border: '2px solid #0d6efd', borderRadius: '4px' }}></span> Selected</span>
                            </div>

                            {seatError && (
                                <div style={{ color: '#dc3545', marginBottom: '1rem', fontWeight: '500' }}>{seatError}</div>
                            )}

                            <button onClick={handleSeatContinue} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                                Continue to Passenger Details
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="card animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #efefef', paddingBottom: '0.8rem' }}>
                                    <Users /> Passenger Details
                                </h2>

                                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <strong>Selected Seats:</strong> {selectedSeats.join(', ')}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStep('seat')}
                                        className="btn"
                                        style={{ border: '1px solid var(--text-muted)', color: 'var(--text-color)', background: 'transparent', padding: '0.4rem 0.85rem', fontSize: '0.9rem' }}
                                    >
                                        Change Seats
                                    </button>
                                </div>

                                {(bookingError || hasInvalidPassengers) && (
                                    <div style={{ background: '#f8d7da', color: '#842029', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                                        {bookingError || 'Please fill in name and age for all passengers'}
                                    </div>
                                )}

                                {passengers.map((p, index) => {
                                    const nameError = showPassengerErrors && !p.name.trim();
                                    const ageError = showPassengerErrors && (p.age === '' || p.age === null);

                                    return (
                                        <div key={index} className="passenger-item">
                                            <div style={{ flex: '2', width: '100%' }}>
                                                <label className="form-label">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter passenger name"
                                                    value={p.name}
                                                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                                    style={nameError ? { borderColor: '#dc3545' } : {}}
                                                />
                                                {nameError && <div style={{ color: '#dc3545', marginTop: '0.25rem', fontSize: '0.85rem' }}>Full Name is required.</div>}
                                            </div>
                                            <div style={{ flex: '1', width: '100%' }}>
                                                <label className="form-label">Age</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Age"
                                                    value={p.age}
                                                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                    style={ageError ? { borderColor: '#dc3545' } : {}}
                                                    min="0"
                                                />
                                                {ageError && <div style={{ color: '#dc3545', marginTop: '0.25rem', fontSize: '0.85rem' }}>Age is required.</div>}
                                            </div>
                                            {passengers.length > 1 && (
                                                <button onClick={() => removePassenger(index)} className="btn btn-remove" style={{ background: '#dc3545', color: 'white', height: '46px' }}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                <button onClick={addPassenger} className="btn" style={{ border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', width: '100%', marginTop: '0.5rem' }}>
                                    + Add Another Passenger
                                </button>
                            </div>

                            {/* Payment Summary */}
                            <div className="card animate-fade-in">
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #efefef', paddingBottom: '0.8rem' }}>
                                    <CreditCard /> Payment Summary
                                </h2>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Price per passenger</span>
                                    <span>₹{flight.price.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
                                    <span>Number of passengers</span>
                                    <span>x {passengers.length}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #ccc', paddingTop: '1rem', marginBottom: '1.5rem', fontSize: '1.15rem', fontWeight: 'bold' }}>
                                    <span>Total Amount</span>
                                    <span style={{ color: '#198754' }}>₹{totalPrice.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontSize: '1.05rem', padding: '0.85rem' }}>
                                    Confirm Booking & Pay ₹{totalPrice.toFixed(2)}
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Booking;
