import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plane, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <Plane size={28} />
                    <span>SkyWings</span>
                </Link>

                <button 
                    className="nav-toggle-btn" 
                    onClick={toggleMenu} 
                    aria-label="Toggle Navigation Menu"
                >
                    {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={closeMenu}>Home</Link>
                    <Link to="/flights" onClick={closeMenu}>Flights</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={18} /> My Bookings
                            </Link>
                            {user.isAdmin && <Link to="/admin" onClick={closeMenu}>Admin Dashboard</Link>}
                            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #ddd' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu} className="btn" style={{ background: 'transparent', border: '1px solid var(--primary-color)' }}>Log In</Link>
                            <Link to="/register" onClick={closeMenu} className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
