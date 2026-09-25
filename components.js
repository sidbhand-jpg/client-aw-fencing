// ============================================================
// SHARED COMPONENTS — Header, Footer, LeadForm, ChatWidget
// Included on every page via <script src="../components.js">
// ============================================================

// ── ATTRIBUTION CAPTURE (Meta CAPI) ───────────────────────────
// Captures UTM params, fbclid, fbp/fbc cookies, and a per-pageview
// lead_event_id for Meta Pixel / CAPI deduplication. Runs on every
// page load and persists data via sessionStorage (current session)
// and localStorage (first-touch, kept across visits).
const HouzflowAttribution = (function () {
  function getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

  function generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function capture() {
    const fbclid = getUrlParam('fbclid');
    const data = {
      utm_source: getUrlParam('utm_source'),
      utm_medium: getUrlParam('utm_medium'),
      utm_campaign: getUrlParam('utm_campaign'),
      utm_content: getUrlParam('utm_content'),
      utm_term: getUrlParam('utm_term'),
      ad_id: getUrlParam('ad_id'),
      adset_id: getUrlParam('adset_id'),
      campaign_id: getUrlParam('campaign_id'),
      fbclid: fbclid,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''),
      source_url: window.location.href,
      user_agent: navigator.userAgent,
      lead_event_id: generateEventId(),
    };

    sessionStorage.setItem('houzflow_attribution', JSON.stringify(data));

    if (!localStorage.getItem('houzflow_first_touch')) {
      localStorage.setItem('houzflow_first_touch', JSON.stringify({
        source: data.utm_source,
        campaign: data.utm_campaign,
        ad_id: data.ad_id,
        timestamp: Date.now(),
      }));
    }

    return data;
  }

  function get() {
    const stored = sessionStorage.getItem('houzflow_attribution');
    return stored ? JSON.parse(stored) : capture();
  }

  // Capture on every page load so fbc/fbclid/UTMs reflect the
  // landing page a visitor arrived on.
  const current = capture();

  return { get, capture, current };
})();


// ── Apply CSS design tokens from CONFIG ──────────────────────
function applyColorTokens() {
  document.documentElement.style.setProperty('--color-primary', CONFIG.colors.primary);
  document.documentElement.style.setProperty('--color-secondary', CONFIG.colors.secondary);
}

// ── Utility: render star icons ───────────────────────────────
function renderStars(count = 5) {
  return Array.from({ length: count }).map(() =>
    `<svg class="star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>`
  ).join('');
}

// ── Logo SVG ─────────────────────────────────────────────────
function logoHTML() {
  return `<a href="/" class="logo-link">
    <img src="/public/brand/aw-fencing-logo.png" alt="${CONFIG.businessName}" class="site-logo-img" />
    <span class="site-logo-name">${CONFIG.businessName}</span>
  </a>`;
}

