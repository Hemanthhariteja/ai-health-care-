const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const updateProfile = async (req, res) => {
  try {
    const result = await authService.updateUserProfile(req.user._id, req.body);
    successResponse(res, 'Profile updated successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const updatePreferences = async (req, res) => {
  try {
    const result = await authService.updateUserPreferences(req.user._id, req.body);
    successResponse(res, 'Preferences updated successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const deleteUserData = async (req, res) => {
  try {
    const result = await authService.deleteUserData(req.user._id);
    successResponse(res, 'All user data deleted successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = {
  updateProfile,
  updatePreferences,
  deleteUserData
};
