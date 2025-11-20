const Booking = require('../models/Booking.js');

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  const { movie, showtime, seats, totalPrice, bookingDate } = req.body;

  if (!seats || seats.length === 0) {
    return res.status(400).json({ message: 'No seats selected' });
  }

  const booking = new Booking({
    user: req.user._id,
    movie,
    showtime,
    bookingDate,
    seats,
    totalPrice,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('movie', 'title posterUrl');

  res.json(bookings);
};

// @desc    Admin: Get all bookings
// @route   GET /api/bookings/admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('movie', 'title posterUrl');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// @desc    Get booked seats for a specific showtime
// @route   GET /api/bookings/booked-seats
const getBookedSeats = async (req, res) => {
  const { movieId, date, time } = req.query;

  if (!movieId || !date || !time) {
    return res.status(400).json({ message: 'Movie ID, date, and time are required' });
  }

  try {
    const bookings = await Booking.find({
      movie: movieId,
      bookingDate: date,
      showtime: time,
    });

    const bookedSeats = bookings.flatMap(b => b.seats);
    res.json(bookedSeats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createBooking, 
  getUserBookings, 
  getBookedSeats,
  getAllBookings  // <-- added
};
