const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth'); // Import your auth middleware

// Protect route with authentication
router.post('/', authMiddleware, bookingController.createBooking);
module.exports = router;
