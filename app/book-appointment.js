document.addEventListener('DOMContentLoaded', function() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    const dateTimeSection = document.getElementById('dateTimeSection');
    const notesSection = document.getElementById('notesSection');
    const selectedInfo = document.getElementById('selectedInfo');
    const confirmBtn = document.getElementById('confirmBtn');
    const appointmentDate = document.getElementById('appointmentDate');
    const timeSlots = document.querySelectorAll('.time-slot:not(.unavailable)');
    const appointmentNotes = document.getElementById('appointmentNotes');
    const confirmationModal = document.getElementById('confirmationModal');
    const proceedToPayment = document.getElementById('proceedToPayment');
    const infoDoctor = document.getElementById('infoDoctor');
    const infoDateTime = document.getElementById('infoDateTime');
    const modalDescription = document.getElementById('modalDescription');

    let selectedDoctor = null;
    let selectedDate = null;
    let selectedTime = null;

    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    appointmentDate.setAttribute('min', minDate);

    const maxDate = new Date(today.setMonth(today.getMonth() + 3));
    appointmentDate.setAttribute('max', maxDate.toISOString().split('T')[0]);

    doctorCards.forEach(card => {
        card.addEventListener('click', function() {
            const availability = this.getAttribute('data-availability');
            
            if (availability === 'Not Available') {
                showToast('This doctor is currently not available. Please select another doctor.');
                return;
            }

            doctorCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            selectedDoctor = {
                name: this.getAttribute('data-doctor'),
                specialty: this.getAttribute('data-specialty'),
                availability: availability
            };

            dateTimeSection.style.display = 'block';
            notesSection.style.display = 'block';

            updateSelectedInfo();

            setTimeout(() => {
                dateTimeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        });
    });

    appointmentDate.addEventListener('change', function() {
        selectedDate = this.value;
        updateSelectedInfo();
    });

    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedTime = this.getAttribute('data-time');
            updateSelectedInfo();
        });
    });

    function updateSelectedInfo() {
        if (selectedDoctor && selectedDate && selectedTime) {
            const dateObj = new Date(selectedDate);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });

            infoDoctor.textContent = `${selectedDoctor.name} - ${selectedDoctor.specialty}`;
            infoDateTime.textContent = `${formattedDate}, ${selectedTime}`;

            selectedInfo.style.display = 'flex';
            confirmBtn.style.display = 'block';

            setTimeout(() => {
                confirmBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        } else if (selectedDoctor) {
            infoDoctor.textContent = `${selectedDoctor.name} - ${selectedDoctor.specialty}`;
            infoDateTime.textContent = 'Please select date and time';
            selectedInfo.style.display = 'flex';
            confirmBtn.style.display = 'none';
        }
    }

    confirmBtn.addEventListener('click', function() {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            showToast('Please select doctor, date, and time');
            return;
        }

        const appointment = {
            doctor: selectedDoctor,
            date: selectedDate,
            time: selectedTime,
            notes: appointmentNotes.value.trim(),
            patientName: localStorage.getItem('userName') || 'John Smith',
            patientId: localStorage.getItem('patientId') || 'H-7890',
            appointmentId: 'APT-' + Date.now().toString().slice(-6),
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        saveAppointment(appointment);

        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });

        modalDescription.textContent = `Your appointment with ${selectedDoctor.name} is scheduled for ${formattedDate} at ${selectedTime}.`;

        confirmationModal.classList.add('visible');
    });

    proceedToPayment.addEventListener('click', function() {
        window.location.href = 'payment.html';
    });

    function saveAppointment(appointment) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        
        if (appointments.length > 20) {
            appointments.shift();
        }
        
        localStorage.setItem('appointments', JSON.stringify(appointments));
        localStorage.setItem('lastAppointment', JSON.stringify(appointment));
        
        console.log('Appointment saved:', appointment);
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
            max-width: 85%;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
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

    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            e.stopPropagation();
        }
    });
});
