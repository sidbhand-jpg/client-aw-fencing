#!/usr/bin/env node
// ============================================================
// BUILD SCRIPT — generate-pages.js
// Reads CONFIG.js and generates one HTML file per service
// and one HTML file per service area.
//
// Usage:  node generate-pages.js
// ============================================================

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const CITY_CONTENT = require('./city-content');

// ── Load CONFIG ──────────────────────────────────────────────
const configSrc = fs.readFileSync(path.join(__dirname, 'CONFIG.js'), 'utf8');
const globalObj = { CONFIG: undefined };
// ^-anchored + multiline: only matches a `const CONFIG` that starts a
// line, so a literal mention inside a comment can never be matched
// instead of the real top-level declaration.
const configScript = new vm.Script(configSrc.replace(/^const CONFIG/m, 'globalThis.CONFIG'));
const vmCtx = vm.createContext(globalObj);
configScript.runInContext(vmCtx);
const CONFIG = globalObj.CONFIG;
const SITE_URL = CONFIG.siteUrl.replace(/\/$/, '');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cityNames = CONFIG.serviceAreas.map(area => area.name);

function sectionHeader(eyebrow, title, subtitle = '') {
  return `<div class="section-header text-center"><div class="section-eyebrow">${escapeHtml(eyebrow)}</div><h2 class="section-title text-navy">${escapeHtml(title)}</h2>${subtitle ? `<p class="section-subtitle text-muted">${escapeHtml(subtitle)}</p>` : ''}</div>`;
}

function seoHead(html, { path: pagePath, title, description, schema, image }) {
  const canonical = `${SITE_URL}${pagePath}`;
  const previewImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/public/projects/shadowbox-fence-long-run.jpg`;
  const tags = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${escapeHtml(previewImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${escapeHtml(previewImage)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>` : '',
    `<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","yntjjym8h7");</script>`,
  ].filter(Boolean).join('\n  ');
  html = html.replace(/[ \t]*<!-- SEO HEAD START -->[\s\S]*?<!-- SEO HEAD END -->\s*/g, '');
  html = html.replace(/<meta property="og:[^"]+"[^>]*>\s*/g, '').replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, '');
  html = html.replace(/<meta name="author"[^>]*>/, `<meta name="author" content="${escapeHtml(CONFIG.businessName)}" />`);
  html = setMeta(html, escapeHtml(title), description);
  return html.replace('</head>', `  <!-- SEO HEAD START -->\n  ${tags}\n  <!-- SEO HEAD END -->\n</head>`);
}

const businessSchema = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`, name: 'A&W Fencing', url: `${SITE_URL}/`,
  telephone: `+1${CONFIG.phoneRaw}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Cherryville', addressRegion: 'NC', postalCode: '28021', addressCountry: 'US' },
  areaServed: cityNames.map(name => ({ '@type': 'City', name })),
  sameAs: Object.values(CONFIG.social).filter(Boolean),
};

