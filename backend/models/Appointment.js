const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientId: {
    type: String,
    required: true
  },
  doctor: {
    name: {
      type: String,
      required: true
    },
    specialty: {
      type: String,
      required: true
    },
    availability: {
      type: String
    }
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  appointmentId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  notes: {
    type: String,
    default: ''
  },
  service: {
    type: String,
    default: 'Tele-Consultation'
  },
  amount: {
    type: Number,
    default: 75.00
  }
}, {
  timestamps: true
});

appointmentSchema.index({ userId: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentId: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
