'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadPatterns } = require('../scripts/lib/repo');
const { formatPattern } = require('../scripts/lib/pattern');

function tmpRepo(patterns) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-repo-'));
  for (const p of patterns) {
    const dir = path.join(root, 'patterns', p.category, p.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'pattern.md'), formatPattern(p));
    fs.writeFileSync(path.join(dir, 'demo.html'), '<div class="demo">x</div>\n');
  }
  return root;
}
const mk = (id, category, order) => ({ id, title: id, category, order, rule: '<p>r</p>', dos: [], avoids: [], extras: [], codes: [] });

test('loads and sorts by category order then pattern order', () => {
  const root = tmpRepo([mk('b', 'forms', 2), mk('a', 'forms', 1), mk('c', 'interaction', 1)]);
  assert.deepStrictEqual(loadPatterns(root).map((p) => p.id), ['c', 'a', 'b']);
});
test('rejects an id that differs from its folder', () => {
  const root = tmpRepo([mk('a', 'forms', 1)]);
  fs.renameSync(path.join(root, 'patterns/forms/a'), path.join(root, 'patterns/forms/z'));
  assert.throws(() => loadPatterns(root), /must equal the folder name/);
});
test('rejects a duplicate order in a category', () => {
  assert.throws(() => loadPatterns(tmpRepo([mk('a', 'forms', 1), mk('b', 'forms', 1)])), /order 1 is used twice/);
});
test('rejects an unknown category folder', () => {
  const root = tmpRepo([mk('a', 'forms', 1)]);
  fs.mkdirSync(path.join(root, 'patterns/bogus'));
  assert.throws(() => loadPatterns(root), /not a known category/);
});