// ── HEADER ───────────────────────────────────────────────────
function renderHeader() {
  const servicesDropdown = CONFIG.services.map(s => `
    <a href="/services/${s.slug}.html" class="dropdown-item">
      <div class="dropdown-item-title">${s.name}</div>
      <div class="dropdown-item-desc">${s.desc}</div>
    </a>`).join('');

  const areasDropdown = CONFIG.serviceAreaGroups.map(group => `
    <section class="area-county-group">
      <div class="area-county-title">${group.county}</div>
      <div class="area-county-links">
        ${group.areas.map(a => `<a href="/cities/${a.slug}.html" class="area-link">${a.name}</a>`).join('')}
      </div>
    </section>`).join('');

  const mobileServiceLinks = CONFIG.services.map(s => `
    <a href="/services/${s.slug}.html" class="mobile-sub-link">${s.name}</a>`).join('');

  const mobileAreaLinks = CONFIG.serviceAreaGroups.map(group => `
    <section class="mobile-area-county-group">
      <div class="mobile-area-county-title">${group.county}</div>
      <div class="mobile-area-county-links">
        ${group.areas.map(a => `<a href="/cities/${a.slug}.html" class="mobile-area-link">${a.name}</a>`).join('')}
      </div>
    </section>`).join('');

  const html = `
  <header class="site-header" id="site-header">
    <div class="container-wide header-inner">
      ${logoHTML()}

      <!-- Desktop nav -->
      <nav class="desktop-nav">
        <!-- Services dropdown -->
        <div class="nav-dropdown-wrap" id="services-dropdown-wrap">
          <button class="nav-btn" id="services-btn">
            Services
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dropdown-panel services-panel" id="services-panel">
            <div class="services-grid">${servicesDropdown}</div>
          </div>
        </div>

        <!-- Areas dropdown -->
        <div class="nav-dropdown-wrap" id="areas-dropdown-wrap">
          <button class="nav-btn" id="areas-btn">
            Service Areas
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dropdown-panel areas-panel" id="areas-panel">
            <div class="areas-groups">${areasDropdown}</div>
          </div>
        </div>

        <a href="/our-work.html" class="nav-link">Our Work</a>
        <a href="/about.html" class="nav-link">About</a>
        <a href="/contact.html" class="nav-link">Contact</a>
      </nav>

      <!-- Desktop CTA -->
      <div class="header-cta">
        <a href="tel:${CONFIG.phoneRaw}" class="btn-phone">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
          ${CONFIG.phone}
        </a>
        <a href="#chat-widget" class="btn-primary-sm" data-open-chat>Get Free Estimate</a>
      </div>

      <!-- Mobile hamburger -->
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <svg id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg id="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Mobile drawer -->
    <div class="mobile-drawer" id="mobile-drawer" style="display:none">
      <div class="container-wide mobile-nav-inner">
        <!-- Services accordion -->
        <button class="mobile-acc-btn" id="mobile-services-btn">
          Services
          <svg class="chevron-icon" id="mobile-services-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-acc-panel" id="mobile-services-panel" style="display:none">
          ${mobileServiceLinks}
        </div>

        <!-- Areas accordion -->
        <button class="mobile-acc-btn border-top" id="mobile-areas-btn">
          Service Areas
          <svg class="chevron-icon" id="mobile-areas-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-acc-panel" id="mobile-areas-panel" style="display:none">
          <div class="mobile-area-groups">${mobileAreaLinks}</div>
        </div>

        <a href="/our-work.html" class="mobile-nav-link border-top">Our Work</a>
        <a href="/about.html" class="mobile-nav-link border-top">About</a>
        <a href="/contact.html" class="mobile-nav-link border-top">Contact</a>

        <div class="mobile-cta-row">
          <a href="tel:${CONFIG.phoneRaw}" class="btn-phone w-full justify-center">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
            ${CONFIG.phone}
          </a>
          <a href="#chat-widget" class="btn-primary w-full text-center" data-open-chat>Get Free Estimate</a>
        </div>
      </div>
    </div>
  </header>`;

  document.body.insertAdjacentHTML('afterbegin', html);
  initHeader();
}

function initHeader() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const iconMenu = document.getElementById('icon-menu');
  const iconX = document.getElementById('icon-x');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  // Run once on load
  if (window.scrollY > 30) header.classList.add('scrolled');

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.style.display !== 'none';
    drawer.style.display = isOpen ? 'none' : 'block';
    iconMenu.style.display = isOpen ? 'block' : 'none';
    iconX.style.display = isOpen ? 'none' : 'block';
  });

  // Desktop dropdowns - hover
  ['services', 'areas'].forEach(key => {
    const wrap = document.getElementById(`${key}-dropdown-wrap`);
    const panel = document.getElementById(`${key}-panel`);
    if (!wrap || !panel) return;
    wrap.addEventListener('mouseenter', () => panel.style.display = 'block');
    wrap.addEventListener('mouseleave', () => panel.style.display = 'none');
  });

  // Mobile accordions
  ['services', 'areas'].forEach(key => {
    const btn = document.getElementById(`mobile-${key}-btn`);
    const panel = document.getElementById(`mobile-${key}-panel`);
    const chevron = document.getElementById(`mobile-${key}-chevron`);
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const isOpen = panel.style.display !== 'none';
      panel.style.display = isOpen ? 'none' : 'block';
      chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  });

  // Close drawer on nav link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.style.display = 'none';
      iconMenu.style.display = 'block';
      iconX.style.display = 'none';
    });
  });
}

