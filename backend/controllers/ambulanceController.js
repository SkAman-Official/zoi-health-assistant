const Ambulance = require('../models/Ambulance');
const User = require('../models/User');
const {
  sendAmbulanceConfirmationEmail,
  sendAdminAlertEmail
} = require('../utils/email');
exports.requestAmbulance = async (req, res) => {
  try {
    // Extract data WITHOUT location
    const {
      patientName,
      contactNumber,
      address,
      emergencyType,
      patientStatus,
      additionalInfo
    } = req.body;

    // Updated required fields (removed location)
    const requiredFields = ['patientName', 'contactNumber', 'address', 'emergencyType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing: missingFields
      });
    }

    // Validate phone number format (Indian)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Must be 10 digits starting with 6-9'
      });
    }
    const validEmergencyTypes = ['Accident', 'Heart Attack', 'Stroke', 'Other'];
    if (!validEmergencyTypes.includes(emergencyType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid emergency type. Valid types: ${validEmergencyTypes.join(', ')}`
      });
    }

    // Validate patient status (if provided)
    if (patientStatus) {
      const validStatuses = ['Critical', 'Serious', 'Stable'];
      if (!validStatuses.includes(patientStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid patient status. Valid statuses: ${validStatuses.join(', ')}`
        });
      }
    }

    // Create ambulance request WITHOUT location
    const ambulanceRequest = new Ambulance({
      userId: req.user.id,
      patientName,
      contactNumber,
      address,
      // Using address string directly
      emergencyType,
      patientStatus: patientStatus || 'Serious',
      additionalInfo: additionalInfo || ''
      // LOCATION FIELD COMPLETELY REMOVED
    });

    // Save to database
    await ambulanceRequest.save();

    // Get user details for email
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send confirmation email to user
    await sendAmbulanceConfirmationEmail(user.email, ambulanceRequest);

    // Send alert email to admin
    await sendAdminAlertEmail(ambulanceRequest);

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Ambulance requested successfully!',
      requestId: ambulanceRequest._id,
      estimatedTime: '15 minutes' // Mock response
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle other errors
    console.error('Ambulance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request ambulance',
      error: error.message
    });
  }
};

// Also update trackAmbulance since location was removed
exports.trackAmbulance = async (req, res) => {
  try {
    // Validate request ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }
    const request = await Ambulance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Verify user owns this request
    if (request.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to track this ambulance'
      });
    }
    res.json({
      success: true,
      status: request.status,
      position: ambulancePosition,
      estimatedArrival: '10 minutes'
    });
  } catch (error) {
    console.error('Ambulance tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track ambulance',
      error: error.message
    });
  }
};

// Add this at the BOTTOM of the file:
exports.createAmbulanceRequest = exports.requestAmbulance; // Alias for compatibility
