
// DROPDOWN 
function toggleMove(element) {
    element.classList.toggle('active');
}

// FOOTER
function revealFooter() {
    const footer = document.getElementById('animatedFooter');
    if (!footer) return;
    
    const footerPosition = footer.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
    
    // Trigger when footer is 80% visible
    if (footerPosition < screenHeight * 0.8) {
        footer.classList.add('visible');
    }
}


// Page Load
document.addEventListener('DOMContentLoaded', revealFooter);

// Scroll
window.addEventListener('scroll', revealFooter);
// PAGE LOAD FUNCTIONS


// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Martial Arts website loaded successfully!');
    
    // Initialize any default states here if needed
    // For example, you could auto-open the first dropdown, etc.
});

        // Check if user is logged in
        window.addEventListener('DOMContentLoaded', () => {
            const memberLock = document.getElementById('memberLock');
            const body = document.body;

            // Check auth status
            if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
                // User is LOGGED IN - unlock content
                memberLock.classList.add('hidden');
                body.classList.remove('locked');
                console.log('✅ Member access granted');
            } else {
                // User is GUEST - show lock screen
                memberLock.classList.remove('hidden');
                body.classList.add('locked');
                console.log('🔒 Guest view - content locked');
            }
        });
// ── SCROLL PROGRESS BAR ──
(function() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }, { passive: true });
})();

// ── BACK TO TOP BUTTON ──
(function() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.title = 'Back to top';
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ── ACTIVE NAV LINK ──
(function() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav h1 a').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) link.classList.add('active-page');
    });
})();
