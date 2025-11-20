// const mongoose = require('mongoose');

// const bookingSchema = mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
//   showtime: { type: String, required: true },
//   seats: [{ type: String, required: true }],
//   totalPrice: { type: Number, required: true },
//   bookingDate: { type: Date, default: Date.now },
// }, { timestamps: true });

// const Booking = mongoose.model('Booking', bookingSchema);
// module.exports = Booking;

const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  bookingDate: { type: String, required: true }, // ADD THIS LINE
  showtime: { type: String, required: true },
  seats: [{ type: String, required: true }], // e.g., ["A1", "A2"]
  totalPrice: { type: Number, required: true },
}, { timestamps: true }); // timestamps will add createdAt and updatedAt

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;