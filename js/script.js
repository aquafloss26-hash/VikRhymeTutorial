/* ===================================
   VIK&RHYME Tutorial Services
   Interactive JavaScript Functionality
   =================================== */

// ========== CONFIGURATION ==========
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4KSaUUjJaJvnMzkla7opRpKlceyJsoGI3SA9ZzVW2MgmQmcrnDMWPiHrdOjAEdiT0TQ/exec';

// ========== COURSES DATA ==========
const coursesData = [
    {
        id: 1,
        title: "Piano Fundamentals",
        category: "music",
        duration: "12 weeks",
        price: "$50/session",
        instructor: "Prof. Victoria Rhyme",
        image: "images/piano.gif",
        description: "Master piano basics with professional instruction"
    },
    {
        id: 2,
        title: "Guitar Mastery",
        category: "music",
        duration: "16 weeks",
        price: "$45/session",
        instructor: "Mr. David Strings",
        image: "images/guitar.gif",
        description: "Learn guitar from beginner to advanced"
    },
    {
        id: 3,
        title: "Voice Training",
        category: "music",
        duration: "10 weeks",
        price: "$55/session",
        instructor: "Prof. Victoria Rhyme",
        image: "images/voice.gif",
        description: "Develop your vocal skills and confidence"
    },
    {
        id: 4,
        title: "Drums & Percussion",
        category: "music",
        duration: "14 weeks",
        price: "$50/session",
        instructor: "Mr. David Strings",
        image: "images/guitar.gif",
        description: "Learn rhythm and drumming techniques"
    },
    {
        id: 5,
        title: "Saxophone Lessons",
        category: "music",
        duration: "12 weeks",
        price: "$55/session",
        instructor: "Prof. Victoria Rhyme",
        image: "images/voice.gif",
        description: "Master the saxophone from basics to jazz"
    },
    {
        id: 6,
        title: "English Proficiency",
        category: "language",
        duration: "20 weeks",
        price: "$40/session",
        instructor: "Ms. Sarah Chen",
        image: "images/english.gif",
        description: "Improve your English skills for all purposes"
    },
    {
        id: 7,
        title: "Japanese Language",
        category: "language",
        duration: "24 weeks",
        price: "$70/session",
        instructor: "Ms. Sarah Chen",
        image: "images/japanese1.gif",
        description: "Learn Japanese from beginner to advanced (JLPT prep)"
    },
    {
        id: 8,
        title: "Korean Language",
        category: "language",
        duration: "24 weeks",
        price: "$45/session",
        instructor: "Ms. Sarah Chen",
        image: "images/japanese.gif",
        description: "Master Korean language and culture (TOPIK prep)"
    },
    {
        id: 9,
        title: "IELTS/TOEFL Prep",
        category: "language",
        duration: "16 weeks",
        price: "$50/session",
        instructor: "Ms. Sarah Chen",
        image: "images/english1.gif",
        description: "Excel in international English exams"
    },
    {
        id: 10,
        title: "Python Programming",
        category: "coding",
        duration: "12 weeks",
        price: "$60/session",
        instructor: "Mr. James Tech",
        image: "images/js6.gif",
        description: "Learn Python from basics to real applications"
    },
    {
        id: 11,
        title: "Web Development",
        category: "coding",
        duration: "16 weeks",
        price: "$65/session",
        instructor: "Mr. James Tech",
        image: "images/webdevelopment.gif",
        description: "Build modern websites with HTML, CSS, JavaScript"
    },
    {
        id: 12,
        title: "Android Development",
        category: "coding",
        duration: "14 weeks",
        price: "$65/session",
        instructor: "Mr. James Tech",
        image: "images/js5.gif",
        description: "Create Android mobile applications"
    },
    {
        id: 13,
        title: "JavaScript Fundamentals",
        category: "coding",
        duration: "10 weeks",
        price: "$55/session",
        instructor: "Mr. James Tech",
        image: "images/prod (12).jpg",
        description: "Master JavaScript for web development"
    },
    {
        id: 14,
        title: "Kids Piano (Ages 5-10)",
        category: "kids",
        duration: "12 weeks",
        price: "$40/session",
        instructor: "Prof. Victoria Rhyme",
        image: "images/piano1.gif",
        description: "Fun piano lessons designed for young learners"
    },
    {
        id: 15,
        title: "Kids Guitar (Ages 8-12)",
        category: "kids",
        duration: "12 weeks",
        price: "$40/session",
        instructor: "Mr. David Strings",
        image: "images/prod (13).jpg",
        description: "Engaging guitar lessons for children"
    },
    {
        id: 16,
        title: "Scratch Coding for Kids",
        category: "kids",
        duration: "8 weeks",
        price: "$45/session",
        instructor: "Mr. James Tech",
        image: "images/scratch.gif",
        description: "Visual programming introduction for kids"
    }
];

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initTabs();
    initCoursesFilter();
    renderCourses('all');
    initTestimonialSlider();
    initContactForm();
    initEnrollmentSystem();
    initScrollToTop();
    initSmoothScroll();
});

