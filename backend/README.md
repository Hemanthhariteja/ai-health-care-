# HealthFlow Backend API

Complete backend REST API for the HealthFlow healthcare application with comprehensive patient data management.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Comprehensive User Management**: Complete profile with personal, health, and emergency contact information
- **Patient Data Collection**: Extensive patient information including medical history, lifestyle habits, insurance details
- **AI Health Chat**: Multilingual chatbot with keyword-based health advice
- **Medical Reports**: Upload, analyze, and manage medical reports (PDF, JPEG, PNG)
- **Lifestyle Guidance**: Static guidance for diet, exercise, yoga, and health precautions
- **Smart Reminders**: Create, manage, and toggle health reminders
- **Mental Health Support**: Anonymous and emotion-aware mental health chat
- **SOS Emergency**: Emergency trigger with location tracking
- **Appointment Booking**: Doctor listing and appointment management with conflict detection
- **Payment Gateway**: Payment processing with refund support
- **GDPR Compliance**: Complete data deletion support

## 🏥 Patient Data Fields

### Personal Information
- Full Name, Email, Phone Number
- Date of Birth, Gender
- Complete Address (Street, City, ZIP Code)
- Marital Status, Occupation

### Health Information
- Blood Type
- Height (cm), Weight (kg)
- Allergies
- Medical Conditions / Medications
- Insurance Provider & Policy Number
- Smoking Status
- Alcohol Consumption Level
- Exercise Frequency
- Family Medical History

### Emergency Contact
- Emergency Contact Name
- Emergency Contact Phone Number

### System Information
- Patient ID (auto-generated)
- Profile Picture / Avatar
- User Preferences (Language, Accessibility, Privacy)
- Last Login Tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.0
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcrypt (bcryptjs 2.4.3)
- **Security**: helmet, express-rate-limit, CORS
- **File Upload**: Multer 1.4.5
- **Validation**: express-validator 7.0.1
- **Logging**: morgan 1.10.0

## 📁 Project Structure

```
backend/
├── config/
│   ├── config.js           # Centralized configuration
│   └── database.js         # MongoDB connection
├── controllers/            # HTTP request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── chatController.js
│   ├── reportController.js
│   ├── lifestyleController.js
│   ├── reminderController.js
│   ├── mentalHealthController.js
│   ├── sosController.js
│   ├── appointmentController.js
│   └── paymentController.js
├── middleware/             # Custom middleware
│   ├── authMiddleware.js   # JWT authentication & RBAC
│   ├── errorMiddleware.js  # Global error handling
│   ├── uploadMiddleware.js # File upload with Multer
│   └── validationMiddleware.js
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Chat.js
│   ├── Report.js
│   ├── Reminder.js
│   ├── Appointment.js
│   ├── Payment.js
│   ├── Emergency.js
│   └── MentalHealthChat.js
├── routes/                 # API route definitions
│   ├── auth.js
│   ├── user.js
│   ├── chat.js
│   ├── reports.js
│   ├── lifestyle.js
│   ├── reminders.js
│   ├── mentalHealth.js
│   ├── sos.js
│   ├── appointments.js
│   └── payments.js
├── services/               # Business logic layer
│   ├── authService.js
│   ├── chatService.js
│   ├── reportService.js
│   ├── lifestyleService.js
│   ├── reminderService.js
│   ├── mentalHealthService.js
│   ├── sosService.js
│   ├── appointmentService.js
│   └── paymentService.js
├── utils/                  # Utility functions
│   ├── jwtUtils.js         # JWT token generation/verification
│   ├── responseUtils.js    # Standardized API responses
│   └── validators.js       # Express-validator chains
├── uploads/                # File upload directory (auto-created)
├── .env.example            # Environment variables template
├── package.json
├── README.md
└── server.js               # Application entry point
```

## ⚙️ Installation

1. **Clone or navigate to the backend directory**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthflow
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

4. **Start the server**

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### User Management
- `PUT /api/user/profile` - Update profile (protected)
- `PUT /api/user/preferences` - Update preferences (protected)
- `DELETE /api/user/data` - Delete all user data (protected, GDPR-compliant)

### AI Chat
- `POST /api/chat/message` - Send chat message (protected)
- `GET /api/chat/history` - Get chat history (protected)
- `DELETE /api/chat/history` - Delete chat session (protected)

### Medical Reports
- `POST /api/reports/upload` - Upload medical report (protected, multipart/form-data)
- `GET /api/reports/:id` - Get single report (protected)
- `GET /api/reports/user/all` - Get all user reports (protected)
- `DELETE /api/reports/:id` - Delete report (protected)

