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

