const Reminder = require('../models/Reminder');

const createReminder = async (userId, reminderData) => {
  const { title, description, time, frequency, days, color, icon, category } = reminderData;

  const reminder = await Reminder.create({
    userId,
    title,
    description,
    time,
    frequency: frequency || 'daily',
    days: days || [],
    color: color || '#5D9CAE',
    icon: icon || 'bell',
    category: category || 'other',
    isEnabled: true
  });

  return {
    reminderId: reminder._id,
    title: reminder.title,
    description: reminder.description,
    time: reminder.time,
    frequency: reminder.frequency,
    days: reminder.days,
    color: reminder.color,
    icon: reminder.icon,
    category: reminder.category,
    isEnabled: reminder.isEnabled,
    createdAt: reminder.createdAt
  };
};

const getReminders = async (userId) => {
  const reminders = await Reminder.find({ userId }).sort({ createdAt: -1 });

  return reminders.map(reminder => ({
    reminderId: reminder._id,
    title: reminder.title,
    description: reminder.description,
    time: reminder.time,
    frequency: reminder.frequency,
    days: reminder.days,
    color: reminder.color,
    icon: reminder.icon,
    category: reminder.category,
    isEnabled: reminder.isEnabled,
    lastTriggered: reminder.lastTriggered,
    createdAt: reminder.createdAt
  }));
};

const updateReminder = async (reminderId, userId, updateData) => {
  const reminder = await Reminder.findOne({ _id: reminderId, userId });

  if (!reminder) {
    throw new Error('Reminder not found');
  }

  if (updateData.title !== undefined) reminder.title = updateData.title;
  if (updateData.description !== undefined) reminder.description = updateData.description;
  if (updateData.time !== undefined) reminder.time = updateData.time;
  if (updateData.frequency !== undefined) reminder.frequency = updateData.frequency;
  if (updateData.days !== undefined) reminder.days = updateData.days;
  if (updateData.color !== undefined) reminder.color = updateData.color;
  if (updateData.icon !== undefined) reminder.icon = updateData.icon;
  if (updateData.category !== undefined) reminder.category = updateData.category;
  if (updateData.isEnabled !== undefined) reminder.isEnabled = updateData.isEnabled;

  await reminder.save();

  return {
    reminderId: reminder._id,
    title: reminder.title,
    description: reminder.description,
    time: reminder.time,
    frequency: reminder.frequency,
    days: reminder.days,
    color: reminder.color,
    icon: reminder.icon,
    category: reminder.category,
    isEnabled: reminder.isEnabled
  };
};

const deleteReminder = async (reminderId, userId) => {
  const reminder = await Reminder.findOne({ _id: reminderId, userId });

  if (!reminder) {
    throw new Error('Reminder not found');
  }

  await Reminder.findByIdAndDelete(reminderId);

  return { message: 'Reminder deleted successfully' };
};

const toggleReminder = async (reminderId, userId) => {
  const reminder = await Reminder.findOne({ _id: reminderId, userId });

  if (!reminder) {
    throw new Error('Reminder not found');
  }

  reminder.isEnabled = !reminder.isEnabled;
  await reminder.save();

  return {
    reminderId: reminder._id,
    isEnabled: reminder.isEnabled
  };
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  toggleReminder
};
