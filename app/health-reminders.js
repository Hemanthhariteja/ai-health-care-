document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    const remindersList = document.querySelector('.reminders-list');
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');

    const defaultReminders = [
        {
            id: 1,
            title: 'Make your meds',
            time: '8:00 AM Daily',
            icon: 'meds',
            color: 'blue',
            enabled: true
        },
        {
            id: 2,
            title: 'Drink water',
            time: 'Every 2 hours',
            icon: 'water',
            color: 'green',
            enabled: true
        },
        {
            id: 3,
            title: 'Exercise stretching',
            time: '6:00 PM',
            icon: 'exercise',
            color: 'orange',
            enabled: true
        },
        {
            id: 4,
            title: "Doctor's visit",
            time: 'Nov 15, 10:00 AM',
            icon: 'calendar',
            color: 'purple',
            enabled: true
        }
    ];

    let reminders = JSON.parse(localStorage.getItem('healthReminders')) || defaultReminders;

    toggleSwitches.forEach((toggle, index) => {
        toggle.addEventListener('change', function() {
            const reminder = reminders[index];
            if (reminder) {
                reminder.enabled = this.checked;
                saveReminders();
                
                if (this.checked) {
                    scheduleNotification(reminder);
                    showToast(`Reminder "${reminder.title}" enabled`);
                } else {
                    showToast(`Reminder "${reminder.title}" disabled`);
                }
            }
        });

        if (reminders[index]) {
            toggle.checked = reminders[index].enabled;
        }
    });

    addBtn.addEventListener('click', function() {
        showAddReminderModal();
    });

    function showAddReminderModal() {
        const title = prompt('Reminder title:');
        if (!title || title.trim() === '') return;

        const time = prompt('Reminder time (e.g., "9:00 AM Daily" or "Every 3 hours"):');
        if (!time || time.trim() === '') return;

        const newReminder = {
            id: Date.now(),
            title: title.trim(),
            time: time.trim(),
            icon: 'custom',
            color: getRandomColor(),
            enabled: true
        };

        reminders.push(newReminder);
        saveReminders();
        addReminderToDOM(newReminder);
        showToast('Reminder added successfully');
    }

    function addReminderToDOM(reminder) {
        const card = document.createElement('div');
        card.className = `reminder-card ${reminder.color}-border`;
        card.innerHTML = `
            <div class="reminder-icon ${reminder.color}-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2.5" opacity="0.5"/>
                    <path d="M24 16V24L28 28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="reminder-content">
                <h2 class="reminder-title">${reminder.title}</h2>
                <p class="reminder-time">${reminder.time}</p>
            </div>
            <div class="reminder-time-right">
                <p class="time-text">${reminder.time}</p>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" ${reminder.enabled ? 'checked' : ''}>
                <span class="slider ${reminder.color}-slider"></span>
            </label>
        `;

        const toggle = card.querySelector('input');
        toggle.addEventListener('change', function() {
            reminder.enabled = this.checked;
            saveReminders();
            showToast(this.checked ? 'Reminder enabled' : 'Reminder disabled');
        });

        remindersList.appendChild(card);
    }

    function getRandomColor() {
        const colors = ['blue', 'green', 'orange', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function saveReminders() {
        localStorage.setItem('healthReminders', JSON.stringify(reminders));
    }

    function scheduleNotification(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            // In a real app, this would schedule actual notifications
            console.log(`Notification scheduled for: ${reminder.title} at ${reminder.time}`);
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notifications enabled');
                }
            });
        }
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
        }, 2500);
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
    `;
    document.head.appendChild(style);

    reminders.forEach(reminder => {
        if (reminder.enabled) {
            scheduleNotification(reminder);
        }
    });
});
