document.addEventListener('DOMContentLoaded', function() {
    // Load saved language
    loadSavedLanguage();
    
    // Elements
    const openLoginBtn = document.getElementById('openLoginBtn');
    const openRegisterBtn = document.getElementById('openRegisterBtn');
    const authModal = document.getElementById('authModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const container = document.querySelector('.container');
    
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToLogin2 = document.getElementById('switchToLogin2');
    
    // Multi-step form elements
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn-form');
    const formSteps = document.querySelectorAll('.form-step');
    
    // User type toggles
    const userTypeButtons = document.querySelectorAll('.user-type-btn');
    
    // Password toggle buttons
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Date of Birth field formatting (dd-mm-yyyy)
    const dobField = document.getElementById('dob');
    if (dobField) {
        dobField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length >= 2) {
                value = value.slice(0, 2) + '-' + value.slice(2);
            }
            if (value.length >= 5) {
                value = value.slice(0, 5) + '-' + value.slice(5, 9);
            }
            e.target.value = value;
        });

        dobField.addEventListener('blur', function(e) {
            // Validate date format on blur
            const datePattern = /^\d{2}-\d{2}-\d{4}$/;
            if (e.target.value && !datePattern.test(e.target.value)) {
                showError('Please enter date in dd-mm-yyyy format');
                e.target.focus();
            }
        });
    }

    // Open modals
    openLoginBtn.addEventListener('click', () => {
        openModal('login');
    });

    openRegisterBtn.addEventListener('click', () => {
        openModal('signup');
    });

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal.classList.contains('show')) {
            closeModal();
        }
    });

    // Tab switching
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));
    
    // Form switching buttons
    if (switchToSignup) {
        switchToSignup.addEventListener('click', () => switchTab('signup'));
    }
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => switchTab('login'));
    }
    if (switchToLogin2) {
        switchToLogin2.addEventListener('click', () => switchTab('login'));
    }

    // User type selection
    userTypeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const container = this.closest('.user-type-toggle');
            container.querySelectorAll('.user-type-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Password toggle
    togglePasswordButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
    });

    // Multi-step form navigation
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStep = this.closest('.form-step');
            const nextStepNumber = parseInt(this.getAttribute('data-next'));
            
            console.log('Next button clicked. Current step:', currentStep.getAttribute('data-step'), 'Next step:', nextStepNumber);
            
            // Validate current step
            if (validateStep(currentStep)) {
                console.log('Validation passed, moving to step', nextStepNumber);
                goToStep(nextStepNumber);
            } else {
                console.log('Validation failed');
            }
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const prevStepNumber = parseInt(this.getAttribute('data-back'));
            console.log('Back button clicked. Moving to step:', prevStepNumber);
            goToStep(prevStepNumber);
        });
    });

    // Form submissions
    const loginFormData = document.getElementById('loginFormData');
    const signupFormData = document.getElementById('signupFormData');

    if (loginFormData) {
        loginFormData.addEventListener('submit', handleLogin);
    }

    if (signupFormData) {
        signupFormData.addEventListener('submit', handleSignup);
    }

    // Functions
    function openModal(type) {
        console.log('Opening modal with type:', type);
        console.log('Form steps available:', document.querySelectorAll('.form-step').length);
        
        // Add shrink-up animation to container
        container.classList.add('shrink-up');
        document.body.classList.add('auth-active');
        
        // Small delay for smooth transition
        setTimeout(() => {
            authModal.classList.add('show');
        }, 100);
        
        switchTab(type);
    }

    function closeModal() {
        authModal.classList.remove('show');
        
        // Wait for modal to fade out before removing shrink
        setTimeout(() => {
            container.classList.remove('shrink-up');
            document.body.classList.remove('auth-active');
            resetForms();
        }, 600);
    }

    function switchTab(type) {
        if (type === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
            // Reset to first step
            goToStep(1);
            updateStepIndicator(1);
        }
    }

    function goToStep(stepNumber) {
        console.log('goToStep called with:', stepNumber);
        console.log('Total form steps found:', formSteps.length);
        
        formSteps.forEach(step => {
            const currentStepNum = parseInt(step.getAttribute('data-step'));
            console.log('Processing step', currentStepNum, 'Target:', stepNumber);
            
            if (currentStepNum === stepNumber) {
                step.classList.add('active');
                console.log('Activated step', currentStepNum);
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update step indicator
        updateStepIndicator(stepNumber);
        
        // Scroll to top of modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }
    
    function updateStepIndicator(currentStep) {
        const stepDots = document.querySelectorAll('.step-dot');
        const stepLines = document.querySelectorAll('.step-line');
        
        stepDots.forEach((dot, index) => {
            const stepNum = parseInt(dot.getAttribute('data-step'));
            
            if (stepNum < currentStep) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (stepNum === currentStep) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });
        
        stepLines.forEach((line, index) => {
            if (index < currentStep - 1) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
    }

    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            let isEmpty = false;
            
            // Check based on input type
            if (input.type === 'checkbox') {
                isEmpty = !input.checked;
            } else if (input.tagName === 'SELECT') {
                isEmpty = !input.value || input.value === '';
            } else {
                isEmpty = !input.value || !input.value.trim();
            }
            
            if (isEmpty) {
                isValid = false;
                input.style.borderColor = '#EF4444';
                
                // Add a subtle shake animation
                input.style.animation = 'shake 0.3s';
                
                setTimeout(() => {
                    input.style.borderColor = '';
                    input.style.animation = '';
                }, 2000);
            }
        });

        if (!isValid) {
            showError('Please fill in all required fields');
        }

        return isValid;
    }

    function handleLogin(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';
        const userType = document.querySelector('#loginForm .user-type-btn.active').getAttribute('data-type');

        if (!email || !password) {
            showError('Please enter both email and password.');
            return;
        }

        console.log('Login attempt:', { email, userType });

        // Make API call to backend
        fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store user data with patientId from backend
                const userData = {
                    ...data.user,
                    loggedIn: true,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Show success message
                showSuccess('Login successful! Redirecting...');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                showError(data.message || 'Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            // Fallback to localStorage if backend is not available
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
            let user = registeredUsers[email];
            
            if (user) {
                // Update login status for existing user
                user.loggedIn = true;
                user.loginTime = new Date().toISOString();
                // Ensure patientId exists
                if (!user.patientId) {
                    user.patientId = `H-${Date.now().toString().slice(-6)}`;
                }
            } else {
                // Create minimal user object for demo/testing
                user = {
                    email: email,
                    userType: userType,
                    name: email.split('@')[0],
                    fullName: email.split('@')[0],
                    patientId: `H-${Date.now().toString().slice(-6)}`,
                    loggedIn: true,
                    loginTime: new Date().toISOString()
                };
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Show success message
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        });
    }

    function handleSignup(e) {
        e.preventDefault();
        
        // Get all form data - Personal Information
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('phoneNumber').value;
        const dobValue = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        
        // Convert dd-mm-yyyy to proper date format
        let dob = null;
        if (dobValue) {
            const dateParts = dobValue.split('-');
            if (dateParts.length === 3) {
                // Create date in yyyy-mm-dd format
                dob = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
        }
        
        // Health Information
        const bloodType = document.getElementById('bloodType').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const allergies = document.getElementById('allergies').value || '';
        const medicalConditions = document.getElementById('medicalConditions').value || '';
        
        // Emergency Contact & Security
        const emergencyName = document.getElementById('emergencyName').value;
        const emergencyPhone = document.getElementById('emergencyPhone').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const userType = document.querySelector('#signupForm .user-type-btn.active').getAttribute('data-type');

        // Validate passwords match
        if (password !== confirmPassword) {
            showError('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long!');
            return;
        }

        if (!agreeTerms) {
            showError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        // Create comprehensive user object
        const patientId = `H-${Date.now().toString().slice(-6)}`;
        const user = {
            name: fullName,
            // Personal Information
            fullName,
            email,
            phone,
            dob,
            gender,
            
            // Health Information
            bloodType,
            height: parseFloat(height),
            weight: parseFloat(weight),
            allergies,
            medicalConditions,
            
            // Emergency Contact
            emergencyContact: {
                name: emergencyName,
                phone: emergencyPhone
            },
            
            // System Information
            role: userType,
            patientId,
            password,
            loggedIn: true,
            registrationDate: new Date().toISOString()
        };

        // Here you would typically make an API call
        console.log('Signup attempt:', user);

        // Make API call to backend
        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store user data
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Store user in registered users database (local backup)
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
                registeredUsers[email] = data.user;
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                // Show success message
                showSuccess('Account created successfully! Redirecting...');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                showError(data.message || 'Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
            // Fallback to localStorage if backend is not available
            // Ensure patientId is included in stored user data
            const userWithId = { ...user, patientId };
            localStorage.setItem('currentUser', JSON.stringify(userWithId));
            localStorage.setItem('isLoggedIn', 'true');
            
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
            registeredUsers[email] = userWithId;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            
            showSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        });
    }

    function resetForms() {
        if (loginFormData) loginFormData.reset();
        if (signupFormData) signupFormData.reset();
        goToStep(1);
        updateStepIndicator(1);
        
        // Reset user type selections
        userTypeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.user-type-btn').forEach((btn, index) => {
            if (index === 0) btn.classList.add('active');
        });
    }

    function showError(message) {
        // Create custom toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-error';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #EF4444;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showSuccess(message) {
        // Create custom toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-success';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #10B981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        languageSelect.value = savedLang;
        
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
            // Update the selected value visually
            languageSelect.value = this.value;
        });
    }

    // Voice assist button
    const voiceAssistBtn = document.getElementById('voiceAssistBtn');
    if (voiceAssistBtn) {
        voiceAssistBtn.addEventListener('click', function() {
            alert('Voice Assist feature coming soon!');
        });
    }
});
