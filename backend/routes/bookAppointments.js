const express = require("express");
const router = express.Router();
const {
  createAppointment,
  confirmChatAppointment,
  getMyAppointments
} = require("../controllers/appointmentController");
const authMiddleware = require("../middleware/auth"); // if you're using it
const rateLimit = require("express-rate-limit");
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: "CHAT_BUSY",
    message: "Please wait before trying to book again."
  }
});

//Doctor appointments route:
const {
  getAppointmentsByDoctor
} = require("../controllers/appointmentController");
router.post("/", authMiddleware, bookingLimiter, createAppointment);
router.post("/chat/confirm", authMiddleware, bookingLimiter, confirmChatAppointment);
router.get("/mine", authMiddleware, getMyAppointments);
router.get("/profile", authMiddleware, (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.accountType !== "user") return res.status(403).json({
    code: "BOOKING_FORBIDDEN"
  });
  res.json({
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone || ""
  });
});
router.get("/doctor/:doctorName", authMiddleware, getAppointmentsByDoctor); //For doctor appointments

module.exports = router;