function cityPage(template, area, copy) {
  const [intro, consideration, question, answer] = copy;
  const name = escapeHtml(area.name);
  const safeIntro = escapeHtml(intro);
  const safeConsideration = escapeHtml(consideration);
  const faq = [
    { q: question, a: answer },
    { q: `What fencing does A&W Fencing offer in ${area.name}?`, a: 'The team discusses residential, commercial, and agricultural fences plus custom gates. Wood, vinyl, aluminum, and chain link may be considered based on the property and project goal.' },
    { q: `How do I request a fence estimate in ${area.name}?`, a: 'Share the project address, fence purpose, approximate scope, gate needs, and any survey or HOA information. A&W Fencing can then discuss the next steps for a free estimate.' },
  ];
  const faqHtml = `<div class="faq-list">${faq.map((item, i) => `<details class="faq-item" id="faq-city-faq-container-${i}"><summary class="faq-summary"><span>${escapeHtml(item.q)}</span><svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></summary><p class="faq-answer">${escapeHtml(item.a)}</p></details>`).join('')}</div>`;
  const points = [consideration, 'Discuss fence purpose, material upkeep, and gate use during the estimate.', 'Check the parcel boundary, applicable local requirements, and any HOA rules before installation.', 'A&W Fencing is based in Cherryville and serves Charlotte and surrounding communities.'];
  const whyGrid = points.map(point => `<div class="city-why-item"><svg class="why-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>${escapeHtml(point)}</span></div>`).join('');
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${area.name} NC`)}&output=embed`;
  const replacements = {
    CITY_EYEBROW: `A&amp;W Fencing · ${name}, NC`,
    CITY_H1: `Fence Installation in <span style="color:var(--color-primary)">${name}, NC</span>`,
    CITY_INTRO: safeIntro,
    CITY_SERVICES: CONFIG.services.map(service => `<a href="/services/${service.slug}.html" class="city-service-pill">${escapeHtml(service.name)}</a>`).join(''),
    PHONE_RAW: CONFIG.phoneRaw, PHONE: escapeHtml(CONFIG.phone),
    CITY_WHY_HEADER: sectionHeader(area.name, `Planning a Fence for Your ${area.name} Property`, consideration),
    CITY_WHY_GRID: whyGrid,
    CITY_MAP_HEADER: sectionHeader('Service Area', `Fencing in ${area.name}`, 'Share your project address to confirm availability and arrange an estimate.'),
    CITY_MAP: `<div class="map-wrap"><iframe title="Map of ${name}, North Carolina" src="${mapSrc}" class="map-iframe" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`,
    CITY_FAQ_HEADER: sectionHeader(`${area.name} FAQ`, `Fence Planning Questions for ${area.name}`),
    CITY_FAQS: faqHtml,
    CITY_CTA: `<section class="cta-section"><div class="grid-overlay"></div><div class="container-wide text-center cta-inner"><h2 class="cta-title">Discuss Your ${name} Fence Project</h2><p class="cta-subtitle">Tell A&amp;W Fencing what the fence needs to do and request a free estimate.</p><div class="cta-btns"><a href="#chat-widget" class="btn-primary btn-lg" data-open-chat>Get Free Estimate</a><a href="tel:${CONFIG.phoneRaw}" class="btn-outline btn-lg">${escapeHtml(CONFIG.phone)}</a></div></div></section>`,
  };
  let html = template;
  for (const [key, value] of Object.entries(replacements)) html = html.replaceAll(`{{${key}}}`, value);
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`Unfilled city template: ${area.slug}`);
  const title = `Fence Installation in ${area.name}, NC | A&W Fencing`;
  const description = intro.length <= 155 ? intro : `${intro.slice(0, 150).replace(/\s+\S*$/, '')}…`;
  return seoHead(html, {
    path: `/cities/${area.slug}.html`, title, description,
    schema: { '@context': 'https://schema.org', '@type': 'Service', name: `Fence installation in ${area.name}, NC`, serviceType: 'Fence installation', provider: { '@id': `${SITE_URL}/#business` }, areaServed: { '@type': 'City', name: area.name } },
  });
}

