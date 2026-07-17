import express from 'express';
const router = express.Router();
import {
    addBookingItems,
    getBookingById,
    getMyBookings,
    getBookings,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addBookingItems).get(protect, admin, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);

export default router;
