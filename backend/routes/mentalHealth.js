const express = require('express');
const router = express.Router();
const mentalHealthController = require('../controllers/mentalHealthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, mentalHealthController.sendMessage);
router.get('/history', protect, mentalHealthController.getHistory);
router.delete('/chat', protect, mentalHealthController.deleteChat);

module.exports = router;
