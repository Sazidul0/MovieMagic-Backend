const Movie = require('../models/Movie.js');

// @desc    Add a new movie (Admin)
// @route   POST /api/movies
const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(400).json({ message: 'Error adding movie', error: error.message });
  }
};

// @desc    Admin: Edit a movie
// @route   PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: 'Error updating movie', error: error.message });
  }
};

// @desc    Get all movies
// @route   GET /api/movies
const getAllMovies = async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) res.json(movie);
  else res.status(404).json({ message: 'Movie not found' });
};

// controllers/movieController.js
const deleteMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    await movie.deleteOne();
    res.json({ message: 'Movie removed' });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
};

module.exports = { addMovie, updateMovie, getAllMovies, getMovieById, deleteMovie };
