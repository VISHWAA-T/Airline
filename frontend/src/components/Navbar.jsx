import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plane, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                {/* Logo row */}
                <div className="nav-top-row" style={{ flex: '0 0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="nav-logo">
                        <Plane size={26} />
                        <span>SkyWings</span>
                    </Link>
                </div>

                {/* Nav links row — always visible, scrollable on mobile */}
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/flights">Flights</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <User size={15} /> My Bookings
                            </Link>
                            {user.isAdmin && <Link to="/admin">Admin</Link>}
                            <button
                                onClick={handleLogout}
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text-color)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    border: '1px solid #ddd',
                                    padding: '0.4rem 0.85rem',
                                }}
                            >
                                <LogOut size={15} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="btn"
                                style={{ background: 'transparent', border: '1px solid var(--primary-color)', padding: '0.4rem 0.85rem' }}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.85rem' }}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
