const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validate } = require('../middleware/validationMiddleware');
const { chatMessageValidator } = require('../utils/validators');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, validate(chatMessageValidator), chatController.sendMessage);
router.get('/history', protect, chatController.getChatHistory);
router.delete('/history', protect, chatController.deleteChatHistory);

module.exports = router;
