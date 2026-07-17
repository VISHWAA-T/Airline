import { useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [airline, setAirline] = useState('');
    const [flightNumber, setFlightNumber] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    const [totalSeats, setTotalSeats] = useState('');
    const [tripType, setTripType] = useState('local');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Ensure only admins can access
    if (!user || !user.isAdmin) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
                <h2>Access Denied</h2>
                <p>You must be an administrator to view this page.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Return Home</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await api.post(
                '/api/flights',
                {
                    airline,
                    flightNumber,
                    origin,
                    destination,
                    departureTime,
                    arrivalTime,
                    price: Number(price),
                    totalSeats: Number(totalSeats),
                    type: tripType,
                },
                config
            );

            setMessage('Flight successfully created!');
            // Reset form
            setAirline('');
            setFlightNumber('');
            setOrigin('');
            setDestination('');
            setDepartureTime('');
            setArrivalTime('');
            setPrice('');
            setTotalSeats('');
            setTripType('local');

        } catch (err) {
            setError(err.response?.data?.message || 'Error creating flight');
        }
    };

    return (
        <div className="container" style={{ marginTop: '3rem', marginBottom: '3rem', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div className="card animate-fade-in">
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #efefef', paddingBottom: '0.8rem' }}>Add New Flight Route</h2>

                {message && <div style={{ background: '#d1e7dd', color: '#0f5132', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>{message}</div>}
                {error && <div style={{ background: '#f8d7da', color: '#842029', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Airline Name</label>
                            <input type="text" className="form-control" value={airline} onChange={e => setAirline(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Flight Number</label>
                            <input type="text" className="form-control" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Origin (Airport Code)</label>
                            <input type="text" className="form-control" value={origin} onChange={e => setOrigin(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Destination (Airport Code)</label>
                            <input type="text" className="form-control" value={destination} onChange={e => setDestination(e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Departure Time</label>
                            <input type="datetime-local" className="form-control" value={departureTime} onChange={e => setDepartureTime(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Arrival Time</label>
                            <input type="datetime-local" className="form-control" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Ticket Price (₹)</label>
                            <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Seats</label>
                            <input type="number" className="form-control" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required min="1" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Trip Type</label>
                            <select className="form-control" value={tripType} onChange={e => setTripType(e.target.value)} required style={{ height: '46px' }}>
                                <option value="local">Local Trip</option>
                                <option value="international">International Trip</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Flight Route</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
