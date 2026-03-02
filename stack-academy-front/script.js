// script.js - Complete scroll functionality for Stack Academy
/*
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SCROLL SECTION HIGHLIGHTING =====
    // Get all sections that have IDs
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Function to update active navigation link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        
        // Check each section's position
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY;
            
            // Add offset for navbar height (80px)
            const offset = 100;
            
            // Check if we've scrolled past this section
            if (scrollPosition >= (sectionTop - offset)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the current section's nav link
        if (currentSection) {
            const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Call the function initially
    updateActiveNavLink();
    
    // Add scroll event listener with throttling for better performance
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveNavLink();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            // Get the target element
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate position with navbar offset
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
    
    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.querySelector('.footer-scroll .scroll-link');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== NAVBAR BACKGROUND CHANGE ON SCROLL =====
    const navbar = document.querySelector('.navbar');
    
    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initial check
    updateNavbarOnScroll();
    
    // Add scroll listener for navbar
    window.addEventListener('scroll', function() {
        updateNavbarOnScroll();
    });
    
    // ===== HANDLE PAGE LOAD WITH URL HASH =====
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Wait a bit for the page to fully load
            setTimeout(function() {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // ===== ANIMATE SECTIONS ON SCROLL (Fade In Effect) =====
    // Add fade-in class to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
    });
    
    // Create intersection observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections
    document.querySelectorAll('.fade-in-section').forEach(section => {
        fadeObserver.observe(section);
    });
    
    // ===== BOOTSTRAP DROPDOWN CLOSE ON LINK CLICK =====
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const dropdown = bootstrap.Dropdown.getInstance(document.querySelector('.dropdown-toggle'));
            if (dropdown) {
                dropdown.hide();
            }
        });
    });
    
    console.log('Scroll functionality initialized successfully!');
});*/