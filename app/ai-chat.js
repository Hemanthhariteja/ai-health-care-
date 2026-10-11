document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const langSelector = document.getElementById('langSelector');
    const currentLang = document.getElementById('currentLang');

    let isRecording = false;
    let recognition = null;
    const userName = localStorage.getItem('userName') || 'John';
    const userLanguage = localStorage.getItem('language') || 'en';
    const aiApiUrl = localStorage.getItem('aiApiUrl') || 'http://localhost:5000/api/ai/chat';
    const userId = localStorage.getItem('userId') || 'defaultUser';

    currentLang.textContent = userLanguage === 'en' ? 'English' : 'Français';

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = userLanguage === 'fr' ? 'fr-FR' : 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            isRecording = false;
            voiceBtn.classList.remove('active');
        };

        recognition.onerror = function() {
            isRecording = false;
            voiceBtn.classList.remove('active');
        };

        recognition.onend = function() {
            isRecording = false;
            voiceBtn.classList.remove('active');
        };
    }

    langSelector.addEventListener('click', function() {
        const newLang = userLanguage === 'en' ? 'fr' : 'en';
        localStorage.setItem('language', newLang);
        currentLang.textContent = newLang === 'en' ? 'English' : 'Français';
        if (recognition) {
            recognition.lang = newLang === 'fr' ? 'fr-FR' : 'en-US';
        }
    });

    voiceBtn.addEventListener('click', function() {
        if (!recognition) {
            alert('Voice recognition is not supported in this browser.');
            return;
        }

        if (isRecording) {
            recognition.stop();
            isRecording = false;
            this.classList.remove('active');
        } else {
            recognition.start();
            isRecording = true;
            this.classList.add('active');
        }
    });

    sendBtn.addEventListener('click', function() {
        sendMessage();
    });

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        messageInput.value = '';

        saveChatMessage(message, 'user');

        const typingId = addTypingIndicator();
        try {
            const response = await fetch(aiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    language: userLanguage,
                    userId,
                    incognito: false,
                    userData: {
                        name: userName
                    }
                })
            });

            const data = await response.json();
            removeTypingIndicator(typingId);

            if (data?.type === 'command') {
                handleCommandResponse(data.command);
                return;
            }

            const botResponse = data?.reply || 'I\'m here to help 💙';
            addMessage(botResponse, 'bot');
            saveChatMessage(botResponse, 'bot');
        } catch {
            removeTypingIndicator(typingId);
            const botResponse = 'I\'m having trouble reaching the AI service right now.';
            addMessage(botResponse, 'bot');
            saveChatMessage(botResponse, 'bot');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'avatar bot-avatar';
            avatar.innerHTML = `
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#E0E8EC"/>
                    <circle cx="20" cy="18" r="6" fill="#7A9AA8"/>
                    <path d="M10 32C10 26 14 24 20 24C26 24 30 26 30 32" fill="#7A9AA8"/>
                </svg>
            `;
            messageDiv.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${sender}-bubble`;
        bubble.innerHTML = `<p>${text}</p>`;
        messageDiv.appendChild(bubble);

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addTypingIndicator() {
        const messageDiv = document.createElement('div');
        const typingId = `typing-${Date.now()}`;
        messageDiv.className = 'message bot-message';
        messageDiv.id = typingId;

        const avatar = document.createElement('div');
        avatar.className = 'avatar bot-avatar';
        avatar.innerHTML = `
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#E0E8EC"/>
                <circle cx="20" cy="18" r="6" fill="#7A9AA8"/>
                <path d="M10 32C10 26 14 24 20 24C26 24 30 26 30 32" fill="#7A9AA8"/>
            </svg>
        `;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble bot-bubble';
        bubble.innerHTML = '<p>Typing…</p>';

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        return typingId;
    }

    function removeTypingIndicator(typingId) {
        const typingNode = document.getElementById(typingId);
        if (typingNode) {
            typingNode.remove();
        }
    }

    function handleCommandResponse(command) {
        if (!command) return;

        if (command.action === 'NAVIGATE' && command.target) {
            window.location.href = command.target;
            return;
        }

        if (command.action === 'SOS') {
            window.location.href = '/sos-emergency.html';
        }
    }

    function saveChatMessage(message, sender) {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        chatHistory.push({
            message: message,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        if (chatHistory.length > 100) {
            chatHistory.shift();
        }
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
});
