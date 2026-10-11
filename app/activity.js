// Activity Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeActivity();
});

function initializeActivity() {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Load user-specific activity data
    loadAppointments();
    loadRecentActivity();
    loadHealthStats();

    // Add event listeners
    setupEventListeners();
}

function loadAppointments() {
    // Load appointments from localStorage if available
    const appointments = JSON.parse(localStorage.getItem('userAppointments')) || [];
    
    if (appointments.length > 0) {
        renderAppointments(appointments);
    }
}

function renderAppointments(appointments) {
    const appointmentsList = document.querySelector('.appointments-list');
    
    // Sort by date (upcoming first)
    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); // Show only first 3

    if (upcomingAppointments.length === 0) return;

    // Clear default content and render user's appointments
    appointmentsList.innerHTML = upcomingAppointments.map(apt => `
        <div class="appointment-card">
            <div class="appointment-date">
                <div class="date-number">${new Date(apt.date).getDate()}</div>
                <div class="date-month">${new Date(apt.date).toLocaleString('en', { month: 'short' })}</div>
            </div>
            <div class="appointment-details">
                <h3 class="appointment-title">${apt.doctor}</h3>
                <p class="appointment-subtitle">${apt.type}</p>
                <div class="appointment-time">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>${apt.time}</span>
                </div>
            </div>
            <button class="appointment-action" onclick="location.href='book-appointment.html'">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `).join('');
}

function loadRecentActivity() {
    const activityData = JSON.parse(localStorage.getItem('userActivity')) || [];
    
    if (activityData.length > 0) {
        renderActivity(activityData);
    }
}

function renderActivity(activities) {
    const activityList = document.querySelector('.activity-list');
    
    // Show most recent activities
    const recentActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    if (recentActivities.length === 0) return;

    activityList.innerHTML = recentActivities.map(activity => {
        const iconClass = getActivityIconClass(activity.type);
        const iconSvg = getActivityIconSvg(activity.type);
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    ${iconSvg}
                </div>
                <div class="activity-content">
                    <h3 class="activity-title">${activity.title}</h3>
                    <p class="activity-subtitle">${activity.description}</p>
                    <span class="activity-time">${formatActivityTime(activity.timestamp)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getActivityIconClass(type) {
    const classMap = {
        'medication': 'medication',
        'report': 'report',
        'chat': 'chat',
        'exercise': 'exercise',
        'appointment': 'appointment'
    };
    return classMap[type] || 'medication';
}

function getActivityIconSvg(type) {
    const svgMap = {
        'medication': `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="5" width="8" height="14" rx="2" stroke="white" stroke-width="2"/>
                <path d="M12 9V15M9 12H15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `,
        'report': `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5 2 4 3 4 4V20C4 21 5 22 6 22H18C19 22 20 21 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        'chat': `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        'exercise': `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="2" fill="white"/>
                <path d="M12 8V14M9 11L15 11M9 14L12 18M15 14L12 18M12 18V20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        'appointment': `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" stroke-width="2"/>
                <path d="M3 10H21M8 3V7M16 3V7" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M8 14L10 16L14 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
    };
    return svgMap[type] || svgMap['medication'];
}

function formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `Today, ${date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
        return `Yesterday, ${date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
        return date.toLocaleDateString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    }
}

function loadHealthStats() {
    const healthStats = JSON.parse(localStorage.getItem('userHealthStats')) || null;
    
    if (healthStats) {
        updateStatsDisplay(healthStats);
    }
}

function updateStatsDisplay(stats) {
    if (stats.steps) {
        const stepsValue = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (stepsValue) stepsValue.textContent = stats.steps.toLocaleString();
    }
    
    if (stats.medications) {
        const medsValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (medsValue) medsValue.textContent = stats.medications;
    }
    
    if (stats.sleep) {
        const sleepValue = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (sleepValue) sleepValue.textContent = stats.sleep;
    }
    
    if (stats.heartRate) {
        const heartValue = document.querySelector('.stat-card:nth-child(4) .stat-value');
        if (heartValue) heartValue.textContent = stats.heartRate;
    }
}

function setupEventListeners() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add click analytics
    document.querySelectorAll('.appointment-action, .view-all-btn, .stat-card').forEach(element => {
        element.addEventListener('click', function() {
            trackActivityInteraction(this.className);
        });
    });
}

function trackActivityInteraction(elementClass) {
    // Log user interactions for analytics
    const interactions = JSON.parse(localStorage.getItem('activityInteractions')) || [];
    interactions.push({
        element: elementClass,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('activityInteractions', JSON.stringify(interactions));
}

// Helper function to add activity (can be called from other pages)
function addActivity(type, title, description) {
    const activities = JSON.parse(localStorage.getItem('userActivity')) || [];
    activities.unshift({
        type: type,
        title: title,
        description: description,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.pop();
    }
    
    localStorage.setItem('userActivity', JSON.stringify(activities));
}

// Make addActivity available globally
window.addActivity = addActivity;
