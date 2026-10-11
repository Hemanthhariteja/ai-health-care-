document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const rawUserData = localStorage.getItem('currentUser');
    let currentUser = {};

    if (rawUserData) {
        try {
            currentUser = JSON.parse(rawUserData);
        } catch {
            currentUser = {};
        }
    }
    
    if (!isLoggedIn || !currentUser || Object.keys(currentUser).length === 0) {
        // Redirect to login if not authenticated
        console.warn('User not logged in, redirecting to index.html');
        window.location.href = 'index.html';
        return;
    }
    
    const languageToggle = document.getElementById('languageToggle');
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const privacyToggle = document.getElementById('privacyToggle');
    const deleteItem = document.querySelector('.delete-item');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const profileName = document.getElementById('profileName');
    const patientId = document.getElementById('patientId');
    
    // Profile picture elements
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarImage = document.getElementById('avatarImage');
    const avatarIcon = document.getElementById('avatarIcon');

    const settings = {
        language: localStorage.getItem('languagePreference') === 'true' || false,
        accessibility: localStorage.getItem('accessibilitySettings') === 'true' || false,
        privacy: localStorage.getItem('dataPrivacy') === 'true' || false
    };

    function loadUserProfile() {
        try {
            // Get user data from currentUser object
            let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            
            console.log('Loading user profile:', currentUser);
            
            // Check if user data exists
            if (!currentUser || Object.keys(currentUser).length === 0) {
                console.warn('No user data found in localStorage');
                if (profileName) {
                    profileName.textContent = 'Guest User';
                }
                if (patientId) {
                    patientId.textContent = 'Not Available';
                }
                return;
            }
            
            // Use fullName from signup or fallback to name, email, or default
            const userName = currentUser.fullName || 
                           currentUser.name || 
                           (currentUser.email ? currentUser.email.split('@')[0] : 'User');
            
            console.log('User name resolved to:', userName);
            
            // Get or generate patient ID
            let userId = currentUser.patientId;
            if (!userId) {
                // Generate a unique patient ID based on timestamp
                userId = `H-${Date.now().toString().slice(-6)}`;
                
                // Update currentUser with patientId
                currentUser.patientId = userId;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('Generated new patient ID:', userId);
            }
            
            // Update the DOM elements
            if (profileName) {
                profileName.textContent = userName;
                console.log('Profile name set to:', userName);
            }
            if (patientId) {
                patientId.textContent = userId;
                console.log('Patient ID set to:', userId);
            }
            
            // Load profile picture if exists
            const savedAvatar = currentUser.avatar || localStorage.getItem('profilePicture');
            if (savedAvatar && avatarImage && avatarIcon) {
                avatarImage.src = savedAvatar;
                avatarImage.style.display = 'block';
                avatarIcon.style.display = 'none';
            }
            
            console.log('Profile loaded successfully');
        } catch (error) {
            console.error('Error loading user profile:', error);
            if (profileName) {
                profileName.textContent = 'Error Loading Profile';
            }
            if (patientId) {
                patientId.textContent = 'Error';
            }
        }
    }
    
    // Profile picture upload functionality
    if (uploadAvatarBtn && avatarInput) {
        uploadAvatarBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Image size should be less than 5MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                        const imageData = event.target.result;
                    
                    // Save to localStorage
                    localStorage.setItem('profilePicture', imageData);
                    
                    // Update currentUser object with avatar
                    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                    currentUser.avatar = imageData;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Display the image
                    avatarImage.src = imageData;
                    avatarImage.style.display = 'block';
                    avatarIcon.style.display = 'none';
                    
                    showToast('Profile picture updated successfully!');
                };
                reader.readAsDataURL(file);
            } else {
                showToast('Please select a valid image file');
            }
        });
    }

    function initializeToggles() {
        if (languageToggle && settings.language) {
            languageToggle.classList.add('active');
        }
        if (accessibilityToggle && settings.accessibility) {
            accessibilityToggle.classList.add('active');
        }
        if (privacyToggle && settings.privacy) {
            privacyToggle.classList.add('active');
        }
    }

    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            settings.language = !settings.language;
            languageToggle.classList.toggle('active');
            localStorage.setItem('languagePreference', settings.language);
            
            showToast(settings.language ? 'Multi-language support enabled' : 'Multi-language support disabled');
        });
    }

    if (accessibilityToggle) {
        accessibilityToggle.addEventListener('click', function() {
            settings.accessibility = !settings.accessibility;
            accessibilityToggle.classList.toggle('active');
            localStorage.setItem('accessibilitySettings', settings.accessibility);
            
            showToast(settings.accessibility ? 'Accessibility features enabled' : 'Accessibility features disabled');

            if (settings.accessibility) {
                document.body.style.fontSize = '110%';
            } else {
                document.body.style.fontSize = '100%';
            }
        });
    }

    if (privacyToggle) {
        privacyToggle.addEventListener('click', function() {
            settings.privacy = !settings.privacy;
            privacyToggle.classList.toggle('active');
            localStorage.setItem('dataPrivacy', settings.privacy);
            
            showToast(settings.privacy ? 'Enhanced privacy mode enabled' : 'Enhanced privacy mode disabled');

            if (settings.privacy) {
                console.log('Privacy controls activated: Data collection minimized');
            }
        });
    }

    if (deleteItem && deleteModal) {
        deleteItem.addEventListener('click', function() {
            deleteModal.classList.add('visible');
        });
    }

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteModal.classList.remove('visible');
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteAllUserData();
        });
    }

    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                deleteModal.classList.remove('visible');
            }
        });
    }

    function deleteAllUserData() {
        const keysToDelete = [
            'userName',
            'currentUser',
            'isLoggedIn',
            'patientId',
            'profilePicture',
            'chatHistory',
            'medicalReports',
            'guidanceActions',
            'customGuidances',
            'healthReminders',
            'mentalHealthChat',
            'emergencyLogs',
            'languagePreference',
            'accessibilitySettings',
            'dataPrivacy',
            'language',
            'textSize',
            'voiceAssist',
            'darkMode',
            'activeLifestyleTab'
        ];

        keysToDelete.forEach(key => {
            localStorage.removeItem(key);
        });

        deleteModal.classList.remove('visible');

        showDeletionConfirmation();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #2C5571;
            color: white;
            padding: 14px 24px;
            border-radius: 16px;
            font-size: 15px;
            font-weight: 500;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    function showDeletionConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 32px;
                border-radius: 24px;
                text-align: center;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            ">
                <svg style="width: 60px; height: 60px; margin-bottom: 16px;" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" stroke="#6B9F7F" stroke-width="4" fill="white"/>
                    <path d="M30 50L43 63L70 36" stroke="#6B9F7F" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h2 style="font-size: 20px; color: #2C5571; font-weight: 700; margin-bottom: 8px;">All data deleted</h2>
                <p style="font-size: 15px; color: #5A7686;">Redirecting to login...</p>
            </div>
        `;
        
        document.body.appendChild(confirmation);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translate(-50%, -20px);
                opacity: 0;
            }
            to {
                transform: translate(-50%, 0);
                opacity: 1;
            }
        }
        @keyframes slideUp {
            from {
                transform: translate(-50%, 0);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    loadUserProfile();
    initializeToggles();

    document.addEventListener('keydown', function(e) {
        if (deleteModal && e.key === 'Escape' && deleteModal.classList.contains('visible')) {
            deleteModal.classList.remove('visible');
        }
    });
});
