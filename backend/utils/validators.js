const { body, param, query } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['patient', 'doctor']).withMessage('Role must be either patient or doctor')
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Please provide a valid phone number')
];

const updatePreferencesValidator = [
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  body('accessibility')
    .optional()
    .isObject().withMessage('Accessibility must be an object'),
  body('privacy')
    .optional()
    .isObject().withMessage('Privacy must be an object')
];

const chatMessageValidator = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message must not exceed 1000 characters'),
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  body('sessionId')
    .optional()
    .isString().withMessage('Session ID must be a string')
];

const reminderValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('time')
    .notEmpty().withMessage('Time is required'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'custom']).withMessage('Invalid frequency')
];

const appointmentValidator = [
  body('doctorName')
    .trim()
    .notEmpty().withMessage('Doctor name is required'),
  body('specialty')
    .trim()
    .notEmpty().withMessage('Specialty is required'),
  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('appointmentTime')
    .trim()
    .notEmpty().withMessage('Appointment time is required')
];

const paymentValidator = [
  body('appointmentId')
    .trim()
    .notEmpty().withMessage('Appointment ID is required'),
  body('amount')
    .isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('method')
    .isIn(['card', 'upi', 'netbanking', 'wallet']).withMessage('Invalid payment method')
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  updatePreferencesValidator,
  chatMessageValidator,
  reminderValidator,
  appointmentValidator,
  paymentValidator
};
