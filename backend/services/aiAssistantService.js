const fetch = require('node-fetch');
const HealthcareDataService = require('./healthcareDataService');

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

const getHealthcareContext = async (message, userData) => {
  const condition = getConditionFromMessage(message) || userData?.condition || null;
  const patientName = userData?.patientName || null;

  const context = { condition };

  try {
    if (condition) {
      const [stats, insights] = await Promise.all([
        HealthcareDataService.getStatsByCondition(condition),
        HealthcareDataService.getInsights({ condition })
      ]);

      if (stats) context.stats = stats;
      if (insights) context.insights = insights;
    }

    if (patientName) {
      const patient = await HealthcareDataService.getPatientByName(patientName);
      if (patient) context.patient = patient;
    }
  } catch {
    return null;
  }

  return Object.keys(context).length > 1 ? context : null;
};

const getAIResponse = async (message, memory, language, userData) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return 'AI service is not configured yet.';
  }

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
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "I'm here to help.";
  } catch {
    return 'Something went wrong while contacting the AI service.';
  }
};

module.exports = { getAIResponse };
