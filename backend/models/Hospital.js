const mongoose = require('mongoose');
const hospitalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  requiredBedType: {
    type: String,
    enum: ['ICU', 'General', 'Pediatric', 'Maternity', 'Emergency'],
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ['Immediate', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  admissionTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Admitted', 'Discharged', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('HospitalBooking', hospitalSchema);
