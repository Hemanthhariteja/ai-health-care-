document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const anonymousBtn = document.getElementById('anonymousBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    let isRecording = false;
    let recognition = null;
    let isAnonymous = false;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

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

    anonymousBtn.addEventListener('click', function() {
        isAnonymous = !isAnonymous;
        
        if (isAnonymous) {
            this.style.background = '#F5F0FA';
            this.style.borderColor = '#9B8FB5';
            showToast('Anonymous mode enabled. Your conversations are private.');
        } else {
            this.style.background = 'white';
            this.style.borderColor = '#E0E8EC';
            showToast('Anonymous mode disabled.');
        }
    });

    deleteBtn.addEventListener('click', function() {
        const confirmed = confirm('Are you sure you want to delete this conversation? This action cannot be undone.');
        
        if (confirmed) {
            const messages = chatContainer.querySelectorAll('.message');
            messages.forEach(msg => {
                msg.style.animation = 'slideOut 0.3s ease';
            });

            setTimeout(() => {
                chatContainer.innerHTML = '';
                localStorage.removeItem('mentalHealthChat');
                showToast('Conversation deleted');
                
                addMessage("It's okay to feel this way. I'm here to listen without judgment.", 'bot');
            }, 400);
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        messageInput.value = '';

        saveChatMessage(message, 'user');

        setTimeout(() => {
            const botResponse = generateMentalHealthResponse(message);
            addMessage(botResponse, 'bot');
            saveChatMessage(botResponse, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'avatar bot-avatar';
            avatar.innerHTML = `
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#D5D8E8"/>
                    <circle cx="20" cy="18" r="6" fill="#9B8FB5"/>
                    <path d="M10 32C10 26 14 24 20 24C26 24 30 26 30 32" fill="#9B8FB5"/>
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

    function generateMentalHealthResponse(userMessage) {
        const responses = {
            anxious: [
                "It's completely normal to feel anxious. Remember to take deep breaths and focus on the present moment.",
                "Anxiety can feel overwhelming. Would you like to try a breathing exercise together?",
                "Your feelings are valid. Let's work through this together, one step at a time."
            ],
            sad: [
                "I hear you. It's okay to feel sad. These feelings are temporary, even when they feel heavy.",
                "Remember, it's okay to not be okay sometimes. You're not alone in this.",
                "Your emotions are valid. Would talking about what's making you feel this way help?"
            ],
            stress: [
                "Stress can be challenging. Have you been able to take any breaks for yourself today?",
                "Remember to be kind to yourself. You're doing the best you can.",
                "Let's identify what's causing the most stress. Sometimes naming it helps us manage it better."
            ],
            lonely: [
                "Feeling lonely is difficult, but you're not alone. I'm here with you.",
                "Connection is important. Have you considered reaching out to someone you trust?",
                "Your feelings matter. It's brave of you to share this."
            ],
            default: [
                "Thank you for sharing that with me. Your feelings are important and valid.",
                "I'm here to listen without judgment. Would you like to tell me more?",
                "Remember, you're taking a positive step by talking about this. How can I support you?"
            ]
        };

        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
            return responses.anxious[Math.floor(Math.random() * responses.anxious.length)];
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('unhappy')) {
            return responses.sad[Math.floor(Math.random() * responses.sad.length)];
        } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
            return responses.stress[Math.floor(Math.random() * responses.stress.length)];
        } else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
            return responses.lonely[Math.floor(Math.random() * responses.lonely.length)];
        } else {
            return responses.default[Math.floor(Math.random() * responses.default.length)];
        }
    }

    function saveChatMessage(message, sender) {
        if (isAnonymous) return;

        const chatHistory = JSON.parse(localStorage.getItem('mentalHealthChat') || '[]');
        chatHistory.push({
            message: message,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        if (chatHistory.length > 50) {
            chatHistory.shift();
        }
        localStorage.setItem('mentalHealthChat', JSON.stringify(chatHistory));
    }

    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #2C5571;
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideUp 0.3s ease;
            max-width: 80%;
            text-align: center;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(20px);
                opacity: 0;
            }
        }
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-100px);
            }
        }
    `;
    document.head.appendChild(style);

    chatContainer.scrollTop = chatContainer.scrollHeight;
});
