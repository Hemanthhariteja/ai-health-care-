document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Get all feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    const navBtns = document.querySelectorAll('.nav-btn');
    const floatingAiBtn = document.querySelector('.floating-ai-btn');

    // Feature card click handlers
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            // The onclick in HTML will handle navigation
            // This adds touch feedback
            this.style.transform = 'scale(0.98) translateY(-4px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // Floating AI button handler
    if (floatingAiBtn) {
        floatingAiBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            saveNavigation('ai-chat.html');
        });
    }

    // Navigation button handlers
    navBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const page = this.getAttribute('onclick');
            if (page && page.includes('.html')) {
                const pageName = page.match(/['\"]([^'\"]+\.html)['\"]/) [1];
                if (pageName) {
                    saveNavigation(pageName);
                }
            }
        });
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

    // Add ripple effect on touch
    featureCards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(122, 179, 157, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            
            const rect = this.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            ripple.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: 'translate(-50%, -50%) scale(4)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            }).onfinish = () => ripple.remove();
        });
    });

    // Track page view
    const pageView = {
        page: 'features.html',
        timestamp: new Date().toISOString()
    };
    
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
    pageViews.push(pageView);
    if (pageViews.length > 100) {
        pageViews.shift();
    }
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
});
