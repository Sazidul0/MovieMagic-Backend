const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['stripe'], default: 'stripe' },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
