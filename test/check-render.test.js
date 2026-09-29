'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { makeFullFixture } = require('./helpers');
const { buildAll, writeAll } = require('../scripts/build');
const { renderCheck, chromePath, MODES } = require('../scripts/check-render');

let haveChrome = true;
try { chromePath(); } catch (e) { haveChrome = false; }
const opts = { skip: haveChrome ? false : 'Chrome not found (set CHROME_PATH)', timeout: 120000 };

const DEMO = 'patterns/interaction/accordion/demo.html';
function fixturePage(demoHtml) {
  const root = makeFullFixture();
  fs.writeFileSync(path.join(root, DEMO), demoHtml);
  writeAll(root, buildAll(root));
  return path.join(root, 'dist/design-standards.html');
}
function tempHtml(body) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ds-render-')), 'p.html');
  fs.writeFileSync(f, `<!doctype html><html><body>${body}</body></html>`);
  return f;
}

test('the four modes cover system dark and forced dark', () => {
  assert.deepStrictEqual(MODES.map((m) => m.name), ['light', 'dark', 'forced-light', 'forced-dark']);
  assert.ok(MODES.some((m) => m.scheme === 'dark' && !m.theme) && MODES.some((m) => m.theme === 'dark'));
});

test('inputs, selects, checkboxes, textareas and anchors are all exercised', opts, async () => {
  const page = fixturePage('<div class="demo"><div class="demo-stage"><input type="text"><input type="checkbox"><select><option>a</option><option>b</option></select><textarea></textarea><a href="https://example.com/">out</a><button>b</button></div></div>\n');
  const r = await renderCheck(page);
  assert.deepStrictEqual(r.errors, []);
  assert.strictEqual(r.patterns, 2);
  for (const k of ['input-text', 'input-click', 'select', 'textarea', 'anchor', 'button']) assert.ok(r.counts[k] >= MODES.length, `${k}: ${JSON.stringify(r.counts)}`);
  assert.ok(r.clicked > 0);
});

test('system dark and forced dark are both really exercised', opts, async () => {
  const probe = '<button onclick="console.error(\'seen:\' + document.documentElement.getAttribute(\'data-theme\') + \':\' + matchMedia(\'(prefers-color-scheme: dark)\').matches)">p</button>';
  const r = await renderCheck(fixturePage(`<div class="demo"><div class="demo-stage">${probe}</div></div>\n`));
  const has = (s) => r.errors.some((e) => e.includes(s));
  assert.ok(has('[dark] console error: seen:null:true'), r.errors.join('|'));
  assert.ok(has('[forced-dark] console error: seen:dark:false'), r.errors.join('|'));
  assert.ok(has('[forced-light] console error: seen:light:true'), r.errors.join('|'));
  assert.ok(has('[light] console error: seen:null:false'), r.errors.join('|'));
});

test('an uncaught page error fails the run', opts, async () => {
  const r = await renderCheck(fixturePage('<div class="demo"><div class="demo-stage"><button onclick="throw new Error(\'boom\')">b</button></div></div>\n'));
  assert.ok(r.errors.some((e) => /uncaught error: .*boom/.test(e)), r.errors.join('|'));
});

test('a page with no patterns fails the run', opts, async () => {
  const r = await renderCheck(tempHtml('<button>x</button>'));
  assert.ok(r.errors.some((e) => /no patterns/.test(e)));
});

test('a page with no controls fails the run', opts, async () => {
  const r = await renderCheck(tempHtml('<div class="lib-pattern">p</div>'));
  assert.ok(r.errors.some((e) => /no interactive controls/.test(e)));
  assert.strictEqual(r.clicked, 0);
});
