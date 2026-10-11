const Appointment = require('../models/Appointment');

const doctors = [
  {
    id: 'doc-1',
    name: 'Dr. Anya Sharma',
    specialty: 'General Physician',
    availability: 'Available Today',
    slots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM']
  },
  {
    id: 'doc-2',
    name: 'Dr. Ben Carter',
    specialty: 'Dermatologist',
    availability: 'Available Tomorrow',
    slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: 'doc-3',
    name: 'Dr. Mei Ling',
    specialty: 'Cardiologist',
    availability: 'Not Available',
    slots: []
  },
  {
    id: 'doc-4',
    name: 'Dr. Raj Patel',
    specialty: 'Orthopedic',
    availability: 'Available Today',
    slots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: 'doc-5',
    name: 'Dr. Sarah Johnson',
    specialty: 'Pediatrician',
    availability: 'Available Tomorrow',
    slots: ['09:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']
  }
];

const getDoctors = () => {
  return doctors;
};

const bookAppointment = async (userId, appointmentData) => {
  const {
    patientName,
    patientId,
    doctorName,
    specialty,
    appointmentDate,
    appointmentTime,
    notes,
    availability
  } = appointmentData;

  const appointmentId = `APT-${Date.now().toString().slice(-6)}`;

  const existingAppointment = await Appointment.findOne({
    'doctor.name': doctorName,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingAppointment) {
    throw new Error('This time slot is already booked. Please select another time.');
  }

  const appointment = await Appointment.create({
    userId,
    patientName,
    patientId,
    doctor: {
      name: doctorName,
      specialty,
      availability: availability || 'Available Today'
    },
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    appointmentId,
    status: 'pending',
    paymentStatus: 'unpaid',
    notes: notes || '',
    service: 'Tele-Consultation',
    amount: 75.00
  });

  return {
    appointmentId: appointment.appointmentId,
    patientName: appointment.patientName,
    doctor: appointment.doctor,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    status: appointment.status,
    service: appointment.service,
    amount: appointment.amount,
    message: 'Appointment booked successfully'
  };
};

const getUserAppointments = async (userId, status = null) => {
  const query = { userId };
  
  if (status) {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .sort({ appointmentDate: -1, createdAt: -1 })
    .limit(50);

  return appointments.map(apt => ({
    appointmentId: apt.appointmentId,
    patientName: apt.patientName,
    doctor: apt.doctor,
    appointmentDate: apt.appointmentDate,
    appointmentTime: apt.appointmentTime,
    status: apt.status,
    paymentStatus: apt.paymentStatus,
    service: apt.service,
    amount: apt.amount,
    notes: apt.notes,
    createdAt: apt.createdAt
  }));
};

const updateAppointmentStatus = async (appointmentId, status, paymentStatus = null) => {
  const appointment = await Appointment.findOne({ appointmentId });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  appointment.status = status;
  
  if (paymentStatus) {
    appointment.paymentStatus = paymentStatus;
  }

  await appointment.save();

  return {
    appointmentId: appointment.appointmentId,
    status: appointment.status,
    paymentStatus: appointment.paymentStatus
  };
};

const cancelAppointment = async (appointmentId, userId) => {
  const appointment = await Appointment.findOne({ appointmentId, userId });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (appointment.status === 'completed') {
    throw new Error('Cannot cancel completed appointment');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  return {
    appointmentId: appointment.appointmentId,
    status: appointment.status,
    message: 'Appointment cancelled successfully'
  };
};

module.exports = {
  getDoctors,
  bookAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  cancelAppointment
};
