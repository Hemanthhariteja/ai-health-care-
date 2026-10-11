const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');

router.post('/trigger', protect, sosController.triggerEmergency);
router.get('/history', protect, sosController.getEmergencyHistory);
router.put('/:id/status', protect, sosController.updateEmergencyStatus);

module.exports = router;
