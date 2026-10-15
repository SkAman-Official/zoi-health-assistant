const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

// Hospital booking endpoints
router.post('/book', auth, hospitalController.bookHospitalBed);
router.get('/availability', auth, hospitalController.checkBedAvailability);
module.exports = router;
