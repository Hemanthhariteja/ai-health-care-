const express = require('express');
const router = express.Router();

const { getAIResponse } = require('./aiService');
const { handleCommand } = require('./commandHandler');
const { getUserMemory, saveUserMemory } = require('./memoryService');

router.post('/chat', async (req, res) => {
  const {
    message,
    language = "en",
    userId = "defaultUser",
    incognito = false,
    userData = {}
  } = req.body;

  // COMMAND
  const command = handleCommand(message);
  if (command) {
    return res.json({ type: "command", command });
  }

  // MEMORY
  const memory = incognito ? [] : getUserMemory(userId);

  // AI RESPONSE
  const reply = await getAIResponse(message, memory, language, userData);

  // SAVE MEMORY
  if (!incognito) {
    saveUserMemory(userId, message, reply);
  }

  res.json({
    type: "chat",
    reply
  });
});

module.exports = router;