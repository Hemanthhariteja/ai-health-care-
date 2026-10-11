const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'daily'
  },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  isEnabled: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#5D9CAE'
  },
  icon: {
    type: String,
    default: 'bell'
  },
  category: {
    type: String,
    enum: ['medication', 'exercise', 'appointment', 'measurement', 'other'],
    default: 'other'
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  lastTriggered: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

reminderSchema.index({ userId: 1, isEnabled: 1 });
reminderSchema.index({ time: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
