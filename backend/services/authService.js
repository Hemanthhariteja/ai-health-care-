const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

const registerUser = async (userData) => {
  const { 
    // Personal Information
    fullName, 
    email, 
    password, 
    phone, 
    dob, 
    gender,
    
    // Health Information
    bloodType,
    height,
    weight,
    allergies,
    medicalConditions,
    
    // Emergency Contact
    emergencyContact,
    
    // System
    role,
    userType
  } = userData;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists with this email');
  }

  const actualRole = role || userType || 'patient';
  const patientId = actualRole === 'patient' ? `H-${Date.now().toString().slice(-4)}` : null;

  const user = await User.create({
    // Personal Information
    fullName: fullName || email.split('@')[0],
    name: fullName || email.split('@')[0],
    email,
    password,
    phone,
    dob,
    gender,
    
    // Health Information
    bloodType,
    height,
    weight,
    allergies: allergies || '',
    medicalConditions: medicalConditions || '',
    
    // Emergency Contact
    emergencyContact: emergencyContact || {},
    
    // System
    role: actualRole,
    patientId
  });

  if (user) {
    return {
      _id: user._id,
      fullName: user.fullName,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId: user.patientId,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      bloodType: user.bloodType,
      height: user.height,
      weight: user.weight,
      token: generateToken(user._id)
    };
  } else {
    throw new Error('Failed to create user');
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save();

  return {
    _id: user._id,
    fullName: user.fullName,
    name: user.name,
    email: user.email,
    role: user.role,
    patientId: user.patientId,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender,
    address: user.address,
    city: user.city,
    zipCode: user.zipCode,
    bloodType: user.bloodType,
    medicalConditions: user.medicalConditions,
    avatar: user.avatar,
    token: generateToken(user._id)
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    _id: user._id,
    // Personal Information
    fullName: user.fullName,
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender,
    address: user.address,
    city: user.city,
    zipCode: user.zipCode,
    maritalStatus: user.maritalStatus,
    occupation: user.occupation,
    
    // Health Information
    bloodType: user.bloodType,
    height: user.height,
    weight: user.weight,
    allergies: user.allergies,
    medicalConditions: user.medicalConditions,
    insuranceProvider: user.insuranceProvider,
    insuranceNumber: user.insuranceNumber,
    smokingStatus: user.smokingStatus,
    alcoholConsumption: user.alcoholConsumption,
    exerciseFrequency: user.exerciseFrequency,
    familyHistory: user.familyHistory,
    
    // Emergency Contact
    emergencyContact: user.emergencyContact,
    
    // System Information
    role: user.role,
    patientId: user.patientId,
    avatar: user.avatar,
    preferences: user.preferences,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt
  };
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Personal Information
  if (updateData.fullName) user.fullName = updateData.fullName;
  if (updateData.name) user.name = updateData.name;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.dob) user.dob = updateData.dob;
  if (updateData.gender) user.gender = updateData.gender;
  if (updateData.address) user.address = updateData.address;
  if (updateData.city) user.city = updateData.city;
  if (updateData.zipCode) user.zipCode = updateData.zipCode;
  if (updateData.maritalStatus) user.maritalStatus = updateData.maritalStatus;
  if (updateData.occupation) user.occupation = updateData.occupation;
  
  // Health Information
  if (updateData.bloodType) user.bloodType = updateData.bloodType;
  if (updateData.height) user.height = updateData.height;
  if (updateData.weight) user.weight = updateData.weight;
  if (updateData.allergies !== undefined) user.allergies = updateData.allergies;
  if (updateData.medicalConditions !== undefined) user.medicalConditions = updateData.medicalConditions;
  if (updateData.insuranceProvider) user.insuranceProvider = updateData.insuranceProvider;
  if (updateData.insuranceNumber) user.insuranceNumber = updateData.insuranceNumber;
  if (updateData.smokingStatus) user.smokingStatus = updateData.smokingStatus;
  if (updateData.alcoholConsumption) user.alcoholConsumption = updateData.alcoholConsumption;
  if (updateData.exerciseFrequency) user.exerciseFrequency = updateData.exerciseFrequency;
  if (updateData.familyHistory !== undefined) user.familyHistory = updateData.familyHistory;
  
  // Emergency Contact
  if (updateData.emergencyContact) {
    user.emergencyContact = {
      ...user.emergencyContact,
      ...updateData.emergencyContact
    };
  }
  
  // Avatar
  if (updateData.avatar) user.avatar = updateData.avatar;

  await user.save();

  return {
    _id: user._id,
    fullName: user.fullName,
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender,
    address: user.address,
    city: user.city,
    zipCode: user.zipCode,
    bloodType: user.bloodType,
    avatar: user.avatar,
    emergencyContact: user.emergencyContact
  };
};

const updateUserPreferences = async (userId, preferences) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (preferences.language) {
    user.preferences.language = preferences.language;
  }

  if (preferences.accessibility) {
    user.preferences.accessibility = {
      ...user.preferences.accessibility,
      ...preferences.accessibility
    };
  }

  if (preferences.privacy) {
    user.preferences.privacy = {
      ...user.preferences.privacy,
      ...preferences.privacy
    };
  }

  await user.save();

  return user.preferences;
};

const deleteUserData = async (userId) => {
  const User = require('../models/User');
  const Chat = require('../models/Chat');
  const Report = require('../models/Report');
  const Reminder = require('../models/Reminder');
  const Appointment = require('../models/Appointment');
  const Payment = require('../models/Payment');
  const Emergency = require('../models/Emergency');
  const MentalHealthChat = require('../models/MentalHealthChat');

  await Chat.deleteMany({ userId });
  await Report.deleteMany({ userId });
  await Reminder.deleteMany({ userId });
  await Appointment.deleteMany({ userId });
  await Payment.deleteMany({ userId });
  await Emergency.deleteMany({ userId });
  await MentalHealthChat.deleteMany({ userId });

  await User.findByIdAndDelete(userId);

  return { message: 'All user data has been permanently deleted' };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  deleteUserData
};
