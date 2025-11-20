const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware.js');
const router = express.Router();
// Add getBookedSeats to the import
const { createBooking, getUserBookings, getBookedSeats, getAllBookings } = require('../controllers/bookingController.js');


// Add the new route to get booked seats
router.get('/booked-seats', protect, getBookedSeats);

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getUserBookings);
router.get('/admin', protect, admin, getAllBookings);

module.exports = router;