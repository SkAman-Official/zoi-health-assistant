const Booking = require('../models/Booking');
const User = require('../models/User');
const {
  sendBookingConfirmationEmail,
  sendAdminBookingAlert
} = require('../utils/email');
exports.createBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      condition,
      symptoms,
      hospitalId,
      ambulanceRequired
    } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!name || !phone || !condition || !symptoms || !hospitalId) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Save booking
    const newBooking = new Booking({
      name,
      phone,
      condition,
      symptoms,
      hospitalId,
      ambulanceRequired: ambulanceRequired || false,
      user: userId
    });
    const savedBooking = await newBooking.save();

    // Send emails (non-blocking)
    try {
      await sendBookingConfirmationEmail(user.email, savedBooking);
    } catch (emailErr) {
      console.error('Failed to send booking confirmation email:', emailErr);
    }
    try {
      await sendAdminBookingAlert(savedBooking);
    } catch (adminEmailErr) {
      console.error('Failed to send admin booking alert:', adminEmailErr);
    }
    res.status(201).json({
      success: true,
      data: savedBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
