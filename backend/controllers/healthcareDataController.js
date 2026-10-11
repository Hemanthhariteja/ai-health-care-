const HealthcareDataService = require('../services/healthcareDataService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

/**
 * Import healthcare data from CSV
 */
const importCSVData = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const result = await HealthcareDataService.importFromCSV(req.file.path);
    successResponse(res, result.message, result);
  } catch (error) {
    errorResponse(res, `Import failed: ${error.message}`, 500);
  }
};

/**
 * Search healthcare data
 */
const searchData = async (req, res) => {
  try {
    const { condition, age, gender, hospital, bloodType, limit } = req.query;

    const query = {};
    if (condition) query.condition = condition;
    if (age) query.age = { min: parseInt(age) - 5, max: parseInt(age) + 5 };
    if (gender) query.gender = gender;
    if (hospital) query.hospital = hospital;
    if (bloodType) query.bloodType = bloodType;

    const results = await HealthcareDataService.searchData(query, parseInt(limit) || 10);
    successResponse(res, 'Data retrieved successfully', { results, count: results.length });
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * Get patient by name
 */
const getPatientByName = async (req, res) => {
  try {
    const { name } = req.params;
    const patient = await HealthcareDataService.getPatientByName(name);

    if (!patient) {
      return errorResponse(res, 'Patient not found', 404);
    }

    successResponse(res, 'Patient data retrieved successfully', patient);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * Get statistics for a medical condition
 */
const getConditionStats = async (req, res) => {
  try {
    const { condition } = req.params;
    const stats = await HealthcareDataService.getStatsByCondition(condition);

    if (!stats) {
      return errorResponse(res, 'No data found for this condition', 404);
    }

    successResponse(res, 'Statistics retrieved successfully', stats);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * Get insights from healthcare data
 */
const getInsights = async (req, res) => {
  try {
    const { condition } = req.query;
    const insights = await HealthcareDataService.getInsights({ condition });
    successResponse(res, 'Insights retrieved successfully', insights);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

/**
 * Get database statistics
 */
const getDatabaseStats = async (req, res) => {
  try {
    const stats = await HealthcareDataService.getDatabaseStats();
    successResponse(res, 'Database statistics retrieved successfully', stats);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

module.exports = {
  importCSVData,
  searchData,
  getPatientByName,
  getConditionStats,
  getInsights,
  getDatabaseStats
};
