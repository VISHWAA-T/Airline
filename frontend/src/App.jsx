import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main style={{ minHeight: '80vh' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/flights" element={<Flights />} />
                        <Route path="/book/:id" element={<Booking />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </main>
                <footer style={{ background: '#212529', color: '#f8f9fa', padding: '2rem 0', textAlign: 'center', marginTop: 'auto' }}>
                    <p>© 2026 SkyWings Airlines Reservation System. All Rights Reserved.</p>
                </footer>
            </Router>
        </AuthProvider>
    );
};

export default App;
