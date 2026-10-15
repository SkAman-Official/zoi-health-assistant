const express = require('express');
const router = express.Router();
const {
  createBloodBooking
} = require('../controllers/bloodBookingController.js'); // DESTRUCTURE the function
const authMiddleware = require('../middleware/auth.js');
router.post('/', authMiddleware, createBloodBooking);
module.exports = router;
