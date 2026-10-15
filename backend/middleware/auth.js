const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const auth = async (req, res, next) => {
  try {
    // Skip middleware for OPTIONS requests
    if (req.method === "OPTIONS") {
      return next();
    }

    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        msg: 'No token, authorization denied'
      });
    }
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in either User or Doctor collection
    const user = await User.findById(decoded.id);
    const doctor = user ? null : await Doctor.findById(decoded.id);
    const account = user || doctor;
    if (!account) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid token - account not found'
      });
    }

    // Attach account to request
    req.account = account;
    req.user = account; // For compatibility with existing code
    req.accountType = user ? 'user' : 'doctor';
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);

    // Handle specific JWT errors
    let errorMsg = 'Token is not valid';
    if (err.name === 'TokenExpiredError') {
      errorMsg = 'Token has expired. Please login again.';
    } else if (err.name === 'JsonWebTokenError') {
      errorMsg = 'Invalid token format';
    }

    // Ensure consistent JSON response
    res.status(401).json({
      success: false,
      msg: errorMsg
    });
  }
};
module.exports = auth;
