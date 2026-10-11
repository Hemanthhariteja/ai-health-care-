document.addEventListener('DOMContentLoaded', function() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const cardDetailsSection = document.getElementById('cardDetailsSection');
    const upiDetailsSection = document.getElementById('upiDetailsSection');
    const netbankingDetailsSection = document.getElementById('netbankingDetailsSection');
    const walletDetailsSection = document.getElementById('walletDetailsSection');
    const payBtn = document.getElementById('payBtn');
    const paymentModal = document.getElementById('paymentModal');
    const loader = document.getElementById('loader');
    const successContent = document.getElementById('successContent');
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const providerName = document.getElementById('providerName');
    const appointmentDateTime = document.getElementById('appointmentDateTime');

    let selectedPaymentMethod = 'card';

    function loadAppointmentDetails() {
        const lastAppointment = JSON.parse(localStorage.getItem('lastAppointment') || 'null');
        
        if (lastAppointment) {
            providerName.textContent = lastAppointment.doctor.name || 'Dr. Anya Sharma';
            
            const dateObj = new Date(lastAppointment.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
            appointmentDateTime.textContent = `${formattedDate}, ${lastAppointment.time}`;
        }
    }

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedPaymentMethod = this.getAttribute('data-method');
            
            cardDetailsSection.style.display = 'none';
            upiDetailsSection.style.display = 'none';
            netbankingDetailsSection.style.display = 'none';
            walletDetailsSection.style.display = 'none';
            
            switch(selectedPaymentMethod) {
                case 'card':
                    cardDetailsSection.style.display = 'block';
                    break;
                case 'upi':
                    upiDetailsSection.style.display = 'block';
                    break;
                case 'netbanking':
                    netbankingDetailsSection.style.display = 'block';
                    break;
                case 'wallet':
                    walletDetailsSection.style.display = 'block';
                    break;
            }
        });
    });

    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    payBtn.addEventListener('click', function() {
        if (!validatePayment()) {
            return;
        }

        processPayment();
    });

    function validatePayment() {
        switch(selectedPaymentMethod) {
            case 'card':
                const cardNum = cardNumber.value.replace(/\s/g, '');
                const expiry = expiryDate.value;
                const cvvNum = cvv.value;

                if (cardNum.length !== 16) {
                    showToast('Please enter a valid 16-digit card number');
                    return false;
                }

                if (expiry.length !== 5 || !expiry.includes('/')) {
                    showToast('Please enter expiry date in MM/YY format');
                    return false;
                }

                if (cvvNum.length !== 3) {
                    showToast('Please enter a valid 3-digit CVV');
                    return false;
                }
                break;

            case 'upi':
                const upiId = document.getElementById('upiId').value.trim();
                if (!upiId || !upiId.includes('@')) {
                    showToast('Please enter a valid UPI ID');
                    return false;
                }
                break;

            case 'netbanking':
                const bank = document.getElementById('bankSelect').value;
                if (!bank) {
                    showToast('Please select your bank');
                    return false;
                }
                break;

            case 'wallet':
                const wallet = document.getElementById('walletSelect').value;
                if (!wallet) {
                    showToast('Please select your wallet');
                    return false;
                }
                break;
        }

        return true;
    }

    function processPayment() {
        paymentModal.classList.add('visible');
        loader.style.display = 'flex';
        successContent.style.display = 'none';

        setTimeout(() => {
            loader.style.display = 'none';
            successContent.style.display = 'block';

            const paymentData = {
                paymentId: 'PAY-' + Date.now().toString().slice(-8),
                method: selectedPaymentMethod,
                amount: 75.00,
                currency: 'USD',
                status: 'success',
                timestamp: new Date().toISOString(),
                appointmentId: localStorage.getItem('lastAppointment') ? 
                              JSON.parse(localStorage.getItem('lastAppointment')).appointmentId : null
            };

            savePaymentRecord(paymentData);

            if (paymentData.appointmentId) {
                updateAppointmentStatus(paymentData.appointmentId);
            }
        }, 2500);
    }

    function savePaymentRecord(payment) {
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        payments.push(payment);
        
        if (payments.length > 20) {
            payments.shift();
        }
        
        localStorage.setItem('payments', JSON.stringify(payments));
        console.log('Payment recorded:', payment);
    }

    function updateAppointmentStatus(appointmentId) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = appointments.map(apt => {
            if (apt.appointmentId === appointmentId) {
                return { ...apt, status: 'confirmed', paymentStatus: 'paid' };
            }
            return apt;
        });
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
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

    loadAppointmentDetails();

    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal && successContent.style.display !== 'block') {
            e.stopPropagation();
        }
    });
});
