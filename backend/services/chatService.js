const Chat = require('../models/Chat');
const HealthcareDataService = require('./healthcareDataService');

const generateBotResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  const responses = {
    energy: [
      "Low energy can be caused by various factors. Make sure you're getting 7-8 hours of sleep, staying hydrated, and eating balanced meals.",
      "Consider checking your iron levels and vitamin D. Regular exercise, even light walks, can also boost energy levels.",
      "If fatigue persists for more than 2 weeks, it's important to consult with a healthcare provider."
    ],
    sleep: [
      "Good sleep hygiene is essential. Try maintaining a consistent sleep schedule, avoiding screens before bed, and keeping your bedroom cool and dark.",
      "Consider relaxation techniques like meditation or deep breathing exercises before sleep.",
      "If you have persistent sleep issues, consult a healthcare provider as it may indicate an underlying condition."
    ],
    stress: [
      "Managing stress is crucial for overall health. Try techniques like meditation, yoga, or regular exercise.",
      "Taking regular breaks, maintaining work-life balance, and talking to someone you trust can help.",
      "If stress becomes overwhelming, professional counseling can be very beneficial."
    ],
    pain: [
      "Pain should not be ignored. If you're experiencing persistent or severe pain, please consult a healthcare provider.",
      "For minor aches, rest, ice/heat therapy, and over-the-counter pain relievers may help.",
      "Document when the pain occurs, its intensity, and any triggers to share with your doctor."
    ],
    diet: [
      "A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats.",
      "Stay hydrated by drinking 8-10 glasses of water daily.",
      "Consider consulting a nutritionist for personalized dietary advice based on your health goals."
    ],
    diabetes: [
      "Diabetes management requires monitoring blood glucose levels regularly. Track your diet, exercise, and medication as prescribed.",
      "Maintain a healthy weight, eat balanced meals with controlled carbohydrates, and stay active.",
      "Regular check-ups with your healthcare provider are essential. Current data shows patients with diabetes benefit from consistent monitoring."
    ],
    cancer: [
      "Cancer treatment varies greatly by type and stage. It's crucial to follow your oncologist's recommendations closely.",
      "Support groups can be beneficial for emotional wellbeing during cancer treatment.",
      "Regular follow-up appointments and screening as recommended by your healthcare team are important."
    ],
    hypertension: [
      "Blood pressure management involves lifestyle changes and often medication. Reduce salt intake, exercise regularly, and manage stress.",
      "Monitor your blood pressure regularly and keep a log to share with your doctor.",
      "According to data patterns, many hypertension patients benefit from consistent medication adherence and lifestyle modifications."
    ],
    cholesterol: [
      "Cholesterol management involves diet, exercise, and sometimes medication. Reduce saturated fats and increase fiber intake.",
      "Regular testing helps track your cholesterol levels. Current data shows most patients benefit from regular monitoring.",
      "Consult with your healthcare provider for personalized recommendations based on your lipid profile."
    ]
  };

  for (const [keyword, responseArray] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
  }

  return "I'm here to provide general health information. For specific medical advice, please consult with a healthcare professional. How can I assist you today?";
};

/**
 * Enhanced response generation with healthcare data
 */
const generateEnhancedResponse = async (message, condition = null) => {
  try {
    let baseResponse = generateBotResponse(message);

    // If a specific condition is mentioned, fetch relevant statistics
    if (condition) {
      const stats = await HealthcareDataService.getStatsByCondition(condition);
      if (stats) {
        baseResponse += `\n\nBased on our healthcare database:\n`;
        baseResponse += `- Average age of patients with ${stats._id}: ${Math.round(stats.avgAge)} years\n`;
        baseResponse += `- Total patients tracked: ${stats.count}\n`;
        baseResponse += `- Average glucose level: ${stats.avgGlucose ? Math.round(stats.avgGlucose * 10) / 10 : 'N/A'}\n`;
        baseResponse += `- Average cholesterol: ${stats.avgCholesterol ? Math.round(stats.avgCholesterol * 10) / 10 : 'N/A'}\n`;
      }
    }

    return baseResponse;
  } catch (error) {
    console.error('Error generating enhanced response:', error);
    return generateBotResponse(message);
  }
};

