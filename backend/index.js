const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();
const app = express();

// Security Middleware
app.use(helmet());

// Configure CORS properly
const corsOptions = {
  origin: process.env.BASE_URL,
  // http://localhost:5173
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Rate Limiting for Emergency APIs
const emergencyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 100,
  // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
  skip: req => req.method === "OPTIONS" // Skip preflight requests
});

// Regular Middleware
// This authenticated feature has its own bounded parsers for image JSON and reviewed text.
app.use("/api/documents", require("./routes/documentRoutes"));
app.use(express.json());

// Import auth middleware
const authMiddleware = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/auth");
const ambulanceRoutes = require("./routes/ambulance");
const hospitalRoutes = require("./routes/hospital");
const bloodRoutes = require("./routes/blood");
const bookingRoutes = require('./routes/bookingRoutes');

// Import blood booking routes
const bloodBookingRoutes = require('./routes/bloodBookingRoutes'); // Add this line

// Import order routes:
const orderRoutes = require("./routes/orderRoutes");

// Adding Appointment booking routes :
const bookAppointmentRoutes = require("./routes/bookAppointments");

// Import patient routes :
const patientRoutes = require("./routes/patientRoutes");

// Import appointment approval/denial routes :
const appointmentRoutes = require("./routes/appointmentRoutes");

// Import doctor routes :
const doctorRoutes = require("./routes/doctorRoutes");

// Public routes (no authentication required)
app.use("/api/auth", authRoutes);
app.use("/api/chat", require("./routes/chatRoutes"));

// Protected routes (require authentication)
app.use("/api/ambulance", emergencyLimiter, authMiddleware, ambulanceRoutes);
app.use("/api/hospital", emergencyLimiter, authMiddleware, hospitalRoutes);
app.use("/api/blood", emergencyLimiter, authMiddleware, bloodRoutes);

// Booking routes (protected)
app.use('/api/bookings', bookingRoutes);

// Add blood booking route (protected)
app.use('/api/blood-booking', emergencyLimiter, authMiddleware, bloodBookingRoutes); // Add this line

// Adding order routes :
app.use("/api/orders", orderRoutes);

// Adding Appointment booking routes :
app.use("/api/appointments", bookAppointmentRoutes);

// Adding patient routes :
app.use("/api/patients", authMiddleware, patientRoutes);

// Adding appointment approval/denial routes :
app.use("/api/appointments", appointmentRoutes);

// Adding doctor routes :
app.use("/api/doctors", doctorRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected")).catch(err => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