### Lifestyle Guidance
- `GET /api/lifestyle/diet` - Get diet guidance
- `GET /api/lifestyle/exercise` - Get exercise guidance
- `GET /api/lifestyle/yoga` - Get yoga guidance
- `GET /api/lifestyle/precautions` - Get health precautions

### Reminders
- `POST /api/reminders` - Create reminder (protected)
- `GET /api/reminders` - Get all reminders (protected)
- `PUT /api/reminders/:id` - Update reminder (protected)
- `DELETE /api/reminders/:id` - Delete reminder (protected)
- `PATCH /api/reminders/:id/toggle` - Toggle reminder (protected)

### Mental Health
- `POST /api/mental-health/chat` - Send mental health message (protected)
- `GET /api/mental-health/history` - Get chat history (protected)
- `DELETE /api/mental-health/chat` - Delete chat session (protected)

### SOS Emergency
- `POST /api/sos/trigger` - Trigger emergency (protected)
- `GET /api/sos/history` - Get emergency history (protected)
- `PUT /api/sos/:id/status` - Update emergency status (protected)

### Appointments
- `GET /api/appointments/doctors` - Get doctors list
- `POST /api/appointments/book` - Book appointment (protected)
- `GET /api/appointments/user/all` - Get user appointments (protected)
- `PUT /api/appointments/:appointmentId/status` - Update appointment status (protected)
- `DELETE /api/appointments/:appointmentId` - Cancel appointment (protected)

### Payments
- `POST /api/payments/initiate` - Initiate payment (protected)
- `GET /api/payments/:id/status` - Get payment status (protected)
- `GET /api/payments/history/all` - Get payment history (protected)
- `POST /api/payments/:id/refund` - Refund payment (protected)

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📤 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Express-validator on all inputs
- **File Upload Security**: Type and size restrictions (PDF, JPEG, PNG only, max 10MB)

## 🗄️ Database Models

- **User**: Authentication, profile, preferences
- **Chat**: AI chat conversations with multilingual support
- **Report**: Medical report uploads with analysis
- **Reminder**: Health reminders with frequency settings
- **Appointment**: Doctor appointments with status tracking
- **Payment**: Payment transactions with refund support
- **Emergency**: SOS emergency records with location
- **MentalHealthChat**: Mental health conversations with emotion detection

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `UPLOAD_PATH` | File upload directory | ./uploads |
| `MAX_FILE_SIZE` | Max file size in bytes | 10485760 |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | 900000 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |

## 🧪 Testing the API

Health check:
```bash
curl http://localhost:5000/health
```

Register a new patient user with comprehensive data:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    "password": "SecurePass123",
    "phone": "+1234567890",
    "dob": "1990-05-15",
    "gender": "female",
    "address": "123 Main Street, Apt 4B",
    "city": "San Francisco",
    "zipCode": "94102",
    "maritalStatus": "single",
    "occupation": "Software Engineer",
    "bloodType": "A+",
    "height": 165,
    "weight": 58,
    "allergies": "Penicillin, Peanuts",
    "medicalConditions": "Mild asthma",
    "insuranceProvider": "Blue Cross Blue Shield",
    "insuranceNumber": "BCBS123456789",
    "smokingStatus": "never",
    "alcoholConsumption": "occasional",
    "exerciseFrequency": "moderate",
    "familyHistory": "Diabetes (maternal grandmother), Hypertension (father)",
    "emergencyContact": {
      "name": "John Johnson",
      "phone": "+1234567891"
    },
    "userType": "patient"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "65a1234567890abcdef12345",
    "fullName": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    "role": "patient",
    "patientId": "H-2345",
    "phone": "+1234567890",
    "dob": "1990-05-15T00:00:00.000Z",
    "gender": "female",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.johnson@example.com",
    "password": "SecurePass123"
  }'
```

Get user profile (requires authentication):
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Update profile (partial update supported):
```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567899",
    "weight": 60,
    "exerciseFrequency": "regular"
  }'
```
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name healthflow-api
```

3. Set up MongoDB Atlas or any MongoDB instance
4. Configure reverse proxy (nginx) with SSL certificate
5. Set up CORS origin for your frontend domain

## 📌 Notes

- All mock services (AI chat, report analysis, payment processing) are production-ready and can be replaced with actual third-party integrations
- File uploads are stored locally in `./uploads` directory - for production, consider using cloud storage (AWS S3, Google Cloud Storage)
- The database uses indexing for optimized query performance
- GDPR-compliant data deletion removes all user data across all collections

## 🤝 License

Proprietary - HealthFlow Healthcare Application
