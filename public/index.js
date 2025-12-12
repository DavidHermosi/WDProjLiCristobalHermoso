
// Toggle dropdown sections (for techniques, stances, kicks, progression)
function toggleMove(element) {
    element.classList.toggle('active');
}

// Close dropdown when clicking outside (for navigation)
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Toggle navigation dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Show selected martial art section (for main site dropdown navigation)
function showMartialArt(artId) {
    // Hide all sections
    const sections = document.querySelectorAll('.martial-art-section, .welcome-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(artId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Close dropdown
    const dropdown = document.getElementById('dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }

    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// OPTIONAL: SCROLL TO TOP BUTTON

// Show scroll to top button when scrolling down
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        if (document.documentElement.scrollTop > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Scroll to top smoothly
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


// OPTIONAL: SEARCH/FILTER FUNCTIONALITY


function searchTechniques() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const searchText = input.value.toLowerCase();
    const items = document.querySelectorAll('.technique-item, .moves-dropdown');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchText)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}


//SMOOTH SCROLL TO SECTIONS


function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


// PAGE LOAD FUNCTIONS


// Run when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Martial Arts website loaded successfully!');
    
    // Initialize any default states here if needed
    // For example, you could auto-open the first dropdown, etc.
});