function servicePage(html, service) {
  const otherLinks = CONFIG.services.filter(item => item.slug !== service.slug).map(item => `<a href="/services/${item.slug}.html" class="other-service-link">${escapeHtml(item.name)}</a>`).join('');
  const benefits = service.benefits.map(item => `<li class="service-benefit-item"><svg class="benefit-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>${escapeHtml(item)}</span></li>`).join('');
  const faqs = `<div class="faq-list">${service.faqs.map((item, i) => `<details class="faq-item" id="faq-service-faq-container-${i}"><summary class="faq-summary"><span>${escapeHtml(item.q)}</span><svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></summary><p class="faq-answer">${escapeHtml(item.a)}</p></details>`).join('')}</div>`;
  const slots = {
    '<img id="service-hero-img" src="" alt=""': `<img id="service-hero-img" src="${escapeHtml(service.image)}" alt="${escapeHtml(service.imageAlt || service.name)}"`,
    '<h1 class="service-hero-title" id="service-title"></h1>': `<h1 class="service-hero-title" id="service-title">${escapeHtml(service.name)}</h1>`,
    '<p class="service-hero-desc" id="service-desc"></p>': `<p class="service-hero-desc" id="service-desc">${escapeHtml(service.desc)}</p>`,
    '<p class="service-longdesc" id="service-longdesc"></p>': `<p class="service-longdesc" id="service-longdesc">${escapeHtml(service.longDesc)}</p>`,
    '<ul class="service-benefits" id="service-benefits"></ul>': `<ul class="service-benefits" id="service-benefits">${benefits}</ul>`,
    '<div class="other-services-list" id="other-services-list"></div>': `<div class="other-services-list" id="other-services-list">${otherLinks}</div>`,
    '<div id="service-estimate-actions"></div>': `<div id="service-estimate-actions"><div class="estimate-card"><h2>Ready for a free estimate?</h2><p>Tell us about your fence project or give us a call.</p><div class="estimate-card-actions"><a href="#chat-widget" class="btn-primary w-full" data-open-chat>Get Free Estimate</a><a href="tel:${CONFIG.phoneRaw}" class="btn-phone w-full justify-center">${escapeHtml(CONFIG.phone)}</a></div></div></div>`,
    '<div id="service-faq-header"></div>': `<div id="service-faq-header">${sectionHeader('FAQ', `${service.name} Questions`)}</div>`,
    '<div id="service-faq-container"></div>': `<div id="service-faq-container">${faqs}</div>`,
    '<div id="service-cta"></div>': `<div id="service-cta"><section class="cta-section"><div class="grid-overlay"></div><div class="container-wide text-center cta-inner"><h2 class="cta-title">Discuss ${escapeHtml(service.name)}</h2><p class="cta-subtitle">Tell us about your property and request a free estimate.</p><div class="cta-btns"><a href="#chat-widget" class="btn-primary btn-lg" data-open-chat>Get Free Estimate</a><a href="tel:${CONFIG.phoneRaw}" class="btn-outline btn-lg">${escapeHtml(CONFIG.phone)}</a></div></div></section></div>`,
  };
  for (const [oldText, newText] of Object.entries(slots)) {
    if (!html.includes(oldText)) throw new Error(`Missing service slot: ${oldText}`);
    html = html.replace(oldText, newText);
  }
  return html;
}

// ── Load PROJECTS (optional — gallery photos, written by the asset
//    pipeline's publish step; falls back to an empty array if missing
//    so a fresh/un-photographed client site still builds) ──────────
let PROJECTS = [];
const projectsPath = path.join(__dirname, 'PROJECTS.js');
if (fs.existsSync(projectsPath)) {
  const projectsSrc = fs.readFileSync(projectsPath, 'utf8');
  const projGlobalObj = { PROJECTS: undefined };
  const projScript = new vm.Script(projectsSrc.replace(/^const PROJECTS/m, 'globalThis.PROJECTS'));
  const projCtx = vm.createContext(projGlobalObj);
  projScript.runInContext(projCtx);
  PROJECTS = projGlobalObj.PROJECTS || [];
}

// ── Helpers ───────────────────────────────────────────────────
function readTemplate(relPath) {
  return fs.readFileSync(path.join(__dirname, relPath), 'utf8');
}

function writeFile(outPath, content) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('  ✓  ' + path.relative(__dirname, outPath));
}

// ── Patch <title> and <meta name="description"> ──────────────
function setMeta(html, title, description) {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escapeHtml(description)}" />`
    );
}

