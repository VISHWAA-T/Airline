import express from 'express';
const router = express.Router();
import {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight,
    searchFlights,
} from '../controllers/flightController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getFlights).post(protect, admin, createFlight);
router.route('/search').get(searchFlights);
router
    .route('/:id')
    .get(getFlightById)
    .put(protect, admin, updateFlight)
    .delete(protect, admin, deleteFlight);

export default router;
