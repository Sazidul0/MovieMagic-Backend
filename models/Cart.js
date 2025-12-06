const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  bookingDate: { type: String, required: true },
  showtime: { type: String, required: true },
  seats: [{ type: String, required: true }], // e.g., ["A1", "A2"]
  pricePerSeat: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

const cartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalCartPrice: { type: Number, default: 0 },
}, { timestamps: true });

// Ensure one cart per user
cartSchema.index({ user: 1 }, { unique: false });

// Calculate total cart price whenever items change
cartSchema.methods.calculateTotal = function () {
  this.totalCartPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  return this.totalCartPrice;
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
