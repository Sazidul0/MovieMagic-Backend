// const mongoose = require('mongoose');

// const movieSchema = mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   posterUrl: { type: String, required: true },
//   genre: { type: String, required: true },
//   rating: { type: Number, required: true },
//   duration: { type: String, required: true },
//   releaseDate: { type: Date, required: true },
//   showtimes: [{ type: String, required: true }],
// }, { timestamps: true });

// const Movie = mongoose.model('Movie', movieSchema);
// module.exports = Movie;


const mongoose = require('mongoose');

// Define a sub-schema for showtimes
const showtimeSchema = mongoose.Schema({
  date: { type: String, required: true }, // e.g., "2025-12-25"
  time: { type: String, required: true }, // e.g., "7:00 PM"
});

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  posterUrl: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  duration: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  // Use the new showtime sub-schema
  showtimes: [showtimeSchema],
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;