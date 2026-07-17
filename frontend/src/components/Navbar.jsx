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
                <Link to="/" className="nav-logo">
                    <Plane size={28} />
                    <span>SkyWings</span>
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/flights">Flights</Link>
                    {user ? (
                        <>
                            <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <User size={18} /> My Bookings
                            </Link>
                            {user.isAdmin && <Link to="/admin">Admin Dashboard</Link>}
                            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #ddd' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn" style={{ background: 'transparent', border: '1px solid var(--primary-color)' }}>Log In</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
