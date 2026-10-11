document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const patientBtn = document.getElementById('patientBtn');
    const doctorBtn = document.getElementById('doctorBtn');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.querySelector('.submit-btn');

    let isSignupMode = true;
    let userType = 'patient';

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signup') {
        isSignupMode = true;
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }

    loginBtn.addEventListener('click', function() {
        isSignupMode = false;
        this.classList.add('active');
        signupBtn.classList.remove('active');
        submitBtn.textContent = 'Log In';
    });

    signupBtn.addEventListener('click', function() {
        isSignupMode = true;
        this.classList.add('active');
        loginBtn.classList.remove('active');
        submitBtn.textContent = 'Sign Up';
    });

    patientBtn.addEventListener('click', function() {
        userType = 'patient';
        this.classList.add('active');
        doctorBtn.classList.remove('active');
    });

    doctorBtn.addEventListener('click', function() {
        userType = 'doctor';
        this.classList.add('active');
        patientBtn.classList.remove('active');
    });

    emailInput.addEventListener('input', function() {
        validateEmail();
    });

    emailInput.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            validateEmail();
        }
    });

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const inputWrapper = emailInput.closest('.input-wrapper');
        
        if (email === '') {
            inputWrapper.classList.remove('error');
            emailError.classList.remove('visible');
            return true;
        }
        
        if (!emailRegex.test(email)) {
            inputWrapper.classList.add('error');
            emailError.classList.add('visible');
            return false;
        } else {
            inputWrapper.classList.remove('error');
            emailError.classList.remove('visible');
            return true;
        }
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isEmailValid = validateEmail();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!isEmailValid || email === '' || password === '') {
            if (email === '') {
                emailInput.closest('.input-wrapper').classList.add('error');
            }
            return;
        }

        const userData = {
            email: email,
            userType: userType,
            mode: isSignupMode ? 'signup' : 'login',
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', email.split('@')[0]);

        submitBtn.textContent = isSignupMode ? 'Signing up...' : 'Logging in...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.location.href = 'home.html';
        }, 800);
    });

    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset link would be sent to your email address.');
    });

    // Scroll animation for sign up section
    const signupSection = document.getElementById('signupSection');
    const scrollToSignupBtn = document.getElementById('scrollToSignup');

    // Intersection Observer for scroll animation
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    if (signupSection) {
        observer.observe(signupSection);
    }

    // Scroll to signup button click
    if (scrollToSignupBtn) {
        scrollToSignupBtn.addEventListener('click', function() {
            isSignupMode = true;
            signupBtn.classList.add('active');
            loginBtn.classList.remove('active');
            submitBtn.textContent = 'Sign Up';
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Focus on email input after scroll
            setTimeout(() => {
                emailInput.focus();
            }, 500);
        });
    }
});
