const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

const initiatePayment = async (userId, paymentData) => {
  const { appointmentId, amount, method, transactionDetails } = paymentData;

  const appointment = await Appointment.findOne({ appointmentId });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (appointment.paymentStatus === 'paid') {
    throw new Error('Payment already completed for this appointment');
  }

  const paymentId = `PAY-${Date.now().toString().slice(-8)}`;

  const payment = await Payment.create({
    userId,
    appointmentId,
    paymentId,
    amount,
    currency: 'USD',
    method,
    status: 'processing',
    transactionDetails: transactionDetails || {},
    paymentDate: new Date()
  });

  setTimeout(async () => {
    payment.status = 'success';
    await payment.save();

    appointment.paymentStatus = 'paid';
    appointment.status = 'confirmed';
    await appointment.save();
  }, 2000);

  return {
    paymentId: payment.paymentId,
    appointmentId: payment.appointmentId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    paymentDate: payment.paymentDate,
    message: 'Payment is being processed'
  };
};

const getPaymentStatus = async (paymentId, userId) => {
  const payment = await Payment.findOne({ paymentId, userId });

  if (!payment) {
    throw new Error('Payment not found');
  }

  return {
    paymentId: payment.paymentId,
    appointmentId: payment.appointmentId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    paymentDate: payment.paymentDate
  };
};

const getPaymentHistory = async (userId, limit = 20) => {
  const payments = await Payment.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return payments.map(payment => ({
    paymentId: payment.paymentId,
    appointmentId: payment.appointmentId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    paymentDate: payment.paymentDate,
    refundDate: payment.refundDate
  }));
};

const refundPayment = async (paymentId, userId) => {
  const payment = await Payment.findOne({ paymentId, userId });

  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status !== 'success') {
    throw new Error('Only successful payments can be refunded');
  }

  if (payment.status === 'refunded') {
    throw new Error('Payment already refunded');
  }

  payment.status = 'refunded';
  payment.refundDate = new Date();
  await payment.save();

  const appointment = await Appointment.findOne({ appointmentId: payment.appointmentId });
  if (appointment) {
    appointment.paymentStatus = 'refunded';
    await appointment.save();
  }

  return {
    paymentId: payment.paymentId,
    status: payment.status,
    refundDate: payment.refundDate,
    message: 'Payment refunded successfully'
  };
};

module.exports = {
  initiatePayment,
  getPaymentStatus,
  getPaymentHistory,
  refundPayment
};
