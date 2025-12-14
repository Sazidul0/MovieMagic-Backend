const Feedback = require('../models/Feedback.js');
const Movie = require('../models/Movie.js');

// Submit feedback or rating
const submitFeedback = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;

    if (!rating && !comment) {
      return res.status(400).json({ success: false, message: 'Provide rating or comment' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const feedback = new Feedback({
      user: req.user._id,
      movie: movieId || null,
      rating: rating || null,
      comment: comment || '',
    });

    await feedback.save();

    return res.status(201).json({ success: true, message: 'Feedback submitted', feedback });
  } catch (error) {
    console.error('submitFeedback error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all feedbacks (public)
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'name email').populate('movie', 'title');
    return res.json({ success: true, feedbacks });
  } catch (error) {
    console.error('getAllFeedbacks error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get feedbacks for a specific movie
const getFeedbackForMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const feedbacks = await Feedback.find({ movie: movieId }).populate('user', 'name');
    return res.json({ success: true, feedbacks });
  } catch (error) {
    console.error('getFeedbackForMovie error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get feedbacks by current user
const getFeedbackByUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ success: false, message: 'Not authorized' });

    const feedbacks = await Feedback.find({ user: req.user._id }).populate('movie', 'title');
    return res.json({ success: true, feedbacks });
  } catch (error) {
    console.error('getFeedbackByUser error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete feedback (admin)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    await feedback.remove();
    return res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    console.error('deleteFeedback error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedbacks,
  getFeedbackForMovie,
  getFeedbackByUser,
  deleteFeedback,
};
