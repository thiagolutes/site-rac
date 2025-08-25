// TypeScript-like JavaScript with type annotations in comments
class SmartRacWebsite {
    constructor() {
        this.currentSection = 'home';
        this.isDarkMode = false;
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupAnimations();
        this.setupForms();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link, [data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section') || link.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        navToggle?.addEventListener('click', () => {
            this.isMenuOpen = !this.isMenuOpen;
            navMenu?.classList.toggle('active', this.isMenuOpen);
            navToggle.innerHTML = this.isMenuOpen ?
                '<i class="fas fa-times"></i>' :
                '<i class="fas fa-bars"></i>';
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Contact form toggles
        document.querySelectorAll('.contact-option').forEach(option => {
            option.addEventListener('click', () => {
                const formType = option.getAttribute('data-form');
                this.switchContactForm(formType);
            });
        });

        // Scroll animations
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && this.isMenuOpen) {
                this.isMenuOpen = false;
                navMenu?.classList.remove('active');
                if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    navigateToSection(sectionId) {
        // Hide current section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        const footer = document.getElementById('footer');
        if (targetSection) {
            setTimeout(() => {
                targetSection.classList.add('active');
                this.animateSection(targetSection);
            }, 100);
            setTimeout(() => {
                footer.classList.add('active');
                this.animateSection(targetSection);
            }, 100);
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

        this.currentSection = sectionId;

        // Close mobile menu
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            document.getElementById('nav-menu')?.classList.remove('active');
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    animateSection(section) {
        const cards = section.querySelectorAll('.service-card, .team-member, .testimonial, .pillar, .footer-element');

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }


    setupTheme() {
        const savedTheme = localStorage.getItem('smartrac-theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
            this.applyTheme();
        } else {
            // Check system preference
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme();
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('smartrac-theme', this.isDarkMode ? 'dark' : 'light');
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupAnimations() {
        // Floating cards animation
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });

        // Service icons pulse animation
        const serviceIcons = document.querySelectorAll('.service-icon');
        serviceIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.3}s`;
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.service-card, .team-member, .testimonial').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    switchContactForm(formType) {
        // Update buttons
        document.querySelectorAll('.contact-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-form="${formType}"]`)?.classList.add('active');

        // Switch forms
        document.querySelectorAll('.contact-form').forEach(form => {
            form.classList.remove('active');
        });

        const targetForm = formType === 'email' ?
            document.getElementById('emailForm') :
            document.getElementById('whatsappForm');

        targetForm?.classList.add('active');
    }

    setupForms() {
        // Scheduling form
        document.getElementById('schedulingForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSchedulingSubmit(e.target);
        });

        // Email contact form
        document.getElementById('emailForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSubmit(e.target);
        });

        // WhatsApp form
        document.getElementById('whatsappSend')?.addEventListener('click', () => {
            this.handleWhatsAppSubmit();
        });

        // Form validation
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity() && value !== '';

        field.style.borderColor = isValid ?
            'var(--border-color)' :
            '#e74c3c';

        return isValid;
    }

    handleSchedulingSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
        const isValid = requiredFields.every(field => {
            const input = form.querySelector(`#${field}`);
            return this.validateField(input);
        });

        if (!isValid) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Create mailto link
        const subject = encodeURIComponent(data.contactSubject);
        const body = encodeURIComponent(`
Nome: ${data.contactName}
E-mail: ${data.contactEmail}

Mensagem:
${data.contactMessage}
                `);

        const mailtoLink = `mailto:contato@smartrac.com.br?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;

        this.showNotification('Cliente de e-mail aberto! Complete o envio no seu aplicativo.', 'success');
        form.reset();
    }

    handleWhatsAppSubmit() {
        const name = document.getElementById('whatsappName')?.value;
        const message = document.getElementById('whatsappMessage')?.value;

        if (!name || !message) {
            this.showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const whatsappMessage = encodeURIComponent(`
Olá! Meu nome é ${name}.

${message}
                `);

        const whatsappUrl = `https://wa.me/5531986022902?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');

        this.showNotification('WhatsApp aberto! Complete o envio no aplicativo.', 'success');

