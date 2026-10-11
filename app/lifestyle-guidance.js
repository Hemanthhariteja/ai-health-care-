document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const categoryContents = document.querySelectorAll('.category-content');
    const guidanceCards = document.querySelectorAll('.guidance-card');
    const addBtn = document.getElementById('addBtn');

    let activeCategory = 'diet';

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            categoryContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${category}-content`) {
                    content.classList.add('active');
                }
            });

            activeCategory = category;
            saveActiveTab(category);
        });
    });

    guidanceCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardText = this.querySelector('.card-text').textContent.trim();
            saveGuidanceAction(cardText, activeCategory);
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);

            showToast('Guidance saved to your daily routine');
        });
    });

    addBtn.addEventListener('click', function() {
        const customGuidance = prompt(`Add a new ${activeCategory} guidance:`);
        if (customGuidance && customGuidance.trim() !== '') {
            addCustomGuidance(customGuidance.trim(), activeCategory);
        }
    });

    function saveActiveTab(category) {
        localStorage.setItem('activeLifestyleTab', category);
    }

    function saveGuidanceAction(guidance, category) {
        const actions = JSON.parse(localStorage.getItem('guidanceActions') || '[]');
        actions.push({
            guidance: guidance,
            category: category,
            timestamp: new Date().toISOString()
        });
        if (actions.length > 100) {
            actions.shift();
        }
        localStorage.setItem('guidanceActions', JSON.stringify(actions));
    }

    function addCustomGuidance(text, category) {
        const customGuidances = JSON.parse(localStorage.getItem('customGuidances') || '{}');
        if (!customGuidances[category]) {
            customGuidances[category] = [];
        }
        
        customGuidances[category].push({
            text: text,
            created: new Date().toISOString()
        });
        
        localStorage.setItem('customGuidances', JSON.stringify(customGuidances));
        
        const activeContent = document.querySelector('.category-content.active .cards-grid');
        if (activeContent) {
            const newCard = document.createElement('div');
            newCard.className = 'guidance-card';
            newCard.innerHTML = `
                <div class="card-icon">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="20" fill="#E8F4F8" stroke="#7AB39D" stroke-width="2.5"/>
                        <path d="M32 22V32M22 32H42" stroke="#7AB39D" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <p class="card-text">${text}</p>
            `;
            
            newCard.addEventListener('click', function() {
                saveGuidanceAction(text, category);
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                showToast('Custom guidance saved');
            });
            
            activeContent.appendChild(newCard);
        }
        
        showToast('Custom guidance added successfully');
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
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2500);
    }

    const savedTab = localStorage.getItem('activeLifestyleTab');
    if (savedTab) {
        const savedTabBtn = document.querySelector(`[data-category="${savedTab}"]`);
        if (savedTabBtn) {
            savedTabBtn.click();
        }
    }

    const customGuidances = JSON.parse(localStorage.getItem('customGuidances') || '{}');
    Object.keys(customGuidances).forEach(category => {
        const guidances = customGuidances[category];
        const content = document.getElementById(`${category}-content`);
        if (content) {
            const grid = content.querySelector('.cards-grid');
            guidances.forEach(item => {
                const newCard = document.createElement('div');
                newCard.className = 'guidance-card';
                newCard.innerHTML = `
                    <div class="card-icon">
                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="20" fill="#E8F4F8" stroke="#7AB39D" stroke-width="2.5"/>
                            <path d="M32 22V32M22 32H42" stroke="#7AB39D" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <p class="card-text">${item.text}</p>
                `;
                
                newCard.addEventListener('click', function() {
                    saveGuidanceAction(item.text, category);
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                    showToast('Custom guidance saved');
                });
                
                grid.appendChild(newCard);
            });
        }
    });

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
    `;
    document.head.appendChild(style);
});
