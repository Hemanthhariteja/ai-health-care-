const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { validate } = require('../middleware/validationMiddleware');
const { reminderValidator } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, validate(reminderValidator), reminderController.createReminder);
router.get('/', protect, reminderController.getReminders);
router.put('/:id', protect, reminderController.updateReminder);
router.delete('/:id', protect, reminderController.deleteReminder);
router.patch('/:id/toggle', protect, reminderController.toggleReminder);

module.exports = router;
