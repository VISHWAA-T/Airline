import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plane, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImageAsDataUrl = async (url) => {
        const response = await fetch(url);
        if (!response.ok) return null;
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('png')) return null;
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const cleanText = (value) => {
        if (value === undefined || value === null) return '';
        const text = value.toString();
        return text
            .replace(/&/g, '&')
            .replace(/→/g, ' to ')
            .replace(/₹/g, 'Rs ')
            .replace(/[^\x20-\x7E]/g, '')  // remove non-printable / non-ASCII chars for jsPDF
            .trim();
    };

    const generateETicket = async (booking) => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();

        const logoPaths = ['/logo.png'];
        let logoData = null;
        for (const path of logoPaths) {
            try {
                logoData = await fetchImageAsDataUrl(path);
                if (logoData) break;
            } catch (err) {
                // ignore failed logo fetches and use fallback header
            }
        }

        if (logoData) {
            doc.addImage(logoData, 'PNG', 50, 35, 120, 40);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.text('E-Ticket / Boarding Pass', pageWidth - 200, 62, { align: 'right' });
        } else {
            doc.setFillColor(25, 103, 210);
            doc.rect(40, 30, pageWidth - 80, 50, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.text('SkyWings', 50, 62);
            doc.setFontSize(14);
            doc.text('E-Ticket / Boarding Pass', pageWidth - 200, 62, { align: 'right' });
        }

        doc.setDrawColor(25, 103, 210);
        doc.setLineWidth(1.5);
        doc.line(40, 100, pageWidth - 40, 100);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const leftX = 50;
        const cardWidth = pageWidth - 100;
        const cardHeight = 170;
        const card1Y = 110;
        const card2Y = card1Y + cardHeight + 24;
        const valueX = leftX + 110;
        const cardRightLimit = leftX + cardWidth - 20;
        const qrX = pageWidth - 150;
        const qrY = card2Y + 20;

        doc.setDrawColor(209, 213, 219);
        doc.setFillColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.roundedRect(leftX - 10, card1Y - 12, cardWidth + 20, cardHeight, 8, 8, 'S');
        doc.roundedRect(leftX - 10, card2Y - 12, cardWidth + 20, cardHeight, 8, 8, 'S');

        doc.setLineDashPattern([4, 4], 0);
        doc.setDrawColor(150, 150, 150);
        doc.line(leftX + 10, card2Y - 2, leftX + cardWidth - 10, card2Y - 2);
        doc.setLineDashPattern([], 0);
        doc.setDrawColor(0, 0, 0);

        const safeRoute = cleanText(`${booking.flight?.origin} to ${booking.flight?.destination}`);
        const departureText = cleanText(new Date(booking.flight?.departureTime).toLocaleString());

        let currentY = card1Y + 18;
        doc.setFont('helvetica', 'bold');
        doc.text('Booking ID:', leftX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(cleanText(booking._id), valueX, currentY, { maxWidth: cardRightLimit - valueX });
        currentY += 18;

        doc.setFont('helvetica', 'bold');
        doc.text('Passenger(s):', leftX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(cleanText(booking.passengers.map(p => p.name).join(', ')), valueX, currentY, { maxWidth: cardRightLimit - valueX });
        currentY += 18;

        if (booking.seats && booking.seats.length) {
            doc.setFont('helvetica', 'bold');
            doc.text('Seat(s):', leftX, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(cleanText(booking.seats.join(', ')), valueX, currentY, { maxWidth: cardRightLimit - valueX });
            currentY += 18;
        }

        doc.setFont('helvetica', 'bold');
        doc.text('Flight:', leftX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(cleanText(`${booking.flight?.airline} ${booking.flight?.flightNumber}`), valueX, currentY, { maxWidth: cardRightLimit - valueX });
        currentY += 18;

        doc.setFont('helvetica', 'bold');
        doc.text('Route:', leftX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(safeRoute, valueX, currentY, { maxWidth: cardRightLimit - valueX });

        let card2YStart = card2Y + 18;
        doc.setFont('helvetica', 'bold');
        doc.text('Departure:', leftX, card2YStart);
        doc.setFont('helvetica', 'normal');
        doc.text(departureText, valueX, card2YStart, { maxWidth: cardRightLimit - valueX });
        card2YStart += 18;

        doc.setFont('helvetica', 'bold');
        doc.text('Total Paid:', leftX, card2YStart);
        doc.setFont('helvetica', 'normal');
        doc.text(cleanText(`Rs ${booking.totalPrice.toFixed(2)}`), valueX, card2YStart, { maxWidth: cardRightLimit - valueX });
        card2YStart += 18;

        doc.setFont('helvetica', 'bold');
        doc.text('Issued To:', leftX, card2YStart);
        doc.setFont('helvetica', 'normal');
        doc.text(cleanText(booking.passengers?.[0]?.name || ''), valueX, card2YStart, { maxWidth: cardRightLimit - valueX });

        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(209, 213, 219);
        doc.rect(qrX - 10, qrY - 10, 130, 130, 'FD');

        try {
            const qrData = await QRCode.toDataURL(`booking:${booking._id}`, {
                type: 'image/png',
                errorCorrectionLevel: 'H',
            });
            doc.addImage(qrData, 'PNG', qrX, qrY, 110, 110);
        } catch (err) {
            console.warn('QR code generation failed; continuing without QR code', err);
            doc.setFontSize(10);
            doc.text('QR generation unavailable', qrX, qrY + 60, { maxWidth: 110 });
        }

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for booking with SkyWings.', leftX, card2Y + cardHeight + 28);

        doc.save(`eticket_${booking._id}.pdf`);
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await api.get('/api/bookings/mybookings', config);
                setBookings(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch your bookings');
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}><h2>Loading your trips...</h2></div>;
    if (error) return <div className="container" style={{ color: 'red', marginTop: '5rem' }}><h2>{error}</h2></div>;

    return (
        <div className="container" style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
            <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>You haven't booked any flights yet</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ready to explore the world? Check out our available flights.</p>
                    <Link to="/flights" className="btn btn-primary">Browse Flights</Link>
                </div>
            ) : (
                <div className="cards-grid">
                    {bookings.map(booking => (
                        <div key={booking._id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="booking-card-header">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                                    <Plane size={20} /> {booking.flight?.origin} to {booking.flight?.destination}
                                </h3>
                                <span style={{ background: booking.status === 'Confirmed' ? '#d1e7dd' : '#f8d7da', color: booking.status === 'Confirmed' ? '#0f5132' : '#842029', padding: '0.2rem 0.75rem', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-details-grid">
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}><Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> Departure</p>
                                    <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>{new Date(booking.flight?.departureTime).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Airline | Flight No</p>
                                    <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>{booking.flight?.airline} ({booking.flight?.flightNumber})</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8f9fa', padding: '0.85rem', borderRadius: 'var(--border-radius)', marginBottom: '1rem', marginTop: 'auto' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Passengers: {booking.passengers.length}</p>
                                {booking.seats?.length > 0 && (
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Seats: {booking.seats.join(', ')}</p>
                                )}
                                <ul style={{ marginLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {booking.passengers.map((p, idx) => (
                                        <li key={idx}>{p.name} (Age: {p.age})</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="booking-card-footer">
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Booking ID: {booking._id.substring(0, 8)}...</p>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await generateETicket(booking);
                                            } catch (err) {
                                                console.error('PDF generation failed', err);
                                                window.alert('Unable to download the e-ticket. Please check the browser console for details.');
                                            }
                                        }}
                                        className="btn"
                                        style={{ border: '1px solid var(--primary-color)', background: 'transparent', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                                    >
                                        Download E-ticket
                                    </button>

                                    <p style={{ fontSize: '1.15rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#198754', margin: 0 }}>
                                        <CreditCard size={16} /> ₹{booking.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
