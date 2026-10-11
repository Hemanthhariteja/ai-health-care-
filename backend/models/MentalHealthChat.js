const mongoose = require('mongoose');

const mentalHealthChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    emotion: {
      type: String,
      enum: ['anxious', 'sad', 'stressed', 'lonely', 'neutral', 'happy'],
      default: 'neutral'
    }
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  }
}, {
  timestamps: true
});

mentalHealthChatSchema.index({ userId: 1, createdAt: -1 });
mentalHealthChatSchema.index({ sessionId: 1 });

module.exports = mongoose.model('MentalHealthChat', mentalHealthChatSchema);
