// ========================================
// HealthTech CDHR1 - Main Script
// ========================================

// High Contrast Toggle
const contrastToggle = document.getElementById('contrastToggle');
const htmlElement = document.documentElement;

// Check localStorage for saved preference
function initializeContrast() {
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
        document.body.classList.add('high-contrast');
        updateContrastButtonText();
    }
}

// Toggle high contrast mode
contrastToggle.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isHighContrast);
    updateContrastButtonText();
});

// Update button text based on current state
function updateContrastButtonText() {
    const isHighContrast = document.body.classList.contains('high-contrast');
    contrastToggle.textContent = isHighContrast ? '🌞 Modo Normal' : '🌓 Alto Contraste';
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Alt + C for contrast toggle
    if (e.altKey && e.key === 'c') {
        contrastToggle.click();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeContrast();
    updateContrastButtonText();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Announce navigation changes to screen readers
function announceNavigation(pageName) {
    const liveRegion = document.querySelector('[aria-live="polite"]') || createLiveRegion();
    liveRegion.textContent = `Navegando para ${pageName}`;
}

// Create live region for screen reader announcements
function createLiveRegion() {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
    return region;
}

// Highlight active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href').split('/').pop() || 'index.html';
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update active link on page load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);
