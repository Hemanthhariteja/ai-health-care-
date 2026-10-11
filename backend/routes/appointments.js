const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { validate } = require('../middleware/validationMiddleware');
const { appointmentValidator } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctors', appointmentController.getDoctors);
router.post('/book', protect, validate(appointmentValidator), appointmentController.bookAppointment);
router.get('/user/all', protect, appointmentController.getUserAppointments);
router.put('/:appointmentId/status', protect, appointmentController.updateAppointmentStatus);
router.delete('/:appointmentId', protect, appointmentController.cancelAppointment);

module.exports = router;
