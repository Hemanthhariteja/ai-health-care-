// Accessibility Settings functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load saved language first
    loadSavedLanguage();
    
    // Load saved settings
    loadAccessibilitySettings();

    // Text Size Slider
    const textSizeSlider = document.getElementById('textSizeSlider');
    textSizeSlider.addEventListener('input', () => {
        const size = textSizeSlider.value;
        applyTextSize(size);
        localStorage.setItem('textSize', size);
    });

    // Contrast Toggle
    const contrastToggle = document.getElementById('contrastToggle');
    contrastToggle.addEventListener('change', () => {
        const isEnabled = contrastToggle.checked;
        applyContrast(isEnabled);
        localStorage.setItem('highContrast', isEnabled);
    });

    // Voice Assistance Toggle
    const voiceToggle = document.getElementById('voiceToggle');
    voiceToggle.addEventListener('change', () => {
        const isEnabled = voiceToggle.checked;
        localStorage.setItem('voiceAssistance', isEnabled);
        
        if (isEnabled) {
            showToast('Voice assistance enabled');
            // Initialize speech synthesis
            initVoiceAssistance();
        } else {
            showToast('Voice assistance disabled');
            // Stop speech synthesis
            stopVoiceAssistance();
        }
    });

    // Reduced Animations Toggle
    const animationsToggle = document.getElementById('animationsToggle');
    animationsToggle.addEventListener('change', () => {
        const isEnabled = animationsToggle.checked;
        applyReducedAnimations(isEnabled);
        localStorage.setItem('reducedAnimations', isEnabled);
    });
});

// Load saved accessibility settings
function loadAccessibilitySettings() {
    // Load text size
    const textSize = localStorage.getItem('textSize') || '2';
    document.getElementById('textSizeSlider').value = textSize;
    applyTextSize(textSize);

    // Load contrast
    const highContrast = localStorage.getItem('highContrast') === 'true';
    document.getElementById('contrastToggle').checked = highContrast;
    applyContrast(highContrast);

    // Load voice assistance
    const voiceAssistance = localStorage.getItem('voiceAssistance') === 'true';
    document.getElementById('voiceToggle').checked = voiceAssistance;
    if (voiceAssistance) {
        initVoiceAssistance();
    }

    // Load reduced animations
    const reducedAnimations = localStorage.getItem('reducedAnimations') === 'true';
    document.getElementById('animationsToggle').checked = reducedAnimations;
    applyReducedAnimations(reducedAnimations);
}

// Apply text size
function applyTextSize(size) {
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    
    switch (size) {
        case '1':
            document.body.classList.add('text-small');
            document.documentElement.style.fontSize = '14px';
            break;
        case '2':
            document.body.classList.add('text-medium');
            document.documentElement.style.fontSize = '16px';
            break;
        case '3':
            document.body.classList.add('text-large');
            document.documentElement.style.fontSize = '18px';
            break;
    }
}

// Apply high contrast
function applyContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

// Apply reduced animations
function applyReducedAnimations(enabled) {
    if (enabled) {
        document.body.classList.add('reduced-animations');
    } else {
        document.body.classList.remove('reduced-animations');
    }
}

// Voice Assistance
let speechSynthesis = window.speechSynthesis;
let voiceEnabled = false;

function initVoiceAssistance() {
    voiceEnabled = true;
    
    // Add click event listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, .settings-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            if (voiceEnabled) {
                const text = getElementText(e.target);
                if (text) {
                    speak(text);
                }
            }
        });
    });
    
    // Announce page title on load
    speak('Accessibility Settings page');
}

function stopVoiceAssistance() {
    voiceEnabled = false;
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
}

function getElementText(element) {
    // Get meaningful text from element
    if (element.getAttribute('aria-label')) {
        return element.getAttribute('aria-label');
    } else if (element.textContent) {
        return element.textContent.trim();
    } else if (element.alt) {
        return element.alt;
    }
    return '';
}

function speak(text) {
    if (!speechSynthesis || !text) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Speak
    speechSynthesis.speak(utterance);
}

// Toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10000;
        animation: toastSlideUp 0.3s ease;
    `;

    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes toastSlideDown {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
        }
    `;
    if (!document.querySelector('style[data-toast]')) {
        style.setAttribute('data-toast', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Announce with voice if enabled
    if (voiceEnabled) {
        speak(message);
    }

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideDown 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Apply settings globally (can be called from other pages)
function applyGlobalAccessibilitySettings() {
    const textSize = localStorage.getItem('textSize') || '2';
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const reducedAnimations = localStorage.getItem('reducedAnimations') === 'true';
    const voiceAssistance = localStorage.getItem('voiceAssistance') === 'true';

    applyTextSize(textSize);
    applyContrast(highContrast);
    applyReducedAnimations(reducedAnimations);
    
    if (voiceAssistance) {
        initVoiceAssistance();
    }
}

// Export for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applyGlobalAccessibilitySettings };
}
