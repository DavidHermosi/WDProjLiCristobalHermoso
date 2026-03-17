/**
 * Profile.js — CRUD operations for user profile
 * ==============================================
 * Handles: Read, Update (username / email / password / avatar color), Delete
 * Depends on: SU.js (AuthSystem class must be loaded first)
 */

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const AVATAR_COLORS = [
    '#E30613', // red  (site primary)
    '#7CF5FF', // cyan (site accent)
    '#FF6B35', // orange
    '#4ECDC4', // teal
    '#F7DC6F', // gold
    '#BB8FCE', // purple
    '#45B7D1', // sky blue
    '#2ED573', // green
];

const BELT_RANKS = [
    { min: 0,    belt: '⬜', name: 'White Belt' },
    { min: 150,  belt: '🟡', name: 'Yellow Belt' },
    { min: 400,  belt: '🟠', name: 'Orange Belt' },
    { min: 750,  belt: '🟢', name: 'Green Belt' },
    { min: 1200, belt: '🔵', name: 'Blue Belt' },
    { min: 2000, belt: '🟣', name: 'Purple Belt' },
    { min: 3200, belt: '🟤', name: 'Brown Belt' },
    { min: 5000, belt: '⬛', name: 'Black Belt' },
];

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
let selectedColor = AVATAR_COLORS[0];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function getBelt(score) {
    let rank = BELT_RANKS[0];
    for (const r of BELT_RANKS) {
        if (score >= r.min) rank = r;
    }
    return rank;
}

function fmtDate(isoStr) {
    try {
        return new Date(isoStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch {
        return '—';
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/* ─────────────────────────────────────────
   RENDER
───────────────────────────────────────── */
function renderProfile(user) {
    const color    = user.avatarColor || '#E30613';
    const initial  = user.username.charAt(0).toUpperCase();
    const joinDate = fmtDate(user.joinDate);

    // Get latest full user data (for stats) from the users array
    const fullUser = getAllUsers().find(u => u.id === user.id) || user;
    const highScore   = fullUser.gameHighScore  || 0;
    const gamesPlayed = fullUser.gamesPlayed    || 0;
    const belt        = getBelt(highScore);

    // ── Header card ──
    const avatarEl = document.getElementById('p-avatar');
    avatarEl.textContent    = initial;
    avatarEl.style.background = color;

    document.getElementById('p-name').textContent   = user.username;
    document.getElementById('p-joined').textContent = `Member since ${joinDate}`;

    // ── Stats ──
    document.getElementById('s-score').textContent = highScore.toLocaleString();
    document.getElementById('s-games').textContent = gamesPlayed;
    document.getElementById('s-belt').textContent  = belt.belt;
    document.getElementById('s-belt').title        = belt.name;

    // ── Account info ──
    document.getElementById('i-username').textContent = user.username;
    document.getElementById('i-email').textContent    = user.email;
    document.getElementById('i-since').textContent    = joinDate;

    // ── Pre-fill edit form ──
    document.getElementById('f-username').value = user.username;
    document.getElementById('f-email').value    = user.email;

    // ── Color swatches ──
    selectedColor = color;
    renderSwatches(color);
}

function renderSwatches(current) {
    const wrap = document.getElementById('swatches-wrap');
    wrap.innerHTML = '';
    AVATAR_COLORS.forEach(c => {
        const s = document.createElement('div');
        s.className   = 'swatch' + (c === current ? ' active' : '');
        s.style.background = c;
        s.title        = c;
        s.onclick = () => {
            document.querySelectorAll('.swatch').forEach(el => el.classList.remove('active'));
            s.classList.add('active');
            selectedColor = c;
        };
        wrap.appendChild(s);
    });
}

/* ─────────────────────────────────────────
   COLLAPSIBLE SECTIONS
───────────────────────────────────────── */
function toggleSection(bodyId, titleEl) {
    const body   = document.getElementById(bodyId);
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (titleEl) titleEl.classList.toggle('open', !isOpen);
}

/* ─────────────────────────────────────────
   ALERT HELPERS
───────────────────────────────────────── */
function showAlert(elId, msg, type) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.className   = `palert palert-${type === 'ok' ? 'ok' : 'err'} show`;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
        el.classList.remove('show');
    }, 4500);
}

/* ─────────────────────────────────────────
   UPDATE (C-R-U-D: Update)
───────────────────────────────────────── */
function handleUpdate() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const newUsername = document.getElementById('f-username').value.trim();
    const newEmail    = document.getElementById('f-email').value.trim();
    const newPw       = document.getElementById('f-pw').value;
    const confirmPw   = document.getElementById('f-pw2').value;
    const newColor    = selectedColor;

    // ── Validation ──
    if (newUsername.length < 3) {
        showAlert('edit-alert', '⚠️ Username must be at least 3 characters.', 'err'); return;
    }
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
        showAlert('edit-alert', '⚠️ Please enter a valid email address.', 'err'); return;
    }
    if (newPw && newPw.length < 6) {
        showAlert('edit-alert', '⚠️ Password must be at least 6 characters.', 'err'); return;
    }
    if (newPw && newPw !== confirmPw) {
        showAlert('edit-alert', '⚠️ Passwords do not match.', 'err'); return;
    }

    // ── Conflict check ──
    const users = getAllUsers();
    if (users.find(u => u.username === newUsername && u.id !== currentUser.id)) {
        showAlert('edit-alert', '⚠️ That username is already taken.', 'err'); return;
    }
    if (users.find(u => u.email === newEmail && u.id !== currentUser.id)) {
        showAlert('edit-alert', '⚠️ That email address is already in use.', 'err'); return;
    }

    // ── Apply update ──
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx === -1) {
        showAlert('edit-alert', '⚠️ User not found. Please log in again.', 'err'); return;
    }

    users[idx].username    = newUsername;
    users[idx].email       = newEmail;
    users[idx].avatarColor = newColor;
    if (newPw) users[idx].password = newPw;

    saveUsers(users);

    // ── Update session ──
    const updated = { ...users[idx] };
    delete updated.password;
    localStorage.setItem('currentUser', JSON.stringify(updated));

    // ── Re-render ──
    renderProfile(updated);

    // ── Clear password fields ──
    document.getElementById('f-pw').value  = '';
    document.getElementById('f-pw2').value = '';

    showAlert('edit-alert', '✅ Profile updated successfully!', 'ok');
}

