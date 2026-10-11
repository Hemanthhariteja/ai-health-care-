# Healthcare Data Integration Guide

## Overview

This healthcare application now includes an integrated healthcare dataset with MongoDB that powers your chatbot with real healthcare insights and patient data analytics.

## Setup

### 1. Install Dependencies

Make sure you have csv-parse installed:

```bash
npm install csv-parse
```

### 2. Import Healthcare Data

#### Option A: Using the Import Script

```bash
npm run import-data -- --file "C:/path/to/cleaned_final_healthcare_ppp.csv"
```

#### Option B: Using API Endpoint

```bash
curl -X POST http://localhost:5000/api/healthcare-data/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@cleaned_final_healthcare_ppp.csv"
```

### 3. Verify Import

```bash
curl -X GET http://localhost:5000/api/healthcare-data/database-stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Features

### 1. Healthcare Data Model

The `HealthcareData` collection stores:
- **Patient Information**: Name, age, gender, blood type, medical condition
- **Hospital Records**: Admission/discharge dates, doctor, hospital, billing
- **Health Metrics**: Glucose, BMI, cholesterol, blood pressure, oxygen saturation
- **Lab Results**: Blood count, chemistry panel, lipid panel, inflammation markers
- **Lifestyle Data**: Smoking, alcohol, exercise, diet score, stress levels

### 2. API Endpoints

#### Search Healthcare Data
```bash
GET /api/healthcare-data/search?condition=diabetes&age=45&limit=10
```

Response:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "results": [...],
    "count": 10
  }
}
```

#### Get Patient by Name
```bash
GET /api/healthcare-data/patient/:name
```

Example:
```bash
GET /api/healthcare-data/patient/Bobby%20Jackson
```

#### Get Medical Condition Statistics
```bash
GET /api/healthcare-data/stats/:condition
```

Example:
```bash
GET /api/healthcare-data/stats/diabetes
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "diabetes",
    "count": 250,
    "avgAge": 52,
    "avgBMI": 28.5,
    "avgGlucose": 145.2,
    "avgCholesterol": 210.3,
    "maleCount": 130,
    "femaleCount": 120
  }
}
```

#### Get Healthcare Insights
```bash
GET /api/healthcare-data/insights?condition=hypertension
```

Response:
```json
{
  "success": true,
  "data": {
    "totalRecords": [...],
    "ageDistribution": [...],
    "genderDistribution": [...],
    "topHospitals": [...]
  }
}
```

#### Get Database Statistics
```bash
GET /api/healthcare-data/database-stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalRecords": 54968,
    "uniqueConditions": 6,
    "uniqueHospitals": 250,
    "conditions": ["cancer", "diabetes", "asthma", ...],
    "hospitals": ["Hospital A", "Hospital B", ...]
  }
}
```

### 3. Enhanced Chat Integration

The chatbot now provides context-aware responses using healthcare data:

#### Regular Chat (Automatic Context)
```bash
POST /api/chat/send
{
  "message": "I have diabetes",
  "language": "en",
  "sessionId": "optional-session-id"
}
```

