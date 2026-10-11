const lifestyleService = require('../services/lifestyleService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const getDiet = async (req, res) => {
  try {
    const result = lifestyleService.getDietGuidance();
    successResponse(res, 'Diet guidance retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getExercise = async (req, res) => {
  try {
    const result = lifestyleService.getExerciseGuidance();
    successResponse(res, 'Exercise guidance retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getYoga = async (req, res) => {
  try {
    const result = lifestyleService.getYogaGuidance();
    successResponse(res, 'Yoga guidance retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getPrecautions = async (req, res) => {
  try {
    const result = lifestyleService.getPrecautionsGuidance();
    successResponse(res, 'Precautions retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getDiet,
  getExercise,
  getYoga,
  getPrecautions
};
