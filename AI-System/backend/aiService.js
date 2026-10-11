const fetch = require('node-fetch');
require('dotenv').config();

const HEALTHCARE_API_BASE_URL = process.env.HEALTHCARE_API_BASE_URL || 'http://localhost:5000/api/healthcare-data';
const HEALTHCARE_API_TOKEN = process.env.HEALTHCARE_API_TOKEN;

const CONDITION_KEYWORDS = [
  'diabetes',
  'cancer',
  'asthma',
  'hypertension',
  'obesity',
  'arthritis'
];

const getConditionFromMessage = (message) => {
  const lower = String(message || '').toLowerCase();
  return CONDITION_KEYWORDS.find((condition) => lower.includes(condition)) || null;
};

const fetchHealthcareJson = async (url) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(HEALTHCARE_API_TOKEN ? { Authorization: `Bearer ${HEALTHCARE_API_TOKEN}` } : {})
  };

  const res = await fetch(url, { headers });
  if (!res.ok) return null;

  const data = await res.json();
  return data?.data || null;
};

const getHealthcareContext = async (message, userData) => {
  const condition = getConditionFromMessage(message) || userData?.condition || null;
  const patientName = userData?.patientName || null;

  const context = { condition };

  try {
    if (condition) {
      const [stats, insights] = await Promise.all([
        fetchHealthcareJson(`${HEALTHCARE_API_BASE_URL}/stats/${encodeURIComponent(condition)}`),
        fetchHealthcareJson(`${HEALTHCARE_API_BASE_URL}/insights?condition=${encodeURIComponent(condition)}`)
      ]);

      if (stats) context.stats = stats;
      if (insights) context.insights = insights;
    }

    if (patientName) {
      const patient = await fetchHealthcareJson(`${HEALTHCARE_API_BASE_URL}/patient/${encodeURIComponent(patientName)}`);
      if (patient) context.patient = patient;
    }
  } catch {
    return null;
  }

  return Object.keys(context).length > 1 ? context : null;
};

const getAIResponse = async (message, memory, language, userData) => {
  const apiKey = process.env.OPENAI_API_KEY;

  const healthcareContext = await getHealthcareContext(message, userData);

  const prompt = `
You are MediConnect AI.

You are caring, human-like, and intelligent.

Rules:
- Speak naturally
- Be emotionally supportive
- Use past memory if useful
- Use user health data if relevant

Language: ${language}

User Data:
${JSON.stringify(userData)}

Healthcare Context (if available):
${JSON.stringify(healthcareContext)}

Memory:
${JSON.stringify(memory)}
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "I'm here 💙";

  } catch {
    return "Something went wrong 💔";
  }
};

module.exports = { getAIResponse };