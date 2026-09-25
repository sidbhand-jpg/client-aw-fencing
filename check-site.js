#!/usr/bin/env node
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const siteUrl = 'https://aw-fencing.com';
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 66, 'sitemap URL count');
assert.equal(new Set(urls).size, urls.length, 'duplicate sitemap URL');
assert(urls.every(url => url.startsWith(siteUrl + '/')), 'wrong sitemap host');
assert.equal(fs.readdirSync(path.join(root, 'cities')).length, 56, 'published city count');
assert.equal(fs.readdirSync(path.join(root, 'services')).length, 4, 'published service count');
for (const excluded of ['pages', 'debug', 'cities/your-city.html', 'services/consultation-estimates.html']) {
  assert(!fs.existsSync(path.join(root, excluded)), `published source or placeholder: ${excluded}`);
}

const titles = new Set();
const descriptions = new Set();
const cityIntros = new Set();
for (const url of urls) {
  const pagePath = new URL(url).pathname;
  const filePath = path.join(root, pagePath === '/' ? 'index.html' : pagePath.slice(1));
  assert(fs.existsSync(filePath), `missing sitemap route: ${pagePath}`);
  const html = fs.readFileSync(filePath, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  assert(title && !/YOUR BUSINESS|Home Services/i.test(title), `invalid title: ${pagePath}`);
  assert(description && description.length > 35, `missing description: ${pagePath}`);
  assert(!titles.has(title), `duplicate title: ${title}`);
  assert(!descriptions.has(description), `duplicate description: ${pagePath}`);
  titles.add(title);
  descriptions.add(description);
  assert.equal(html.match(/<link rel="canonical"/g)?.length, 1, `canonical count: ${pagePath}`);
  assert(html.includes(`<link rel="canonical" href="${url}"`), `canonical mismatch: ${pagePath}`);
  assert(html.includes(`<meta property="og:url" content="${url}"`), `og:url mismatch: ${pagePath}`);
  assert(html.includes('"yntjjym8h7"'), `missing Clarity project: ${pagePath}`);
  assert(!/epoxy|concrete coating|YOUR BUSINESS NAME/i.test(html), `old template copy: ${pagePath}`);
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, '').trim();
  assert(h1, `missing static H1: ${pagePath}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    assert(JSON.parse(match[1])['@context'] === 'https://schema.org', `schema context: ${pagePath}`);
  }
  if (pagePath.startsWith('/cities/')) {
    const intro = html.match(/<p class="city-sub" id="city-sub">([^<]+)<\/p>/)?.[1];
    assert(intro && intro.length > 110, `thin city intro: ${pagePath}`);
    assert(!cityIntros.has(intro), `duplicate city intro: ${pagePath}`);
    cityIntros.add(intro);
    assert(html.includes('<div class="faq-list">'), `missing static city FAQ: ${pagePath}`);
    assert(!html.includes('generic-runtime.js'), `city copy may be overwritten: ${pagePath}`);
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
    if (match[1] === '/' || match[1].includes('${')) continue;
    assert(fs.existsSync(path.join(root, match[1].slice(1))), `broken local URL ${match[1]} from ${pagePath}`);
  }
}
assert(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(`Sitemap: ${siteUrl}/sitemap.xml`));
assert(fs.readFileSync(path.join(root, 'llms.txt'), 'utf8').includes('Cherryville'));
assert(fs.existsSync(path.join(root, '_headers')));
assert(fs.readFileSync(path.join(root, '404.html'), 'utf8').includes('content="noindex"'));
console.log(`Validated ${urls.length} canonical routes, ${cityIntros.size} unique city intros, local links, schema, Clarity, and crawl files.`);
