const mongoose = require('mongoose');
const bloodRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: 1
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  urgencyLevel: {
    type: String,
    enum: ['Critical', 'Urgent', 'Normal'],
    default: 'Urgent'
  },
  status: {
    type: String,
    enum: ['Requested', 'Matched', 'In Process', 'Completed', 'Cancelled'],
    default: 'Requested'
  },
  requiredBy: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
bloodRequestSchema.index({
  location: '2dsphere'
});
module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
