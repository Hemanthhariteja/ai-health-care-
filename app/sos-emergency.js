document.addEventListener('DOMContentLoaded', function() {
    const sosCircle = document.getElementById('sosCircle');
    const confirmationModal = document.getElementById('confirmationModal');
    const yesBtn = document.getElementById('yesBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalStatus = document.getElementById('modalStatus');
    const checkAnimation = document.getElementById('checkAnimation');
    const modalButtons = document.querySelector('.modal-buttons');

    let emergencyTriggered = false;

    sosCircle.addEventListener('click', function() {
        if (!emergencyTriggered) {
            confirmationModal.classList.add('visible');
        }
    });

    cancelBtn.addEventListener('click', function() {
        confirmationModal.classList.remove('visible');
        resetModal();
    });

    yesBtn.addEventListener('click', function() {
        triggerEmergency();
    });

    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal && !emergencyTriggered) {
            confirmationModal.classList.remove('visible');
            resetModal();
        }
    });

    function triggerEmergency() {
        emergencyTriggered = true;

        modalButtons.style.display = 'none';
        document.querySelector('.modal-title').style.display = 'none';

        modalStatus.classList.add('visible');
        checkAnimation.classList.add('visible');

        const emergencyData = {
            timestamp: new Date().toISOString(),
            location: 'Unknown',
            userId: localStorage.getItem('userName') || 'Unknown',
            status: 'Emergency triggered'
        };

        saveEmergencyLog(emergencyData);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    emergencyData.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log('Emergency location:', emergencyData.location);
                },
                error => {
                    console.log('Location access denied');
                }
            );
        }

        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }

        console.log('EMERGENCY ALERT TRIGGERED', emergencyData);

        setTimeout(() => {
            confirmationModal.classList.remove('visible');
            showConfirmationToast();
            
            setTimeout(() => {
                resetModal();
                emergencyTriggered = false;
            }, 3000);
        }, 3000);
    }

    function resetModal() {
        modalButtons.style.display = 'flex';
        document.querySelector('.modal-title').style.display = 'block';
        modalStatus.classList.remove('visible');
        checkAnimation.classList.remove('visible');
    }

    function saveEmergencyLog(data) {
        const logs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
        logs.push(data);
        if (logs.length > 10) {
            logs.shift();
        }
        localStorage.setItem('emergencyLogs', JSON.stringify(logs));
    }

    function showConfirmationToast() {
        const toast = document.createElement('div');
        toast.textContent = 'Emergency services have been notified. Help is on the way.';
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2C5571;
            color: white;
            padding: 20px 32px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 500;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            text-align: center;
            max-width: 80%;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2500);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmationModal.classList.contains('visible') && !emergencyTriggered) {
            confirmationModal.classList.remove('visible');
            resetModal();
        }
    });

    window.addEventListener('beforeunload', function(e) {
        if (emergencyTriggered) {
            e.preventDefault();
            e.returnValue = 'Emergency is in progress. Are you sure you want to leave?';
            return e.returnValue;
        }
    });
});
