# Quick Start: Healthcare Data Integration

## 📋 Summary of Changes

Your healthcare application now has full MongoDB integration with the healthcare dataset. Here's what was added:

### New Files Created:
1. **Models**
   - `backend/models/HealthcareData.js` - MongoDB schema for healthcare records

2. **Services**
   - `backend/services/healthcareDataService.js` - Data operations and querying

3. **Controllers**
   - `backend/controllers/healthcareDataController.js` - API request handlers

4. **Routes**
   - `backend/routes/healthcareData.js` - API endpoints

5. **Scripts**
   - `backend/scripts/importData.js` - CSV import utility

6. **Documentation**
   - `backend/HEALTHCARE_DATA_GUIDE.md` - Complete integration guide

### Modified Files:
1. `backend/server.js` - Added healthcare data routes
2. `backend/services/chatService.js` - Enhanced with healthcare context
3. `backend/models/Chat.js` - Added contextData field
4. `backend/package.json` - Added csv-parse dependency

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Import Healthcare Data
```bash
npm run import-data -- --file "C:/Users/sathv/Downloads/cleaned_final_healthcare_ppp.csv"
```

**Expected Output:**
```
╔════════════════════════════════════════════╗
║   Healthcare Data Import Script            ║
╚════════════════════════════════════════════╝

📄 File: C:\Users\sathv\Downloads\cleaned_final_healthcare_ppp.csv
🔄 Importing healthcare data...

✅ Import Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message: Data imported successfully
Records: 54968
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Start Server
```bash
npm start
# or for development with hot reload:
npm run dev
```

### Step 4: Verify Integration
```bash
# Test the health check endpoint
curl http://localhost:5000/health

# You should see:
{
  "success": true,
  "message": "HealthFlow API is running",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 🎯 Key Features

### 1. **Healthcare Data Search**
Query patient records by condition, age, hospital, etc.

```javascript
// Example: Find diabetes patients around age 45
GET /api/healthcare-data/search?condition=diabetes&age=45&limit=10
```

### 2. **Patient Lookup**
Find specific patient records by name

```javascript
GET /api/healthcare-data/patient/Bobby%20Jackson
```

### 3. **Medical Condition Statistics**
Get aggregated health metrics for any condition

```javascript
GET /api/healthcare-data/stats/diabetes
// Returns: count, avgAge, avgBMI, avgGlucose, avgCholesterol, gender distribution
```

### 4. **AI-Powered Chatbot**
Chat bot automatically uses healthcare data context for better responses

```javascript
POST /api/chat/send
{
  "message": "I have diabetes",
  "language": "en"
}
// Bot responds with condition-specific advice + database statistics
```

### 5. **Healthcare Insights**
Get comprehensive analytics on patient populations

```javascript
GET /api/healthcare-data/insights?condition=cancer
// Returns: age distribution, gender distribution, top hospitals, etc.
```

---

## 📊 Dataset Overview

**Total Records:** 54,968 patient records

**Medical Conditions:**
- Diabetes
- Cancer
- Asthma
- Hypertension
- Obesity
- Arthritis

**Data Points per Patient:** 80+ fields including:
- Demographics (age, gender, blood type)
- Hospital information (admission, discharge, billing)
- Health metrics (glucose, BMI, cholesterol, blood pressure)
- Lab results (blood count, chemistry, lipids)
- Lifestyle factors (exercise, diet, stress, sleep)

---

## 🔌 API Endpoints

### Healthcare Data Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/healthcare-data/search` | Search healthcare data |
| GET | `/api/healthcare-data/patient/:name` | Get patient by name |
| GET | `/api/healthcare-data/stats/:condition` | Get condition statistics |
| GET | `/api/healthcare-data/insights` | Get healthcare insights |
| GET | `/api/healthcare-data/database-stats` | Get database statistics |
| POST | `/api/healthcare-data/import` | Import new CSV data |

### Chat Integration

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat/send` | Send chat message (auto-enhanced with healthcare data) |
| POST | `/api/chat/send-with-context` | Send chat with patient context |
| GET | `/api/chat/history` | Get chat history |

**All endpoints require:** `Authorization: Bearer JWT_TOKEN`

---

## 💡 Usage Examples

### Example 1: Search Diabetes Patients
```bash
curl "http://localhost:5000/api/healthcare-data/search?condition=diabetes&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example 2: Get Patient Statistics
```bash
curl "http://localhost:5000/api/healthcare-data/stats/diabetes" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example 3: Chat with Healthcare Context
```bash
curl -X POST "http://localhost:5000/api/chat/send" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have diabetes, how should I manage it?",
    "language": "en"
  }'
```

**Response includes:**
- Standard health advice
- Real statistics from your dataset
- Patient case information when available

### Example 4: Get Database Overview
```bash
curl "http://localhost:5000/api/healthcare-data/database-stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔒 Security

- **Authentication Required:** All endpoints require valid JWT token
- **Authorization:** Built on Express Auth Middleware
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **HTTPS:** Use HTTPS in production

---

## 📈 Performance Metrics

**Database Indexes Created:**
- Patient name lookup: O(1)
- Condition search: O(n) with index
- Hospital search: O(n) with index
- Statistics aggregation: ~1-2 seconds per condition

**Recommended Limits:**
- Search results: 10-100 records
- History retrieval: 50 records
- Aggregations: Use filters to limit scope

---

## 🐛 Troubleshooting

### Issue: "No module named 'csv-parse'"
```bash
npm install csv-parse
```

### Issue: "Cannot find collection"
```bash
# Run import script again
npm run import-data -- --file "path/to/csv"
```

### Issue: "Invalid JWT token"
- Generate new token: Login to app and copy JWT from localStorage
- Include in Authorization header: `Bearer YOUR_TOKEN`

### Issue: "Connection refused"
- Verify MongoDB is running
- Check connection string in `.env`
- Test connection: `mongosh` or MongoDB Compass

---

## 📚 More Information

For detailed documentation, refer to:
- `backend/HEALTHCARE_DATA_GUIDE.md` - Complete API reference
- `backend/models/HealthcareData.js` - Data schema
- `backend/services/healthcareDataService.js` - Available methods

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] CSV file imported (`npm run import-data`)
- [ ] Server started (`npm start` or `npm run dev`)
- [ ] Health check passing (`GET /health`)
- [ ] Database stats visible (`GET /api/healthcare-data/database-stats`)
- [ ] Chat endpoint working (`POST /api/chat/send`)

---

## 🎓 Next Steps

1. **Test in Postman/Insomnia:** Use the API endpoints provided
2. **Frontend Integration:** Update chat UI to show healthcare insights
3. **Analytics Dashboard:** Build charts using the insights endpoint
4. **Mobile App:** Implement healthcare data search in mobile version
5. **Advanced Features:** Add prediction models, ML algorithms, etc.

---

## 📞 Support

For issues or questions, check:
1. `HEALTHCARE_DATA_GUIDE.md` - Comprehensive reference
2. `healthcareDataService.js` - Available methods
3. API response messages - Usually contain specific error details

**Happy coding! 🚀**
