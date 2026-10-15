const mongoose = require('mongoose');
const bloodBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  },
  units: {
    type: Number,
    required: true,
    min: 1
  },
  urgency: {
    type: String,
    required: true,
    enum: ['critical', 'urgent', 'stable']
  },
  hospital: {
    type: String,
    required: true
  },
  additionalInfo: String
}, {
  timestamps: true
});
module.exports = mongoose.model('BloodBooking', bloodBookingSchema);