/**
 * Extract medical condition from message
 */
const extractCondition = (message) => {
  const conditions = ['diabetes', 'cancer', 'asthma', 'hypertension', 'obesity', 'arthritis'];
  const lowerMessage = message.toLowerCase();

  for (const condition of conditions) {
    if (lowerMessage.includes(condition)) {
      return condition;
    }
  }

  return null;
};

const sendMessage = async (userId, message, language = 'en', sessionId = null) => {
  const newSessionId = sessionId || `session-${Date.now()}`;

  let chat = await Chat.findOne({ userId, sessionId: newSessionId, isActive: true });

  if (!chat) {
    chat = new Chat({
      userId,
      sessionId: newSessionId,
      language,
      messages: []
    });
  }

  chat.messages.push({
    role: 'user',
    content: message,
    language,
    timestamp: new Date()
  });

  // Extract condition and generate enhanced response
  const condition = extractCondition(message);
  const botResponse = await generateEnhancedResponse(message, condition);

  chat.messages.push({
    role: 'bot',
    content: botResponse,
    language,
    timestamp: new Date()
  });

  await chat.save();

  return {
    sessionId: newSessionId,
    userMessage: message,
    botResponse,
    timestamp: new Date()
  };
};

/**
 * Send message with healthcare data context
 */
const sendMessageWithContext = async (userId, message, language = 'en', sessionId = null, patientName = null) => {
  const newSessionId = sessionId || `session-${Date.now()}`;

  let chat = await Chat.findOne({ userId, sessionId: newSessionId, isActive: true });

  if (!chat) {
    chat = new Chat({
      userId,
      sessionId: newSessionId,
      language,
      messages: [],
      contextData: {}
    });
  }

  // If patient name is provided, fetch patient data
  if (patientName) {
    try {
      const patientData = await HealthcareDataService.getPatientByName(patientName);
      if (patientData) {
        chat.contextData = {
          patientName: patientData.name,
          condition: patientData.medical_condition,
          age: patientData.age,
          glucose: patientData.glucose,
          bmi: patientData.bmi,
          cholesterol: patientData.cholesterol
        };
      }
    } catch (error) {
      console.error('Error fetching patient context:', error);
    }
  }

  chat.messages.push({
    role: 'user',
    content: message,
    language,
    timestamp: new Date()
  });

  const condition = chat.contextData?.condition || extractCondition(message);
  const botResponse = await generateEnhancedResponse(message, condition);

  chat.messages.push({
    role: 'bot',
    content: botResponse,
    language,
    timestamp: new Date()
  });

  await chat.save();

  return {
    sessionId: newSessionId,
    userMessage: message,
    botResponse,
    context: chat.contextData,
    timestamp: new Date()
  };
};

/**
 * Get healthcare insights for conversation
 */
const getHealthcareInsights = async (condition = null) => {
  try {
    const insights = await HealthcareDataService.getInsights({ condition });
    return insights;
  } catch (error) {
    console.error('Error fetching insights:', error);
    return null;
  }
};

const getChatHistory = async (userId, limit = 50) => {
  const chats = await Chat.find({ userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);

  return chats;
};

const deleteChatHistory = async (userId, sessionId = null) => {
  if (sessionId) {
    await Chat.findOneAndUpdate(
      { userId, sessionId },
      { isActive: false }
    );
  } else {
    await Chat.updateMany(
      { userId },
      { isActive: false }
    );
  }

  return { message: 'Chat history deleted successfully' };
};

module.exports = {
  sendMessage,
  sendMessageWithContext,
  getChatHistory,
  deleteChatHistory,
  generateEnhancedResponse,
  getHealthcareInsights,
  extractCondition
};
