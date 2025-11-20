const express = require('express');
const router = express.Router();
// Add getAllUsers to the import list
const { registerUser, loginUser, getUserProfile, getAllUsers } = require('../controllers/userController.js');
// Add admin to the import list
const { protect, admin } = require('../middleware/authMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Add the new protected admin route
router.get('/all', protect, admin, getAllUsers);
router.get("/admin", protect, admin, getAllUsers);
module.exports = router;