// ===================================
// Hallel Hospital & Maternity - Main JS
// ===================================

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------
    // 1. MOBILE NAVIGATION TOGGLE
    // -----------------------------------
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');

    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

    const themeToggle = document.getElementById('theme-toggle');
    navContainer.insertBefore(menuToggle, themeToggle);

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });


    // -----------------------------------
    // 2. DARK / LIGHT THEME TOGGLE
    // -----------------------------------
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');
    const body = document.body;

    const savedTheme = localStorage.getItem('hallel-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('hallel-theme', isDark ? 'dark' : 'light');
    });


    // -----------------------------------
    // 3. HEADER SCROLL EFFECT
    // -----------------------------------
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // -----------------------------------
    // 4. STATS COUNTER ANIMATION
    // -----------------------------------
    const statCards = document.querySelectorAll('.stat-card h2');
    let statsCounted = false;

    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / (target / increment);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(timer); }
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, stepTime);
    }

    function handleStatsAnimation() {
        const statsSection = document.querySelector('.stats');
        if (!statsSection || statsCounted) return;
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
            statsCounted = true;
            statCards.forEach((h2) => {
                const text = h2.textContent.trim();
                if (text.includes('24/7')) {
                    h2.textContent = '0/7';
                    let count = 0;
                    const interval = setInterval(() => { count++; h2.textContent = count + '/7'; if (count >= 24) clearInterval(interval); }, 80);
                } else if (text.includes('+')) {
                    const numericPart = text.replace(/[+,]/g, '');
                    const target = parseInt(numericPart, 10);
                    if (!isNaN(target)) { animateCounter(h2, target, '+'); }
                }
            });
        }
    }
    window.addEventListener('scroll', handleStatsAnimation);
    handleStatsAnimation(); 


    // -----------------------------------
    // 5. SMOOTH SCROLL FOR ANCHOR LINKS
    // -----------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) { e.preventDefault(); targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });


    // -----------------------------------
    // 6. SCROLL REVEAL ANIMATIONS
    // -----------------------------------
    const revealElements = document.querySelectorAll('.about-container, .stat-card, .hero-content, .service-card, .testimonial-card');
    function revealOnScroll() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 100) { el.classList.add('revealed'); }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 


    // -----------------------------------
    // 7. ACTIVE NAV LINK HIGHLIGHT
    // -----------------------------------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) { link.classList.add('active-link'); }
    });


    // -----------------------------------
    // 8. APPOINTMENT FORM SUBMISSION (FORMSPREE)
    // -----------------------------------
    const appointmentForm = document.getElementById('appointment-form');
    const formSuccess = document.getElementById('form-success');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(appointmentForm);
            
            fetch(appointmentForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    appointmentForm.style.display = 'none';
                    if(formSuccess) { formSuccess.style.display = 'block'; }
                    appointmentForm.reset();
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again.');
                }
            }).catch(error => {
                alert('Oops! There was a network error. Please check your connection and try again.');
            });
        });
    }


    // -----------------------------------
    // 9. CONTACT FORM SUBMISSION (FORMSPREE)
    // -----------------------------------
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    if(contactSuccess) { contactSuccess.style.display = 'block'; }
                    contactForm.reset();
                } else {
                    alert('Oops! There was a problem sending your message. Please try again.');
                }
            }).catch(error => {
                alert('Oops! There was a network error. Please check your connection and try again.');
            });
        });
    }


    // -----------------------------------
    // 10. CHATBOT LOGIC
    // -----------------------------------
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chatbot-input');
    const chatSend = document.getElementById('chatbot-send');
    const chatMessages = document.getElementById('chatbot-messages');

    if(chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.remove('chatbot-hidden');
            chatToggle.style.display = 'none';
            if(chatMessages.innerHTML === '') {
                appendMessage("bot", "Hello! ð Welcome to Hallel Hospital. How can I assist you today? (You can ask about our hours, location, services, or appointments)");
            }
        });
    }

    if(chatClose) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.add('chatbot-hidden');
            chatToggle.style.display = 'flex';
        });
    }

    if(chatSend) {
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function sendMessage() {
        const userText = chatInput.value.trim();
        if (userText === '') return;
        appendMessage("user", userText);
        chatInput.value = '';
        setTimeout(() => {
            const botResponse = getBotResponse(userText);
            appendMessage("bot", botResponse);
        }, 600);
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-msg');
        msgDiv.classList.add(sender === "user" ? 'user-msg' : 'bot-msg');
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(input) {
        input = input.toLowerCase();

        if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
            return "Hello! Welcome to Hallel Hospital. How can I help you today?";
        } else if (input.includes("hour") || input.includes("open") || input.includes("time") || input.includes("24/7")) {
            return "We are open 24/7, Monday through Sunday! Emergency services are always available.";
        } else if (input.includes("location") || input.includes("address") || input.includes("where") || input.includes("direction")) {
            return "We are located at #5, Harmony Close Eneka Portharcourt.";
        } else if (input.includes("appointment") || input.includes("book")) {
            return "You can book an appointment by clicking the 'Appointment' link in the menu above!";
        } else if (input.includes("service") || input.includes("offer") || input.includes("do you do")) {
            return "We offer General Consultation, Antenatal Care, Maternity & Delivery, Surgery, Lab Services, Ultrasound, Eye Clinic, and 24/7 Emergency Care.";
        } else if (input.includes("email") || input.includes("mail")) {
            return "You can email us at hospitalhallel@gmail.com.";
        } else if (input.includes("phone") || input.includes("call") || input.includes("emergency") || input.includes("contact")) {
            return "For emergencies or inquiries, please call +234 704 288 2756.";
        } else if (input.includes("hmo") || input.includes("insurance")) {
            return "Yes, we accept various HMOs including Bastion, Life Action Plus, Serene, Reliance, Anchor, Health Partner, Axa Mansard, Avon, Clearline, and Leadway. Please contact us to confirm your specific plan.";
        } else {
            return "I am a basic virtual assistant. I can help with our hours, location, appointments, and services. For medical advice, please call our emergency line directly.";
        }
    }


    // -----------------------------------
    // 11. BACK TO TOP BUTTON
    // -----------------------------------
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // -----------------------------------
    // 12. FAQ ACCORDION
    // -----------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items first
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });
        // -----------------------------------
    // 13. PAGE PRELOADER
    // -----------------------------------
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            // Completely remove it from the page after the fade animation finishes
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        });
    }
        // -----------------------------------
    // 14. NEWSLETTER FORM SUBMISSION (FORMSPREE)
    // -----------------------------------
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(newsletterForm);
            
            fetch(newsletterForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                                     const input = newsletterForm.querySelector('input[type="email"]');
                 const btn = newsletterForm.querySelector('button');
                 input.value = 'Subscribed! â';
                 input.style.color = '#25D366';
                 btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                 btn.style.background = '#25D366';
                 btn.style.transform = 'scale(1.1)';
                 newsletterForm.reset();
                    
                                     setTimeout(() => {
                     btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                     btn.style.background = '';
                     btn.style.transform = '';
                     input.value = '';
                     input.style.color = '';
                 }, 3000);
                } else {
                    alert('Oops! There was a problem. Please try again.');
                }
            }).catch(error => {
                alert('Oops! Network error. Please check your connection.');
            });
        });
    }
});
