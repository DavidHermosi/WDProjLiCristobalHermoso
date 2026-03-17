/**
 * MARTIAL ARTS AND THE WORLD — Loading Screen
 * =============================================
 * Day → Night → Dawn → Logo Reveal
 *
 * Usage (root pages like index.html):
 *   <script src="./loading.js"></script>
 *
 * Usage (subpages like SU.html, Profile.html):
 *   <script src="../loading.js"></script>
 *
 * Add the script tag as the LAST item before </body>
 */

(function () {
    'use strict';

    if (document.getElementById('ma-loading-overlay')) return;

    /* ─────────────────────────────────────────
       STYLES
    ───────────────────────────────────────── */
    const CSS = `
    #ma-loading-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: opacity 0.9s ease;
    }
    #ma-loading-overlay.ma-hide {
        opacity: 0;
        pointer-events: none;
    }

    /* ── Sky cycle: night → pre-dawn → dawn → site theme ── */
    #ma-sky {
        position: absolute;
        inset: 0;
        animation: ma-sky-anim 5s ease-in-out forwards;
    }
    @keyframes ma-sky-anim {
        0%   { background: radial-gradient(ellipse at 50% 100%, #06021a 0%, #020110 50%, #000005 100%); }
        15%  { background: radial-gradient(ellipse at 50% 100%, #0c0430 0%, #06021f 50%, #000008 100%); }
        35%  { background: radial-gradient(ellipse at 50% 100%, #8b2800 0%, #3d0c22 35%, #100530 65%, #000010 100%); }
        55%  { background: radial-gradient(ellipse at 50% 100%, #d96000 0%, #8a2200 25%, #320a40 55%, #08040e 100%); }
        72%  { background: radial-gradient(ellipse at 50% 100%, #c87800 0%, #6e1800 30%, #1e0e38 60%, #040210 100%); }
        88%  { background: linear-gradient(to bottom, #000000 0%, #020818 60%, #060d1a 100%); }
        100% { background: #000000; }
    }

    /* ── Twinkling stars ── */
    #ma-stars {
        position: absolute;
        inset: 0;
        animation: ma-stars-fade 3.2s ease-in-out forwards;
    }
    @keyframes ma-stars-fade {
        0%   { opacity: 1; }
        55%  { opacity: 0.7; }
        80%  { opacity: 0.15; }
        100% { opacity: 0; }
    }
    .ma-star {
        position: absolute;
        border-radius: 50%;
        background: #ffffff;
        animation: ma-twinkle var(--dur, 1.8s) ease-in-out infinite alternate;
        animation-delay: var(--delay, 0s);
        opacity: var(--lo, 0.3);
    }
    @keyframes ma-twinkle {
        from { opacity: var(--lo, 0.3); transform: scale(1); }
        to   { opacity: var(--hi, 1);   transform: scale(1.4); }
    }

    /* ── Crescent moon ── */
    #ma-moon {
        position: absolute;
        top: 10%;
        right: 18%;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: radial-gradient(circle at 38% 38%, #fff8c0, #f0d555, #c8a000);
        box-shadow: 0 0 24px rgba(255, 230, 80, 0.4);
        animation: ma-moon-anim 3.2s ease-in-out forwards;
    }
    /* Crescent cut-out */
    #ma-moon::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -6px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #06021a;
        animation: ma-moon-cutout 3.2s ease-in-out forwards;
    }
    @keyframes ma-moon-anim {
        0%   { opacity: 0.9; transform: translateY(0px); }
        65%  { opacity: 0.25; transform: translateY(-18px); }
        100% { opacity: 0; transform: translateY(-30px); }
    }
    @keyframes ma-moon-cutout {
        0%   { background: #06021a; }
        35%  { background: #1a0832; }
        65%  { background: #5c2000; }
        100% { background: #000; }
    }

    /* ── Horizon dawn glow ── */
    #ma-horizon {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 50%;
        pointer-events: none;
        animation: ma-horizon-anim 5s ease-in-out forwards;
    }
    @keyframes ma-horizon-anim {
        0%   { background: transparent; opacity: 0; }
        30%  { background: linear-gradient(to top, rgba(180,40,0,0.5), transparent); opacity: 0; }
        45%  { background: linear-gradient(to top, rgba(220,80,0,0.9), rgba(160,30,0,0.4), transparent); opacity: 1; }
        65%  { background: linear-gradient(to top, rgba(210,120,0,0.7), rgba(140,40,0,0.3), transparent); opacity: 0.8; }
        85%  { background: linear-gradient(to top, rgba(100,40,0,0.2), transparent); opacity: 0.3; }
        100% { opacity: 0; }
    }

    /* ── Rising sun ── */
    #ma-sun {
        position: absolute;
        bottom: 36%;
        left: 50%;
        transform: translateX(-50%);
        width: 80px; height: 80px;
        border-radius: 50%;
        background: radial-gradient(circle, #fff5a0 0%, #ffb700 35%, #ff6600 65%, transparent 100%);
        filter: blur(7px);
        animation: ma-sun-anim 5s ease-in-out forwards;
        pointer-events: none;
    }
    @keyframes ma-sun-anim {
        0%   { opacity: 0;   bottom: 25%; }
        28%  { opacity: 0;   bottom: 28%; }
        48%  { opacity: 0.9; bottom: 36%; }
        70%  { opacity: 0.5; bottom: 44%; }
        88%  { opacity: 0.1; bottom: 48%; }
        100% { opacity: 0; }
    }

    /* ── Dojo / mountain cityline silhouette ── */
    #ma-cityline {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 90px;
        animation: ma-city-anim 5s ease-in-out forwards;
        pointer-events: none;
    }
    @keyframes ma-city-anim {
        0%   { opacity: 0.7; }
        80%  { opacity: 0.4; }
        100% { opacity: 0; }
    }

    /* ── Logo container ── */
    #ma-logo-wrap {
        position: relative;
        z-index: 10;
        text-align: center;
        opacity: 0;
        animation: ma-logo-in 1s cubic-bezier(0.22, 1, 0.36, 1) 3.1s forwards;
    }
    @keyframes ma-logo-in {
        0%   { opacity: 0; transform: translateY(22px) scale(0.94); filter: blur(10px); }
        100% { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0); }
    }

    #ma-logo-img {
        width: 88px;
        height: 88px;
        object-fit: contain;
        display: block;
        margin: 0 auto 18px;
        filter: drop-shadow(0 0 20px rgba(227,6,19,0.9))
                drop-shadow(0 0 45px rgba(227,6,19,0.4));
        animation: ma-logo-pulse 1.8s ease-in-out 3.8s infinite alternate;
    }
    @keyframes ma-logo-pulse {
        from { filter: drop-shadow(0 0 18px rgba(227,6,19,0.7)) drop-shadow(0 0 30px rgba(227,6,19,0.3)); }
        to   { filter: drop-shadow(0 0 28px rgba(227,6,19,1))   drop-shadow(0 0 65px rgba(227,6,19,0.6)); }
    }

    #ma-logo-title {
        font-family: 'BBH Sans Bogle', Georgia, serif;
        font-size: clamp(1.5rem, 3.5vw, 2.2rem);
        color: #E8F0F2;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin: 0 0 10px;
        text-shadow: 0 0 30px rgba(124,245,255,0.9), 0 0 70px rgba(124,245,255,0.4);
    }
    #ma-logo-sub {
        font-family: Tahoma, sans-serif;
        font-size: 0.72rem;
        color: #E30613;
        letter-spacing: 7px;
        text-transform: uppercase;
        text-shadow: 0 0 14px rgba(227,6,19,0.8);
    }

    /* ── Martial artist silhouette ── */
    #ma-fighter-sil {
        display: block;
        margin: 18px auto 0;
        width: 75px;
        opacity: 0;
        animation: ma-sil-in 0.7s ease-out 3.5s forwards;
        filter: drop-shadow(0 0 14px rgba(124,245,255,0.55));
    }
    @keyframes ma-sil-in {
        from { opacity: 0; transform: scale(0.7) rotate(-8deg); }
        to   { opacity: 1; transform: scale(1)   rotate(0deg); }
    }

    /* ── Loading dots ── */
    #ma-dots {
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
    }
    .ma-dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        background: rgba(124,245,255,0.18);
        border: 1px solid rgba(124,245,255,0.35);
        transition: background 0.3s, box-shadow 0.3s;
    }
    .ma-dot.ma-lit {
        background: #E30613;
        border-color: #E30613;
        box-shadow: 0 0 10px rgba(227,6,19,0.8);
    }

    /* ── Bottom tagline ── */
    #ma-tagline {
        position: absolute;
        bottom: 12%;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-family: Tahoma, sans-serif;
        font-size: 0.72rem;
        letter-spacing: 4px;
        color: rgba(232,240,242,0.45);
        opacity: 0;
        animation: ma-tag-in 0.7s ease 3.4s forwards;
    }
    @keyframes ma-tag-in {
        to { opacity: 1; }
    }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'ma-loading-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    /* ─────────────────────────────────────────
       DETECT PATH DEPTH for logo asset
    ───────────────────────────────────────── */
    const pathDepth = (window.location.pathname.match(/\//g) || []).length;
    const isSubpage = pathDepth > 1 || document.querySelector('link[href*="../"]') !== null;
    const logoSrc = isSubpage
        ? '../asset/hermoso_cristobal_logo.png'
        : './asset/hermoso_cristobal_logo.png';

    /* ─────────────────────────────────────────
       GENERATE STARS
    ───────────────────────────────────────── */
    let starsHTML = '';
    for (let i = 0; i < 130; i++) {
        const x   = (Math.random() * 100).toFixed(1);
        const y   = (Math.random() * 68).toFixed(1);
        const sz  = (Math.random() * 2.8 + 0.4).toFixed(1);
        const dur = (Math.random() * 2.5 + 0.8).toFixed(1);
        const dl  = (Math.random() * 2.5).toFixed(1);
        const lo  = (Math.random() * 0.15 + 0.05).toFixed(2);
        const hi  = (Math.random() * 0.55 + 0.45).toFixed(2);
        starsHTML += `<div class="ma-star" style="left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;--dur:${dur}s;--delay:${dl}s;--lo:${lo};--hi:${hi}"></div>`;
    }

    /* ─────────────────────────────────────────
       BUILD OVERLAY HTML
    ───────────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.id = 'ma-loading-overlay';
    overlay.innerHTML = `
        <div id="ma-sky"></div>

        <div id="ma-stars">${starsHTML}</div>

        <div id="ma-moon"></div>
        <div id="ma-horizon"></div>
        <div id="ma-sun"></div>

        <!-- Dojo / mountain silhouette horizon line -->
        <svg id="ma-cityline" viewBox="0 0 1200 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <polygon
                points="0,90 80,50 150,65 230,22 310,55 390,35 460,52 530,18 600,48 670,28 740,52 810,38 890,55 970,22 1050,45 1130,32 1200,42 1200,90"
                fill="rgba(0,0,0,0.88)"
            />
            <!-- Pagoda left -->
            <rect x="224" y="22" width="12" height="68" fill="rgba(0,0,0,0.95)"/>
            <polygon points="218,22 230,10 242,22" fill="rgba(0,0,0,0.95)"/>
            <polygon points="215,28 230,18 245,28" fill="rgba(0,0,0,0.95)"/>
            <!-- Pagoda center -->
            <rect x="524" y="18" width="14" height="72" fill="rgba(0,0,0,0.95)"/>
            <polygon points="517,18 531,5 545,18" fill="rgba(0,0,0,0.95)"/>
            <polygon points="514,25 531,14 548,25" fill="rgba(0,0,0,0.95)"/>
            <!-- Flag pole right -->
            <rect x="962" y="22" width="5" height="68" fill="rgba(0,0,0,0.95)"/>
            <polygon points="967,22 985,30 967,38" fill="rgba(180,30,0,0.7)"/>
        </svg>

        <!-- Logo area (appears at 3.1s) -->
        <div id="ma-logo-wrap">
            <img
                id="ma-logo-img"
                src="${logoSrc}"
                alt="Martial Arts and The World"
                onerror="this.style.display='none'"
            >
            <p id="ma-logo-title">🥋 Martial Arts &amp; The World</p>
            <p id="ma-logo-sub">Training from Dusk till Dawn</p>

            <!-- High-kick silhouette SVG -->
            <svg id="ma-fighter-sil" viewBox="0 0 60 95" xmlns="http://www.w3.org/2000/svg">
                <!-- Head -->
                <circle cx="30" cy="10" r="8" fill="#7CF5FF" opacity="0.92"/>
                <!-- Body -->
                <line x1="30" y1="18" x2="30" y2="52" stroke="#7CF5FF" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Standing leg -->
                <line x1="30" y1="52" x2="22" y2="73" stroke="#7CF5FF" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="22" y1="73" x2="18" y2="90" stroke="#7CF5FF" stroke-width="3.5" stroke-linecap="round"/>
                <!-- High kick leg (red accent) -->
                <line x1="30" y1="52" x2="52" y2="32" stroke="#E30613" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="52" y1="32" x2="60" y2="15" stroke="#E30613" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Left arm guard -->
                <line x1="30" y1="30" x2="10" y2="42" stroke="#7CF5FF" stroke-width="3" stroke-linecap="round"/>
                <!-- Right arm extended -->
                <line x1="30" y1="30" x2="46" y2="24" stroke="#7CF5FF" stroke-width="3" stroke-linecap="round"/>
            </svg>
        </div>

        <p id="ma-tagline">THE WAY OF THE WARRIOR</p>

        <div id="ma-dots">
            <div class="ma-dot" id="ma-d1"></div>
            <div class="ma-dot" id="ma-d2"></div>
            <div class="ma-dot" id="ma-d3"></div>
            <div class="ma-dot" id="ma-d4"></div>
        </div>
    `;

    document.body.prepend(overlay);

    /* ─────────────────────────────────────────
       ANIMATE DOTS
    ───────────────────────────────────────── */
    [450, 1200, 2100, 3100].forEach((ms, i) => {
        setTimeout(() => {
            const dot = document.getElementById(`ma-d${i + 1}`);
            if (dot) dot.classList.add('ma-lit');
        }, ms);
    });

    /* ─────────────────────────────────────────
       FADE OUT & CLEANUP
    ───────────────────────────────────────── */
    setTimeout(() => overlay.classList.add('ma-hide'), 4600);
    setTimeout(() => {
        overlay.remove();
        styleEl.remove();
    }, 5500);

})();
