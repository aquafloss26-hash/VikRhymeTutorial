// Main Application
class StellarSignupApp {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.animationFrameId = null;
        this.initializeApp();
    }

    // Initialize all components
    initializeApp() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Stellar Signup App Initialized');
            this.setupComponents();
            this.bindEvents();
            this.restoreState();
        });
    }

    // Setup all UI components
    setupComponents() {
        this.setupTheme();
        this.setupFormSteps();
        this.setupPasswordStrength();
        this.setupPasswordToggle();
        this.setupBioCounter();
        this.setupRealTimeStats();
        this.setupColorPicker();
        this.setupPasswordChart();
        this.setupDemoMode();
        this.setupValidation();
    }

    // Bind event listeners
    bindEvents() {
        // Form submission
        const form = document.getElementById('signupForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

        // Window resize for responsive adjustments
        window.addEventListener('resize', () => this.handleResize());
    }

    // Restore previous state
    restoreState() {
        // Restore saved form data
        const savedData = localStorage.getItem('stellarFormData');
        if (savedData) {
            try {
                this.formData = JSON.parse(savedData);
                this.populateFormFromData();
            } catch (e) {
                console.warn('Could not restore form data:', e);
            }
        }
    }

    // ========== THEME MANAGEMENT ==========
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const themeIcon = themeToggle.querySelector('i');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('stellarTheme') || (prefersDark ? 'dark' : 'light');
        
        // Apply saved theme
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Theme toggle click handler
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('stellarTheme', isDark ? 'dark' : 'light');
            
            // Animate toggle
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 500);
        });
    }

    // ========== FORM STEP MANAGEMENT ==========
    setupFormSteps() {
        const steps = document.querySelectorAll('.form-step');
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        const progressBar = document.getElementById('formProgress');
        
        if (!steps.length) return;

        // Initialize first step
        this.showStep(1);
        this.updateProgressBar(1);

        // Next button handlers
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const nextStep = parseInt(button.dataset.next);
                if (this.validateCurrentStep()) {
                    this.navigateToStep(nextStep);
                }
            });
        });

        // Previous button handlers
        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const prevStep = parseInt(button.dataset.prev);
                this.navigateToStep(prevStep);
            });
        });
    }

    navigateToStep(step) {
        if (step < 1 || step > 3) return;

        this.showStep(step);
        this.updateProgressBar(step);
        this.currentStep = step;
        
        // Smooth animation
        this.animateStepTransition();
        
        // Auto-save progress
        this.saveFormProgress();
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(el => {
            el.classList.remove('active');
        });

        // Show current step
        const currentStepEl = document.getElementById(`step${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }

        // Update progress labels
        document.querySelectorAll('.progress-labels span').forEach((label, index) => {
            label.classList.toggle('active', index < step);
        });
    }

    updateProgressBar(step) {
        const progressBar = document.getElementById('formProgress');
        if (progressBar) {
            const progress = ((step - 1) / 3) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    animateStepTransition() {
        const currentStep = document.querySelector('.form-step.active');
        if (currentStep) {
            currentStep.style.animation = 'none';
            requestAnimationFrame(() => {
                currentStep.style.animation = 'slideIn 0.5s ease';
            });
        }
    }

    // ========== PASSWORD STRENGTH ==========
    setupPasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        const confirmInput = document.getElementById('signupConfirmPassword');
        
        if (!passwordInput) return;

        // Password input validation
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            this.validatePasswordRequirements(password);
            this.updatePasswordStrength(password);
            
            // Check confirmation
            if (confirmInput && confirmInput.value) {
                this.validatePasswordMatch();
            }
        });

        // Confirm password validation
        if (confirmInput) {
            confirmInput.addEventListener('input', () => this.validatePasswordMatch());
        }
    }

    validatePasswordRequirements(password) {
        const requirements = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        // Update UI indicators
        const requirementClasses = {
            length: 'req-length',
            upper: 'req-upper',
            lower: 'req-lower',
            number: 'req-number',
            special: 'req-special'
        };

        Object.entries(requirementClasses).forEach(([key, className]) => {
            const element = document.querySelector(`.${className}`);
            if (element) {
                element.classList.toggle('valid', requirements[key]);
                element.querySelector('i').style.color = requirements[key] ? '#10b981' : '#ef4444';
            }
        });

        return Object.values(requirements).every(req => req);
    }

    updatePasswordStrength(password) {
        const securityMeter = document.getElementById('securityMeter');
        if (!securityMeter) return;

        // Calculate strength score
        let score = 0;
        if (password.length >= 8) score += 20;
        if (/[A-Z]/.test(password)) score += 20;
        if (/[a-z]/.test(password)) score += 20;
        if (/\d/.test(password)) score += 20;
        if (/[^a-zA-Z0-9]/.test(password)) score += 20;

        // Update meter
        securityMeter.style.width = `${score}%`;
        
        // Update color based on strength
        if (score < 40) {
            securityMeter.style.background = 'linear-gradient(90deg, #EF4444, #F59E0B)';
        } else if (score < 80) {
            securityMeter.style.background = 'linear-gradient(90deg, #F59E0B, #10B981)';
        } else {
            securityMeter.style.background = 'linear-gradient(90deg, #10B981, #059669)';
        }

        // Update chart if exists
        this.updatePasswordChart(password);
    }

    validatePasswordMatch() {
        const passwordInput = document.getElementById('signupPassword');
        const confirmInput = document.getElementById('signupConfirmPassword');
        
        if (!passwordInput || !confirmInput) return true;

        const password = passwordInput.value;
        const confirm = confirmInput.value;

        if (password && confirm) {
            if (password === confirm) {
                confirmInput.classList.remove('is-invalid');
                confirmInput.classList.add('is-valid');
                return true;
            } else {
                confirmInput.classList.add('is-invalid');
                confirmInput.classList.remove('is-valid');
                return false;
            }
        }
        return true;
    }

    // ========== PASSWORD TOGGLE ==========
    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('signupPassword');
        
        if (!toggleBtn || !passwordInput) return;

        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update icon
            const icon = toggleBtn.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // ========== BIO CHARACTER COUNTER ==========
    setupBioCounter() {
        const bioTextarea = document.getElementById('signupBio');
        const charCount = document.getElementById('bioCharCount');
        
        if (!bioTextarea || !charCount) return;

        bioTextarea.addEventListener('input', (e) => {
            const text = e.target.value;
            const count = text.length;
            charCount.textContent = count;

            // Update color based on count
            if (count > 180) {
                charCount.style.color = '#EF4444';
            } else if (count > 150) {
                charCount.style.color = '#F59E0B';
            } else {
                charCount.style.color = '';
            }

            // Enforce character limit
            if (count > 200) {
                bioTextarea.value = text.substring(0, 200);
                charCount.textContent = 200;
            }

            // Auto-save
            this.saveFormProgress();
        });
    }

    // ========== REAL-TIME STATISTICS ==========
    setupRealTimeStats() {
        // Check if stats elements exist
        const usersCount = document.getElementById('usersCount');
        const successRate = document.getElementById('successRate');
        const avgTime = document.getElementById('avgTime');
        
        if (!usersCount || !successRate || !avgTime) return;

        // Initialize with realistic values
        usersCount.textContent = Math.floor(Math.random() * 5000 + 10000);
        successRate.textContent = '98%';
        avgTime.textContent = '45s';

        // Update periodically
        setInterval(() => {
            this.updateStatistics(usersCount, successRate, avgTime);
        }, 5000);
    }

    updateStatistics(usersCount, successRate, avgTime) {
        // Simulate user growth
        const currentUsers = parseInt(usersCount.textContent);
        const increment = Math.floor(Math.random() * 5 + 1);
        usersCount.textContent = currentUsers + increment;

        // Animate update
        usersCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            usersCount.style.transform = 'scale(1)';
        }, 300);

        // Update success rate (small random variation)
        const rates = ['97%', '98%', '99%'];
        successRate.textContent = rates[Math.floor(Math.random() * rates.length)];

        // Update average time
        const times = ['42s', '45s', '48s', '43s', '47s'];
        avgTime.textContent = times[Math.floor(Math.random() * times.length)];
    }

    // ========== COLOR PICKER ==========
    setupColorPicker() {
        const colorOptions = document.querySelectorAll('.color-option');
        if (!colorOptions.length) return;

        const colorThemes = {
            purple: { primary: '#8B5CF6', primaryDark: '#7C3AED', secondary: '#10B981' },
            blue: { primary: '#3B82F6', primaryDark: '#1D4ED8', secondary: '#06B6D4' },
            green: { primary: '#10B981', primaryDark: '#059669', secondary: '#3B82F6' },
            pink: { primary: '#EC4899', primaryDark: '#DB2777', secondary: '#8B5CF6' },
            orange: { primary: '#F59E0B', primaryDark: '#D97706', secondary: '#EF4444' }
        };

        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all
                colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active to clicked
                option.classList.add('active');
                
                // Get theme
                const color = option.dataset.color;
                const theme = colorThemes[color];
                
                // Apply theme
                this.applyColorTheme(theme);
                localStorage.setItem('stellarColorTheme', color);
            });
        });

        // Apply saved theme
        const savedColor = localStorage.getItem('stellarColorTheme') || 'purple';
        const savedOption = document.querySelector(`.color-option[data-color="${savedColor}"]`);
        if (savedOption) {
            savedOption.click();
        }
    }

    applyColorTheme(theme) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--primary-dark', theme.primaryDark);
        root.style.setProperty('--secondary-color', theme.secondary);
        
        // Smooth transition
        document.body.style.opacity = '0.9';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 200);
    }

    // ========== PASSWORD CHART ==========
    setupPasswordChart() {
        const canvas = document.getElementById('passwordChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        this.passwordChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Length', 'Complexity', 'Uniqueness', 'Security', 'Memorability'],
                datasets: [{
                    label: 'Password Strength',
                    data: [20, 20, 20, 20, 20],
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(139, 92, 246, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false,
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                size: 11,
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#e2e8f0',
                        bodyColor: '#cbd5e1',
                        borderColor: 'rgba(139, 92, 246, 0.5)',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    updatePasswordChart(password) {
        if (!this.passwordChart) return;

        const scores = this.calculatePasswordScores(password);
        this.passwordChart.data.datasets[0].data = scores;
        this.passwordChart.update();
    }

    calculatePasswordScores(password) {
        if (!password) return [20, 20, 20, 20, 20];

        const lengthScore = Math.min(100, (password.length / 16) * 100);
        const complexityScore = this.calculateComplexityScore(password);
        const uniquenessScore = this.calculateUniquenessScore(password);
        const securityScore = (lengthScore + complexityScore + uniquenessScore) / 3;
        const memorabilityScore = Math.max(0, 100 - (complexityScore * 0.7));

        return [lengthScore, complexityScore, uniquenessScore, securityScore, memorabilityScore];
    }

    calculateComplexityScore(password) {
        let score = 0;
        if (/[a-z]/.test(password)) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/\d/.test(password)) score += 25;
        if (/[^a-zA-Z0-9]/.test(password)) score += 25;
        return score;
    }

    calculateUniquenessScore(password) {
        if (!password) return 0;
        const uniqueChars = new Set(password).size;
        return Math.min(100, (uniqueChars / password.length) * 100 * 2);
    }

    // ========== DEMO MODE ==========
    setupDemoMode() {
        const demoBtn = document.getElementById('playDemo');
        if (!demoBtn) return;

        demoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.fillDemoData();
            
            // Show modal if exists
            const demoModal = document.getElementById('demoModal');
            if (demoModal) {
                const modal = new bootstrap.Modal(demoModal);
                modal.show();
            }
        });
    }

    fillDemoData() {
        const demoData = {
            signupName: 'Alex Johnson',
            signupUsername: 'alexj2023',
            signupGender: 'male',
            signupBirthdate: '1990-05-15',
            signupBio: 'Digital creator passionate about technology and design. Building the future one line of code at a time.',
            signupEmail: 'alex.johnson@example.com',
            signupMobile: '5550123456',
            signupAddress: '123 Innovation Drive\nTech City, TC 10001\nUnited States',
            signupPassword: 'SecurePass123!',
            signupConfirmPassword: 'SecurePass123!'
        };

        // Fill form fields
        Object.entries(demoData).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                
                // Trigger validation events
                const event = new Event('input', { bubbles: true });
                element.dispatchEvent(event);
            }
        });

        // Check additional options
        const termsCheckbox = document.getElementById('termsAgreement');
        const newsletterCheckbox = document.getElementById('newsletter');
        const twoFactorCheckbox = document.getElementById('twoFactorAuth');
        
        if (termsCheckbox) termsCheckbox.checked = true;
        if (newsletterCheckbox) newsletterCheckbox.checked = true;
        if (twoFactorCheckbox) twoFactorCheckbox.checked = true;

        this.showMessage('Demo data loaded! Review and submit to see the success animation.', 'info');
    }

    // ========== FORM VALIDATION ==========
    setupValidation() {
        // Username availability check
        const usernameInput = document.getElementById('signupUsername');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => this.checkUsernameAvailability(usernameInput.value));
        }

        // Email validation
        const emailInput = document.getElementById('signupEmail');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput.value));
        }

        // Real-time validation for required fields
        document.querySelectorAll('[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Auto-save on input
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('input', () => this.saveFormProgress());
        });
    }

    checkUsernameAvailability(username) {
        if (!username || username.length < 3) return;
        
        // Simulate API call
        const takenUsernames = ['admin', 'root', 'test', 'user', 'demo'];
        const usernameInput = document.getElementById('signupUsername');
        
        if (!usernameInput) return;

        // Show loading state
        usernameInput.classList.add('loading');
        
        setTimeout(() => {
            usernameInput.classList.remove('loading');
            
            if (takenUsernames.includes(username.toLowerCase())) {
                usernameInput.classList.add('is-invalid');
                usernameInput.setCustomValidity('Username already taken');
                this.showMessage('Username is already taken. Please choose another.', 'error');
            } else {
                usernameInput.classList.remove('is-invalid');
                usernameInput.setCustomValidity('');
                usernameInput.classList.add('is-valid');
            }
        }, 800);
    }

    validateEmail(email) {
        const emailInput = document.getElementById('signupEmail');
        if (!emailInput) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            emailInput.classList.add('is-invalid');
            emailInput.setCustomValidity('Please enter a valid email address');
            return false;
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.setCustomValidity('');
            emailInput.classList.add('is-valid');
            return true;
        }
    }

    validateField(field) {
        if (!field.checkValidity()) {
            field.classList.add('is-invalid');
            return false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            return true;
        }
    }

    validateCurrentStep() {
        const currentStep = document.querySelector('.form-step.active');
        if (!currentStep) return false;

        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for step 3
        if (this.currentStep === 3) {
            if (!this.validatePasswordMatch()) {
                isValid = false;
            }
            
            const termsCheckbox = document.getElementById('termsAgreement');
            if (termsCheckbox && !termsCheckbox.checked) {
                termsCheckbox.classList.add('is-invalid');
                isValid = false;
            } else if (termsCheckbox) {
                termsCheckbox.classList.remove('is-invalid');
            }
        }

        return isValid;
    }

    // ========== FORM SUBMISSION ==========
    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all steps
        for (let i = 1; i <= 3; i++) {
            if (!this.validateCurrentStep()) {
                this.navigateToStep(i);
                this.showMessage('Please fix the errors in the form before submitting.', 'error');
                return;
            }
        }

        // Collect form data
        const formData = this.collectFormData();
        
        // Validate unique email
        if (!this.isEmailUnique(formData.email)) {
            this.showMessage('This email is already registered. Please use a different email.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Creating Account...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            const result = await this.simulateAPIRequest(formData);
            
            // Save to localStorage
            this.saveUserToLocalStorage(formData);
            
            // Show success
            this.showMessage('🎉 Account created successfully! Welcome to Stellar.', 'success');
            
            // Launch confetti
            this.launchConfetti();
            
            // Reset form after delay
            setTimeout(() => {
                this.resetForm();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                this.navigateToStep(1);
            }, 3000);

        } catch (error) {
            this.showMessage('❌ Error creating account. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    collectFormData() {
        return {
            id: Date.now(),
            name: document.getElementById('signupName')?.value || '',
            username: document.getElementById('signupUsername')?.value || '',
            gender: document.getElementById('signupGender')?.value || '',
            birthdate: document.getElementById('signupBirthdate')?.value || '',
            bio: document.getElementById('signupBio')?.value || '',
            email: document.getElementById('signupEmail')?.value || '',
            mobile: document.getElementById('signupMobile')?.value || '',
            address: document.getElementById('signupAddress')?.value || '',
            newsletter: document.getElementById('newsletter')?.checked || false,
            twoFactor: document.getElementById('twoFactorAuth')?.checked || false,
            securityQuestions: document.getElementById('securityQuestions')?.checked || false,
            createdAt: new Date().toISOString()
        };
    }

    isEmailUnique(email) {
        const users = JSON.parse(localStorage.getItem('stellarUsers') || '[]');
        return !users.some(user => user.email === email);
    }

    simulateAPIRequest(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% success rate simulation
                if (Math.random() > 0.1) {
                    resolve({ success: true, data });
                } else {
                    reject(new Error('Network error. Please try again.'));
                }
            }, 2000);
        });
    }

    saveUserToLocalStorage(userData) {
        let users = JSON.parse(localStorage.getItem('stellarUsers') || '[]');
        users.push(userData);
        localStorage.setItem('stellarUsers', JSON.stringify(users));
        localStorage.removeItem('stellarFormData'); // Clear saved form data
    }

    saveFormProgress() {
        const formData = this.collectFormData();
        localStorage.setItem('stellarFormData', JSON.stringify(formData));
    }

    populateFormFromData() {
        if (!this.formData) return;

        Object.entries(this.formData).forEach(([key, value]) => {
            const element = document.getElementById(`signup${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
                
                // Trigger validation
                const event = new Event('input', { bubbles: true });
                element.dispatchEvent(event);
            }
        });
    }

    resetForm() {
        const form = document.getElementById('signupForm');
        if (form) {
            form.reset();
            document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
            
            // Reset password chart
            if (this.passwordChart) {
                this.passwordChart.data.datasets[0].data = [20, 20, 20, 20, 20];
                this.passwordChart.update();
            }
            
            // Reset bio counter
            const charCount = document.getElementById('bioCharCount');
            if (charCount) {
                charCount.textContent = '0';
                charCount.style.color = '';
            }
        }
    }

    // ========== CONFETTI ANIMATION ==========
    launchConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;

        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        const confettiPieces = [];
        const colors = ['#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#F59E0B'];

        // Create confetti pieces
        for (let i = 0; i < 200; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                radius: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 4 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 12 - 6,
                shape: Math.random() > 0.5 ? 'circle' : 'rect'
            });
        }

        // Animation function
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let activePieces = 0;

            confettiPieces.forEach(piece => {
                piece.y += piece.speed;
                piece.x += Math.sin(piece.y * 0.01) * 1.5;
                piece.rotation += piece.rotationSpeed;

                if (piece.y < canvas.height + 100) {
                    activePieces++;
                }

                // Draw confetti piece
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;

                if (piece.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, piece.radius, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-piece.radius, -piece.radius/2, piece.radius * 2, piece.radius);
                }
                
                ctx.restore();
            });

            if (activePieces > 0) {
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(this.animationFrameId);
                canvas.style.display = 'none';
            }
        };

        animate();
    }

    // ========== MESSAGE DISPLAY ==========
    showMessage(message, type) {
        const messageBox = document.getElementById('signupMessage');
        if (!messageBox) return;

        // Clear previous messages
        messageBox.className = 'alert mt-4';
        messageBox.style.display = 'block';

        // Set type-specific classes and content
        switch (type) {
            case 'success':
                messageBox.classList.add('alert-success');
                messageBox.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
                break;
            case 'error':
                messageBox.classList.add('alert-danger');
                messageBox.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${message}`;
                break;
            case 'info':
                messageBox.classList.add('alert-info');
                messageBox.innerHTML = `<i class="fas fa-info-circle me-2"></i>${message}`;
                break;
            case 'warning':
                messageBox.classList.add('alert-warning');
                messageBox.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${message}`;
                break;
        }

        // Auto-hide non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 5000);
        }
    }

    // ========== KEYBOARD NAVIGATION ==========
    handleKeyboardNavigation(e) {
        // Enter key to navigate forward (except in textareas)
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (this.currentStep < 3) {
                document.querySelector(`.next-step[data-next="${this.currentStep + 1}"]`)?.click();
            }
        }

        // Esc key to close modal
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            }
        }
    }

    // ========== RESPONSIVE HANDLING ==========
    handleResize() {
        // Update confetti canvas size if visible
        const canvas = document.getElementById('confettiCanvas');
        if (canvas && canvas.style.display === 'block') {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Update chart if it exists
        if (this.passwordChart) {
            this.passwordChart.resize();
        }
    }
}

// Initialize the application
const stellarApp = new StellarSignupApp();

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pageReveal {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    body {
        animation: pageReveal 0.8s ease forwards;
    }
    
    .loading {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3E%3Ccircle cx='50' cy='50' fill='none' stroke='%238B5CF6' stroke-width='10' r='35' stroke-dasharray='164.93361431346415 56.97787143782138'%3E%3CanimateTransform attributeName='transform' type='rotate' repeatCount='indefinite' dur='1s' values='0 50 50;360 50 50' keyTimes='0;1'/%3E%3C/circle%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 20px;
    }
    
    .req-length.valid i,
    .req-upper.valid i,
    .req-lower.valid i,
    .req-number.valid i,
    .req-special.valid i {
        color: #10b981 !important;
    }
`;
document.head.appendChild(style);