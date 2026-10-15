const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  slotReserved: {
    type: Boolean
  },
  bookingRequestKey: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reason: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  cardNumber: {
    type: String
  },
  // optional
  isFirstVisit: {
    type: Boolean
  },
  // ✅ Add this line to reference the user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["Scheduled", "Pending", "Approved", "Rejected", "Rescheduled", "Completed"],
    default: "Scheduled"
  }
}, {
  timestamps: true
});

// Legacy records stay intact. New bookings share atomic slot and retry protection.
appointmentSchema.index({
  doctorId: 1,
  date: 1,
  time: 1
}, {
  unique: true,
  partialFilterExpression: {
    slotReserved: true,
    doctorId: {
      $type: "objectId"
    }
  },
  name: "reserved_doctor_slot"
});
appointmentSchema.index({
  bookingRequestKey: 1
}, {
  unique: true,
  partialFilterExpression: {
    bookingRequestKey: {
      $type: "string"
    }
  },
  name: "booking_request_retry"
});
module.exports = mongoose.model("Appointment", appointmentSchema);