        // Clear form
        document.getElementById('whatsappName').value = '';
        document.getElementById('whatsappMessage').value = '';
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Agendar Serviço';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas ${this.getNotificationIcon(type)}"></i>
                        <span>${message}</span>
                        <button class="notification-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

        // Add styles
        notification.style.cssText = `
                    position: fixed;
                    top: 90px;
                    right: 20px;
                    z-index: 10000;
                    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : 'var(--primary-color)'};
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    max-width: 400px;
                `;

        notification.querySelector('.notification-content').style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                `;

        notification.querySelector('.notification-close').style.cssText = `
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.25rem;
                    margin-left: auto;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Close button hover effect
        notification.querySelector('.notification-close').addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'rgba(255,255,255,0.2)';
        });

        notification.querySelector('.notification-close').addEventListener('mouseleave', function () {
            this.style.backgroundColor = 'transparent';
        });
    }

    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    handleScroll() {
        const header = document.getElementById('header');
        const scrollY = window.scrollY;

        // Header background on scroll
        if (scrollY > 100) {
            header.style.background = `var(--background-color)`;
            header.style.boxShadow = `0 2px 20px var(--shadow)`;
        } else {
            header.style.background = `var(--background-color)`;
            header.style.boxShadow = `none`;
        }

        // Parallax effect for floating cards
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            card.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Utility method to create smooth scrolling animations
    createScrollAnimation() {
        const scrollElements = document.querySelectorAll('[data-scroll]');

        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
        };

        const displayScrollElement = (element) => {
            element.classList.add('scrolled');
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });
    }

    // Method to handle dynamic content loading
    loadDynamicContent() {
        // This could be used to load content from APIs
        // For now, we'll use it to enhance the user experience with loading states

        const loadingPlaceholders = document.querySelectorAll('.loading-placeholder');
        loadingPlaceholders.forEach(placeholder => {
            placeholder.style.background = `
                        linear-gradient(90deg, 
                            var(--surface-color) 0%, 
                            var(--border-color) 50%, 
                            var(--surface-color) 100%)
                    `;
            placeholder.style.backgroundSize = '200% 100%';
            placeholder.style.animation = 'loading 1.5s infinite';
        });

        // Add loading keyframes
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                        @keyframes loading {
                            0% { background-position: 200% 0; }
                            100% { background-position: -200% 0; }
                        }
                    `;
            document.head.appendChild(style);
        }
    }

    // Method to handle accessibility features
    setupAccessibility() {
        // Add ARIA labels
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add focus management
        document.querySelectorAll('a, button, input, textarea, select').forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = `2px solid var(--primary-color)`;
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.isMenuOpen = false;
                document.getElementById('nav-menu')?.classList.remove('active');
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Method to handle performance optimization
    optimizePerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Debounce scroll and resize events
        let scrollTimeout;
        let resizeTimeout;

        const originalScroll = this.handleScroll.bind(this);
        this.handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(originalScroll, 16); // ~60fps
        };

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Handle responsive changes
                this.handleResponsiveChanges();
            }, 250);
        });
    }

    handleResponsiveChanges() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile && this.isMenuOpen) {
            // Close menu on resize to mobile
            this.isMenuOpen = false;
            document.getElementById('nav-menu')?.classList.remove('active');
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }

        // Adjust hero visual for mobile
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            if (isMobile) {
                heroVisual.style.position = 'static';
                heroVisual.style.transform = 'none';
            } else {
                heroVisual.style.position = 'absolute';
                heroVisual.style.transform = 'translateY(-50%)';
            }
        }
    }

    // Initialize everything
    start() {
        this.setupAccessibility();
        this.optimizePerformance();
        this.createScrollAnimation();
        this.loadDynamicContent();

        // Add smooth reveal animation for the initial page load
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        console.log('Smart Rac Website initialized successfully! 🚀');
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new SmartRacWebsite();
    website.start();
});

// Add some additional utility functions
function formatPhoneNumber(phone) {
    // Format Brazilian phone number
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

// Add phone number formatting to phone inputs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    });

    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.setAttribute('min', today);
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartRacWebsite, formatPhoneNumber, validateEmail, validateDate };
}