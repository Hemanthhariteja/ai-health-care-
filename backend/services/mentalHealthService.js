const MentalHealthChat = require('../models/MentalHealthChat');

const detectEmotion = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.match(/\b(anxious|anxiety|worried|nervous|panic)\b/)) {
    return 'anxious';
  }
  if (lowerMessage.match(/\b(sad|depressed|down|unhappy|crying)\b/)) {
    return 'sad';
  }
  if (lowerMessage.match(/\b(stress|stressed|overwhelmed|pressure)\b/)) {
    return 'stressed';
  }
  if (lowerMessage.match(/\b(lonely|alone|isolated|loneliness)\b/)) {
    return 'lonely';
  }
  if (lowerMessage.match(/\b(happy|good|great|wonderful|excellent)\b/)) {
    return 'happy';
  }

  return 'neutral';
};

const generateMentalHealthResponse = (message, emotion) => {
  const responses = {
    anxious: [
      "I understand you're feeling anxious. Remember, it's okay to feel this way. Try taking slow, deep breaths.",
      "Anxiety can be overwhelming. Would you like to try a grounding technique? Focus on 5 things you can see around you.",
      "You're not alone in feeling anxious. Consider talking to a mental health professional who can provide personalized support."
    ],
    sad: [
      "I'm here for you. It's completely valid to feel sad sometimes. Would you like to talk about what's troubling you?",
      "Sadness is a natural emotion. Be kind to yourself during this time. Have you tried reaching out to someone you trust?",
      "Your feelings matter. If sadness persists, speaking with a counselor can be really helpful."
    ],
    stressed: [
      "Stress can be very challenging. Have you tried taking short breaks throughout your day?",
      "Managing stress is important for your wellbeing. Consider activities like walking, listening to music, or talking to someone.",
      "Remember to prioritize self-care. It's not selfish—it's necessary for your mental health."
    ],
    lonely: [
      "Feeling lonely is difficult. Remember, reaching out—even online—can help. You've taken a good step by being here.",
      "Loneliness is something many people experience. Have you considered joining a group or community with shared interests?",
      "You matter, and your feelings are valid. Consider connecting with friends, family, or a support group."
    ],
    happy: [
      "I'm glad you're feeling good! Keep nurturing those positive feelings.",
      "That's wonderful to hear! Remember to celebrate these moments.",
      "It's great that you're in a good place. Keep taking care of yourself!"
    ],
    neutral: [
      "I'm here to listen and support you. This is a safe space. How are you feeling today?",
      "Thank you for sharing with me. Would you like to talk about anything specific?",
      "Remember, this conversation is confidential and judgment-free. I'm here whenever you need."
    ]
  };

  const emotionResponses = responses[emotion] || responses.neutral;
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};

const sendMentalHealthMessage = async (userId, message, isAnonymous = false, sessionId = null) => {
  const newSessionId = sessionId || `mental-session-${Date.now()}`;
  const emotion = detectEmotion(message);

  let chat;

  if (!isAnonymous) {
    chat = await MentalHealthChat.findOne({ userId, sessionId: newSessionId, isActive: true });

    if (!chat) {
      chat = new MentalHealthChat({
        userId,
        sessionId: newSessionId,
        isAnonymous: false,
        messages: [],
        severity: 'low'
      });
    }

    chat.messages.push({
      role: 'user',
      content: message,
      emotion,
      timestamp: new Date()
    });
  }

  const botResponse = generateMentalHealthResponse(message, emotion);

  if (!isAnonymous && chat) {
    chat.messages.push({
      role: 'bot',
      content: botResponse,
      emotion: 'neutral',
      timestamp: new Date()
    });

    await chat.save();
  }

  return {
    sessionId: newSessionId,
    userMessage: message,
    botResponse,
    emotion,
    timestamp: new Date(),
    isAnonymous
  };
};

const getMentalHealthHistory = async (userId) => {
  const chats = await MentalHealthChat.find({ userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(10);

  return chats;
};

const deleteMentalHealthChat = async (userId, sessionId = null) => {
  if (sessionId) {
    await MentalHealthChat.findOneAndUpdate(
      { userId, sessionId },
      { isActive: false }
    );
  } else {
    await MentalHealthChat.updateMany(
      { userId },
      { isActive: false }
    );
  }

  return { message: 'Mental health chat history deleted successfully' };
};

module.exports = {
  sendMentalHealthMessage,
  getMentalHealthHistory,
  deleteMentalHealthChat
};
