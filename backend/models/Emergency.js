const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    address: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['triggered', 'acknowledged', 'resolved', 'cancelled'],
    default: 'triggered'
  },
  priority: {
    type: String,
    enum: ['high', 'critical'],
    default: 'critical'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  emergencyType: {
    type: String,
    enum: ['medical', 'accident', 'other'],
    default: 'medical'
  },
  contactNumber: {
    type: String
  },
  notificationsSent: [{
    type: {
      type: String,
      enum: ['sms', 'email', 'push']
    },
    sentAt: {
      type: Date
    },
    recipient: {
      type: String
    }
  }]
}, {
  timestamps: true
});

emergencySchema.index({ userId: 1, timestamp: -1 });
emergencySchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);
