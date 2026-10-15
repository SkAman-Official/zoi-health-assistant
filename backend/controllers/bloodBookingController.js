const BloodBooking = require('../models/BloodBooking'); // Add this import

const createBloodBooking = async (req, res) => {
  try {
    const {
      patientName,
      contactName,
      phone,
      bloodType,
      units,
      urgency,
      hospital,
      additionalInfo
    } = req.body;

    // Create new booking using the BloodBooking model
    const newBooking = new BloodBooking({
      user: req.user.id,
      patientName,
      contactName,
      phone,
      bloodType,
      units,
      urgency,
      hospital,
      additionalInfo
    });

    // Save to database
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Blood booking error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: messages.join(', ')
      });
    }

    // Handle other errors
    res.status(500).json({
      message: error.message || 'Server error creating blood booking'
    });
  }
};
module.exports = {
  createBloodBooking
};
