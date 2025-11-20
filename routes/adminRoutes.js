const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// This route is protected and can only be accessed by logged-in admins
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;