import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { Plane, Clock, IndianRupee, AlertCircle, Info } from 'lucide-react';

const FlightCard = ({ flight }) => (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #efefef', paddingBottom: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}><Plane size={20} /> {flight.airline}</h3>
            <span style={{ background: '#e9ecef', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{flight.flightNumber}</span>
        </div>

        <div className="flight-card-route" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
            <div>
                <p style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{flight.origin}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={14} /> {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            <div className="flight-icon-center" style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)' }}>
                <Plane size={22} style={{ transform: 'rotate(90deg)' }} />
            </div>
            <div className="flight-card-dest" style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{flight.destination}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                    <Clock size={14} /> {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {new Date(flight.departureTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #efefef', gap: '0.5rem', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '1.35rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#198754', margin: 0 }}>
                <IndianRupee size={18} />{flight.price}
            </p>
            <Link to={`/book/${flight._id}`} className="btn btn-primary">
                Book Now
            </Link>
        </div>
        <p style={{ textAlign: 'right', fontSize: '0.8rem', color: flight.availableSeats > 20 ? 'var(--text-muted)' : '#dc3545', marginTop: '0.5rem' }}>
            {flight.availableSeats} seats left
        </p>
    </div>
);

const Flights = () => {
    const [searchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearchMode, setIsSearchMode] = useState(false);

    const searchOrigin = searchParams.get('origin') || '';
    const searchDestination = searchParams.get('destination') || '';
    const searchDate = searchParams.get('date') || '';
    const searchType = searchParams.get('type') || '';

    useEffect(() => {
        const hasSearchParams = searchOrigin || searchDestination || searchDate;
        setIsSearchMode(hasSearchParams);

        const fetchFlights = async () => {
            setLoading(true);
            setError(null);
            setSuggestions([]);

            try {
                const params = new URLSearchParams();
                if (searchOrigin) params.set('origin', searchOrigin);
                if (searchDestination) params.set('destination', searchDestination);
                if (searchDate) params.set('date', searchDate);
                if (searchType) params.set('type', searchType);

                if (searchOrigin || searchDestination || searchDate) {
                    const { data } = await api.get(`/api/flights/search?${params.toString()}`);
                    setFlights(data.exactMatches);
                    setSuggestions(data.suggestions);
                } else {
                    const { data } = await api.get(`/api/flights?${params.toString()}`);
                    setFlights(data);
                }

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching flights');
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchOrigin, searchDestination, searchDate, searchType]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}><h2>Loading available flights...</h2></div>;
    if (error) return <div className="container" style={{ color: 'red', marginTop: '5rem' }}><h2>{error}</h2></div>;

    const searchSummary = [
        searchType && `${searchType.charAt(0).toUpperCase() + searchType.slice(1)} trip`,
        searchOrigin && `from ${searchOrigin}`,
        searchDestination && `to ${searchDestination}`,
        searchDate && `on ${new Date(searchDate).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
    ].filter(Boolean).join(' ');

    return (
        <div className="container" style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
            <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                {searchType ? `${searchType.charAt(0).toUpperCase() + searchType.slice(1)} Flights` : isSearchMode ? 'Search Results' : 'Available Flights'}
            </h1>

            {(isSearchMode || searchType) && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
                    Showing flights {searchSummary}
                </p>
            )}

            {/* Exact Matches */}
            {flights.length > 0 ? (
                <div className="cards-grid">
                    {flights.map(flight => (
                        <FlightCard key={flight._id} flight={flight} />
                    ))}
                </div>
            ) : isSearchMode ? (
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1.25rem', background: '#fff3cd', border: '1px solid #ffc107' }}>
                    <AlertCircle size={40} style={{ color: '#856404', marginBottom: '0.75rem' }} />
                    <h3 style={{ color: '#856404', marginBottom: '0.5rem' }}>No exact flights found {searchSummary}</h3>
                    <p style={{ color: '#664d03' }}>We couldn't find a flight matching your exact search. Check out our suggestions below!</p>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '2rem 1.25rem' }}>
                    <h3>No flights found at the moment.</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Please check back later or try different search criteria.</p>
                </div>
            )}

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <Info size={22} style={{ color: 'var(--primary-color)' }} />
                        <h2 style={{ margin: 0 }}>
                            Suggested Flights {searchDestination ? `to ${searchDestination}` : searchOrigin ? `from ${searchOrigin}` : ''}
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        These flights match your destination but depart on different dates or from other origins.
                    </p>
                    <div className="cards-grid">
                        {suggestions.map(flight => (
                            <FlightCard key={flight._id} flight={flight} />
                        ))}
                    </div>
                </div>
            )}

            {(isSearchMode || searchType) && (
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <Link to="/flights" className="btn" style={{ border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent' }}>
                        View All Available Flights
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Flights;
