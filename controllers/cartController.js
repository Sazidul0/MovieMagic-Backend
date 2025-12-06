const Cart = require('../models/Cart.js');
const Booking = require('../models/Booking.js');
const Movie = require('../models/Movie.js');

// @desc    Add item to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { movie, bookingDate, showtime, seats, pricePerSeat } = req.body;
    const userId = req.user._id;

    // Validation
    if (!movie || !bookingDate || !showtime || !seats || seats.length === 0 || !pricePerSeat) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if movie exists
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Calculate total price for this item
    const totalPrice = seats.length * pricePerSeat;

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if same movie with same date and time already exists
    const existingItemIndex = cart.items.findIndex(
      item =>
        item.movie.toString() === movie &&
        item.bookingDate === bookingDate &&
        item.showtime === showtime
    );

    if (existingItemIndex > -1) {
      // Merge seats if same showtime
      const existingItem = cart.items[existingItemIndex];
      existingItem.seats = [...new Set([...existingItem.seats, ...seats])];
      existingItem.totalPrice = existingItem.seats.length * pricePerSeat;
    } else {
      // Add new item to cart
      cart.items.push({
        movie,
        bookingDate,
        showtime,
        seats,
        pricePerSeat,
        totalPrice,
      });
    }

    // Calculate total cart price
    cart.calculateTotal();
    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate('items.movie', 'title posterUrl price');

    res.status(200).json({
      message: 'Item added to cart successfully',
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate('items.movie', 'title posterUrl price');

    if (!cart) {
      // Return empty cart response without creating in DB
      return res.status(200).json({
        cart: {
          _id: null,
          user: userId,
          items: [],
          totalCartPrice: 0
        }
      });
    }

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item by id
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    // Recalculate total
    cart.calculateTotal();
    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate('items.movie', 'title posterUrl price');

    res.status(200).json({
      message: 'Item removed from cart',
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

// @desc    Update cart item (change seats)
// @route   PUT /api/cart/update/:itemId
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { seats, pricePerSeat } = req.body;

    if (!seats || seats.length === 0 || !pricePerSeat) {
      return res.status(400).json({ message: 'Seats and pricePerSeat are required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update seats and total price
    cart.items[itemIndex].seats = seats;
    cart.items[itemIndex].pricePerSeat = pricePerSeat;
    cart.items[itemIndex].totalPrice = seats.length * pricePerSeat;

    // Recalculate total
    cart.calculateTotal();
    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate('items.movie', 'title posterUrl price');

    res.status(200).json({
      message: 'Cart item updated successfully',
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

// @desc    Checkout - Create bookings from selected cart items
// @route   POST /api/cart/checkout
const checkoutCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { selectedItems } = req.body; // Array of item IDs to checkout

    if (!selectedItems || selectedItems.length === 0) {
      return res.status(400).json({ message: 'No items selected for checkout' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Get selected items
    const itemsToBook = cart.items.filter(item =>
      selectedItems.includes(item._id.toString())
    );

    if (itemsToBook.length === 0) {
      return res.status(404).json({ message: 'Selected items not found in cart' });
    }

    // Create bookings for each selected item
    const bookings = [];
    for (const item of itemsToBook) {
      const booking = new Booking({
        user: userId,
        movie: item.movie,
        bookingDate: item.bookingDate,
        showtime: item.showtime,
        seats: item.seats,
        totalPrice: item.totalPrice,
      });
      const savedBooking = await booking.save();
      bookings.push(savedBooking);
    }

    // Remove booked items from cart
    cart.items = cart.items.filter(
      item => !selectedItems.includes(item._id.toString())
    );
    cart.calculateTotal();
    await cart.save();

    res.status(201).json({
      message: 'Checkout successful',
      bookings,
      remainingCart: cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalCartPrice = 0;
    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  checkoutCart,
  clearCart,
};
