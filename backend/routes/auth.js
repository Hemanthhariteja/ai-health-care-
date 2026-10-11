const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const { registerValidator, loginValidator } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
