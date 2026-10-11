const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate } = require('../middleware/validationMiddleware');
const { updateProfileValidator, updatePreferencesValidator } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, validate(updateProfileValidator), userController.updateProfile);
router.put('/preferences', protect, validate(updatePreferencesValidator), userController.updatePreferences);
router.delete('/data', protect, userController.deleteUserData);

module.exports = router;
