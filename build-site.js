#!/usr/bin/env node
// Build the static site and publish only its public routes and assets.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const root = __dirname;
const out = path.resolve(root, 'dist');
if (out !== path.join(root, 'dist') || !out.startsWith(root + path.sep)) {
  throw new Error('Unexpected build output path');
}

execFileSync(process.execPath, [path.join(root, 'generate-pages.js')], { cwd: root, stdio: 'inherit' });
const context = { CONFIG: undefined };
const source = fs.readFileSync(path.join(root, 'CONFIG.js'), 'utf8').replace(/^const CONFIG/m, 'globalThis.CONFIG');
vm.runInNewContext(source, context);
const config = context.CONFIG;
const routes = [
  'index.html', 'about.html', 'contact.html', 'our-work.html', 'privacy-policy.html', 'terms.html', '404.html',
  'CONFIG.js', 'PROJECTS.js', 'components.js', 'generic-runtime.js', 'styles.css', 'favicon.svg',
  'sitemap.xml', 'robots.txt', 'llms.txt',
  ...config.services.map(service => `services/${service.slug}.html`),
  ...config.serviceAreas.map(area => `cities/${area.slug}.html`),
];

if (fs.existsSync(out)) fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const relative of routes) {
  const sourcePath = path.join(root, relative);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing public file: ${relative}`);
  const targetPath = path.join(out, relative);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}
fs.cpSync(path.join(root, 'public'), path.join(out, 'public'), {
  recursive: true,
  filter: sourcePath => path.basename(sourcePath) !== '_headers',
});
fs.copyFileSync(path.join(root, 'public', '_headers'), path.join(out, '_headers'));
console.log(`Published ${routes.length} site files plus assets to ${out}`);
