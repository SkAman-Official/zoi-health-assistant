const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodController');
const auth = require('../middleware/auth');

// Blood service endpoints
router.post('/request', auth, bloodController.requestBlood);
router.get('/donors', auth, bloodController.findDonors);
module.exports = router;
