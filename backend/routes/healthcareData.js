const express = require('express');
const router = express.Router();
const healthcareDataController = require('../controllers/healthcareDataController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Import CSV data - requires authentication and admin role
router.post('/import', protect, upload.single('file'), healthcareDataController.importCSVData);

// Search healthcare data
router.get('/search', protect, healthcareDataController.searchData);

// Get patient by name
router.get('/patient/:name', protect, healthcareDataController.getPatientByName);

// Get statistics for medical condition
router.get('/stats/:condition', protect, healthcareDataController.getConditionStats);

// Get insights
router.get('/insights', protect, healthcareDataController.getInsights);

// Get database statistics
router.get('/database-stats', protect, healthcareDataController.getDatabaseStats);

module.exports = router;
