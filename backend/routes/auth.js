const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor"); // Critical import
const {
  sendWelcomeEmail,
  sendDoctorWelcomeEmail
} = require("../mailer");
const router = express.Router();

// User Signup Route
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      email
    });
    if (existingUser) return res.status(400).send("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Send Welcome Email
    sendWelcomeEmail(email, name); // Send the email after successful signup

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) return res.status(401).json({
      message: "Invalid credentials"
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({
      message: "Invalid credentials"
    });
    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

// Doctor Signup Route
router.post("/doctor/signup", async (req, res) => {
  try {
    // Destructure the request body
    let {
      fullName,
      email,
      licenseNumber,
      specialization,
      password,
      hospital
    } = req.body;

    // Normalize email to lowercase
    email = email.toLowerCase();

    // Check existing doctor
    const existingDoctor = await Doctor.findOne({
      email
    });
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists"
      });
    }

    // Validate required fields
    if (!hospital) {
      return res.status(400).json({
        message: "Hospital is required"
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    // Create new doctor
    const doctor = new Doctor({
      fullName,
      email,
      licenseNumber,
      specialization,
      password,
      // ✅ Use the hashed password
      hospital
    });
    await doctor.save();

    // Send welcome email
    sendDoctorWelcomeEmail(email, fullName, specialization, licenseNumber);
    res.status(201).json({
      message: "Doctor registered successfully"
    });
  } catch (error) {
    // Improved error logging
    console.error("Doctor signup error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message
    });
  }
});

// Doctor Login Route
router.post("/doctor/login", async (req, res) => {
  try {
    // Validate input
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }
    let {
      email,
      password
    } = req.body;
    email = email.toLowerCase().trim();
    // Debug password length

    const doctor = await Doctor.findOne({
      email
    });

    // Doctor not found
    if (!doctor) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // 🔥 Enhanced password validation

    // 1. Try standard comparison
    let isMatch = await bcrypt.compare(password, doctor.password);

    // 2. If fails, try alternative comparison methods
    if (!isMatch) {
      // Alternative 1: Compare with raw body password
      isMatch = await bcrypt.compare(req.body.password, doctor.password);

      // Alternative 2: Try trimming both sides
      if (!isMatch) {
        const trimmedPassword = password.trim();
        isMatch = await bcrypt.compare(trimmedPassword, doctor.password);
      }

      // Alternative 3: Handle special characters
      if (!isMatch) {
        const escapedPassword = password.replace(/\$/g, '$$$$');
        isMatch = await bcrypt.compare(escapedPassword, doctor.password);
      }
    }
    if (!isMatch) {
      // 🔥 Critical debug: Compare password lengths

      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign({
      id: doctor._id,
      email: doctor.email,
      role: "doctor",
      hospital: doctor.hospital
    }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Successful login response

    res.json({
      token,
      doctor: {
        id: doctor._id,
        // ✅ This is critical
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        hospital: doctor.hospital
      }
    });
  } catch (error) {
    console.error("🔥 DOCTOR LOGIN ERROR:", error);

    // Enhanced bcrypt error handling
    if (error.message.includes("Invalid salt version")) {
      console.error("🚨 PASSWORD HASH CORRUPTION DETECTED");
      return res.status(500).json({
        message: "Authentication system error",
        solution: "Contact support or reset password"
      });
    }

    // Handle bcrypt 6.x specific errors
    if (error.message.includes("data must be a string")) {
      console.error("🚨 BCRYPT 6.0 INPUT VALIDATION ERROR");
      return res.status(400).json({
        message: "Invalid password format",
        details: "Password must be a valid string"
      });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// Get all doctors with full details (for frontend filtering by hospital)
router.get("/doctors/all", async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const doctors = await Doctor.find({}, "fullName specialization hospital").sort({
      fullName: 1,
      _id: 1
    });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      message: "Failed to fetch doctors"
    });
  }
});
module.exports = router;
