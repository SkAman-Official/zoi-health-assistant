const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'urgent'],
    // <- now "urgent" is allowed
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  hospitalId: {
    type: String,
    required: true
  },
  ambulanceRequired: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Booking', bookingSchema);
