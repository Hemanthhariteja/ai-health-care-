const reminderService = require('../services/reminderService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const createReminder = async (req, res) => {
  try {
    const result = await reminderService.createReminder(req.user._id, req.body);
    successResponse(res, 'Reminder created successfully', result, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getReminders = async (req, res) => {
  try {
    const result = await reminderService.getReminders(req.user._id);
    successResponse(res, 'Reminders retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reminderService.updateReminder(id, req.user._id, req.body);
    successResponse(res, 'Reminder updated successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reminderService.deleteReminder(id, req.user._id);
    successResponse(res, result.message);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

const toggleReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reminderService.toggleReminder(id, req.user._id);
    successResponse(res, 'Reminder toggled successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  toggleReminder
};
