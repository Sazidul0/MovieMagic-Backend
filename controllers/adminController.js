const User = require('../models/User.js');
const Movie = require('../models/Movie.js');
const Booking = require('../models/Booking.js');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalMovies, totalBookings, revenueData] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } }}])
    ]);

    const totalRevenue = revenueData.length ? revenueData[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalMovies,
      totalBookings,
      revenue: totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };
