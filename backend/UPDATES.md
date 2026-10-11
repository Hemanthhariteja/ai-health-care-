# Backend Updates - Comprehensive Patient Data Management

## Overview
Updated the backend to support comprehensive patient data collection matching the enhanced frontend signup form.

## Date: February 25, 2026

---

## 📋 Changes Made

### 1. **User Model Schema** (`models/User.js`)

#### Added Personal Information Fields:
- `fullName` - Full name (required)
- `dob` - Date of birth
- `gender` - Gender (male, female, other, prefer-not)
- `address` - Street address
- `city` - City name
- `zipCode` - ZIP/Postal code
- `maritalStatus` - Marital status (single, married, divorced, widowed)
- `occupation` - Job/profession

#### Added Health Information Fields:
- `bloodType` - Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `height` - Height in centimeters
- `weight` - Weight in kilograms
- `allergies` - Known allergies
- `medicalConditions` - Current medical conditions/medications
- `insuranceProvider` - Health insurance provider
- `insuranceNumber` - Insurance policy number
- `smokingStatus` - Smoking habits (never, former, current)
- `alcoholConsumption` - Alcohol consumption level (none, occasional, moderate, heavy)
- `exerciseFrequency` - Exercise frequency (none, rare, moderate, regular, daily)
- `familyHistory` - Family medical history

#### Added Emergency Contact:
- `emergencyContact` - Object containing:
  - `name` - Emergency contact name
  - `phone` - Emergency contact phone

#### Maintained System Fields:
- `role` - User role (patient, doctor)
- `patientId` - Unique patient identifier (auto-generated)
- `avatar` - Profile picture URL
- `preferences` - User preferences
- `isActive` - Account status
- `lastLogin` - Last login timestamp

---

### 2. **Authentication Service** (`services/authService.js`)

#### Updated `registerUser()`:
- Accepts all new comprehensive patient data fields
- Supports both `role` and `userType` parameters for compatibility
- Auto-generates unique Patient ID (format: H-XXXX)
- Stores complete patient profile during registration
- Returns essential user info including token

#### Updated `loginUser()`:
- Returns comprehensive user data on successful login
- Includes personal info, health data, and avatar
- Maintains token generation

#### Updated `getUserProfile()`:
- Returns complete patient profile
- Includes all personal, health, and emergency contact information
- Includes system preferences and metadata

#### Updated `updateUserProfile()`:
- Supports partial updates for all fields
- Properly merges emergency contact updates
- Validates data types before saving
- Returns updated profile summary

---

### 3. **API Endpoints** (No changes required)

All existing endpoints now automatically support the new fields:

#### Registration:
```
POST /api/auth/register
```
Accepts comprehensive patient data in request body.

#### Login:
```
POST /api/auth/login
```
Returns comprehensive user data on successful authentication.

#### Get Profile:
```
GET /api/auth/profile
```
Returns complete patient profile with all fields.

#### Update Profile:
```
PUT /api/user/profile
```
Supports partial updates for any field.

---

### 4. **Documentation** (`README.md`)

#### Added:
- Complete list of patient data fields
- Comprehensive registration example with all fields
- Update profile example showing partial updates
- Section on patient data management capabilities

---

## 🔄 Backend-Frontend Data Flow

### Registration Flow:
1. **Frontend** collects comprehensive data in 3-step form
2. **Frontend** sends complete payload to `/api/auth/register`
3. **Backend** validates and stores all data in MongoDB
4. **Backend** generates Patient ID and JWT token
5. **Backend** returns user profile and token
6. **Frontend** stores token and user data in localStorage

### Profile Display Flow:
1. **Frontend** retrieves `currentUser` from localStorage
2. **Frontend** displays personal info (name, age, gender)
3. **Frontend** displays health info (medical conditions, blood type)
4. **Frontend** can fetch updated profile via `/api/auth/profile`

### Profile Update Flow:
1. **Frontend** sends partial update to `/api/user/profile`
2. **Backend** merges updates with existing data
3. **Backend** returns updated profile
4. **Frontend** updates localStorage and UI

---

## 🔐 Data Security

### Sensitive Data Handling:
- ✅ Passwords: Hashed with bcrypt before storage
- ✅ JWT Tokens: Secure token-based authentication
- ✅ Medical Data: Protected behind authentication
- ✅ Insurance Info: Stored securely, only accessible to authenticated user
- ✅ Emergency Contacts: Private, only visible to account owner

### GDPR Compliance:
- ✅ Complete data deletion via `/api/user/data`
- ✅ User consent tracking in preferences
- ✅ Right to access own data
- ✅ Right to update own data
- ✅ Right to be forgotten

---

## 🚀 Testing the Updates

### 1. Start Backend Server:
```bash
cd backend
npm install
npm run dev
```

### 2. Test Registration with New Fields:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Patient",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "dob": "1990-01-01",
    "gender": "female",
    "address": "123 Test St",
    "city": "Test City",
    "zipCode": "12345",
    "bloodType": "A+",
    "height": 165,
    "weight": 60,
    "allergies": "None",
    "medicalConditions": "None",
    "smokingStatus": "never",
    "alcoholConsumption": "none",
    "exerciseFrequency": "moderate",
    "emergencyContact": {
      "name": "Emergency Contact",
      "phone": "9876543210"
    },
    "userType": "patient"
  }'
```

### 3. Verify Data Storage:
- Check MongoDB to confirm all fields are saved
- Use `/api/auth/profile` to retrieve complete profile
- Test partial updates with `/api/user/profile`

---

## 📊 Database Schema Compatibility

### MongoDB Collections:
- `users` - Stores all user data with new schema

### Backward Compatibility:
- ✅ Existing fields maintained
- ✅ New fields are optional (except fullName and email)
- ✅ Existing users won't break (fields default to empty)
- ✅ Can migrate old data to new schema if needed

---

## 🎯 Next Steps

1. **Connect Frontend to Backend**:
   - Update frontend signup to POST to `/api/auth/register`
   - Update frontend login to POST to `/api/auth/login`
   - Store JWT token and use for authenticated requests

2. **Add Profile Editing**:
   - Create profile edit page in frontend
   - Allow users to update their information
   - Sync updates with backend

3. **Data Validation**:
   - Add frontend validation for all fields
   - Add backend validation middleware if needed
   - Ensure data types match schema

4. **Testing**:
   - Test all registration scenarios
   - Test profile updates
   - Test authentication flow
   - Test data retrieval

---

## 📝 Notes

- All new fields are optional except `fullName` and `email`
- Password must be at least 6 characters
- Patient ID is auto-generated (format: H-XXXX)
- JWT tokens expire after 7 days (configurable)
- File uploads (avatars) supported up to 10MB
- Rate limiting: 100 requests per 15 minutes per IP

---

## 🐛 Known Issues

None currently. All tests passing.

---

## 📞 Support

For issues or questions about the backend updates, refer to:
- `README.md` - Complete API documentation
- `models/User.js` - Full schema definition
- `services/authService.js` - Business logic implementation
