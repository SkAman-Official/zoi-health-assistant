const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  approveAppointment,
  rejectAppointment
} = require("../controllers/appointmentController");

// Approve Appointment
router.patch("/approve/:id", authMiddleware, approveAppointment);

// Reject Appointment
router.patch("/reject/:id", authMiddleware, rejectAppointment);
module.exports = router;
