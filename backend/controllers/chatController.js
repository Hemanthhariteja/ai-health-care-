const chatService = require('../services/chatService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const sendMessage = async (req, res) => {
  try {
    const { message, language, sessionId } = req.body;
    const result = await chatService.sendMessage(req.user._id, message, language, sessionId);
    successResponse(res, 'Message sent successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getChatHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const result = await chatService.getChatHistory(req.user._id, limit);
    successResponse(res, 'Chat history retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const deleteChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const result = await chatService.deleteChatHistory(req.user._id, sessionId);
    successResponse(res, result.message);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  deleteChatHistory
};
