// Settings functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load saved language first
    loadSavedLanguage();
    
    // Load saved settings
    loadSettings();

    // Language settings
    const languageSettings = document.getElementById('languageSettings');
    const languageModal = document.getElementById('languageModal');
    const closeLanguageModal = document.getElementById('closeLanguageModal');
    const languageOptions = document.querySelectorAll('.language-option');

    languageSettings.addEventListener('click', () => {
        languageModal.classList.add('show');
    });

    closeLanguageModal.addEventListener('click', () => {
        languageModal.classList.remove('show');
    });

    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            languageModal.classList.remove('show');
        }
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            const langName = option.querySelector('.lang-name').textContent;
            
            // Remove selected class from all options
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Update display
            document.getElementById('currentLanguage').textContent = langName;
            
            // Change language using translation system
            changeLanguage(lang);
            
            // Close modal after short delay
            setTimeout(() => {
                languageModal.classList.remove('show');
            }, 300);
        });
    });

    // Accessibility settings
    const accessibilitySettings = document.getElementById('accessibilitySettings');
    const accessibilityToggle = document.getElementById('accessibilityToggle');

    accessibilityToggle.addEventListener('change', () => {
        const isEnabled = accessibilityToggle.checked;
        localStorage.setItem('accessibilityEnabled', isEnabled);
        
        if (isEnabled) {
            // Navigate to accessibility settings page
            window.location.href = 'accessibility-settings.html';
        }
    });

    // Navigate to accessibility settings when clicking the item (not toggle)
    accessibilitySettings.addEventListener('click', (e) => {
        if (!e.target.closest('.toggle-container')) {
            window.location.href = 'accessibility-settings.html';
        }
    });

    // Notifications settings
    const notificationsToggle = document.getElementById('notificationsToggle');

    notificationsToggle.addEventListener('change', () => {
        const isEnabled = notificationsToggle.checked;
        localStorage.setItem('notificationsEnabled', isEnabled);
        
        // Show feedback
        showToast(isEnabled ? 'Notifications enabled' : 'Notifications disabled');
        
        // Request notification permission if enabling
        if (isEnabled && 'Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showToast('Notification permission granted');
                } else {
                    notificationsToggle.checked = false;
                    localStorage.setItem('notificationsEnabled', false);
                    showToast('Notification permission denied');
                }
            });
        }
    });

    // About settings
    const aboutSettings = document.getElementById('aboutSettings');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModal = document.getElementById('closeAboutModal');

    aboutSettings.addEventListener('click', () => {
        aboutModal.classList.add('show');
    });

    closeAboutModal.addEventListener('click', () => {
        aboutModal.classList.remove('show');
    });

    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove('show');
        }
    });

    // About links
    const aboutLinks = document.querySelectorAll('.about-link');
    aboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent;
            showToast(`Opening ${linkText}...`);
        });
    });
});

// Load saved settings from localStorage
function loadSettings() {
    // Load language - get the current language and find its name
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Find the language name from the file
    const languageNames = {
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'hi': 'हिन्दी',
        'bn': 'বাংলা',
        'te': 'తెలుగు',
        'mr': 'मराठी',
        'ta': 'தமிழ்',
        'it': 'Italiano',
        'pt': 'Português',
        'zh': '中文'
    };
    
    const langName = languageNames[savedLang] || 'English';
    document.getElementById('currentLanguage').textContent = langName;
    
    // Select the language option
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === savedLang) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    // Load accessibility setting
    const accessibilityEnabled = localStorage.getItem('accessibilityEnabled') !== 'false';
    document.getElementById('accessibilityToggle').checked = accessibilityEnabled;

    // Load notifications setting
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    document.getElementById('notificationsToggle').checked = notificationsEnabled;
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
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideDown 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Apply settings globally
function applySettings() {
    // This function can be called from other pages to apply settings
    const accessibilityEnabled = localStorage.getItem('accessibilityEnabled') !== 'false';
    
    if (accessibilityEnabled) {
        // Apply accessibility settings
        const textSize = localStorage.getItem('textSize') || 'medium';
        const highContrast = localStorage.getItem('highContrast') === 'true';
        const voiceAssistance = localStorage.getItem('voiceAssistance') === 'true';
        const reducedAnimations = localStorage.getItem('reducedAnimations') === 'true';

        // Apply text size
        document.documentElement.style.fontSize = textSize === 'small' ? '14px' : textSize === 'large' ? '18px' : '16px';

        // Apply high contrast
        if (highContrast) {
            document.body.classList.add('high-contrast');
        }

        // Apply reduced animations
        if (reducedAnimations) {
            document.body.classList.add('reduced-animations');
        }
    }
}

// Export for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applySettings };
}
