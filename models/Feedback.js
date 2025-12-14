const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: false },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