// ── Patch og:image / twitter:image content="" placeholders ───
// Used for our-work.html: fills in the top featured PROJECTS image so
// social shares of the gallery page show a real photo, not a blank card.
function setOgImage(html, imageUrl) {
  if (!imageUrl) return html; // no PROJECTS yet — leave placeholders empty
  const safeUrl = imageUrl.replace(/"/g, '&quot;');
  return html
    .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${safeUrl}"`)
    .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${safeUrl}"`);
}

// ── Pick the lead image for og:image: first featured PROJECTS entry,
//    falling back to the first entry overall, or null if PROJECTS is empty.
function getLeadProjectImage(projects) {
  if (!projects || !projects.length) return null;
  const featured = projects.find(p => p.featured);
  return (featured || projects[0]).img || null;
}

// ── Fix relative paths based on output directory depth ───────
function fixPaths(html, depth) {
  // depth=0 → root (index.html), depth=1 → pages/, depth=2 → services/
  const prefix = '../'.repeat(depth);
  return html
    .replace(/(src|href)="(styles\.css|CONFIG\.js|components\.js)"/g,
      (_, attr, file) => `${attr}="${prefix}${file}"`)
    .replace(/(src|href)="\.\.\/styles\.css"/g,   `$1="${prefix}styles.css"`)
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,    `$1="${prefix}CONFIG.js"`)
    .replace(/(src|href)="\.\.\/components\.js"/g,`$1="${prefix}components.js"`);
}

// ── 1. Generate one file per SERVICE ─────────────────────────
console.log('\n📄 Generating service pages…');
const serviceTemplate = readTemplate('pages/service.html');
const servicesDir = path.join(__dirname, 'services');

CONFIG.services.forEach(service => {
  const outPath = path.join(servicesDir, `${service.slug}.html`);
  let html = serviceTemplate;
  html = seoHead(html, {
    path: `/services/${service.slug}.html`,
    title: `${service.name} in Charlotte, NC | ${CONFIG.businessName}`,
    description: `${service.desc} A&W Fencing serves Charlotte and surrounding communities. Request a free estimate.`,
    image: service.image,
    schema: { '@context': 'https://schema.org', '@type': 'Service', name: service.name, serviceType: service.name, provider: { '@id': `${SITE_URL}/#business` }, areaServed: { '@type': 'City', name: 'Charlotte' } },
  });
  html = servicePage(html, service);
  // Fix paths: services/ is depth 1 from root (same level as pages/)
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="../styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="../CONFIG.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="../components.js"');
  writeFile(outPath, html);
});

// ── 2. Generate one file per CITY ─────────────────────────────
console.log('\n🗺  Generating city pages…');

