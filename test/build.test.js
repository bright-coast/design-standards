'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { makeFixture } = require('./helpers');
const { buildAll, writeAll } = require('../scripts/build');
const { lfSha256Buffer } = require('../scripts/lib/lf');

const versionOf = (root) => fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
const EXPECTED = ['skills/design-standards/SKILL.md', 'skills/design-standards/references/forms.md', 'skills/design-standards/references/interaction.md'];

test('release.json lists every skill file, sorted, with matching fingerprints', () => {
  const root = makeFixture();
  const files = buildAll(root);
  const rel = JSON.parse(files['release.json']);
  assert.strictEqual(rel.version, versionOf(root));
  assert.deepStrictEqual(rel.files.map((f) => f.path), EXPECTED);
  for (const f of rel.files) assert.strictEqual(f.sha256, lfSha256Buffer(Buffer.from(files[f.path], 'utf8')));
});
test('writeAll writes every file and removes a stale reference', () => {
  const root = makeFixture();
  fs.mkdirSync(path.join(root, 'skills/design-standards/references'), { recursive: true });
  fs.writeFileSync(path.join(root, 'skills/design-standards/references/old.md'), 'stale');
  const files = buildAll(root);
  writeAll(root, files);
  assert.ok(!fs.existsSync(path.join(root, 'skills/design-standards/references/old.md')));
  for (const [rel, text] of Object.entries(files)) assert.strictEqual(fs.readFileSync(path.join(root, rel), 'utf8'), text);
});
test('two builds are byte-identical', () => {
  const root = makeFixture();
  assert.deepStrictEqual(buildAll(root), buildAll(root));
});

test('catalog.json parses, in the skill catalog schema, and matches VERSION', () => {
  const root = makeFixture();
  const files = buildAll(root);
  const cat = JSON.parse(files['catalog.json']);
  assert.deepStrictEqual(Object.keys(cat), ['catalog_version', 'repo', 'ref', 'raw_base', 'license', 'skills']);
  assert.strictEqual(cat.catalog_version, 1);
  assert.strictEqual(cat.repo, 'bright-coast/design-standards');
  assert.strictEqual(cat.ref, 'stable');
  assert.strictEqual(cat.license, 'Bright Coast AI Design Standards Licence 1.0');
  assert.ok(cat.raw_base.endsWith('/'));
  assert.strictEqual(cat.raw_base, 'https://raw.githubusercontent.com/bright-coast/design-standards/stable/');
  assert.strictEqual(cat.skills.length, 1);
  const s = cat.skills[0];
  assert.deepStrictEqual(Object.keys(s), ['id', 'name', 'status', 'version', 'sha256', 'category', 'summary', 'needs', 'offer_if', 'path', 'changes', 'files']);
  assert.strictEqual(s.version, versionOf(root));
  assert.strictEqual(s.id, 'design-standards');
  assert.strictEqual(s.name, 'Design Standards');
  assert.strictEqual(s.status, 'ready');
  assert.strictEqual(s.category, 'Building');
  assert.deepStrictEqual(s.needs, []);
  assert.strictEqual(s.offer_if, 'builds or designs web pages, apps or dashboards');
  assert.strictEqual(s.path, 'skills/design-standards/SKILL.md');
  assert.strictEqual(s.changes, 'First release.');
  assert.ok(!new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']').test(files['catalog.json']));
});
test('catalog fingerprints match the built files and equal release.json', () => {
  const files = buildAll(makeFixture());
  const cat = JSON.parse(files['catalog.json']);
  const rel = JSON.parse(files['release.json']);
  const s = cat.skills[0];
  assert.strictEqual(s.sha256, lfSha256Buffer(Buffer.from(files[s.path], 'utf8')));
  const paths = s.files.map((f) => f.path);
  assert.deepStrictEqual(paths, [...paths].sort());
  assert.deepStrictEqual(paths, EXPECTED.slice(1));
  for (const f of s.files) {
    assert.strictEqual(f.sha256, lfSha256Buffer(Buffer.from(files[f.path], 'utf8')));
    assert.strictEqual(f.sha256, rel.files.find((r) => r.path === f.path).sha256);
  }
  assert.strictEqual(s.sha256, rel.files.find((r) => r.path === s.path).sha256);
});
test('catalog.json uses the catalog formatter (2-space indent, plain lists inline, LF)', () => {
  const t = buildAll(makeFixture())['catalog.json'];
  assert.ok(t.startsWith('{\n  "catalog_version": 1,\n'));
  assert.ok(t.includes('      "needs": [],\n'));
  assert.ok(t.endsWith('}\n'));
  assert.ok(!t.includes('\r'));
});
test('catalog changes text comes from the first CHANGELOG entry', () => {
  const root = makeFixture();
  fs.writeFileSync(path.join(root, 'CHANGELOG.md'), '# Changelog\n\n## 1.0.0 - 2026-09-29\n\nFirst public version of the rules.\n\n## 0.9.0\n\nOlder.\n');
  assert.strictEqual(JSON.parse(buildAll(root)['catalog.json']).skills[0].changes, 'First public version of the rules.');
});
