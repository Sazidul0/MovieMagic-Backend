const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware.js');
const {
  submitFeedback,
  getAllFeedbacks,
  getFeedbackForMovie,
  getFeedbackByUser,
  deleteFeedback,
} = require('../controllers/feedbackController.js');

// Public: get all feedbacks
router.get('/', getAllFeedbacks);

// Public: get feedback for a movie
router.get('/movie/:movieId', getFeedbackForMovie);

// Protected: submit feedback
router.post('/', protect, submitFeedback);

// Protected: get feedbacks by current user
router.get('/user', protect, getFeedbackByUser);

// Admin: delete a feedback
router.delete('/:id', protect, admin, deleteFeedback);

module.exports = router;
