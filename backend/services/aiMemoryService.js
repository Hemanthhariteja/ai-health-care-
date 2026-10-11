const memoryStore = {};

function getUserMemory(userId) {
  return memoryStore[userId] || [];
}

function saveUserMemory(userId, message, reply) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = [];
  }

  memoryStore[userId].push({ message, reply });

  if (memoryStore[userId].length > 10) {
    memoryStore[userId].shift();
  }
}

module.exports = { getUserMemory, saveUserMemory };
