const mongoose = require('mongoose');
const ambulanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Patient name cannot exceed 100 characters']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function (v) {
        // Indian phone number validation (10 digits starting with 6-9)
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian phone number!`
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [255, 'Address cannot exceed 255 characters']
  },
  emergencyType: {
    type: String,
    enum: {
      values: ['Accident', 'Heart Attack', 'Stroke', 'Other'],
      message: 'Invalid emergency type: {VALUE}'
    },
    required: [true, 'Emergency type is required']
  },
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [500, 'Additional info cannot exceed 500 characters']
  },
  patientStatus: {
    type: String,
    enum: {
      values: ['Critical', 'Serious', 'Stable'],
      message: 'Invalid patient status: {VALUE}'
    },
    default: 'Serious'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['Requested', 'Dispatched', 'Arrived', 'Completed', 'Cancelled'],
      message: 'Invalid status: {VALUE}'
    },
    default: 'Requested'
  }
});
module.exports = mongoose.model('Ambulance', ambulanceSchema);
