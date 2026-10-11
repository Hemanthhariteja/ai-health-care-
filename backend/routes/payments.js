const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validate } = require('../middleware/validationMiddleware');
const { paymentValidator } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.post('/initiate', protect, validate(paymentValidator), paymentController.initiatePayment);
router.get('/:id/status', protect, paymentController.getPaymentStatus);
router.get('/history/all', protect, paymentController.getPaymentHistory);
router.post('/:id/refund', protect, paymentController.refundPayment);

module.exports = router;
