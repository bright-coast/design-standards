#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

// CHROME_PATH overrides the search below.
function chromePath() {
  const candidates = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome not found. Set CHROME_PATH to the Chrome executable.');
  return found;
}

// Four looks: the two system schemes, and the two forced themes (against the opposite system scheme).
const MODES = [
  { name: 'light', scheme: 'light', theme: null },
  { name: 'dark', scheme: 'dark', theme: null },
  { name: 'forced-light', scheme: 'dark', theme: 'light' },
  { name: 'forced-dark', scheme: 'light', theme: 'dark' },
];

// Runs inside the page. Exercises every interactive control once and returns counts per control type.
function exerciseControls() {
  document.addEventListener('submit', (e) => e.preventDefault(), true);
  // Anchors that leave the page are blocked; in-page hash links are followed.
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest && e.target.closest('a[href]');
    if (a) { const h = a.getAttribute('href') || ''; if (h.charAt(0) !== '#') e.preventDefault(); }
  }, true);
  const counts = {};
  const seen = new Set();
  const bump = (k) => { counts[k] = (counts[k] || 0) + 1; };
  const each = (sel, fn) => document.querySelectorAll(sel).forEach((el) => { if (seen.has(el) || el.disabled) return; seen.add(el); fn(el); });
  const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
  const typeInto = (el) => {
    el.focus();
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, 'x');
    fire(el, 'input'); fire(el, 'change');
    el.blur();
  };
  each('.code-toggle', (el) => { el.click(); bump('code-toggle'); });
  each('button, [role="button"]', (el) => { el.click(); bump('button'); });
  each('[role="tab"], [role="switch"], [role="menuitem"], [role="checkbox"], [role="radio"]', (el) => { el.click(); bump('role-control'); });
  each('summary', (el) => { el.click(); bump('summary'); });
  each('a[href]', (el) => { el.click(); bump('anchor'); });
  each('select', (el) => {
    for (let i = 0; i < el.options.length; i += 1) { el.selectedIndex = i; fire(el, 'input'); fire(el, 'change'); }
    bump('select');
  });
  each('textarea', (el) => { typeInto(el); bump('textarea'); });
  each('input', (el) => {
    const t = (el.getAttribute('type') || 'text').toLowerCase();
    if (['checkbox', 'radio', 'button', 'submit', 'reset', 'image'].includes(t)) { el.click(); bump('input-click'); }
    else if (t === 'file' || t === 'hidden') return;
    else { typeInto(el); bump('input-text'); }
  });
  each('[tabindex="0"]', (el) => { el.click(); bump('tabindex'); });
  return counts;
}

// Opens the built page in every mode, exercises every control, and reports any uncaught error,
// console error or failed request. It also fails when the page has no patterns or no controls.
// Optionally saves sliced screenshots.
async function renderCheck(file, { shotsDir } = {}) {
  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true });
  const errors = [];
  const counts = {};
  let patterns = 0;
  let clicked = 0;
  try {
    for (const mode of MODES) {
      const tag = mode.name;
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: mode.scheme }]);
      page.on('pageerror', (e) => errors.push(`[${tag}] uncaught error: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${tag}] console error: ${m.text()}`); });
      page.on('requestfailed', (r) => errors.push(`[${tag}] request failed: ${r.url().slice(0, 80)}`));
      page.on('dialog', (d) => d.dismiss());
      await page.goto('file:///' + path.resolve(file).replace(/\\/g, '/'), { waitUntil: 'load' });
      if (mode.theme) await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), mode.theme);
      const n = await page.$$eval('.lib-pattern', (els) => els.length);
      const modeCounts = await page.evaluate(exerciseControls);
      const total = Object.values(modeCounts).reduce((a, b) => a + b, 0);
      for (const [k, v] of Object.entries(modeCounts)) counts[k] = (counts[k] || 0) + v;
      if (n === 0) errors.push(`[${tag}] the page has no patterns`);
      if (total === 0) errors.push(`[${tag}] no interactive controls were found or clicked`);
      patterns = n;
      clicked += total;
      await new Promise((r) => setTimeout(r, 300));
      if (shotsDir) {
        fs.mkdirSync(shotsDir, { recursive: true });
        for (const id of await page.$$eval('.lib-cat', (els) => els.map((e) => e.id))) {
          const box = await page.$eval('#' + id, (e) => { const r = e.getBoundingClientRect(); return { y: r.top + window.scrollY, h: r.height }; });
          for (let y = box.y, i = 1; y < box.y + box.h; y += 5000, i += 1) {
            const height = Math.min(5000, box.y + box.h - y);
            await page.screenshot({ path: path.join(shotsDir, `${id}-${tag}-${i}.png`), clip: { x: 0, y, width: 1280, height }, captureBeyondViewport: true });
          }
        }
      }
      await page.close();
      console.log(`  ${tag}: ${n} patterns, ${total} controls exercised (${Object.entries(modeCounts).map(([k, v]) => `${k} ${v}`).join(', ')})`);
    }
  } finally {
    await browser.close();
  }
  return { errors, patterns, clicked, counts };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--shots');
  renderCheck(path.join(__dirname, '..', 'dist/design-standards.html'), { shotsDir: i >= 0 ? args[i + 1] : null }).then(({ errors }) => {
    const uniq = [...new Set(errors)];
    uniq.forEach((e) => console.log('  FAIL ' + e));
    console.log(uniq.length ? `${uniq.length} problem(s).` : 'Render check passed.');
    process.exit(uniq.length ? 1 : 0);
  }).catch((e) => { console.error(e.message); process.exit(1); });
}
module.exports = { renderCheck, chromePath, MODES };
