const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const register = async (req, res) => {
  try {
    const userData = req.body;
    const result = await authService.registerUser(userData);
    successResponse(res, 'User registered successfully', result, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    successResponse(res, 'Login successful', result);
  } catch (error) {
    errorResponse(res, error.message, 401);
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await authService.getUserProfile(req.user._id);
    successResponse(res, 'Profile retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
