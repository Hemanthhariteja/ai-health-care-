const mentalHealthService = require('../services/mentalHealthService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const sendMessage = async (req, res) => {
  try {
    const { message, isAnonymous, sessionId } = req.body;
    const result = await mentalHealthService.sendMentalHealthMessage(
      req.user._id,
      message,
      isAnonymous || false,
      sessionId
    );
    successResponse(res, 'Message sent successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getHistory = async (req, res) => {
  try {
    const result = await mentalHealthService.getMentalHealthHistory(req.user._id);
    successResponse(res, 'Mental health chat history retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const deleteChat = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const result = await mentalHealthService.deleteMentalHealthChat(req.user._id, sessionId);
    successResponse(res, result.message);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

module.exports = {
  sendMessage,
  getHistory,
  deleteChat
};
