const appointmentService = require('../services/appointmentService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

const getDoctors = async (req, res) => {
  try {
    const result = appointmentService.getDoctors();
    successResponse(res, 'Doctors list retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const bookAppointment = async (req, res) => {
  try {
    const result = await appointmentService.bookAppointment(req.user._id, req.body);
    successResponse(res, 'Appointment booked successfully', result, 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const result = await appointmentService.getUserAppointments(req.user._id, status);
    successResponse(res, 'Appointments retrieved successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, paymentStatus } = req.body;
    const result = await appointmentService.updateAppointmentStatus(appointmentId, status, paymentStatus);
    successResponse(res, 'Appointment status updated successfully', result);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const result = await appointmentService.cancelAppointment(appointmentId, req.user._id);
    successResponse(res, result.message);
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

module.exports = {
  getDoctors,
  bookAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  cancelAppointment
};
