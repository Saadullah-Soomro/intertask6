// ===== BLOG WEBSITE INTERACTIVITY =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== SEARCH FUNCTIONALITY =====
    const headerSearchInput = document.getElementById('headerSearchInput');
    const headerSearchBtn = document.getElementById('headerSearchBtn');
    const sidebarSearchInput = document.querySelector('.search-input');
    const sidebarSearchBtn = document.querySelector('.search-button');
    const blogCards = document.querySelectorAll('.blog-card');

    // Search function
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        let foundResults = 0;

        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.blog-category').textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('search-highlight');
                foundResults++;
            } else {
                card.style.display = searchTerm === '' ? 'block' : 'none';
                card.classList.remove('search-highlight');
            }
        });

        // Update section title to show search results
        const sectionTitle = document.querySelector('.section-title');
        if (searchTerm === '') {
            sectionTitle.textContent = 'Latest Articles';
        } else {
            sectionTitle.textContent = `Search Results (${foundResults} found)`;
        }

        // Show/hide no results message
        showNoResultsMessage(foundResults, searchTerm);
    }

    // Show no results message
    function showNoResultsMessage(count, term) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (count === 0 && term !== '') {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = `
                    <div class="no-results-content">
                        <h3>No articles found</h3>
                        <p>Sorry, we couldn't find any articles matching "<strong>${term}</strong>"</p>
                        <p>Try different keywords or browse our categories.</p>
                    </div>
                `;
                document.querySelector('.blog-grid').appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Header search events
    headerSearchBtn.addEventListener('click', () => {
        performSearch(headerSearchInput.value);
    });

    headerSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(headerSearchInput.value);
        }
    });

    headerSearchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            performSearch('');
        }
    });

    // Sidebar search events
    sidebarSearchBtn.addEventListener('click', () => {
        performSearch(sidebarSearchInput.value);
    });

    sidebarSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(sidebarSearchInput.value);
        }
    });

    sidebarSearchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            performSearch('');
        }
    });

    // ===== CATEGORY FILTERING =====
    const categoryLinks = document.querySelectorAll('.category-link');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryName = link.textContent.split('(')[0].trim().toLowerCase();
            filterByCategory(categoryName);
            
            // Update active category
            categoryLinks.forEach(l => l.classList.remove('active-category'));
            link.classList.add('active-category');
        });
    });

    // Filter posts by category
    function filterByCategory(category) {
        let foundResults = 0;

        blogCards.forEach(card => {
            const cardCategory = card.querySelector('.blog-category').textContent.toLowerCase();
            
            if (cardCategory === category || category === 'all') {
                card.style.display = 'block';
                foundResults++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update section title
        const sectionTitle = document.querySelector('.section-title');
        if (category === 'all') {
            sectionTitle.textContent = 'Latest Articles';
        } else {
            sectionTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Articles (${foundResults})`;
        }

        // Clear search inputs
        headerSearchInput.value = '';
        sidebarSearchInput.value = '';
    }

    // ===== SMOOTH SCROLLING ENHANCEMENT =====
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe blog cards for animation
    blogCards.forEach(card => {
        observer.observe(card);
    });

    // Observe sidebar sections
    const sidebarSections = document.querySelectorAll('.sidebar-section');
    sidebarSections.forEach(section => {
        observer.observe(section);
    });

    // ===== NEWSLETTER FORM HANDLING =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                showNotification('Thank you for subscribing! You\'ll receive our latest updates.', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // ===== ENHANCED CARD INTERACTIONS =====
    blogCards.forEach(card => {
        // Add loading state to images
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }

        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== DARK MODE PERSISTENCE =====
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check if browser supports :has() selector
    const supportsHas = CSS.supports('selector(:has(*))');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        darkModeToggle.checked = true;
        // Add fallback class for browsers without :has() support
        if (!supportsHas) {
            body.classList.add('light-mode');
        }
    }

    // Save theme preference and handle fallback
    darkModeToggle.addEventListener('change', () => {
        const isLightMode = darkModeToggle.checked;
        localStorage.setItem('darkMode', isLightMode);
        
        // Handle fallback for browsers without :has() support
        if (!supportsHas) {
            if (isLightMode) {
                body.classList.add('light-mode');
            } else {
                body.classList.remove('light-mode');
            }
        }
        
        // Show notification for theme change
        showNotification(`Switched to ${isLightMode ? 'light' : 'dark'} mode`, 'success');
    });

    // ===== HEADER SCROLL BEHAVIOR =====
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });

    // ===== LOADING ANIMATIONS =====
    // Add stagger animation to blog cards
    blogCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    console.log('🚀 Blog website loaded successfully!');
});

// ===== UTILITY FUNCTIONS =====
// Debounce function for search
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

// Add scroll to top functionality
window.addEventListener('scroll', () => {
    const scrollTop = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        if (!scrollTop) {
            const button = document.createElement('button');
            button.className = 'scroll-to-top';
            button.innerHTML = '↑';
            button.setAttribute('aria-label', 'Scroll to top');
            
            button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            document.body.appendChild(button);
        }
    } else if (scrollTop) {
        scrollTop.remove();
    }
});
