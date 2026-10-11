document.addEventListener('DOMContentLoaded', function() {
    // Load saved language
    loadSavedLanguage();
    
    // Check authentication
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Get user data
    const rawUserData = localStorage.getItem('currentUser');
    let userData = {};

    if (rawUserData) {
        try {
            userData = JSON.parse(rawUserData);
        } catch {
            userData = {};
        }
    }
    const userName = localStorage.getItem('userName') || 'Chen';
    
    // Debug: Log user data
    console.log('User Data:', userData);
    
    // Load profile picture if exists
    const savedAvatar = localStorage.getItem('profilePicture');
    const profileAvatarImage = document.getElementById('profileAvatarImage');
    const profileAvatarIcon = document.getElementById('profileAvatarIcon');
    
    if (savedAvatar && profileAvatarImage && profileAvatarIcon) {
        profileAvatarImage.src = savedAvatar;
        profileAvatarImage.style.display = 'block';
        profileAvatarIcon.style.display = 'none';
    }

    // Load and display patient details
    loadPatientDetails(userData);
    
    // Function to calculate age from date of birth
    function calculateAge(dob) {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    // Function to load and display patient details
    function loadPatientDetails(userData) {
        console.log('Loading patient details:', userData);
        
        const profileName = document.getElementById('profileName');
        const profileAge = document.getElementById('profileAge');
        const profileGender = document.getElementById('profileGender');
        const conditionBadge = document.getElementById('conditionBadge');
        
        // Display full name
        if (profileName) {
            if (userData.fullName) {
                profileName.textContent = userData.fullName;
                console.log('Set name:', userData.fullName);
            } else {
                profileName.textContent = userData.name || 'User';
                console.log('Using fallback name');
            }
        }
        
        // Display age
        if (profileAge) {
            if (userData.dob) {
                const age = calculateAge(userData.dob);
                if (age !== null) {
                    profileAge.textContent = `${age} yrs`;
                    console.log('Set age:', age);
                } else {
                    profileAge.style.display = 'none';
                }
            } else {
                profileAge.style.display = 'none';
                console.log('No DOB available');
            }
        }
        
        // Display gender
        if (profileGender) {
            if (userData.gender) {
                const genderDisplay = userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1);
                profileGender.textContent = genderDisplay;
                console.log('Set gender:', genderDisplay);
            } else {
                profileGender.style.display = 'none';
                console.log('No gender available');
            }
        }
        
        // Display medical conditions or hide badge if none
        if (conditionBadge) {
            if (userData.medicalConditions && userData.medicalConditions.trim()) {
                // Extract first condition if multiple are listed
                const firstCondition = userData.medicalConditions.split(',')[0].trim();
                conditionBadge.textContent = firstCondition;
                conditionBadge.style.display = 'inline-flex';
                console.log('Set condition:', firstCondition);
            } else {
                conditionBadge.style.display = 'none';
                console.log('No medical conditions');
            }
        }
    }
    
    // Get elements
    const wellnessCards = document.querySelectorAll('.wellness-card');
    const aiAssistantBtn = document.getElementById('aiAssistantBtn');
    const navBtns = document.querySelectorAll('.nav-btn');

    // Wellness card click handlers
    wellnessCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardType = this.className.split(' ').find(cls => 
                cls.includes('-card') && cls !== 'wellness-card'
            )?.replace('-card', '');
            
            if (cardType) {
                handleWellnessCardClick(cardType);
            }
        });

        // Touch feedback
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98) translateY(-4px)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });

    function handleWellnessCardClick(cardType) {
        switch(cardType) {
            case 'breakfast':
            case 'lunch':
                // Navigate to lifestyle guidance for meal plans
                saveNavigation('lifestyle-guidance.html');
                window.location.href = 'lifestyle-guidance.html';
                break;
            case 'exercise':
                // Navigate to health reminders for exercise tracking
                saveNavigation('health-reminders.html');
                window.location.href = 'health-reminders.html';
                break;
            case 'hydration':
                // Navigate to health reminders for hydration tracking
                saveNavigation('health-reminders.html');
                window.location.href = 'health-reminders.html';
                break;
        }
    }

    // AI Assistant button handler
    if (aiAssistantBtn) {
        aiAssistantBtn.addEventListener('click', function() {
            saveNavigation('ai-chat.html');
            window.location.href = 'ai-chat.html';
        });

        // Floating button animation
        aiAssistantBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });

        aiAssistantBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }

    // Navigation button handlers
    navBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            
            if (page && page !== 'home.html') {
                navBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                saveNavigation(page);
                window.location.href = page;
            }
        });
    });

    // Set active navigation
    const currentPage = 'home.html';
    navBtns.forEach(btn => {
        if (btn.dataset.page === currentPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Save navigation history
    function saveNavigation(page) {
        const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
        history.push({
            page: page,
            timestamp: new Date().toISOString()
        });
        if (history.length > 50) {
            history.shift();
        }
        localStorage.setItem('navigationHistory', JSON.stringify(history));
    }

    // Track last visit
    const lastVisit = localStorage.getItem('lastHomeVisit');
    const now = new Date();
    localStorage.setItem('lastHomeVisit', now.toISOString());

    if (lastVisit) {
        const daysSinceLastVisit = Math.floor((now - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastVisit >= 1) {
            console.log(`Welcome back! It's been ${daysSinceLastVisit} day(s) since your last visit.`);
        }
    }

    // Load wellness card completion status from localStorage
    loadWellnessStatus();

    function loadWellnessStatus() {
        const today = new Date().toDateString();
        const wellnessStatus = JSON.parse(localStorage.getItem('wellnessStatus') || '{}');
        
        if (wellnessStatus.date !== today) {
            // Reset status for new day
            wellnessStatus.date = today;
            wellnessStatus.completed = {};
            localStorage.setItem('wellnessStatus', JSON.stringify(wellnessStatus));
        }
    }
});
