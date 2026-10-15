const HospitalBooking = require('../models/Hospital');
exports.bookHospitalBed = async (req, res) => {
  try {
    const {
      hospitalId,
      patientName,
      condition,
      requiredBedType,
      urgencyLevel,
      admissionTime
    } = req.body;
    const booking = new HospitalBooking({
      userId: req.user.id,
      hospitalId,
      patientName,
      condition,
      requiredBedType,
      urgencyLevel,
      admissionTime: new Date(admissionTime)
    });
    await booking.save();
    res.status(201).json({
      message: 'Hospital bed booking requested!',
      bookingId: booking._id,
      status: booking.status
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to book hospital bed'
    });
  }
};
exports.checkBedAvailability = async (req, res) => {
  try {
    const {
      hospitalId,
      bedType
    } = req.query;

    // Mock availability check - in real app query hospital inventory
    const availableBeds = Math.floor(Math.random() * 5) + 1;
    res.json({
      hospitalId,
      bedType,
      available: availableBeds > 0,
      availableBeds,
      waitTime: availableBeds > 0 ? 'Immediate' : '2-4 hours'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Availability check failed'
    });
  }
};