CONFIG.serviceAreas.forEach(area => {
  const outPath = path.join(__dirname, 'cities', `${area.slug}.html`);
  const copy = CITY_CONTENT[area.slug];
  if (!copy) throw new Error(`Missing researched content for ${area.slug}`);
  let html = cityPage(readTemplate('pages/city.html'), area, copy);
  // City pages live at root — fix paths to point to root-level files
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="../styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="../CONFIG.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="../components.js"');
  // City pages live in cities/ — update links to pages/ and services/
  html = html.replace(/href="\/pages\//g, 'href="../pages/');
  html = html.replace(/href="\/services\//g, 'href="../services/');
  writeFile(outPath, html);
});

// ── 3. Symlink convenience pages at root ──────────────────────
// pages/contact.html → already in pages/
// The index.html at root already exists.
// We just copy the pages/* to their canonical URL paths.
console.log('\n📋 Copying canonical top-level pages…');
const pagesToRoot = [
  ['pages/about.html',          'about.html'],
  ['pages/contact.html',        'contact.html'],
  ['pages/our-work.html',       'our-work.html'],
  ['pages/privacy-policy.html', 'privacy-policy.html'],
  ['pages/terms.html',          'terms.html'],
  ['pages/404.html',            '404.html'],
];

pagesToRoot.forEach(([src, dest]) => {
  const srcPath  = path.join(__dirname, src);
  const destPath = path.join(__dirname, dest);
  if (!fs.existsSync(srcPath)) { console.warn(`  ⚠  ${src} not found, skipping`); return; }

  let html = fs.readFileSync(srcPath, 'utf8');
  // These pages are at root — update relative paths
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="CONFIG.js"')
    .replace(/(src|href)="\.\.\/PROJECTS\.js"/g,   'src="PROJECTS.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="components.js"');

  // our-work.html: fill in og:image / twitter:image from the top
  // featured PROJECTS photo, so social shares show a real image.
  if (dest === 'our-work.html') {
    html = setOgImage(html, getLeadProjectImage(PROJECTS));
  }

  const meta = {
    'about.html': ['About A&W Fencing | Charlotte Area Fence Installation', 'Meet A&W Fencing, a Cherryville-based fence company serving Charlotte and surrounding North Carolina communities. Learn about its installation approach.'],
    'contact.html': ['Contact A&W Fencing | Request a Fence Estimate', 'Discuss a fence or gate project in Charlotte or a surrounding community. Contact A&W Fencing for a free estimate and service availability.'],
    'our-work.html': ['Fence & Gate Project Gallery | A&W Fencing', 'Explore A&W Fencing project photos and discuss wood, vinyl, aluminum, chain link, or gate ideas for your property.'],
    'privacy-policy.html': ['Privacy Policy | A&W Fencing', 'Read how A&W Fencing handles website information and analytics.'],
    'terms.html': ['Website Terms | A&W Fencing', 'Read the website terms for A&W Fencing.'],
  }[dest];
  if (meta) html = seoHead(html, { path: `/${dest}`, title: meta[0], description: meta[1], schema: dest === 'about.html' || dest === 'contact.html' ? businessSchema : null });
  else html = html.replace('</head>', '  <meta name="robots" content="noindex" />\n</head>');

  writeFile(destPath, html);
});

const homeTitle = 'A&W Fencing | Charlotte Area Fence & Gate Installation';
const homeDescription = 'A&W Fencing installs residential, commercial, and agricultural fences and custom gates in Charlotte and surrounding North Carolina communities. Request a free estimate.';
const homePath = path.join(__dirname, 'index.html');
writeFile(homePath, seoHead(fs.readFileSync(homePath, 'utf8'), { path: '/', title: homeTitle, description: homeDescription, schema: businessSchema }));

const sitemapPaths = ['/', '/about.html', '/contact.html', '/our-work.html', '/privacy-policy.html', '/terms.html',
  ...CONFIG.services.map(service => `/services/${service.slug}.html`),
  ...CONFIG.serviceAreas.map(area => `/cities/${area.slug}.html`)];
writeFile(path.join(__dirname, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(pagePath => `  <url><loc>${SITE_URL}${pagePath}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFile(path.join(__dirname, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
writeFile(path.join(__dirname, 'llms.txt'), `# A&W Fencing\n\nA&W Fencing is based in Cherryville, North Carolina and serves Charlotte and surrounding communities across Mecklenburg, Gaston, Lincoln, Rowan, Cabarrus, Catawba, and Iredell counties. It offers residential, commercial, and agricultural fence installation and custom gates. Project details, availability, and local requirements should be confirmed with the company.\n\n## Main pages\n- [Home](${SITE_URL}/)\n- [About](${SITE_URL}/about.html)\n- [Contact and free estimate](${SITE_URL}/contact.html)\n- [Residential fence installation](${SITE_URL}/services/residential-fence-installation.html)\n- [Commercial fence installation](${SITE_URL}/services/commercial-fence-installation.html)\n- [Farm and agricultural fencing](${SITE_URL}/services/farm-agricultural-fencing.html)\n- [Custom gates and access control](${SITE_URL}/services/custom-gates-access-control.html)\n- [Charlotte service area](${SITE_URL}/cities/charlotte.html)\n- [Sitemap](${SITE_URL}/sitemap.xml)\n`);

// ── Summary ───────────────────────────────────────────────────
const total = CONFIG.services.length + CONFIG.serviceAreas.length + pagesToRoot.length;
console.log(`\n✅  Build complete — ${total} pages generated.\n`);
console.log('── File structure ──');
console.log('  index.html            ← homepage');
CONFIG.services.forEach(s => console.log(`  services/${s.slug}.html`));
CONFIG.serviceAreas.forEach(a => console.log(`  cities/${a.slug}.html`));
pagesToRoot.forEach(([, d]) => console.log(`  ${d}`));
console.log('');
