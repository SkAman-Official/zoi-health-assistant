const express = require('express');
const router = express.Router();
const Ambulance = require('../models/ambulance');
const {
  sendAmbulanceConfirmationEmail,
  sendAdminAlertEmail
} = require('../utils/email'); // ✅ Import email functions

// POST /api/ambulance/request
router.post('/request', async (req, res) => {
  try {
    // Extract data without location
    const {
      patientName,
      emergencyType,
      contactNumber,
      address,
      additionalInfo
    } = req.body;

    // Create new ambulance request
    const ambulanceRequest = new Ambulance({
      userId: req.account._id,
      // From auth middleware
      patientName,
      emergencyType,
      contactNumber,
      address,
      additionalInfo,
      status: 'Requested'
    });
    await ambulanceRequest.save();

    // Get user's email from authenticated account
    const userEmail = req.account.email;

    // Send confirmation email to user
    await sendAmbulanceConfirmationEmail(userEmail, ambulanceRequest.toObject());

    // Send alert to admin
    await sendAdminAlertEmail(ambulanceRequest.toObject());
    res.status(201).json({
      success: true,
      message: 'Ambulance requested successfully',
      ambulanceId: ambulanceRequest._id,
      estimatedTime: '15-20 minutes'
    });
  } catch (error) {
    console.error('Ambulance request error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.values(error.errors).forEach(err => {
        errors[err.path] = err.message;
      });
      return res.status(400).json({
        success: false,
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error processing request'
    });
  }
});
module.exports = router;
