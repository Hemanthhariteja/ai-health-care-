require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/database');
const config = require('./config/config');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');
const lifestyleRoutes = require('./routes/lifestyle');
const reminderRoutes = require('./routes/reminders');
const mentalHealthRoutes = require('./routes/mentalHealth');
const sosRoutes = require('./routes/sos');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const healthcareDataRoutes = require('./routes/healthcareData');
const aiRoutes = require('./routes/ai');

// Initialize Express app
const app = express();

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(config.rateLimitWindow) || 15 * 60 * 1000,
  max: parseInt(config.rateLimitMax) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/healthcare-data', healthcareDataRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

module.exports = app;
