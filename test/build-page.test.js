'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { makeFixture } = require('./helpers');
const { buildPage, renderLibrary, fill } = require('../scripts/build-page');

test('page has every pattern, the category counts and the footer', () => {
  const root = makeFixture();
  const version = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
  const html = buildPage(root);
  assert.ok(html.includes('id="lp-accordion"') && html.includes('id="lp-inline-validation"'));
  assert.ok(html.includes('<span class="lib-cat-count">1 patterns</span>'));
  assert.ok(html.includes('id="lib-interaction"') && html.includes('id="lib-forms"'));
  assert.ok(html.includes('How people click and drag.'));
  assert.ok(html.includes('@brightcoast.ai'));
  assert.ok(html.includes('Copyright 2026 Bright Coast AI'));
  assert.ok(html.includes('v' + version), 'fixture VERSION not in page');
  assert.ok(!/\{\{[A-Z_]+\}\}/.test(html), 'unfilled placeholder left in the page');
  assert.ok(!html.includes('\r'), 'CR found');
  assert.ok(!html.includes(String.fromCharCode(0xFFFD)), 'replacement character found');
});
test('dollar signs in inserted CSS and JS are not treated as replacement patterns (Review Focus 2)', () => {
  const css = "a::after { content: '$&'; } b { content: '$1'; }";
  const js = "var s = '$&' + \"$'\";";
  const html = buildPage(makeFixture(css, js));
  assert.ok(html.includes(css), 'the css was changed on insertion');
  assert.ok(html.includes(js), 'the script was changed on insertion');
});
test('placeholder-looking text inside content is left alone', () => {
  const html = buildPage(makeFixture('/* {{LIBRARY}} {{NOPE}} */'));
  assert.ok(html.includes('/* {{LIBRARY}} {{NOPE}} */'));
});
test('renderLibrary returns only the category blocks', () => {
  const lib = renderLibrary(makeFixture());
  assert.ok(lib.startsWith('    <div class="lib-cat" id="lib-interaction">'));
  assert.ok(!lib.includes('topbar'));
});
test('fill replaces known keys in one pass', () => {
  assert.strictEqual(fill('a {{X}} {{Y}}', { X: '{{Y}}', Y: 'z' }), 'a {{Y}} z');
});
test('the theme block and styles are in the page head', () => {
  const html = buildPage(makeFixture());
  assert.ok(html.indexOf('--ds-accent') < html.indexOf('body { color'));
});
