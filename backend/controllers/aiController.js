const { getAIResponse } = require('../services/aiAssistantService');
const { handleCommand } = require('../utils/aiCommandHandler');
const { getUserMemory, saveUserMemory } = require('../services/aiMemoryService');

const chat = async (req, res) => {
  const {
    message,
    language = 'en',
    userId = 'defaultUser',
    incognito = false,
    userData = {}
  } = req.body || {};

  if (!message) {
    return res.status(400).json({ type: 'error', message: 'Message is required.' });
  }

  const command = handleCommand(message);
  if (command) {
    return res.json({ type: 'command', command });
  }

  const memory = incognito ? [] : getUserMemory(userId);
  const reply = await getAIResponse(message, memory, language, userData);

  if (!incognito) {
    saveUserMemory(userId, message, reply);
  }

  return res.json({ type: 'chat', reply });
};

module.exports = { chat };
