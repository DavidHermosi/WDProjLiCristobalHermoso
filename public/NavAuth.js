/**
 * NavAuth.js — Smart Auth Dropdown for every page
 * ================================================
 * Drop this ONE script tag into every page before </body>:
 *
 *   Root page  (index.html):      <script src="./NavAuth.js"></script>
 *   Subpages   (public/*.html):   <script src="../NavAuth.js"></script>
 *
 * LOGGED IN  → avatar circle + name → hover dropdown: [Profile] [Fighter Game] [Sign Out]
 * GUEST      → "Login / Sign Up" link
 */

(function () {
    'use strict';

    const isSubpage = window.location.pathname.includes('/public/') ||
                      window.location.pathname.split('/').filter(Boolean).length > 1;
    const ROOT   = isSubpage ? '../' : './';
    const PUBLIC = isSubpage ? './'  : './public/';

    function getUser() {
        try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); }
        catch { return null; }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = ROOT + 'index.html';
    }

    /* ── CSS ── */
    const STYLE = `
    #na-wrap {
        position: relative;
        display: flex;
        align-items: center;
        margin-left: 6px;
        flex-shrink: 0;
    }

    #na-guest-link {
        color: white;
        text-decoration: none;
        font-size: 14px;
        font-weight: bold;
        padding: 8px 14px;
        border-radius: 8px;
        border: 1px solid rgba(124,245,255,0.25);
        background: rgba(124,245,255,0.06);
        transition: all 0.25s;
        white-space: nowrap;
    }
    #na-guest-link:hover {
        background: rgba(227,6,19,0.12);
        border-color: #E30613;
        color: #E30613;
    }

    #na-trigger {
        display: flex;
        align-items: center;
        gap: 9px;
        cursor: pointer;
        padding: 5px 10px 5px 5px;
        border-radius: 24px;
        border: 1px solid rgba(124,245,255,0.18);
        background: rgba(0,0,0,0.4);
        transition: border-color 0.25s, background 0.25s;
        user-select: none;
        -webkit-user-select: none;
    }
    #na-wrap:hover #na-trigger,
    #na-wrap.open  #na-trigger {
        border-color: rgba(124,245,255,0.55);
        background: rgba(124,245,255,0.07);
    }

    #na-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: bold;
        color: #fff;
        flex-shrink: 0;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
    }
    #na-name {
        font-size: 0.82rem;
        font-weight: bold;
        color: #E8F0F2;
        letter-spacing: 0.5px;
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    #na-caret {
        font-size: 0.55rem;
        color: rgba(232,240,242,0.45);
        transition: transform 0.22s;
        margin-left: 2px;
    }
    #na-wrap:hover #na-caret,
    #na-wrap.open  #na-caret { transform: rotate(180deg); }

    /* ── Dropdown panel ── */
    #na-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        min-width: 200px;
        background: #070d1a;
        border: 1px solid rgba(124,245,255,0.2);
        border-radius: 14px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.75), 0 0 0 1px rgba(124,245,255,0.05);
        overflow: hidden;
        opacity: 0;
        transform: translateY(-8px) scale(0.97);
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
        z-index: 9999;
    }

    /* Open on hover OR on .open class (touch fallback) */
    #na-wrap:hover #na-dropdown,
    #na-wrap.open  #na-dropdown {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    /* Invisible bridge so mouse can travel from trigger to dropdown */
    #na-dropdown::before {
        content: '';
        position: absolute;
        top: -8px;
        left: 0;
        right: 0;
        height: 8px;
    }

    .na-dd-header {
        padding: 14px 16px 10px;
        border-bottom: 1px solid rgba(124,245,255,0.1);
    }
    .na-dd-header-name {
        font-weight: bold;
        color: #E8F0F2;
        font-size: 0.95rem;
        margin-bottom: 2px;
    }
    .na-dd-header-email {
        font-size: 0.75rem;
        color: rgba(232,240,242,0.38);
    }

    .na-dd-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 16px;
        color: rgba(232,240,242,0.8);
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 500;
        transition: background 0.15s, color 0.15s;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        font-family: Tahoma, sans-serif;
    }
    .na-dd-item:hover {
        background: rgba(124,245,255,0.07);
        color: #E8F0F2;
    }
    .na-dd-item.danger:hover {
        background: rgba(255,68,68,0.08);
        color: #ff6666;
    }
    .na-dd-item .na-icon {
        font-size: 1rem;
        width: 20px;
        text-align: center;
        flex-shrink: 0;
    }
    .na-dd-divider {
        height: 1px;
        background: rgba(124,245,255,0.08);
        margin: 4px 0;
    }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    /* ── Build widget ── */
    function buildNav(user) {
        const wrap = document.createElement('div');
        wrap.id = 'na-wrap';

        if (!user) {
            const link = document.createElement('a');
            link.id   = 'na-guest-link';
            link.href = PUBLIC + 'SU.html';
            link.textContent = '🥋 Login / Sign Up';
            wrap.appendChild(link);
        } else {
            const initial = user.username.charAt(0).toUpperCase();
            const color   = user.avatarColor || getDefaultColor(user.username);
            const email   = user.email || '';

            const trigger = document.createElement('div');
            trigger.id = 'na-trigger';
            trigger.setAttribute('aria-haspopup', 'true');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.innerHTML = `
                <div id="na-avatar" style="background:${color}">${initial}</div>
                <span id="na-name">${user.username}</span>
                <span id="na-caret">▼</span>
            `;

            const dd = document.createElement('div');
            dd.id = 'na-dropdown';
            dd.setAttribute('role', 'menu');
            dd.innerHTML = `
                <div class="na-dd-header">
                    <div class="na-dd-header-name">${user.username}</div>
                    <div class="na-dd-header-email">${email}</div>
                </div>
                <a class="na-dd-item" href="${PUBLIC}Profile.html" role="menuitem">
                    <span class="na-icon">👤</span> My Profile
                </a>
                <a class="na-dd-item" href="${PUBLIC}Game.html" role="menuitem">
                    <span class="na-icon">⚔️</span> Fighter Game
                </a>
                <div class="na-dd-divider"></div>
                <button class="na-dd-item danger" id="na-logout" role="menuitem">
                    <span class="na-icon">→</span> Sign Out
                </button>
            `;

            wrap.appendChild(trigger);
            wrap.appendChild(dd);

            /* ── Touch / click fallback (for mobile where :hover doesn't persist) ── */
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = PUBLIC + 'Profile.html';
            });

            /* Close .open when clicking outside (hover handles mouse, this handles touch) */
            document.addEventListener('click', () => {
                wrap.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });

            dd.addEventListener('click', e => e.stopPropagation());

            dd.querySelector('#na-logout').addEventListener('click', logout);
        }

        return wrap;
    }

    /* ── Replace the existing SVG profile link in the nav ── */
    function injectNav() {
        const user = getUser();
        const widget = buildNav(user);

        const allLinks = document.querySelectorAll('header a, nav a');
        let replaced = false;

        for (const link of allLinks) {
            const href   = link.getAttribute('href') || '';
            const hasSVG = link.querySelector('svg');
            if (href.includes('SU.html') || hasSVG) {
                link.parentNode.insertBefore(widget, link);
                link.remove();
                replaced = true;
                break;
            }
        }

        if (!replaced) {
            const nav = document.querySelector('header nav, header');
            if (nav) nav.appendChild(widget);
        }
    }

    function getDefaultColor(username) {
        const colors = ['#E30613','#7CF5FF','#FF6B35','#4ECDC4','#F7DC6F','#BB8FCE','#45B7D1','#2ED573'];
        let h = 0;
        for (let i = 0; i < username.length; i++) h = username.charCodeAt(i) + ((h << 5) - h);
        return colors[Math.abs(h) % colors.length];
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNav);
    } else {
        injectNav();
    }

})();
