import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Plane } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [tripType, setTripType] = useState('local');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (origin.trim()) params.set('origin', origin.trim().toUpperCase());
        if (destination.trim()) params.set('destination', destination.trim().toUpperCase());
        if (date) params.set('date', date);
        params.set('type', tripType);
        navigate(`/flights?${params.toString()}`);
    };

    return (
        <div>
            {/* Hero Section */}
            <div
                className="hero-bg"
                style={{
                    color: 'white',
                    padding: '5rem 0 7rem 0',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: "url('/background.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,30,80,0.55) 0%, rgba(0,50,130,0.35) 50%, rgba(0,20,60,0.60) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                }} />

                <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 3 }}>
                    {/* Animated badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '999px',
                        padding: '0.4rem 1.2rem',
                        marginBottom: '1.25rem',
                        backdropFilter: 'blur(8px)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        color: '#b4d8ff',
                        fontWeight: 500,
                    }}>
                        <Plane size={14} style={{ color: '#7ec8ff' }} />
                        Premium Airline Experience
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                        marginBottom: '1rem',
                        fontWeight: '800',
                        textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                    }}>
                        Where would you like to{' '}
                        <span style={{
                            color: '#ffffff',
                            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                        }}>explore?</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                        opacity: '0.9',
                        marginBottom: '2rem',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        maxWidth: '520px',
                        margin: '0 auto 2rem',
                        padding: '0 0.5rem'
                    }}>
                        Book your flights with <strong>SkyWings</strong> for a premium and seamless experience.
                    </p>

                    {/* Stats row */}
                    <div className="hero-stats-row" style={{
                        display: 'flex',
                        justify: 'center',
                        gap: '2.5rem',
                        flexWrap: 'wrap',
                        marginTop: '1rem',
                    }}>
                        {[
                            { val: '200+', label: 'Destinations' },
                            { val: '50K+', label: 'Happy Travelers' },
                            { val: '99%', label: 'On-time Rate' },
                        ].map(stat => (
                            <div key={stat.label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', fontWeight: 800, color: '#7ec8ff', textShadow: '0 0 20px rgba(126,200,255,0.5)' }}>{stat.val}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
                <form
                    onSubmit={handleSearch}
                    className="card animate-fade-in search-card-form"
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1.75rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        boxShadow: '0 8px 40px rgba(13,110,253,0.12)',
                        border: '1px solid rgba(13,110,253,0.08)',
                    }}
                >
                    {/* Trip Type Selector */}
                    <div className="search-trip-type" style={{ display: 'flex', width: '100%', gap: '0.75rem', marginBottom: '0.5rem', borderBottom: '1px solid #efefef', paddingBottom: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => setTripType('local')}
                            style={{
                                flex: '1',
                                background: tripType === 'local' ? 'linear-gradient(135deg, var(--primary-color) 0%, #173b75 100%)' : 'rgba(245, 247, 250, 0.9)',
                                color: tripType === 'local' ? '#ffffff' : 'var(--text-color)',
                                border: '1px solid ' + (tripType === 'local' ? 'transparent' : '#e2e8f0'),
                                padding: '0.65rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                boxShadow: tripType === 'local' ? '0 4px 12px rgba(23, 59, 117, 0.2)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'center'
                            }}
                        >
                            Local Trip
                        </button>
                        <button
                            type="button"
                            onClick={() => setTripType('international')}
                            style={{
                                flex: '1',
                                background: tripType === 'international' ? 'linear-gradient(135deg, var(--primary-color) 0%, #173b75 100%)' : 'rgba(245, 247, 250, 0.9)',
                                color: tripType === 'international' ? '#ffffff' : 'var(--text-color)',
                                border: '1px solid ' + (tripType === 'international' ? 'transparent' : '#e2e8f0'),
                                padding: '0.65rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                boxShadow: tripType === 'international' ? '0 4px 12px rgba(23, 59, 117, 0.2)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'center'
                            }}
                        >
                            International Trip
                        </button>
                    </div>

                    <div className="search-input-group" style={{ flex: '1', minWidth: '200px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><MapPin size={16} /> From</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={tripType === 'local' ? "Origin (e.g., Madurai, Chennai)" : "Origin (e.g., Mumbai, Chennai)"}
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                        />
                    </div>
                    <div className="search-input-group" style={{ flex: '1', minWidth: '200px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><MapPin size={16} /> To</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={tripType === 'local' ? "Destination (e.g., Coimbatore, Delhi)" : "Destination (e.g., Singapore, Dubai)"}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                    <div className="search-input-group" style={{ flex: '1', minWidth: '200px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><Calendar size={16} /> Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="search-submit-group" style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', height: '46px', width: '100%' }}>
                            <Search size={18} /> Search Flights
                        </button>
                    </div>
                </form>
            </div>

            {/* Why SkyWings */}
            <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '2rem' }}>Why choose SkyWings?</h2>
                <div className="cards-grid">
                    <div className="card">
                        <h3>Best Prices</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>We guarantee the most competitive rates for all global destinations.</p>
                    </div>
                    <div className="card">
                        <h3>Premium Comfort</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Experience luxury in the skies with our state-of-the-art aircraft.</p>
                    </div>
                    <div className="card">
                        <h3>24/7 Support</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Our dedicated team is always ready to assist you on your journey.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