/* ─────────────────────────────────────────
   DELETE (C-R-U-D: Delete)
───────────────────────────────────────── */
function handleDelete() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const confirmed = confirm(
        `⚠️ Are you sure you want to permanently delete your account "${currentUser.username}"?\n\n` +
        `This cannot be undone. All your data and game progress will be lost.`
    );
    if (!confirmed) return;

    const users    = getAllUsers();
    const filtered = users.filter(u => u.id !== currentUser.id);
    saveUsers(filtered);
    localStorage.removeItem('currentUser');

    alert('Your account has been deleted. You will now be redirected to the home page.');
    window.location.href = '../index.html';
}

/* ─────────────────────────────────────────
   LOGOUT
───────────────────────────────────────── */
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

/* ─────────────────────────────────────────
   FOOTER ANIMATION
───────────────────────────────────────── */
function initFooter() {
    const footer = document.getElementById('animatedFooter');
    if (!footer) return;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            footer.classList.add('visible');
            obs.disconnect();
        }
    }, { threshold: 0.1 });
    obs.observe(footer);
    // Also trigger on scroll in case footer is already partially visible
    window.addEventListener('scroll', () => {
        const pos = footer.getBoundingClientRect().top;
        if (pos < window.innerHeight * 0.9) footer.classList.add('visible');
    });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();

    if (!user) {
        document.getElementById('view-profile').style.display = 'none';
        document.getElementById('view-guest').style.display   = 'block';
        return;
    }

    renderProfile(user);
    initFooter();
});
