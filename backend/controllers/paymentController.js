const paymentService = require('../services/paymentService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const initiatePayment = async (req, res) => {
  try {
    const result = await paymentService.initiatePayment(req.user._id, req.body);
    successResponse(res, 'Payment initiated successfully', result, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await paymentService.getPaymentStatus(id, req.user._id);
    successResponse(res, 'Payment status retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const result = await paymentService.getPaymentHistory(req.user._id, limit);
    successResponse(res, 'Payment history retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await paymentService.refundPayment(id, req.user._id);
    successResponse(res, result.message);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

module.exports = {
  initiatePayment,
  getPaymentStatus,
  getPaymentHistory,
  refundPayment
};
