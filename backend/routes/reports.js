const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('report'), reportController.uploadReport);
router.get('/:id', protect, reportController.getReport);
router.get('/user/all', protect, reportController.getUserReports);
router.delete('/:id', protect, reportController.deleteReport);

module.exports = router;