Response:
```json
{
  "sessionId": "session-1234567890",
  "userMessage": "I have diabetes",
  "botResponse": "Diabetes management requires monitoring blood glucose levels regularly...\n\nBased on our healthcare database:\n- Average age of patients with diabetes: 52 years\n- Total patients tracked: 250\n- Average glucose level: 145.2\n- Average cholesterol: 210.3",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Chat with Patient Context
```bash
POST /api/chat/send-with-context
{
  "message": "What should I monitor?",
  "patientName": "Bobby Jackson",
  "language": "en",
  "sessionId": "optional-session-id"
}
```

### 4. Supported Health Conditions

The chatbot has enhanced responses for:
- Diabetes
- Cancer
- Asthma
- Hypertension
- Obesity
- Arthritis
- Hypertension

## Data Fields

### Basic Information
- `name`: Patient name
- `age`: Age in years
- `gender`: Male/Female/Other
- `blood_type`: Blood type (A+, B-, etc.)
- `medical_condition`: Primary health condition

### Hospital Information
- `date_of_admission`: Hospital admission date
- `doctor`: Attending physician
- `hospital`: Hospital name
- `insurance_provider`: Insurance company
- `billing_amount`: Total billing amount
- `room_number`: Hospital room
- `admission_type`: Urgent/Emergency/Elective
- `discharge_date`: Hospital discharge date

### Health Metrics
- `glucose`: Blood glucose level
- `blood_pressure`: BP reading
- `bmi`: Body Mass Index
- `oxygen_saturation`: O2 saturation percentage
- `cholesterol`: Total cholesterol
- `triglycerides`: Triglyceride level
- `hba1c`: Glycated hemoglobin

### Lifestyle Factors
- `smoking`: Smoking status (0-1)
- `alcohol`: Alcohol consumption (0-1)
- `physical_activity`: Activity level (hours/week)
- `diet_score`: Diet quality score (0-10)
- `family_history`: Family health history (0-1)
- `stress_level`: Stress level (0-10)
- `sleep_hours`: Average sleep per night

### Laboratory Results

#### Blood Chemistry
- `chem_glucose`: Glucose level (mg/dL)
- `chem_creatinine`: Kidney function
- `chem_bun`: Urea nitrogen
- `chem_sodium`: Sodium level
- `chem_potassium`: Potassium level
- `chem_calcium`: Calcium level

#### Blood Count
- `bc_hemoglobin`: Hemoglobin level
- `bc_hematocrit`: Hematocrit percentage
- `bc_wbc`: White blood cell count
- `bc_platelet_count`: Platelet count

#### Lipid Panel
- `lip_cholesterol_total`: Total cholesterol
- `lip_cholesterol_hdl`: HDL cholesterol (good)
- `lip_cholesterol_ldl`: LDL cholesterol (bad)
- `lip_triglycerides`: Triglycerides

## Security & Permissions

All endpoints require:
- **Authentication**: Valid JWT token in Authorization header
- **HTTPS**: Use HTTPS in production
- **Rate Limiting**: Default 100 requests per 15 minutes

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Workflows

### Workflow 1: Patient Lookup & Condition Stats
```bash
# 1. Search for patients with diabetes
curl "http://localhost:5000/api/healthcare-data/search?condition=diabetes&limit=5" \
  -H "Authorization: Bearer TOKEN"

# 2. Get statistics for diabetes
curl "http://localhost:5000/api/healthcare-data/stats/diabetes" \
  -H "Authorization: Bearer TOKEN"

# 3. Chat about diabetes
curl -X POST "http://localhost:5000/api/chat/send" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Patient has diabetes, what should we monitor?",
    "language": "en"
  }'
```

### Workflow 2: Hospital Performance Analysis
```bash
# 1. Get database statistics
curl "http://localhost:5000/api/healthcare-data/database-stats" \
  -H "Authorization: Bearer TOKEN"

# 2. Get insights filtered by condition
curl "http://localhost:5000/api/healthcare-data/insights?condition=cancer" \
  -H "Authorization: Bearer TOKEN"
```

### Workflow 3: Patient-Specific Guidance
```bash
# 1. Get patient data
curl "http://localhost:5000/api/healthcare-data/patient/Bobby%20Jackson" \
  -H "Authorization: Bearer TOKEN"

# 2. Chat with patient context
curl -X POST "http://localhost:5000/api/chat/send-with-context" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What recommendations for my health?",
    "patientName": "Bobby Jackson",
    "language": "en"
  }'
```

## Database Indexes

For optimal performance, the following indexes are created:

```javascript
// Search performance
{ medical_condition: 1, age: 1 }
{ hospital: 1 }
{ insurance_provider: 1 }

// Name-based lookups
{ name: 1 }
```

## Performance Tips

1. **Limit Results**: Always use `limit` parameter in search queries
2. **Use Filters**: Narrow down searches with specific criteria
3. **Cache Results**: Cache common queries on the frontend
4. **Batch Operations**: Use aggregation for large analyses

## Troubleshooting

### Import Fails
- Check CSV file format (headers required)
- Ensure file path is correct
- Verify MongoDB is running

### No Results in Search
- Check spelling of condition names
- Verify data was imported (check database-stats)
- Try broader search criteria

### Chatbot Not Using Healthcare Data
- Verify healthcare data was imported
- Check that the condition keyword matches (case-insensitive)
- Ensure JWT token is valid

## Future Enhancements

1. **Advanced Analytics**: Correlation analysis, predictive models
2. **Data Visualization**: Charts and graphs for insights
3. **Custom Reports**: Generate PDF reports for medical professionals
4. **Real-time Monitoring**: Integration with IoT health devices
5. **AI Integration**: ML-based patient risk assessment

## Support

For issues or questions, please contact your development team.
