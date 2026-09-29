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

// Opens the built page in light and dark, clicks every demo control and code toggle once,
// and reports any uncaught error, console error or failed request. Optionally saves sliced screenshots.
async function renderCheck(file, { shotsDir } = {}) {
  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({ executablePath: chromePath(), headless: true });
  const errors = [];
  let patterns = 0;
  try {
    for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
      page.on('pageerror', (e) => errors.push(`[${scheme}] uncaught error: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${scheme}] console error: ${m.text()}`); });
      page.on('requestfailed', (r) => errors.push(`[${scheme}] request failed: ${r.url().slice(0, 80)}`));
      page.on('dialog', (d) => d.dismiss());
      await page.goto('file:///' + path.resolve(file).replace(/\\/g, '/'), { waitUntil: 'load' });
      patterns = await page.$$eval('.lib-pattern', (els) => els.length);
      const clicked = await page.evaluate(() => {
        document.addEventListener('submit', (e) => e.preventDefault(), true);
        let n = 0;
        document.querySelectorAll('.demo-stage button, .demo-stage [role="tab"], .demo-stage summary, .code-toggle').forEach((el) => { el.click(); n += 1; });
        return n;
      });
      await new Promise((r) => setTimeout(r, 300));
      if (shotsDir) {
        fs.mkdirSync(shotsDir, { recursive: true });
        for (const id of await page.$$eval('.lib-cat', (els) => els.map((e) => e.id))) {
          const box = await page.$eval('#' + id, (e) => { const r = e.getBoundingClientRect(); return { y: r.top + window.scrollY, h: r.height }; });
          for (let y = box.y, i = 1; y < box.y + box.h; y += 5000, i += 1) {
            const height = Math.min(5000, box.y + box.h - y);
            await page.screenshot({ path: path.join(shotsDir, `${id}-${scheme}-${i}.png`), clip: { x: 0, y, width: 1280, height }, captureBeyondViewport: true });
          }
        }
      }
      await page.close();
      console.log(`  ${scheme}: ${patterns} patterns, ${clicked} controls clicked`);
    }
  } finally {
    await browser.close();
  }
  return { errors, patterns };
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
module.exports = { renderCheck, chromePath };
