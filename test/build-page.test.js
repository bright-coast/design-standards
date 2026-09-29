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
test('plain-text category text is wrapped as the dek paragraph', () => {
  assert.ok(buildPage(makeFixture()).includes('<p class="lib-cat-dek">How people click and drag.</p>'));
});
test('category HTML is rendered verbatim, with the part after the marker placed after the last pattern (ruling P2)', () => {
  const root = makeFixture();
  const pre = '<p class="lib-cat-dek">Dek.</p>\n<div class="caveat-box"><b>Six states.</b> Text.</div>';
  const post = '<div class="psych-index" id="psych-index"><h4>Index</h4></div>';
  fs.writeFileSync(path.join(root, 'patterns/interaction/_category.html'), `${pre}\n<!-- patterns -->\n${post}\n`);
  const html = buildPage(root);
  const cat = html.slice(html.indexOf('id="lib-interaction"'), html.indexOf('id="lib-forms"'));
  assert.ok(cat.includes(pre), 'the part before the marker is not verbatim');
  assert.ok(cat.includes(post), 'the part after the marker is missing');
  assert.ok(!cat.includes('<!-- patterns -->'), 'the marker leaked into the page');
  assert.ok(cat.indexOf(pre) < cat.indexOf('id="lp-accordion"'), 'pre must come before the first pattern');
  assert.ok(cat.indexOf(post) > cat.indexOf('id="lp-accordion"'), 'post must come after the last pattern');
  assert.ok(!cat.includes('<p class="lib-cat-dek"><p'), 'HTML must not be wrapped in a second dek paragraph');
});
