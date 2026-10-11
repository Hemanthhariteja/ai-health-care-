const Emergency = require('../models/Emergency');

const triggerEmergency = async (userId, emergencyData) => {
  const { userName, location, emergencyType, contactNumber, notes } = emergencyData;

  const emergency = await Emergency.create({
    userId,
    userName: userName || 'Unknown',
    location: location || {},
    emergencyType: emergencyType || 'medical',
    contactNumber: contactNumber || null,
    notes: notes || '',
    status: 'triggered',
    priority: 'critical',
    timestamp: new Date()
  });

  console.log(`EMERGENCY ALERT: User ${userName} (${userId}) triggered emergency at ${new Date()}`);
  console.log(`Location:`, location);

  return {
    emergencyId: emergency._id,
    userName: emergency.userName,
    location: emergency.location,
    status: emergency.status,
    priority: emergency.priority,
    timestamp: emergency.timestamp,
    message: 'Emergency services have been notified. Stay calm and wait for assistance.'
  };
};

const getEmergencyHistory = async (userId, limit = 20) => {
  const emergencies = await Emergency.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit);

  return emergencies.map(emergency => ({
    emergencyId: emergency._id,
    userName: emergency.userName,
    location: emergency.location,
    emergencyType: emergency.emergencyType,
    status: emergency.status,
    priority: emergency.priority,
    timestamp: emergency.timestamp,
    responseTime: emergency.responseTime,
    notes: emergency.notes
  }));
};

const updateEmergencyStatus = async (emergencyId, status) => {
  const emergency = await Emergency.findById(emergencyId);

  if (!emergency) {
    throw new Error('Emergency record not found');
  }

  emergency.status = status;

  if (status === 'acknowledged' && !emergency.responseTime) {
    emergency.responseTime = new Date();
  }

  await emergency.save();

  return {
    emergencyId: emergency._id,
    status: emergency.status,
    responseTime: emergency.responseTime
  };
};

module.exports = {
  triggerEmergency,
  getEmergencyHistory,
  updateEmergencyStatus
};
