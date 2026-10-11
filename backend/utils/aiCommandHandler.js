const handleCommand = (message) => {
  const msg = String(message || '').toLowerCase();

  if (msg.includes('open profile')) {
    return { action: 'NAVIGATE', target: '/profile.html' };
  }

  if (msg.includes('book appointment')) {
    return { action: 'NAVIGATE', target: '/book-appointment.html' }; 
  }

  if (msg.includes('call emergency')) {
    return { action: 'SOS' };
  }

  return null;
};

module.exports = { handleCommand };
