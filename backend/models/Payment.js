const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  appointmentId: {
    type: String,
    ref: 'Appointment',
    required: true
  },
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['initiated', 'processing', 'success', 'failed', 'refunded'],
    default: 'initiated'
  },
  transactionDetails: {
    cardLast4: {
      type: String
    },
    upiId: {
      type: String
    },
    bankName: {
      type: String
    },
    walletName: {
      type: String
    }
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ appointmentId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
