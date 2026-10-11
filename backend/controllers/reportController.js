const reportService = require('../services/reportService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const result = await reportService.uploadReport(req.user._id, req.file);
    successResponse(res, 'Report uploaded successfully', result, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reportService.getReport(id, req.user._id);
    successResponse(res, 'Report retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

const getUserReports = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await reportService.getUserReports(req.user._id, limit);
    successResponse(res, 'Reports retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reportService.deleteReport(id, req.user._id);
    successResponse(res, result.message);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

module.exports = {
  uploadReport,
  getReport,
  getUserReports,
  deleteReport
};
