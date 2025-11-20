const express = require('express');
const router = express.Router();
const { addMovie, getAllMovies, getMovieById, updateMovie,deleteMovie } = require('../controllers/movieController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', protect, admin, addMovie); // Protected admin route
router.put('/:id', protect, admin, updateMovie); 
router.delete('/:id', protect, admin, deleteMovie);

module.exports = router;