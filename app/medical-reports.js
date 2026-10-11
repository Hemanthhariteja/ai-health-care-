document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressFill = progressBar.querySelector('.progress-fill');
    const processingText = document.getElementById('processingText');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const langSelector = document.getElementById('langSelector');

    const userLanguage = localStorage.getItem('language') || 'en';
    const darkMode = localStorage.getItem('darkMode') === 'true';

    if (darkMode) {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleFileUpload(this.files[0]);
        }
    });

    darkModeToggle.addEventListener('change', function() {
        const isDark = this.checked;
        localStorage.setItem('darkMode', isDark);
        document.body.classList.toggle('dark-mode', isDark);
    });

    langSelector.addEventListener('click', function() {
        const newLang = userLanguage === 'en' ? 'fr' : 'en';
        localStorage.setItem('language', newLang);
        updateLanguage(newLang);
    });

    function handleFileUpload(file) {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF, JPEG, or PNG file.');
            return;
        }

        if (file.size > maxSize) {
            alert('File size must be less than 10MB.');
            return;
        }

        uploadArea.style.pointerEvents = 'none';
        uploadArea.style.opacity = '0.6';
        
        progressBar.classList.add('visible');
        processingText.classList.add('visible');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    progressBar.classList.remove('visible');
                    processingText.classList.remove('visible');
                    uploadArea.style.pointerEvents = 'auto';
                    uploadArea.style.opacity = '1';
                    
                    saveReport(file);
                }, 500);
            }
            progressFill.style.width = progress + '%';
        }, 200);
    }

    function saveReport(file) {
        const reports = JSON.parse(localStorage.getItem('medicalReports') || '[]');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const report = {
                id: Date.now(),
                name: file.name,
                type: file.type,
                size: file.size,
                uploadDate: new Date().toISOString(),
                data: e.target.result,
                status: 'Normal',
                summary: 'Your lab results are within normal ranges'
            };
            
            reports.push(report);
            if (reports.length > 20) {
                reports.shift();
            }
            
            localStorage.setItem('medicalReports', JSON.stringify(reports));
            
            alert('Report uploaded and processed successfully!');
        };
        
        reader.readAsDataURL(file);
    }

    function updateLanguage(lang) {
        const translations = {
            en: {
                title: 'Medical Reports',
                upload: 'Drag & drop files or click to upload',
                formats: 'Supported formats: PDF, JPEG, PNG',
                processing: 'Processing your report...',
                results: 'Results',
                summary: 'Simplified Summary',
                details: 'Detailed Explanation'
            },
            fr: {
                title: 'Rapports Médicaux',
                upload: 'Glissez-déposez ou cliquez pour télécharger',
                formats: 'Formats supportés: PDF, JPEG, PNG',
                processing: 'Traitement de votre rapport...',
                results: 'Résultats',
                summary: 'Résumé Simplifié',
                details: 'Explication Détaillée'
            }
        };

        const t = translations[lang];
        document.querySelector('.page-title').textContent = t.title;
        document.querySelector('.upload-text').textContent = t.upload;
        document.querySelector('.upload-formats').textContent = t.formats;
        document.querySelector('#processingText').textContent = t.processing;
        document.querySelector('.results-title').textContent = t.results;
    }

    const savedReports = JSON.parse(localStorage.getItem('medicalReports') || '[]');
    console.log(`You have ${savedReports.length} saved report(s)`);
});