// ── FOOTER ───────────────────────────────────────────────────
function renderFooter() {
  const serviceLinks = CONFIG.services.map(s =>
    `<li><a href="/services/${s.slug}.html">${s.name}</a></li>`).join('');

  const areaLinks = CONFIG.serviceAreaGroups.map(group => `
    <section class="footer-area-county-group">
      <div class="footer-area-county-title">${group.county}</div>
      <div class="footer-area-county-links">
        ${group.areas.map(a => `<a href="/cities/${a.slug}.html" class="footer-area-link">${a.name}</a>`).join('')}
      </div>
    </section>`).join('');

  // Render only configured social profiles.
  const SOCIAL_ICONS = {
    facebook:  { label: 'Facebook',  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    instagram: { label: 'Instagram', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' },
    googleBusinessProfile: { label: 'Google Business Profile', svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>' },
    youtube:   { label: 'YouTube',   svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>' },
    tiktok:    { label: 'TikTok',    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/></svg>' },
    linkedin:  { label: 'LinkedIn',  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>' },
    yelp:      { label: 'Yelp',      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.271 9.604l-3.847-1.41c-.547-.201-.868-.156-1.083.073-.268.286-.179.732.025 1.207l1.44 3.35c.181.42.463.656.779.656.217 0 .438-.093.635-.277l2.432-2.298c.387-.366.375-.866.022-1.014l-.403-.287zm-1.97 4.977l-1.49 3.688c-.198.488-.13.893.178 1.099.234.156.514.107.828-.075l3.49-2.014c.415-.24.578-.592.423-.935l-.018-.04-1.626-2.128c-.307-.4-.784-.377-1.071-.142l-.714.547zm5.05-7.49l-2.978-2.626c-.404-.357-.793-.37-1.039-.108-.264.283-.217.7-.016 1.141l1.524 3.334c.195.427.486.638.81.595.204-.027.4-.155.569-.374l1.427-1.518c.309-.33.053-.756-.297-.444zm2.97 4.43c-.128-.493-.47-.719-.944-.625l-3.856.697c-.454.082-.667.361-.603.745.03.178.132.35.293.5l2.68 2.47c.353.325.746.308.99.036.186-.206.2-.508.073-.834l-.633-3z"/></svg>' },
    houzz:     { label: 'Houzz',     svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 22V8l9-6 9 6v14h-6v-7H9v7z"/></svg>' },
    nextdoor:  { label: 'Nextdoor',  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-2.25v-4.5h-4.5v4.5H7.5v-9l4.5-2.25 4.5 2.25v9z"/></svg>' },
  };
  const social = CONFIG.social || {};
  const socialHTML = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => typeof social[key] === 'string' && /^https:\/\//i.test(social[key].trim()))
    .map(([key, meta]) => `<a href="${social[key].trim()}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${meta.label}">${meta.svg}</a>`)
    .join('');
  const socialRow = socialHTML ? `<div class="footer-social-row" aria-label="Social media">${socialHTML}</div>` : '';

  const html = `
  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container-wide footer-grid">

      <!-- Brand column -->
      <div class="footer-brand">
        <a href="/" class="footer-logo-link" aria-label="${CONFIG.businessName} home">
          <img src="/public/brand/aw-fencing-logo.png" alt="${CONFIG.businessName}" class="footer-logo-img" loading="lazy" />
        </a>
        <p class="footer-tagline">${CONFIG.tagline}</p>
        <div class="footer-contact-list">
          <a href="tel:${CONFIG.phoneRaw}" class="footer-contact-item">
            <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
            ${CONFIG.phone}
          </a>
          ${CONFIG.email ? `<a href="mailto:${CONFIG.email}" class="footer-contact-item">
            <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            ${CONFIG.email}
          </a>` : ''}
          <div class="footer-contact-item">
            <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${CONFIG.address}
          </div>
        </div>
        ${socialRow}
      </div>

      <!-- Services column -->
      <div class="footer-col">
        <div class="footer-col-title">Services</div>
        <ul class="footer-links">${serviceLinks}</ul>
      </div>

      <!-- Service Areas column -->
      <div class="footer-col footer-areas-col">
        <div class="footer-col-title">Service Areas</div>
        <div class="footer-area-groups">${areaLinks}</div>
        ${CONFIG.licenseNumber ? `<div class="footer-license">License #${CONFIG.licenseNumber}</div>` : ''}
      </div>

      <!-- Company column -->
      <div class="footer-col">
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/our-work.html">Our Work</a></li>
          <li><a href="/contact.html">Contact</a></li>
          <li><a href="/privacy-policy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container-wide footer-bottom-inner">
        <div>&copy; <span id="footer-year"></span> ${CONFIG.businessName}. All rights reserved.</div>
        <div>${CONFIG.niche || 'Professional Home Services'} &middot; ${CONFIG.state}.</div>
      </div>
      <div class="container-wide footer-credit">
        Website Design &amp; Marketing by <a href="https://houzflow.com" target="_blank" rel="noopener">HouzFlow</a>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ── CHAT WIDGET ───────────────────────────────────────────────
function renderChatWidget() {
  const html = `
  <!-- CHAT WIDGET -->
  <div class="chat-widget" id="chat-widget">
    <div class="chat-panel" id="chat-panel" style="display:none">
      <div class="chat-header">
        <div>
          <div class="chat-header-title">Get Free Estimate</div>
          <div class="chat-header-sub">Tell us about your fence project</div>
        </div>
         <button class="chat-close" id="chat-close-btn" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-body" id="chat-body">
        <form id="chat-form" class="chat-form">
           <p class="chat-intro">Share a few details and we'll follow up about your estimate.</p>
           <label class="chat-field-label" for="chat-name">Full name</label>
           <input required id="chat-name" name="name" autocomplete="name" placeholder="Full name" class="form-input" />
           <label class="chat-field-label" for="chat-phone">Phone</label>
           <input required id="chat-phone" name="phone" type="tel" autocomplete="tel" placeholder="Phone number" class="form-input" />
           <label class="chat-field-label" for="chat-email">Email</label>
           <input required id="chat-email" name="email" type="email" autocomplete="email" placeholder="Email address" class="form-input" />
           <label class="chat-field-label" for="chat-service">Fence project</label>
           <select required id="chat-service" name="service" class="form-select">
             <option value="" disabled selected>Select your project</option>
             ${CONFIG.services.map(s => `<option value="${s.slug}">${s.name}</option>`).join('')}
             <option value="other">Other / Not sure</option>
           </select>
           <label class="chat-field-label" for="chat-details">Details</label>
           <textarea required id="chat-details" name="message" rows="3" placeholder="Tell us about your fence project" class="form-textarea"></textarea>
           <div id="chat-error" class="form-error" role="alert" style="display:none">We can't send your request right now. Please call <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a>.</div>
           <button type="submit" class="btn-primary w-full" id="chat-submit-btn">Submit</button>
        </form>
      </div>
    </div>
     <button class="chat-fab" id="chat-fab" aria-label="Open chat" aria-controls="chat-panel" aria-expanded="false">
      <svg id="chat-icon-msg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <svg id="chat-icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  initChatWidget();
}

function initChatWidget() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close-btn');
  const iconMsg = document.getElementById('chat-icon-msg');
  const iconX = document.getElementById('chat-icon-x');
  const form = document.getElementById('chat-form');
  const submitBtn = document.getElementById('chat-submit-btn');
  const chatBody = document.getElementById('chat-body');
  const chatError = document.getElementById('chat-error');

  // Bounce animation on load
  setTimeout(() => {
    fab.classList.add('chat-bounce');
    setTimeout(() => fab.classList.remove('chat-bounce'), 1100);
  }, 2000);

  // Check if already submitted
  if (localStorage.getItem('gcr_chat_submitted') === '1') {
    form.innerHTML = '<p class="text-center text-muted" style="padding:1rem">We already have your message. We\'ll be in touch shortly!</p>';
  }

   function setPanelOpen(open) {
     panel.style.display = open ? 'block' : 'none';
     fab.setAttribute('aria-expanded', String(open));
     iconMsg.style.display = open ? 'none' : 'block';
     iconX.style.display = open ? 'block' : 'none';
   }

   fab.addEventListener('click', () => setPanelOpen(panel.style.display === 'none'));
   document.addEventListener('click', (e) => {
     const trigger = e.target.closest('[data-open-chat]');
     if (!trigger) return;
     e.preventDefault();
     setPanelOpen(true);
     document.getElementById('chat-name')?.focus();
   });
   closeBtn.addEventListener('click', () => {
     setPanelOpen(false);
     fab.focus();
   });

  // Close on outside click
  document.addEventListener('mousedown', (e) => {
    const widget = document.getElementById('chat-widget');
    if (!widget.contains(e.target)) {
       setPanelOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
       setPanelOpen(false);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    chatError.style.display = 'none';
    const data = Object.fromEntries(new FormData(form).entries());
    const attribution = HouzflowAttribution.get();
    try {
       if (!CONFIG.webhookUrl) throw new Error('Chat delivery is not configured');
       await fetch(CONFIG.webhookUrl, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           mode: 'no-cors',
           body: JSON.stringify({ source: 'chat', ...data, ...attribution }),
       });
      if (typeof fbq !== 'undefined' && CONFIG.metaPixelId) {
        fbq('track', 'Lead', {}, { eventID: attribution.lead_event_id });
      }
      localStorage.setItem('gcr_chat_submitted', '1');
      chatBody.innerHTML = `
        <div class="chat-thanks">
          <div class="chat-thanks-emoji">🎉</div>
          <div class="chat-thanks-title">Thanks — we'll be in touch shortly.</div>
        </div>`;
      setTimeout(() => {
         setPanelOpen(false);
      }, 3000);
    } catch {
      chatError.style.display = 'block';
      submitBtn.disabled = false;
       submitBtn.textContent = 'Submit';
    }
  });
}

// ── FAQ ACCORDION ─────────────────────────────────────────────
function renderFAQs(containerId, faqs) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="faq-list">
      ${faqs.map((f, i) => `
        <details class="faq-item" id="faq-${containerId}-${i}">
          <summary class="faq-summary">
            <span>${f.q}</span>
            <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </summary>
          <p class="faq-answer">${f.a}</p>
        </details>`).join('')}
    </div>`;
}

// ── SECTION HEADER ────────────────────────────────────────────
function sectionHeaderHTML({ eyebrow, title, subtitle, center = true, light = false }) {
  return `
  <div class="section-header ${center ? 'text-center' : ''}">
    ${eyebrow ? `<div class="section-eyebrow">${eyebrow}</div>` : ''}
    <h2 class="section-title ${light ? 'text-white' : 'text-navy'}">${title}</h2>
    ${subtitle ? `<p class="section-subtitle ${light ? 'text-white-80' : 'text-muted'}">${subtitle}</p>` : ''}
  </div>`;
}

// ── TRUST BAR ─────────────────────────────────────────────────
function renderTrustBar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = [
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`, label: 'Serving Charlotte', sub: 'And surrounding communities' },
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><path d="M4 4h16v16H4z"/><path d="M8 4v16M16 4v16M4 12h16"/></svg>`, label: 'Fence Installation', sub: 'Residential and commercial' },
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>`, label: 'Free Estimates', sub: 'Talk through your project' },
  ];
  container.innerHTML = `
    <div class="trust-bar-inner">
      ${items.map(item => `
        <div class="trust-item">
          ${item.svg}
          <div>
            <div class="trust-label">${item.label}</div>
            <div class="trust-sub">${item.sub}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

// ── CTA SECTION ───────────────────────────────────────────────
function ctaSectionHTML({ title, subtitle }) {
  return `
  <section class="cta-section">
    <div class="grid-overlay"></div>
    <div class="container-wide text-center cta-inner">
      <h2 class="cta-title">${title}</h2>
      ${subtitle ? `<p class="cta-subtitle">${subtitle}</p>` : ''}
      <div class="cta-btns">
         <a href="#chat-widget" class="btn-primary btn-lg" data-open-chat>Get Free Estimate</a>
         <a href="tel:${CONFIG.phoneRaw}" class="btn-outline btn-lg">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
           ${CONFIG.phone}
        </a>
      </div>
    </div>
  </section>`;
}

function estimateCardHTML() {
  return `<div class="estimate-card">
    <h2>Ready for a free estimate?</h2>
    <p>Tell us about your fence project or give us a call.</p>
    <div class="estimate-card-actions">
      <a href="#chat-widget" class="btn-primary w-full" data-open-chat>Get Free Estimate</a>
      <a href="tel:${CONFIG.phoneRaw}" class="btn-phone w-full justify-center">${CONFIG.phone}</a>
    </div>
  </div>`;
}

// ── PROCESS STEPS ─────────────────────────────────────────────
function processStepsHTML(steps) {
  return `
  <div class="process-steps">
    <div class="process-connector"></div>
    ${steps.map((s, i) => `
      <div class="process-step">
        <div class="process-num">${i + 1}</div>
        <div class="process-step-title">${s.title}</div>
        <p class="process-step-desc">${s.desc}</p>
      </div>`).join('')}
  </div>`;
}

// ── MAP EMBED ─────────────────────────────────────────────────
function mapEmbedHTML(query) {
  // Use the explicit embed URL from CONFIG if provided, otherwise fall back to query-based embed
  const src = (CONFIG.googleMapsEmbedUrl && CONFIG.googleMapsEmbedUrl.trim())
    ? CONFIG.googleMapsEmbedUrl
    : `https://www.google.com/maps?q=${encodeURIComponent(query || CONFIG.city)}&output=embed`;
  return `
  <div class="map-wrap">
    <iframe
      title="Service area map"
      src="${src}"
      class="map-iframe"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>`;
}

// ── SERVICE CARD HTML ─────────────────────────────────────────
function serviceCardHTML(service) {
  return `
  <a href="/services/${service.slug}.html" class="service-card">
    <div class="service-card-img-wrap">
      <img src="${service.image}" alt="${service.imageAlt || service.name}" class="service-card-img" loading="lazy" />
      <div class="service-card-overlay"></div>
    </div>
    <div class="service-card-body">
      <div class="service-card-title">${service.name}</div>
      <p class="service-card-desc">${service.desc}</p>
      <div class="service-card-cta">
        Explore Service
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>
  </a>`;
}

// ── GRID OVERLAY (industrial dot/line background) ─────────────
function gridOverlayHTML() {
  return `<div class="grid-overlay"></div>`;
}

// ── SCROLL TO TOP on page load ────────────────────────────────
window.scrollTo(0, 0);

// ── INIT ALL ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyColorTokens();
  renderHeader();
  renderFooter();
  renderChatWidget();
});
