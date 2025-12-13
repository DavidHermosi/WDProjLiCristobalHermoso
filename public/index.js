
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

