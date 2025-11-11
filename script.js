// Page Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1000);
    }
});

// Sticky Header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
}

// Mobile Dropdown Toggle
document.querySelectorAll('.dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Close any open dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if(targetId === '#' || targetId === '#!') return;
        
        // Check if it's an anchor link on the same page
        if (targetId.startsWith('#') && document.querySelector(targetId)) {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && hamburger && navLinks) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        }
    });
});

// Portfolio Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Testimonial Carousel
const indicators = document.querySelectorAll('.indicator');
const slides = document.querySelectorAll('.testimonial-slide');
let currentSlide = 0;
let slideInterval;

if (indicators.length > 0 && slides.length > 0) {
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        currentSlide = n;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function startSlideShow() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    // Start the carousel
    startSlideShow();

    // Pause carousel on hover
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopSlideShow);
        carousel.addEventListener('mouseleave', startSlideShow);
    }
}

// Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        // Email validation
        const emailInput = contactForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = 'red';
            }
        }
        
        if (isValid) {
            // In a real application, you would submit the form data to a server here
            // For now, we'll use a mailto fallback or just show a success message
            const formData = new FormData(contactForm);
            const formEntries = Object.fromEntries(formData);
            
            // Create mailto link as fallback
            const subject = `New Contact Form Submission from ${formEntries.name || 'Unknown'}`;
            const body = `
Name: ${formEntries.name || 'Not provided'}
Email: ${formEntries.email || 'Not provided'}
Phone: ${formEntries.phone || 'Not provided'}
Service: ${formEntries.service || 'Not provided'}
Message: ${formEntries.message || 'Not provided'}
            `;
            
            const mailtoLink = `mailto:info@abcremodelers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Try to send via AJAX first (placeholder endpoint)
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(formEntries),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => response.json())
            .then(json => {
                console.log('Form submitted (placeholder):', json);
                alert('Thank you for your message! We will contact you soon.');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Form submission failed, using mailto fallback:', error);
                // Fallback to mailto
                window.location.href = mailtoLink;
                alert('Thank you for your message! We will contact you soon.');
                contactForm.reset();
            });
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
}

// Portfolio Item Click for Modal (conceptual)
const portfolioItemsModal = document.querySelectorAll('.portfolio-item');
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');

if (portfolioItemsModal.length > 0 && modal && modalClose) {
    portfolioItemsModal.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            modal.querySelector('.modal-img').setAttribute('src', imgSrc);
            modal.querySelector('.modal-title').textContent = title;
            modal.querySelector('.modal-description').textContent = description;
            
            modal.style.display = 'flex';
        });
    });
    
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Scroll Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        document.querySelector('#services').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Image Lazy Loading Enhancement
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(emailInput.value)) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        }
    });
}