// ========== NAVIGATION ==========
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : '';
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => span.style.transform = '');
            spans[1].style.opacity = '1';
        });
    });
    
    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#enrollments') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== SCROLL EFFECTS (AOS Alternative) ==========
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ========== TABS (ABOUT SECTION) ==========
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ========== COURSES FILTER & RENDER ==========
function initCoursesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value and render courses
            const filter = button.getAttribute('data-filter');
            renderCourses(filter);
        });
    });
}

function renderCourses(filter) {
    const coursesGrid = document.getElementById('coursesGrid');
    const filteredCourses = filter === 'all' 
        ? coursesData 
        : coursesData.filter(course => course.category === filter);
    
    // Clear grid
    coursesGrid.innerHTML = '';
    
    // Render filtered courses
    filteredCourses.forEach((course, index) => {
        const courseCard = createCourseCard(course, index);
        coursesGrid.appendChild(courseCard);
    });
    
    // Reinitialize enroll buttons
    initEnrollButtons();
}

function createCourseCard(course, index) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${index * 100}`);
    card.setAttribute('data-id', course.id);
    
    const categoryIcons = {
        music: '🎵',
        language: '🌍',
        coding: '💻',
        kids: '🧒'
    };
    
    card.innerHTML = `
        <div class="course-image">
            <img src="${course.image}" alt="${course.title}">
            <div class="course-category">${categoryIcons[course.category]} ${course.category.charAt(0).toUpperCase() + course.category.slice(1)}</div>
        </div>
        <div class="course-info">
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-dollar-sign"></i> ${course.price}</span>
            </div>
            <div class="course-instructor">
                <i class="fas fa-user-tie"></i>
                <span>${course.instructor}</span>
            </div>
            <div class="course-footer">
                <span class="course-price">${course.price}</span>
                <button class="enroll-btn" data-course-id="${course.id}">
                    <i class="fas fa-graduation-cap"></i> Enroll Now
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ========== ENROLLMENT SYSTEM ==========
function initEnrollmentSystem() {
    updateEnrollmentBadge();
}

function initEnrollButtons() {
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const courseId = parseInt(button.getAttribute('data-course-id'));
            enrollInCourse(courseId);
        });
    });
}

function enrollInCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    // Get existing enrollments from localStorage
    let enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
    
    // Check if already enrolled
    const alreadyEnrolled = enrollments.some(e => e.id === courseId);
    
    if (alreadyEnrolled) {
        showNotification('You are already enrolled in this course!', 'error');
        return;
    }
    
    // Add to enrollments
    enrollments.push(course);
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
    
    // Update badge
    updateEnrollmentBadge();
    
    // Show success notification
    showNotification(`Successfully enrolled in ${course.title}!`, 'success');
    
    // Animate button
    const button = document.querySelector(`[data-course-id="${courseId}"]`);
    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Enrolled!';
        button.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
        }, 2000);
    }
}

function updateEnrollmentBadge() {
    const enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
    const badge = document.getElementById('enrollmentBadge');
    
    if (enrollments.length > 0) {
        badge.textContent = enrollments.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// ========== TESTIMONIAL SLIDER ==========
function initTestimonialSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const cards = slider.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    
    let currentIndex = 0;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.dot');
    
    function goToSlide(index) {
        cards[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        currentIndex = index;
        
        cards[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % cards.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        goToSlide(prevIndex);
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        formMessage.style.display = 'none';
        
        // Collect form data
        const formData = new FormData(form);
        
        try {
            // Send to Google Sheets
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });
            
            // Show success message
            formMessage.textContent = 'Thank you! We will contact you soon to schedule your free consultation.';
            formMessage.className = 'form-message success';
            formMessage.style.display = 'block';
            
            // Reset form
            form.reset();
            
            // Show notification
            showNotification('Inquiry sent successfully!', 'success');
            
        } catch (error) {
            // Show error message
            formMessage.textContent = 'Something went wrong. Please try again or contact us directly.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
}

// ========== SCROLL TO TOP ==========
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    
    toast.textContent = message;
    toast.className = `notification-toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== UTILITY FUNCTIONS ==========

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format price
function formatPrice(price) {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ========== CONSOLE MESSAGE ==========
console.log('%c🎓 VIK&RHYME Tutorial Services', 'font-size: 20px; font-weight: bold; color: #6C5CE7;');
console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #00D2FF;');
console.log('%cFor inquiries, contact: leecasiopea45@gmail.com', 'font-size: 12px; color: #718096;');
