const BloodRequest = require('../models/BloodRequest');
exports.requestBlood = async (req, res) => {
  try {
    const {
      patientName,
      bloodType,
      unitsRequired,
      hospitalId,
      location,
      urgencyLevel,
      requiredBy
    } = req.body;
    const bloodRequest = new BloodRequest({
      userId: req.user.id,
      patientName,
      bloodType,
      unitsRequired,
      hospitalId,
      urgencyLevel,
      requiredBy: new Date(requiredBy)
    });
    if (location) {
      bloodRequest.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      };
    }
    await bloodRequest.save();
    res.status(201).json({
      message: 'Blood request submitted!',
      requestId: bloodRequest._id,
      status: bloodRequest.status
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to request blood'
    });
  }
};
exports.findDonors = async (req, res) => {
  try {
    const {
      bloodType,
      location
    } = req.query;

    // Mock donor search - in real app query donor database
    const donors = [{
      name: 'Blood Bank Central',
      distance: '2.5 km'
    }, {
      name: 'City Hospital',
      distance: '3.1 km'
    }, {
      name: 'Community Donor Center',
      distance: '4.7 km'
    }];
    res.json({
      bloodType,
      available: donors.length > 0,
      nearestDonor: donors[0],
      allDonors: donors
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to find donors'
    });
  }
};
