// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Registration form submission
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            skillOffer: document.getElementById('skillOffer').value,
            skillLevel: document.getElementById('skillLevel').value,
            skillWant: document.getElementById('skillWant').value,
            availability: document.getElementById('availability').value,
            bio: document.getElementById('bio').value,
            timestamp: new Date().toISOString()
        };

        console.log('Registration Data:', formData);

        // Track form submission in Google Analytics
        if (typeof gtag === "function") {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'registration_form',
                value: 1
            });
        }

        document.getElementById('successMessage').classList.add('show');
        registrationForm.reset();

        setTimeout(() => {
            document.getElementById('successMessage').classList.remove('show');
            window.location.href = 'index.html';
        }, 3000);
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        console.log('Contact Form Data:', formData);

        // Track form submission in Google Analytics
        if (typeof gtag === "function") {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'contact_form',
                value: 1
            });
        }

        document.getElementById('contactSuccessMessage').classList.add('show');
        contactForm.reset();

        setTimeout(() => {
            document.getElementById('contactSuccessMessage').classList.remove('show');
        }, 3000);
    });
}

// Track skill card clicks
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', function() {
        const skillName = this.querySelector('h3') ? this.querySelector('h3').textContent : 'Unknown';
        
        if (typeof gtag === "function") {
            gtag('event', 'skill_card_click', {
                event_category: 'engagement',
                event_label: skillName,
                value: 1
            });
        }
    });
});

// Track CTA button clicks
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        if (typeof gtag === "function") {
            gtag('event', 'cta_click', {
                event_category: 'engagement',
                event_label: 'join_now_button',
                value: 1
            });
        }
    });
});
