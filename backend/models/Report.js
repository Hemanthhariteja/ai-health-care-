const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  analysis: {
    simplified: {
      type: String,
      default: ''
    },
    detailed: {
      type: String,
      default: ''
    },
    keywords: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  metadata: {
    reportType: {
      type: String
    },
    reportDate: {
      type: Date
    },
    doctorName: {
      type: String
    }
  }
}, {
  timestamps: true
});

reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ 'analysis.status': 1 });

module.exports = mongoose.model('Report', reportSchema);
