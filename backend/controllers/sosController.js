const sosService = require('../services/sosService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const triggerEmergency = async (req, res) => {
  try {
    const result = await sosService.triggerEmergency(req.user._id, req.body);
    successResponse(res, 'Emergency triggered successfully', result, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getEmergencyHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await sosService.getEmergencyHistory(req.user._id, limit);
    successResponse(res, 'Emergency history retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await sosService.updateEmergencyStatus(id, status);
    successResponse(res, 'Emergency status updated successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

module.exports = {
  triggerEmergency,
  getEmergencyHistory,
  updateEmergencyStatus
};
